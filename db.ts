import * as admin from "firebase-admin";
require("dotenv").config();

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://dwf-chat-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
