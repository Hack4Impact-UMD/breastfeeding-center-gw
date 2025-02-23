// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyC1Tiq6fpX9_sfOrSSo_xKUT60_dPRXMlo",
  authDomain: "breastfeeding-center-gw.firebaseapp.com",
  projectId: "breastfeeding-center-gw",
  storageBucket: "breastfeeding-center-gw.firebasestorage.app",
  messagingSenderId: "611366512129",
  appId: "1:611366512129:web:74ae2c89b43ebccaf38200",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-east4");
// connectFunctionsEmulator(functions, "127.0.0.1", 5001);
export default app;
