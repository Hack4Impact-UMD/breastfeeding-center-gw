import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";
/*
Write functions to retrieve the following information 

- Baby due date, birth date, birth location
- Which classes and on what dates are classes taken for each individual
    - Note not all appointments are classes
*/

/*
 * Get all appointments
 */
export function getAppointments(): Promise<void> {
  return new Promise((resolve, reject) => {
    const getAppointments = httpsCallable(functions, "getAppointments");
    getAppointments()
      .then((appointments: any) => {
        console.log("Appointments retrieved successfully.");
        console.log(appointments.data);
        resolve(appointments.data);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}
