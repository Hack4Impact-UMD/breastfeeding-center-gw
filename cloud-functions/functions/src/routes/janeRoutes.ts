import { Request, Router, Response } from "express";
import { upload } from "../middleware/filesMiddleware";
import { logger } from "firebase-functions";
import { parseAppointmentSheet } from "../utils/janeUploadAppts";
import { parseClientSheet } from "../utils/janeUploadClients";
import { JaneAppt } from "../types/janeType";
import { Client, Baby } from "../types/clientType";
import { db } from "../services/firebase";
import { isAuthenticated } from "../middleware/authMiddleware";
import { DateTime } from "luxon";

const router = Router();

router.post("/upload", [upload], async (req: Request, res: Response) => {
  // NOTE: req.files is an object with keys being the fieldName (appointments/clients)
  // and the values being a list of uploaded files for that field. Examples for reading
  // the text content of those fields is below. We can assume each field name has only one
  // file for our purposes. Also note, req.files is populated by the `upload` middleware
  // used on this route.
  // logger.info(req.files);

  if (!req.files) return res.status(400).send("Missing files!");

  try {
    const clientsFile = req.files["clients"]?.[0];
    const apptsFile = req.files["appointments"]?.[0];

    if (!apptsFile) {
      return res.status(400).send("Missing appointments file!");
    }

    // confirm received files are of valid type
    const appointmentFileType = getFileType(apptsFile.name);

    let clientFileExists = false;
    if (clientsFile) {
      clientFileExists = true;
    }

    const appointmentParseResults = await parseAppointmentSheet(
      appointmentFileType,
      apptsFile.buffer,
    );

    const {
      appointments: appointments_sheet,
      patientNames,
      babyAppts,
    } = appointmentParseResults;

    const babyApptSet = new Set(babyAppts.map((appt) => appt.apptId));

    let clientsList: Client[] = [];
    const babiesMap: Map<string, Baby> = new Map();
    if (clientFileExists) {
      const clientFileType = getFileType(clientsFile.name);
      const clientParseResults = await parseClientSheet(
        clientFileType,
        clientsFile.buffer,
      );

      clientsList = clientParseResults.clientList;
      const babies = clientParseResults.babyList;

      babies.forEach((b) => {
        babiesMap.set(b.id, b);
      });
    } else {
      clientsList = await getAllFirebaseClients();
      const babies = clientsList.flatMap((client) => client.baby);
      babies.forEach((b) => {
        babiesMap.set(b.id, b);
      });
    }

    const clientMap: Map<string, Client> = new Map();

    clientsList.forEach((client) => {
      clientMap.set(client.id, client);
    });

    const appointments_map = new Map<string, JaneAppt[]>();

    appointments_sheet.forEach((jane_appt: JaneAppt) => {
      const key = `${jane_appt.startAt}-${jane_appt.clinician}`;
      const appt_group = appointments_map.get(key);
      if (appt_group) {
        appt_group.push(jane_appt);
      } else {
        appointments_map.set(key, [jane_appt]);
      }
    });

    const missing_clients: string[] = [];

    function is_baby_appt(appt: JaneAppt): boolean {
      return babyApptSet.has(appt.apptId);
    }

    async function getAllFirebaseClients() {
      const clients = db.collection("Client");
      return (await clients.get()).docs.map((d) => d.data() as Client);
    }

    async function appt_in_firebase(appt: JaneAppt): Promise<boolean> {
      // check if appt in firebase JaneAppt collection
      const querySnapshot = await db
        .collection("JaneAppt")
        .where("apptId", "==", appt.apptId)
        .get();

      if (querySnapshot.docs.length == 0) {
        // logger.info(
        //   `No matching appointment in JaneAppt collection for appointment: ${appt.apptId}`,
        // );
        return false;
      }
      return true;
    }

    function clientExists(patientId: string): boolean {
      return clientMap.has(patientId);
    }

    const parentsToAdd: Client[] = [];
    const apptsToAdd: JaneAppt[] = [];

    for (const appointments of appointments_map.values()) {
      let parent = null; // Client type
      const babies: Baby[] = []; // list of baby type
      let parentAppt = null; // JaneAppt type, the parent's appointment

      let parentApptExistsInFirebase = false; // do we already have the parent appointment in firebase?

      for (const appt of appointments) {
        // the appt is for baby
        const patientName = patientNames[appt.patientId];
        if (is_baby_appt(appt)) {
          const baby = babiesMap.get(appt.patientId); // find matching baby
          if (baby) {
            babies.push(baby);
          } else {
            // the baby could not be found, add them to missing clients
            missing_clients.push(
              `${patientName.firstName} ${patientName.lastName}`,
            );
          }
        } else {
          // the appt is for client
          if (await appt_in_firebase(appt)) {
            parentApptExistsInFirebase = true;
            break;
          }

          // get the client info, either from firebase or the clients sheet if the client is not in the db yet
          if (clientExists(appt.patientId)) {
            const client = clientMap.get(appt.patientId);
            parent = client;
          } else {
            // if the client is not in firebase or the clients sheet, we cannot add this appointment
            // get the patient's first and last name and add them to the missing clients list
            if (patientName) {
              missing_clients.push(
                `${patientName["firstName"]} ${patientName["lastName"]}`,
              );
            }
            continue; // skip this appointment
          }
          parentAppt = appt;
        }
      }
      if (parentApptExistsInFirebase) {
        continue;
      }

      // add to the parent object's babies array using the babies matched with their appointment.
      // NOTE: only add the new babies if they do not already exist in the parent's baby array (check based on their ids)
      const parentResolved = parent;
      if (!parentResolved) {
        continue;
      }

      // merging parent existing baby list and new baby
      // this implementation may be inefficient
      if (!parentResolved.baby) {
        parentResolved.baby = [];
      }

      babies.forEach((baby) => {
        if (
          !parentResolved?.baby.some(
            (existingBaby: { id: string }) => existingBaby.id === baby.id,
          )
        ) {
          parentResolved?.baby.push(baby);
        }
      });

      if (parentResolved) {
        parentsToAdd.push(parentResolved);
      }
      if (parentAppt) {
        apptsToAdd.push(parentAppt);
      }
    }

    // if there are missing clients, return an error response with their names.
    // their names will be displayed in the tooltip for users so they can reupload those clients.
    if (missing_clients.length > 0) {
      logger.error(["Missing clients!", missing_clients]);
      return res.status(400).json({
        error: "Missing clients!",
        details: missing_clients,
      });
    }

    // batch transaction for performace, limit is 500 per batch
    const chunkSize = 500;
    for (let i = 0; i < parentsToAdd.length; i += chunkSize) {
      const chunk = parentsToAdd.slice(i, i + chunkSize);
      const batch = db.batch();
      chunk.forEach((parent) => {
        const { id, ...parentData } = parent;
        batch.set(db.collection("Client").doc(id), parentData, {
          merge: true,
        });
      });
      await batch.commit();
    }

    for (let i = 0; i < apptsToAdd.length; i += chunkSize) {
      const chunk = apptsToAdd.slice(i, i + chunkSize);
      const batch = db.batch();
      chunk.forEach((appt) => {
        const { apptId, ...apptData } = appt;
        batch.set(db.collection("JaneAppt").doc(apptId), apptData, {
          merge: true,
        });
      });
      await batch.commit();
    }

    return res.status(200).send();

    // helpers
    function getFileType(fileName: string) {
      const parts = fileName.split(".");
      const extension = parts.length > 1 ? parts.pop()!.toLowerCase() : "";
      if (extension === "csv") {
        return "csv";
      } else if (extension !== "xlsx") {
        throw new Error("Incorrect file type");
      }

      return "xlsx";
    }
  } catch (e) {
    return res.status(400).send((e as Error).message);
  }
});

