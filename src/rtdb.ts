import firebase from "firebase";
const app = firebase.initializeApp({
  apiKey: "AIzaSyDYyK5xfZ7JxkcddeMToq7EswEM-2WdxIg",
  authDomain: "dwf-chat.firebaseapp.com",
  databaseURL: "https://dwf-chat-default-rtdb.firebaseio.com/",
});
const rtdb = firebase.database(app);

export { rtdb };
