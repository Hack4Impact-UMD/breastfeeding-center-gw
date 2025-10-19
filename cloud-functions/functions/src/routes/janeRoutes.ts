import { Request, Router, Response } from "express";
import { upload } from "../middleware/filesMiddleware";
import { logger } from "firebase-functions";
import { parseAppointmentSheet } from "../utils/janeUploadAppts";
import { parseClientSheet } from "../utils/janeUploadClients";
import { JaneAppt } from "../types/janeType";
import { Client, Baby } from "../types/clientTypes";
import { db } from "../services/firebase";

const router = Router();

router.post("/upload", upload, async (req: Request, res: Response) => {
  // NOTE: req.files is an object with keys being the fieldName (appointments/clients)
  // and the values being a list of uploaded files for that field. Examples for reading
  // the text content of those fields is below. We can assume each field name has only one
  // file for our purposes. Also note, req.files is populated by the `upload` middleware
  // used on this route.
  // logger.info(req.files);

  if (!req.files) return res.status(400).send("Missing files!");

  try {
    // confirm received files are of valid type
    const appointmentFileType = getFileType(req.files["appointments"][0].name);

    let clientFileExists = false;
    if (req.files?.["clients"]?.[0]) {
      clientFileExists = true;
    }
    const clientFileType = getFileType(req.files["clients"][0].name);

    const appointmentParseResults = await parseAppointmentSheet(
      appointmentFileType,
      req.files["appointments"][0].buffer,
    );

    const { appointments: appointments_sheet, patientNames } =
      appointmentParseResults;

    let clients_sheet!: Client[];
    let babyList!: Baby[];
    if (clientFileExists) {
      const clientParseResults = await parseClientSheet(
        clientFileType,
        req.files["clients"][0].buffer,
      );

      clients_sheet = clientParseResults.clientList;
      babyList = clientParseResults.babyList;
    }
    console.log(babyList[0].middleName);

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
      if (
        babyList?.some((baby: { id: string }) => baby.id === appt.patientId)
      ) {
        return true;
      }
      return false;
    }

    async function appt_in_firebase(appt: JaneAppt): Promise<boolean> {
      // check if appt in firebase JaneAppt collection
      const querySnapshot = await db
        .collection("JaneAppt")
        .where("apptId", "==", appt.apptId)
        .get();

      if (querySnapshot.docs.length == 0) {
        logger.info(
          `No matching appointment in JaneAppt collection for appointment: ${appt.apptId}`,
        );
        return false;
      }
      return true;
    }

    async function client_in_firebase(patientId: string): Promise<boolean> {
      // check patientid in firebase client collection
      const querySnapshot = await db
        .collection("Client")
        .where("id", "==", patientId)
        .get();

      if (querySnapshot.docs.length == 0) {
        logger.info(
          `No matching client in Client collection for client ID: ${patientId}`,
        );
        return false;
      }
      return true;
    }

    async function add_to_clients_collection(parent: Client) {
      if (!parent.baby) {
        parent.baby = [];
      }
      await db.collection("Client").doc(parent.id).set(parent);
    }

    async function add_to_appts_collection(appt: JaneAppt) {
      await db.collection("JaneAppt").doc(String(appt.apptId)).set(appt);
    }

    async function get_client_from_firebase(
      patientId: string,
    ): Promise<Client> {
      const querySnapshot = await db
        .collection("Client")
        .where("id", "==", patientId)
        .get();

      // querySnapshot is guaranteed to not be empty
      const doc = querySnapshot.docs[0];
      const data = doc.data();

      const client: Client = {
        id: data.id,
        firstName: data.firstName,
        ...(data.middleName && { middleName: data.middleName }),
        lastName: data.lastName,
        email: data.email,
        ...(data.phone && { phone: data.phone }),
        ...(data.insurance && { insurance: data.insurance }),
        ...(data.paysimpleId && { paysimpleId: data.paysimpleId }),
        baby: data.baby,
      };

      return client;
    }

    function client_in_clients_sheet(patientId: string): boolean {
      return clients_sheet.some(
        (client: { id: string }) => client.id === patientId,
      );
    }

    for (const appointments of appointments_map.values()) {
      let parent = null; // Client type
      const babies: Baby[] = []; // list of baby type
      let parentAppt = null; // JaneAppt type, the parent's appointment

      let parentApptExistsInFirebase = false; // do we already have the parent appointment in firebase?

      for (const appt of appointments) {
        // the appt is for baby
        if (is_baby_appt(appt)) {
          const baby = babyList.find(
            (baby: { id: string }) => baby.id === appt.patientId,
          ); // find matching baby
          if (baby) {
            babies.push(baby);
          }
        } else {
          // the appt is for client
          if (await appt_in_firebase(appt)) {
            parentApptExistsInFirebase = true;
            break;
          }

          // get the client info, either from firebase or the clients sheet if the client is not in the db yet
          if (await client_in_firebase(appt.patientId)) {
            parent = await get_client_from_firebase(appt.patientId);
          } else if (
            clientFileExists &&
            client_in_clients_sheet(appt.patientId)
          ) {
            const client = clients_sheet.find(
              (client: { id: string }) => client.id == appt.patientId,
            );
            parent = client;
          } else {
            const patientName = patientNames[appt.patientId];
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
      const parentResolved = await parent;
      if (!parentResolved) {
        continue;
      }

      // merging parent existing baby list and new baby
      // this implementation may be inefficient
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
        await add_to_clients_collection(parentResolved);
      }
      if (parentAppt) {
        await add_to_appts_collection(parentAppt);
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

export default router;
