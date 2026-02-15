import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Setup the "Universal" Sanitizer
const rawKey = process.env.FIREBASE_PRIVATE_KEY;

const privateKey = rawKey 
  ? (rawKey.startsWith('-----') 
      ? rawKey.replace(/\\n/g, '\n') // Handle raw PEM format
      : Buffer.from(rawKey, 'base64').toString('ascii')) // Handle Base64 format
  : undefined;

// 2. The initialization function
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

// 3. Export the DB getter
export const getDb = () => {
  getAdminApp();
  return getFirestore();
};