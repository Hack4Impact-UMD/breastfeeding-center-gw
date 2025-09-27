import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
// import dotenv from "dotenv";
import app from "./app";

// dotenv.config()
admin.initializeApp();

exports.api = onRequest({ region: "us-east4" }, app)

//TODO: this package is really old, doesn't have type definitions, and introduces some vulnerabilities.
//It's best to switch to just making http requestions to the acuity api directly instead of using this.
// const Acuity = require("acuityscheduling");
//
const acuity = Acuity.basic({
  userId: process.env.ACUITY_USER_ID,
  apiKey: process.env.ACUITY_API_KEY,
});

const CLASS_CATEGORIES = [
  "Childbirth Classes",
  "Postpartum Classes",
  "Prenatal Classes",
  "Infant Massage",
  "Parent Groups",
];


/**
 * Updates a user's email
 * Arguments: email - the user's current email
 *            newEmail - the user's new email
 * TODO: Update Error Codes
 */

exports.updateUserEmail = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.email != null &&
        data.newEmail != null &&
        auth &&
        auth.token &&
        auth.token.email.toLowerCase() == data.email.toLowerCase()
      ) {
        await authorization
          .updateUser(auth.uid, {
            email: data.newEmail,
          })
          .then(async () => {
            await db
              .collection("Users")
              .where("auth_id", "==", auth.uid)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  reject({
                    reason: "Database Change Failed",
                    text: "User's email has been changed for login, but failed to find user's email within the database.",
                  });
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that email in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ email: data.newEmail }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      resolve({
                        reason: "Success",
                        text: "Successfully changed email.",
                      });
                    })
                    .catch(() => {
                      reject({
                        reason: "Database Change Failed",
                        text: "User's email has been changed for login, but failed to find user's email within the database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to change user's email within the database."
                      );
                    });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Change Failed",
                  text: "User's email has been changed for login, but failed to find user's email within the database.",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that email in the database"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Change Failed",
              text: "Failed to change user's email within the login system.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user's email."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "You do not have the correct permissions to update email. If you think you do, please make sure the new email is not already in use.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "You do not have the correct permissions to update email."
        );
      }
    });
  }
);

/**
 * Changes a user's role in both authorization and the database.
 * Takes an object as a parameter that should contain a firebase_id field and a role field.
 * This function can only be called by a user with admin status
 * Arguments: firebase_id - the id of the user
 *            role: the user's new role; string, (Options: "ADMIN", "TEACHER")
 */

exports.setUserRole = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        data.role != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        authorization
          .setCustomUserClaims(data.firebase_id, { role: data.role })
          .then(async () => {
            await db
              .collection("Users")
              .where("auth_id", "==", data.firebase_id)
              .get()
              .then(async (querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that firebase id in the database"
                  );
                } else {
                  const promises = [];
                  querySnapshot.forEach((doc) => {
                    promises.push(doc.ref.update({ type: data.role }));
                  });
                  await Promise.all(promises)
                    .then(() => {
                      return { result: "OK" };
                    })
                    .catch(() => {
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Unable to update user role in database"
                      );
                    });
                }
              })
              .catch((error) => {
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Unable to find user with that firebase id in the database"
                );
              });
          })
          .catch((error) => {
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to change user role."
            );
          });
      } else {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
        );
      }
    });
  }
);

/**
 * Gets all appointments from Acuity
 */

exports.getAppointments = onCall(
  { region: "us-east4", cors: true },
  async () => {
    return new Promise(async (resolve, reject) => {
      // if (
      //   auth &&
      //   auth.token
      // ) {
      acuity.request("/appointments?max=10", function (err, appointments) {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log(appointments.body);
        resolve(appointments.body);
      });

      // } else {
      //   throw new functions.https.HttpsError(
      //     "permission-denied",
      //     "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
      //   );
      // }
    });
  }
);

/*
Will retrieve baby due / birth date and where will / were they born
*/

exports.getBabyInfo = onCall({ region: "us-east4", cors: true }, async () => {
  return new Promise(async (resolve, reject) => {
    // if (
    //   auth &&
    //   auth.token
    // ) {
    acuity.request("/appointments?max=10", function (err, appointments) {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(appointments.body);
      resolve(appointments.body);
    });

    // } else {
    //   throw new functions.https.HttpsError(
    //     "permission-denied",
    //     "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
    //   );
    // }
  });
});

exports.getClientAppointments = onCall(
  { region: "us-east4", cors: true },
  async () => {
    return new Promise((resolve, reject) => {
      // Fetch raw appointments from Acuity
      acuity.request("/appointments?max=100", (err, resp) => {
        if (err) {
          console.error("Acuity error:", err);
          return reject(err);
        }

        const raw = resp.body;
        const clientMap = {};

        raw.forEach((appt) => {
          // Skip anything that isn't one of our class categories
          if (!CLASS_CATEGORIES.includes(appt.category)) return;

          const id = appt.id;
          if (!clientMap[id]) {
            clientMap[id] = { appointments: [] };
          }

          clientMap[id].appointments.push({
            date: new Date(appt.datetime),
            instructor: appt.calendar || null,
            title: appt.type || null,
            classType: appt.category,
            didAttend: !appt.canceled,
          });
        });

        resolve(clientMap);
      });
    });
  }
);


