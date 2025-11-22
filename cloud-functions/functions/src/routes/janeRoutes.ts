import { Request, Router, Response } from "express";
import { upload } from "../middleware/filesMiddleware";
import { logger } from "firebase-functions";
import { parseAppointmentSheet, RawJaneAppt } from "../utils/janeUploadAppts";
import { parseClientSheet } from "../utils/janeUploadClients";
import { JaneAppt } from "../types/janeType";
import { Client, Baby } from "../types/clientType";
import { db } from "../services/firebase";
import { isAuthenticated } from "../middleware/authMiddleware";
import { CLIENTS_COLLECTION, JANE_APPT_COLLECTION } from "../types/collections";
import { getAllJaneApptsInRange } from "../services/jane";

const router = Router();

router.post(
  "/upload",
  [isAuthenticated, upload],
  async (req: Request, res: Response) => {
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
        appointments: appointmentsSheet,
        patientNames,
        babyAppts,
      } = appointmentParseResults;

      const babyApptSet = new Set(babyAppts.map((appt) => appt.apptId));

      const referencedClientIds = new Set(
        appointmentsSheet.map((appt) => appt.janePatientNumber),
      );
      let clientsList: Client[] =
        await getAllFirebaseClients(referencedClientIds);

      logger.info("client list:");
      logger.info(clientsList);

      const janeIdToUUIDMap = new Map<string, string>();
      clientsList.forEach((c) => {
        if (c.janeId) janeIdToUUIDMap.set(c.janeId, c.id);
      });

      const babiesMap: Map<string, Baby> = new Map();
      if (clientFileExists) {
        const clientFileType = getFileType(clientsFile.name);
        const clientParseResults = await parseClientSheet(
          clientFileType,
          clientsFile.buffer,
          janeIdToUUIDMap,
        );

        clientsList = clientParseResults.clientList;
        const babies = clientParseResults.babyList;

        babies.forEach((b) => {
          babiesMap.set(b.id, b);
        });
      } else {
        const babies = clientsList.flatMap((client) => client.baby);
        babies.forEach((b) => {
          babiesMap.set(b.id, b);
        });
      }

      // jane id -> client
      const clientMap: Map<string, Client> = new Map();

      clientsList.forEach((client) => {
        if (client.janeId) {
          clientMap.set(client.janeId, client);
        }
      });

      const appointments_map = new Map<string, RawJaneAppt[]>();

      appointmentsSheet.forEach((jane_appt) => {
        const key = `${jane_appt.startAt}-${jane_appt.clinician}`;
        const appt_group = appointments_map.get(key);
        if (appt_group) {
          appt_group.push(jane_appt);
        } else {
          appointments_map.set(key, [jane_appt]);
        }
      });

      const missingClients: Set<string> = new Set<string>();

      function is_baby_appt(appt: RawJaneAppt): boolean {
        return babyApptSet.has(appt.apptId);
      }

      async function getAllFirebaseClients(janeIdsSet: Set<string>) {
        const allClients: Client[] = [];
        const MAX_IN_SIZE = 30;
        const janeIds = [...janeIdsSet];

        for (let i = 0; i < janeIds.length; i += MAX_IN_SIZE) {
          const chunk = janeIds.slice(i, i + MAX_IN_SIZE);
          const query = db
            .collection(CLIENTS_COLLECTION)
            .where("janeId", "in", chunk);
          const clients = (await query.get()).docs.map(
            (d) => d.data() as Client,
          );

          allClients.push(...clients);
        }

        return allClients;
      }

      const parentsToAdd: Client[] = [];
      const apptsToAdd: RawJaneAppt[] = [];

      // iterate through each group of appts with the same start time + clinician
      for (const appointments of appointments_map.values()) {
        let parent = null; // Client type
        const babies: Baby[] = []; // list of baby type
        let parentAppt: RawJaneAppt | null = null; // JaneAppt type, the parent's appointment
        const potentiallyMissing: string[] = [];
        let foundClientInGroup = false;

        for (const appt of appointments) {
          // the appt is for baby
          const patientName = patientNames[appt.janePatientNumber];
          if (is_baby_appt(appt)) {
            const baby = babiesMap.get(appt.janePatientNumber); // find matching baby
            if (baby) {
              babies.push(baby);
            } else {
              //NOTE: do nothing for now, this should only happen for babies w/o associated parents
              //which get ignored anyway.
              // the baby could not be found, add them to missing clients
              // potentiallyMissing.push(
              //   `Baby ${patientName.firstName} ${patientName.lastName}`,
              // );
            }
          } else {
            // get the client info, either from firebase or the clients sheet if the client is not in the db yet
            if (clientMap.has(appt.janePatientNumber)) {
              const client = clientMap.get(appt.janePatientNumber);
              parent = client;
              foundClientInGroup = true;
            } else {
              // if the client is not in firebase or the clients sheet, we cannot add this appointment
              // get the patient's first and last name and add them to the missing clients list
              if (patientName) {
                potentiallyMissing.push(
                  `${patientName["firstName"]} ${patientName["lastName"]}`,
                );
              }
              continue; // skip this appointment
            }
            parentAppt = appt;
          }

          if (!foundClientInGroup) {
            potentiallyMissing.forEach((c) => missingClients.add(c));
          }
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
      if (missingClients.size > 0) {
        logger.error(["Missing clients!", [...missingClients]]);
        return res.status(400).json({
          error: "Missing clients!",
          details: missingClients,
        });
      }

      const janeToDocIdMap = new Map<string, string>();
      // batch transaction for performace, limit is 500 per batch
      const chunkSize = 500;
      for (let i = 0; i < parentsToAdd.length; i += chunkSize) {
        const chunk = parentsToAdd.slice(i, i + chunkSize);
        const batch = db.batch();
        chunk.forEach((parent) => {
          janeToDocIdMap.set(parent.janeId!, parent.id);
          batch.set(db.collection(CLIENTS_COLLECTION).doc(parent.id), parent, {
            merge: true,
          });
        });
        await batch.commit();
      }

      for (let i = 0; i < apptsToAdd.length; i += chunkSize) {
        const chunk = apptsToAdd.slice(i, i + chunkSize);
        const batch = db.batch();
        chunk.forEach((appt) => {
          const { apptId } = appt;
          const parentId = janeToDocIdMap.get(appt.janePatientNumber);
          batch.set(
            db.collection(JANE_APPT_COLLECTION).doc(apptId),
            { ...appt, clientId: parentId } as JaneAppt,
            {
              merge: true,
            },
          );
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
  },
);

router.get(
  "/appointments",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const includeClient = req.query.includeClient === "true";
      const clientId = req.query.clientId as string;

      logger.info(`Fetching jane appts between: ${startDate} - ${endDate}`);

      let appts: JaneAppt[] = [];
      try {
        appts = await getAllJaneApptsInRange(startDate, endDate);
      } catch (err) {
        logger.error("Failed to fetch jane appts in range");
        logger.error(err);

        if (err instanceof Error) {
          return res.status(400).send(err.message);
        } else {
          return res.status(400).send();
        }
      }

      if (appts.length === 0) return res.status(200).json([]);

      if (includeClient) {
        // bulk fetch clients, then join them with their appts
        const clientIds = appts.map((appt) => appt.clientId);
        // logger.info(clientIds);

        const clients = await db.getAll(
          ...clientIds.map((id) => db.collection(CLIENTS_COLLECTION).doc(id)),
        );
        const clientsMap = new Map<string, Client>();

        clients.forEach((c) => {
          const client = c.data() as Client;
          if (client && client.id) {
            clientsMap.set(client.id, client);
          }
        });

        const appointmentsWithClient: (JaneAppt & { client?: Client })[] =
          appts.map((appt) => {
            const client = clientsMap.get(appt.clientId);

            if (client) {
              return { ...appt, client };
            } else {
              return appt;
            }
          });

        return res.status(200).json(appointmentsWithClient);
      } else {
        // Convert documents to JaneAppt objects
        if (clientId) {
          appts = appts.filter((a) => a.clientId === clientId);
        }
        return res.status(200).json(appts);
      }
    } catch (e) {
      logger.error("Error fetching appointments:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

router.get(
  "/clients",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const clientsSnapshot = await db.collection(CLIENTS_COLLECTION).get();
      const clients = clientsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Client[];
      return res.status(200).json(clients);
    } catch (e) {
      logger.error("Error fetching clients:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

router.get(
  "/client/:client_id",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const clientId = req.params.client_id;

      // Get client document by client_id
      const doc = await db.collection(CLIENTS_COLLECTION).doc(clientId).get();

      if (!doc.exists) {
        return res.status(404).send("Client not found");
      }

      const clientData: Client = doc.data() as Client;
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

    const apptsCollection = db.collection(JANE_APPT_COLLECTION);
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

    const apptsCollection = db.collection(JANE_APPT_COLLECTION);

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

router.get(
  "/retention",
  [isAuthenticated],
  async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      logger.info(`Fetching jane appts between: ${startDate} - ${endDate}`);

      let appts: JaneAppt[] = [];
      try {
        appts = await getAllJaneApptsInRange(startDate, endDate);
      } catch (err) {
        logger.error("Failed to fetch jane appts in range");
        logger.error(err);

        if (err instanceof Error) {
          return res.status(400).send(err.message);
        } else {
          return res.status(400).send();
        }
      }
      const clientsByNumVisits: { [key: number]: Client[] } = {};

      for (let i = 1; i <= 6; i++) {
        clientsByNumVisits[i] = [];
      }

      const apptsToRemove = ["bra fitting", "pump check"];

      const appts_filtered = appts.filter(
        (appt) =>
          !apptsToRemove.some((phrase) =>
            appt.service.toLowerCase().includes(phrase),
          ) && appt.firstVisit,
      );

      if (appts_filtered.length === 0)
        return res.status(200).send(clientsByNumVisits);

      const firstVisitClients: Client[] = [];
      const clientDict: { [key: string]: Set<string> } = {};

      const uniquePatientIds = [
        ...new Set(appts_filtered.map((a) => a.clientId)),
      ];

      const clientDocs = await db.getAll(
        ...uniquePatientIds.map((id) =>
          db.collection(CLIENTS_COLLECTION).doc(id),
        ),
      );

      const clientsMap = new Map<string, Client>();
      clientDocs.forEach((doc) => {
        if (doc.exists) {
          const client = doc.data() as Client;
          clientsMap.set(client.id, client);
        }
      });

      for (const appt of appts_filtered) {
        const matchingClient = clientsMap.get(appt.clientId);
        if (matchingClient) {
          firstVisitClients.push(matchingClient);
          if (!clientDict[appt.clientId]) {
            clientDict[appt.clientId] = new Set();
          }
          clientDict[appt.clientId].add(appt.apptId);
        } else {
          logger.warn(`No client found with id ${appt.clientId}`);
        }
      }
      // For each client in the firstVisitClients list, get the list of all
      // their appointments within date range (use the original list of returned appointments to filter)
      // ?
      firstVisitClients.forEach((client: Client) => {
        const matchingAppts = appts
          .filter((appt) => client.id === appt.clientId)
          .map((appt) => appt.apptId);
        clientDict[client.id] = new Set([
          ...clientDict[client.id],
          ...new Set(matchingAppts),
        ]);
        if (clientDict[client.id].size >= 6) {
          clientsByNumVisits[6].push(client);
        } else {
          clientsByNumVisits[clientDict[client.id].size].push(client);
        }
      });

      return res.status(200).send(clientsByNumVisits);
    } catch (e) {
      logger.error("Error fetching retention data:", e);
      return res.status(500).send((e as Error).message);
    }
  },
);

export default router;
