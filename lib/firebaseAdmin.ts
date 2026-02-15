import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // We use the simple replace fix—this is standard for Vercel
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

export function getDb() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return getFirestore();
}