import { Request, Router, Response } from "express";
import { upload } from "../middleware/filesMiddleware";
// import { logger } from "firebase-functions";
// import {
//   // parseAppointmentRow,
//   parseAppointmentSheet,
// } from "../utils/janeUploadAppts";
import { logger } from "firebase-functions";
import { parseAppointmentSheet } from "../utils/janeUploadAppts";
import { JaneAppt } from "../types/JaneType";
import { Client, Baby } from "../types/clientType";
import { db } from "../services/firebase";

// import { parseDateXlsx } from "../utils/janeUploadAppts";
// import { Jane, VisitType } from "../types/janeType";

const router = Router();

router.post("/upload", [upload], async (req: Request, res: Response) => {
  // NOTE: req.files is an object with keys being the fieldName (appointments/clients)
  // and the values being a list of uploaded files for that field. Examples for reading
  // the text content of those fields is below. We can assume each field name has only one
  // file for our purposes. Also note, req.files is populated by the `upload` middleware
  // used on this route.
  logger.info(req.files);

  if (!req.files) return res.status(400).send("Missing files!");
  const appointmentParseResults = await parseAppointmentSheet(
    req.files["appointments"][0].name,
    req.files["appointments"][0].buffer,
  );

  if (appointmentParseResults === "Missing headers") {
    return res.status(400).send("Missing headers");
  }

  const { appointments: appointments_sheet, patientNames } = appointmentParseResults

  const clientParseResults = await parseClientSheet(
    req.files["clients"][0].name,
    req.files["clients"][0].buffer,
  );

  if (clientParseResults === "Missing headers") {
    return res.status(400).send("Missing headers");
  }
  const { clients: clients_sheet, babies: babyList } = clientParseResults

  // logger.info(req.files["clients"][0].buffer.toString())
  // implement function in utils/janeUploadAppts.ts to parse clientSheet
  // if function cannot parse then throw error
  // const clients_sheet = await parseClientSheet(
  //   req.files["clients"][0].name, req.files["clients"][0].buffer,);
  // if (clients_sheet === "Missing headers") {
  //  res.status(400).send("Missing headers");
  // }

  // perform matching process and uploading to firebase
  // ----------------------------------------------------------------------------------------------------------

  const appointments_map = new Map<[string, string], JaneAppt[]>();

  appointments_sheet.forEach((jane_appt: JaneAppt) => {
    const appt_group = appointments_map.get([
      jane_appt.startAt,
      jane_appt.clinician,
    ]);
    if (appt_group) {
      appt_group.push(jane_appt);
    } else {
      appointments_map.set(
        [jane_appt.startAt, jane_appt.clinician],
        [jane_appt],
      );
    }
  });

  const missing_clients: string[] = [];

  // implement all functions below
  function is_baby_appt(appt: JaneAppt): boolean {
    return babyList.some(baby => baby.id === appt.patientId)
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
        `No matching appointment in Client collection for client ID: ${patientId}`,
      );
      return false;
    }
    return true;
  }

  async function get_client_from_firebase(patientId: string): Promise<Client> {
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
    return clients_sheet.some(client => client["id"] === patientId)
  }

  for (const [[start_time, staff_member], appointments] of appointments_map) {
    let parent = null; // Client type
    const babies: Baby[] = []; // list of baby type
    let parentAppt = null; // JaneAppt type, the parent's appointment

    let parentApptExistsInFirebase = false; // do we already have the parent appointment in firebase?

    for (const appt of appointments) {
      // the appt is for baby
      if (is_baby_appt(appt)) {
        const baby = babyList.find(baby => baby.id === appt.patientId); // find matching baby
        if (baby) {
          babies.push(baby)
        }
      } else {
        // the appt is for client
        if (await appt_in_firebase(appt)) {
          parentApptExistsInFirebase = true;
          break;
        }

        // get the client info, either from firebase or the clients sheet if the client is not in the db yet
        if (await client_in_firebase(appt.patientId)) {
          parent = get_client_from_firebase(appt.patientId);
        } else if (client_in_clients_sheet(appt.patientId)) {
          // TO-DO
          // reference the client list to get the client information necessary to create a Client object
          const client = clients_sheet.find(client => client.id == appt.patientId)
          // parent = get_client_info_using_client_sheet(appt.patientId);
          // parent = clients_sheet.find(obj => obj.id === appt.patientId); // find matching client
          continue;
        } else {
          const patientName = patientNames[appt.patientId]
          // if the client is not in firebase or the clients sheet, we cannot add this appointment
          // get the patient's first and last name and add them to the missing clients list

          if (patientName) {
            missing_clients.push(`${patientName["firstName"]} ${patientName["lastName"]}`);
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

    // merging parent existing baby list and new baby
    // this implementation may be inefficient
    babies.forEach((baby) => {
      if (
        !parentResolved?.baby.some(
          (existingBaby) => existingBaby.id === baby.id,
        )
      ) {
        parentResolved?.baby.push(baby);
      }
    });
    parentResolved?.baby;

    // TO-DO
    //add_to_clients_collection(parent);
    // add_to_appts_collection(parentAppt);
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
});

export default router;
