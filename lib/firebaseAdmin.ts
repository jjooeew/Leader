import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Setup the "Sanitizer" for the Private Key
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

// 2. The initialization function (Safe for Next.js builds)
function getAdminApp() {
  if (!getApps().length) {
    if (!privateKey) {
      throw new Error("FIREBASE_PRIVATE_KEY is missing from environment variables.");
    }

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }
}

// 3. Export a way to get the database that works everywhere
export const getDb = () => {
  getAdminApp();
  return getFirestore();
};