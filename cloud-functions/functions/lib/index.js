"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
exports.api = (0, https_1.onRequest)({ region: "us-east4" }, app_1.default);
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
//# sourceMappingURL=index.js.map
