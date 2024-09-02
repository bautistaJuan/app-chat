"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const app = express();
// midleware
app.use(express.json());
app.use(cors());
const usersCollection = db_1.firestore.collection("users");
const roomsCollection = db_1.firestore.collection("rooms");
/**
 * Creates a new user in the database with the provided email and name.
 *
 * @param {string} email - The email of the new user.
 * @param {string} name - The name of the new user.
 * @returns {Promise<{ id: string, new: boolean }>} - An object containing the ID of the newly created user and a flag indicating if the user was newly created.
 * @throws {Error} - If the user already exists.
 */
app.post("/signup", (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  if (!email || !name) {
    return res.status(400).json({ error: "Email y nombre son requeridos" });
  }
  usersCollection
    .where("email", "==", email)
    .get()
    .then(emailValidate => {
      if (emailValidate.empty) {
        usersCollection
          .add({
            email,
            name,
          })
          .then(newUser => {
            res.status(201).json({
              id: newUser.id,
              new: true,
            });
          });
      } else {
        res.status(409).json({ error: "Ese usuario ya existe" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
// Aunteticacion
/**
 * Authenticates a user by checking if the provided email and name match an existing user in the database.
 *
 * @param {string} email - The email of the user to authenticate.
 * @param {string} name - The name of the user to authenticate.
 * @returns {Promise<{ id: string }>} - An object containing the ID of the authenticated user.
 * @throws {Error} - If the user is not found.
 */
app.post("/auth", (req, res) => {
  const { email } = req.body;
  const { name } = req.body;
  usersCollection
    .where("email".toLowerCase(), "==", email)
    .where("name".toLowerCase(), "==", name)
    .get()
    .then(emailValidation => {
      if (emailValidation.empty) {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      } else {
        res.json({
          id: emailValidation.docs[0].id,
        });
      }
    })
    .catch(error => {
      console.error("Error al buscar el usuario", error);
      res.status(500).json({
        message: "Error en el servidor",
      });
    });
});
/**
 * Creates a new room in the Realtime Database and stores its ID in Firestore.
 *
 * @param {string} userId - The ID of the user creating the room.
 * @returns {Promise<{ id: number }>} - An object containing the ID of the newly created room.
 * @throws {Error} - If the user is not found.
 */
app.post("/rooms", (req, res) => {
  //Este endpoint se encarga de crear una nueva room en la realtime
  const { userId } = req.body;
  usersCollection
    .doc(userId.toString()) // Buscamos el documento con el id que nos pasaron en el body
    .get()
    .then(snap => {
      console.log(snap.exists);
      if (snap.exists) {
        const roomRef = db_1.rtdb.ref("rooms/" + crypto.randomUUID()); // Acá se crea una nueva room en la Realtime DB
        roomRef
          .set({
            messages: [],
            owner: userId,
          })
          .then(() => {
            const longId = roomRef.key; // ID que Firebase nos devuelve al crear algo
            const roomId = 1000 + Math.floor(Math.random() * 9000); // Acá se crea un número aleatorio de 4 dígitos
            roomsCollection
              .doc(roomId.toString()) // Este ID vas ver en Firetore
              .set({
                rtdbRoomId: longId, // Este ID es el que se va a guardar dentro del documento de Firestore que tiene el ID anterior
              })
              .then(() => {
                res.json({
                  id: roomId, // Le mostramos al cliente el ID de la room que se creó
                });
              });
          });
      } else throw new Error();
    })
    .catch(() => {
      return res.status(404).json({
        message: "No existe el usuario",
      });
    });
});
/**
 * Retrieves the details of a room based on the provided room ID and user ID.
 *
 * @param {string} userId - The ID of the user requesting the room details.
 * @param {string} roomId - The ID of the room to retrieve.
 * @returns {Promise<Object>} - The details of the requested room, including the Realtime Database room ID.
 * @throws {Error} - If the user or room is not found, or an internal server error occurs.
 */
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  usersCollection
    .doc(userId.toString())
    .get()
    .then(snap => {
      if (snap.exists) {
        roomsCollection
          .doc(roomId.toString())
          .get()
          .then(snapFinal => {
            if (!snapFinal.exists)
              return res.status(404).json({ message: "Room not found" });
            const data = snapFinal.data();
            res.json(data.rtdbRoomId);
          });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(error => {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});
//
//
//  Initialize
app.listen(port, () => {
  console.log(`Ejecutando en : http://${host}:${port}`);
});
