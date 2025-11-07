import * as admin from "firebase-admin";

// if the app has not been initialized by this point, do it now
if (!admin.apps.length || admin.apps.length === 0) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
