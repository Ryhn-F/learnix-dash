import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let app;
const firebaseConfigStr = process.env.FIREBASE_CONFIG || "{}";

try {
  const firebaseConfig = JSON.parse(firebaseConfigStr);
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn(
    "Failed to parse FIREBASE_CONFIG. Firebase will be minimally initialized.",
  );
  app = !getApps().length ? initializeApp({}) : getApp();
}

export const db = getFirestore(app);
export const hasFirebaseConfig = !!firebaseConfigStr;