router.get(
  "/appointments",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      logger.info(`Fetching jane appts between: ${startDate} - ${endDate}`);

      // Start query from JaneAppts collection
      const collectionRef = db.collection("JaneAppt");
      let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
        collectionRef;

      // Filter appointments by date range if provided
      if (startDate) {
        const start = DateTime.fromISO(startDate).startOf("day");
        if (!start.isValid) {
          return res.status(400).send("Invalid startDate format");
        }
        query = query.where("startAt", ">=", start.toISO());
      }

      if (endDate) {
        const end = DateTime.fromISO(endDate).endOf("day");
        logger.info("end time: " + end);
        if (!end.isValid) {
          return res.status(400).send("Invalid endDate format");
        }
        query = query.where("startAt", "<=", end.toISO());
      }

      // Execute query to get appointments within timeframe
      const snapshot = await query.get();

      // Convert documents to JaneAppt objects
      const appointments: JaneAppt[] = snapshot.docs.map((doc) => {
        return { ...(doc.data() as Omit<JaneAppt, "id">), apptId: doc.id } as JaneAppt;
      });

      return res.status(200).json(appointments);
    } catch (e) {
      logger.error("Error fetching appointments:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

router.get(
  "/client/:patient_id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const patientId = req.params.patient_id;

      // Get client document by patient_id
      const doc = await db.collection("Client").doc(patientId).get();

      if (!doc.exists) {
        return res.status(404).send("Client not found");
      }

      const clientData: Client = { ...(doc.data() as Omit<Client, "id">), id: doc.id };
      return res.status(200).json(clientData);
    } catch (e) {
      logger.error("Error fetching client:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

// delete a specific appointment
router.delete(
  "/appointments/:id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).send();

    const apptsCollection = db.collection("JaneAppt");
    const doc = apptsCollection.doc(id);

    await doc.delete();
    return res.status(200).send();
  },
);

// bulk delete appts
router.post(
  "/bulk/appointments/delete",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    const { ids } = req.body as { ids: string[] };

    if (!ids || ids.length == 0) {
      return res.status(400).send("No ids provided");
    }

    const CHUNK_SIZE = 500;

    const apptsCollection = db.collection("JaneAppt");

    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const slice = ids.slice(i, i + CHUNK_SIZE);
      const batch = db.batch();

      slice.forEach((id) => {
        const doc = apptsCollection.doc(id);
        batch.delete(doc);
      });

      await batch.commit();
    }

    return res.status(200).send();
  },
);

export default router;
