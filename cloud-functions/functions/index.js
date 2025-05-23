/* eslint-disable */
// const cors = require("cors")({ origin: true });
const crypto = require("crypto");
const functions = require("firebase-functions");
const { onCall } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const dotenv = require("dotenv");
require("dotenv").config();
var Acuity = require("acuityscheduling");

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

/*
 * Creates a new admin.
 * Takes an object as a parameter that should contain an email, first name, and last name.
 * Arguments: email: string, the user's email
 *            first name: string, the user's first name
 *            last name: string, the user's last name
 */
exports.createAdminUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      if (auth && auth.token && auth.token.role == "ADMIN") {
        const authorization = admin.auth();
        const pass = crypto.randomBytes(32).toString("hex");
        await authorization
          .createUser({
            email: data.email,
            password: pass,
          })
          .then(async (userRecord) => {
            await authorization
              .setCustomUserClaims(userRecord.uid, {
                role: "ADMIN",
              })
              .then(async () => {
                const collectionObject = {
                  auth_id: userRecord.uid,
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  type: "ADMIN",
                };
                await db
                  .collection("Users")
                  .where("auth_id", "==", userRecord.uid)
                  .get()
                  .then(async (querySnapshot) => {
                    if (querySnapshot.docs.length == 0) {
                      await db
                        .collection("Users")
                        .add(collectionObject)
                        .then(async () => {
                          resolve({ reason: "Success", text: "Success" });
                        })
                        .catch((error) => {
                          reject({
                            reason: "Database Add Failed",
                            text: "User has been created in login, but has not been added to database.",
                          });
                          throw new functions.https.HttpsError(
                            "Unknown",
                            "Failed to add user to database"
                          );
                        });
                    } else {
                      // User already in database
                      reject({
                        reason: "Database Add Failed",
                        text: "User already in database.",
                      });
                      throw new functions.https.HttpsError(
                        "Unknown",
                        "Failed to add user to database"
                      );
                    }
                  })
                  .catch((error) => {
                    reject({
                      reason: "Database Deletion Failed",
                      text: "Unable to find user in the database. Make sure they exist.",
                    });
                    throw new functions.https.HttpsError("unknown", `${error}`);
                  });
              })
              .catch((error) => {
                reject({
                  reason: "Role Set Failed",
                  text: "User has been created, but their role was not set properly",
                });
                throw new functions.https.HttpsError(
                  "Unknown",
                  "Failed to set user's role"
                );
              });
          })
          .catch((error) => {
            reject({
              reason: "Creation Failed",
              text: "Failed to create user. Please make sure the email is not already in use.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Failed to create user in the auth."
            );
          });
      } else {
        reject({
          reason: "Permission Denied",
          text: "Only an admin user can create admin users. If you are an admin, make sure the email and name passed in are correct.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can create admin users. If you are an admin, make sure the email and name passed into the function are correct."
        );
      }
    });
  }
);

/**
 * Deletes the user
 * Argument: firebase_id - the user's firebase_id
 */

exports.deleteUser = onCall(
  { region: "us-east4", cors: true },
  async ({ auth, data }) => {
    return new Promise(async (resolve, reject) => {
      const authorization = admin.auth();
      if (
        data.firebase_id != null &&
        auth &&
        auth.token &&
        auth.token.role.toLowerCase() == "admin"
      ) {
        await authorization
          .deleteUser(data.firebase_id)
          .then(async () => {
            const promises = [];
            await db
              .collection("Users")
              .where("auth_id", "==", data.firebase_id)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.docs.length == 0) {
                  throw new functions.https.HttpsError(
                    "Unknown",
                    "Unable to find user with that firebase id in the database"
                  );
                } else {
                  querySnapshot.forEach((documentSnapshot) => {
                    promises.push(documentSnapshot.ref.delete());
                  });
                }
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to find user in the database. Make sure they exist.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
            await Promise.all(promises)
              .then(() => {
                resolve({ reason: "Success", text: "Success" });
              })
              .catch((error) => {
                reject({
                  reason: "Database Deletion Failed",
                  text: "Unable to delete user from the database.",
                });
                throw new functions.https.HttpsError("unknown", `${error}`);
              });
          })
          .catch((error) => {
            reject({
              reason: "Auth Deletion Failed",
              text: "Unable to delete user from login system. Make sure they exist.",
            });
            throw new functions.https.HttpsError(
              "Unknown",
              "Unable to delete user."
            );
          });
      } else {
        reject({
          reason: "Permissions",
          text: "Only an admin user can delete users. If you are an admin, make sure the account exists.",
        });
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only an admin user can delete users. If you are an admin, make sure the account exists."
        );
      }
    });
  }
);
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
