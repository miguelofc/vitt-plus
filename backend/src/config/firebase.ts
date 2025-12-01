import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKeyEnv = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKeyEnv) {
  throw new Error("Variáveis de ambiente Firebase não configuradas.");
}

const privateKey = privateKeyEnv.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey
  })
});

export const firebaseAdmin = admin;
export const firestore = admin.firestore();
export const firebaseAuth = admin.auth();
