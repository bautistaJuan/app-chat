import * as admin from "firebase-admin";
const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://dwf-chat-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
