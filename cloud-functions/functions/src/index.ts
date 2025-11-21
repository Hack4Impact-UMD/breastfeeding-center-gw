import dotenv from "dotenv";
dotenv.config();

import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
admin.initializeApp();

import app from "./app";
import { config } from "./config";
import { logger, onInit } from "firebase-functions";

onInit(() => {
  logger.info("====CONFIG DETAILS BELOW====");
  logger.info(`INIT: USING ROOT USER EMAIL: ${config.rootUserEmail.value()}`);
  // logger.info(`INIT: USING ROOT USER SECRET: ${config.rootUserSecret.value()}`);
  logger.info("====CONFIG DETAILS END====");
});

exports.api = onRequest({ region: "us-east4", timeoutSeconds: 120, memory: "512MiB" }, app);

//TODO: this package is really old, doesn't have type definitions, and introduces some vulnerabilities.
//It's best to switch to just making http requestions to the acuity api directly instead of using this.
// const Acuity = require("acuityscheduling");
//
// const acuity = Acuity.basic({
//   userId: process.env.ACUITY_USER_ID,
//   apiKey: process.env.ACUITY_API_KEY,
// });

// const CLASS_CATEGORIES = [
//   "Childbirth Classes",
//   "Postpartum Classes",
//   "Prenatal Classes",
//   "Infant Massage",
//   "Parent Groups",
// ];

//TODO: convert these to our own calls, the acuity package is bad
// /**
//  * Gets all appointments from Acuity
//  */
//
// exports.getAppointments = onCall(
//   { region: "us-east4", cors: true },
//   async () => {
//     return new Promise(async (resolve, reject) => {
//       // if (
//       //   auth &&
//       //   auth.token
//       // ) {
//       acuity.request("/appointments?max=10", function (err, appointments) {
//         if (err) {
//           console.error(err);
//           reject(err);
//         }
//         console.log(appointments.body);
//         resolve(appointments.body);
//       });
//
//       // } else {
//       //   throw new functions.https.HttpsError(
//       //     "permission-denied",
//       //     "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
//       //   );
//       // }
//     });
//   }
// );
//
// /*
// Will retrieve baby due / birth date and where will / were they born
// */
//
// exports.getBabyInfo = onCall({ region: "us-east4", cors: true }, async () => {
//   return new Promise(async (resolve, reject) => {
//     // if (
//     //   auth &&
//     //   auth.token
//     // ) {
//     acuity.request("/appointments?max=10", function (err, appointments) {
//       if (err) {
//         console.error(err);
//         reject(err);
//       }
//       console.log(appointments.body);
//       resolve(appointments.body);
//     });
//
//     // } else {
//     //   throw new functions.https.HttpsError(
//     //     "permission-denied",
//     //     "Only an admin user can change roles. If you are an admin, make sure the arguments passed into the function are correct."
//     //   );
//     // }
//   });
// });
//
// exports.getClientAppointments = onCall(
//   { region: "us-east4", cors: true },
//   async () => {
//     return new Promise((resolve, reject) => {
//       // Fetch raw appointments from Acuity
//       acuity.request("/appointments?max=100", (err, resp) => {
//         if (err) {
//           console.error("Acuity error:", err);
//           return reject(err);
//         }
//
//         const raw = resp.body;
//         const clientMap = {};
//
//         raw.forEach((appt) => {
//           // Skip anything that isn't one of our class categories
//           if (!CLASS_CATEGORIES.includes(appt.category)) return;
//
//           const id = appt.id;
//           if (!clientMap[id]) {
//             clientMap[id] = { appointments: [] };
//           }
//
//           clientMap[id].appointments.push({
//             date: new Date(appt.datetime),
//             instructor: appt.calendar || null,
//             title: appt.type || null,
//             classType: appt.category,
//             didAttend: !appt.canceled,
//           });
//         });
//
//         resolve(clientMap);
//       });
//     });
//   }
// );
//
//
