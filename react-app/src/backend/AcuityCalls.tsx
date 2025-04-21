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

export function getBabyInfo(): Promise<void> {
  return new Promise((resolve, reject) => {
    const getBabyInfo = httpsCallable(functions, "getBabyInfo");
    const babyDueDate = /(?:Baby \(or babies\)|Baby's) Due Date:\s*(.+)/;
    const babyBirthDate =
      /Baby \(or babies\) Date of Birth \(write n\/a if still pregnant\):\s*(.+)/;
    const babyBirthOrDueDate = /Baby's DOB \(or Due Date\):\s*(.+)/; // For the question: Baby's DOB (or Due Date):
    const babyBirthLocation = /Where will you \(or did you\) birth\?:\s*(.+)/; // This is consistent across formats
    /*
Different formats:
>        'Baby (or babies) Due Date: 8/27/2025\n' +
>        '\n' +
>        'Baby (or babies) Date of Birth (write n/a if still pregnant): n/a\n' +
>        '\n' +
>        'Where will you (or did you) birth?: GW Hospital \n' +

>        "Baby's DOB (or Due Date): September 12, 2025\n" +
>        '\n' +
>        'Where will you (or did you) birth?: MedStar Washington Hospital Midwives\n' +

>        'Where will you (or did you) birth?: Hospital\n' +
>        '\n' +
>        "Baby's Due Date: August 29, 2025\n" +
*/
    const userMap: {
      [id: number]: {
        firstName: string;
        lastName: string;
        email: string;
        babyDueDate: Date | null;
        babyBirthDate: Date | null;
        birthLocation: string | null;
      };
    } = {};
    getBabyInfo()
      .then((babyInfo: any) => {
        console.log("Baby Info retrieved successfully.");
        babyInfo.data.forEach((user) => {
          console.log(user);
          userMap[user.id] = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            babyDueDate: null,
            babyBirthDate: null,
            birthLocation: null,
          };
          // Finding baby due / birth date
          const matchDate = user.formsText.match(babyDueDate);
          if (matchDate) {
            // Assume that the entered date is convertable to date object
            const dateStr = matchDate[1].trim();
            const dateObj = new Date(dateStr);

            // Check if date object is valid
            if (!isNaN(dateObj.getTime())) {
              userMap[user.id].babyDueDate = dateObj;
            }
          } else {
            // Try another possible question format
            const matchDueOrBirth = user.formsText.match(babyBirthOrDueDate);
            if (matchDueOrBirth) {
              // Assume that the entered date is convertable to date object
              const dateDueOrBirth = matchDueOrBirth[1].trim();
              const dateObjDueOrBirth = new Date(dateDueOrBirth);

              // Check if date object is valid
              if (!isNaN(dateObjDueOrBirth.getTime())) {
                // Seeing if this date is due or birth date (future or past)
                const today = new Date();

                if (dateObjDueOrBirth > today) {
                  // If the date is in the future then it is the baby due date
                  userMap[user.id].babyDueDate = dateObjDueOrBirth;
                } else {
                  // Else the date is birth date since it is in the past
                  userMap[user.id].babyBirthDate = dateObjDueOrBirth;
                }
              }
            }
          }

          // Finding possible date of birth
          const matchBirthDate = user.formsText.match(babyBirthDate);
          if (matchBirthDate) {
            const dateBirth = matchBirthDate[1].trim();
            const dateObjBirth = new Date(dateBirth);

            // Checking if this is a valid date because possible answers include n/a
            if (!isNaN(dateObjBirth.getTime())) {
              userMap[user.id].babyBirthDate = dateObjBirth;
            }
          }

          // Finding baby birth location
          const matchLocation = user.formsText.match(babyBirthLocation);
          if (matchLocation) {
            userMap[user.id].birthLocation = matchLocation[1].trim();
          }
        });
        console.log(userMap);
        resolve(babyInfo.data);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}
