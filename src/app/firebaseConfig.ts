import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Importing env cred
const apiKey = import.meta.env.VITE_APP_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_APP_FIREBASE_PROJECT_ID;
const appId = import.meta.env.VITE_APP_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "billing-app-7868c.firebaseapp.com",
  projectId: projectId,
  storageBucket: "billing-app-7868c.appspot.com",
  messagingSenderId: "872979294331",
  appId: appId,
  measurementId: "G-Z5RRDT2PVJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
