import { Request, Router, Response } from "express";
import { upload } from "../middleware/filesMiddleware";

const router = Router();

router.post("/upload", [upload], async (req: Request, res: Response) => {
  console.log(req.files)

  if (req.files)
    console.log(req.files["appointments"][0].buffer.toString())
  // implement function in utils/janeUploadAppts.ts to parse apptsCsvString
  // if function cannot parse then throw error
  // const apptsData = janeUploadAppts(apptsCsvString)

  // perform matching process and uploading to firebase
  // ----------------------------------------------------------------------------------------------------------

  /*
    // this map will let us group together appointments for related clients and babies 
    // key: (start_time, staff_member)
    // value: list of appointments
    appointments_map = {}

    // iterate over all appointments sheet rows and populate the map
    for each row in appointments_sheet {
      // extract the data necessary for a JaneAppt object from the row
      jane_appt = parse_appt_row(row) 

      // add the appointment to the map based on its start time and staff member
      appointments_map[(jane_appt.startAt, jane_appt.clinician)].add(jane_appt) 
    }

    // now we have map that groups together appointments for parents and their babies 
    // but, we still need to match them together to conform to our types

    missing_clients = [] // we will need to keep a list of client names missing from both the firebase and clients sheet
    // iterate over each key, value pair (entry) in the map: ((start_time, staff_member), list of appointments)
    for each (key, appointments) in appointments_map {

      parent = null // Client type
      babies = [] // list of Baby type
      parentAppt = null // JaneAppt type, the parent's appointment

      parentApptExistsInFirebase = false // do we already have the parent appointment in firebase?

      // iterate over the appointments
      for each appt in appointments  {
        // check if this is a baby appointment 
        if (is_baby_appt(appt)) {
          // reference the client list to get the baby information necessary to create a Baby object
          baby = get_baby_info_using_client_sheet(appt.patientId) // Baby type

          // add the baby to the list of babies
          babies.add(baby)
        } else { // otherwise this is a parent appointment

          // check if the parent appt is in firebase
          if(appt_in_firebase(appt)) {
            // if it is, set parentApptExistsInFirebase to true and break out of this loop
            parentApptExistsInFirebase = true;
            break;
          }

          // get the client info, either from firebase or the clients sheet if the client is not in the db yet
          if (client_in_firebase(appt.patientId)) {
            // get the existing client object from firebase for this patient
            parent = get_client_from_firebase(appt.patientId)
          } else if (client_in_clients_sheet(appt.patientId)) {
            // reference the client list to get the client information necessary to create a Client object
            parent = get_client_info_using_client_sheet(appt.patientId) 
          } else {
            // if the client is not in firebase or the clients sheet, we cannot add this appointment
            // get the patient's first and last name and add them to the missing clients list
            missing_clients.add(patient_first_and_last_name)
            continue // skip this appointment
          }

          // set the parent appointment to this one
          parentAppt = appt
        }
      }

      // if we've already processed this appt in the database, then we can skip adding the client and appt
      if(parentApptExistsInFirebase) { 
        continue;
      }

      // add to the parent object's babies array using the babies matched with their appointment.
      // NOTE: only add the new babies if they do not already exist in the parent's baby array (check based on their ids)
      parent.baby.add_if_not_exists(babies)
      add_to_clients_collection(parent)
      add_to_appts_collection(parentAppt)
    }

    // if there are missing clients, return an error response with their names. 
    // their names will be displayed in the tooltip for users so they can reupload those clients.
    if (missing_clients.length > 0) {
      return error_response(missing_clients) 
    }
  */

  return res.status(200).send();
});

export default router;
