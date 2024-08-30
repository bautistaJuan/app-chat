"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var express = require("express");
var cors = require("cors");
var port = process.env.PORT || 3000;
var app = express();
// midleware
app.use(express.json());
app.use(cors());
var usersCollection = db_1.firestore.collection("users");
var roomsCollection = db_1.firestore.collection("rooms");
/**
 * Creates a new user in the database with the provided email and name.
 *
 * @param {string} email - The email of the new user.
 * @param {string} name - The name of the new user.
 * @returns {Promise<{ id: string, new: boolean }>} - An object containing the ID of the newly created user and a flag indicating if the user was newly created.
 * @throws {Error} - If the user already exists.
 */
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    if (!email || !name) {
        return res.status(400).json({ error: "Email y nombre son requeridos" });
    }
    usersCollection
        .where("email", "==", email)
        .get()
        .then(function (emailValidate) {
        if (emailValidate.empty) {
            usersCollection
                .add({
                email: email,
                name: name,
            })
                .then(function (newUser) {
                res.status(201).json({
                    id: newUser.id,
                    new: true,
                });
            });
        }
        else {
            res.status(409).json({ error: "Ese usuario ya existe" });
        }
    })
        .catch(function (error) {
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
app.post("/auth", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    usersCollection
        .where("email".toLowerCase(), "==", email)
        .where("name".toLowerCase(), "==", name)
        .get()
        .then(function (emailValidation) {
        if (emailValidation.empty) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }
        else {
            res.json({
                id: emailValidation.docs[0].id,
            });
        }
    })
        .catch(function (error) {
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
app.post("/rooms", function (req, res) {
    //Este endpoint se encarga de crear una nueva room en la realtime
    var userId = req.body.userId;
    usersCollection
        .doc(userId.toString()) // Buscamos el documento con el id que nos pasaron en el body
        .get()
        .then(function (snap) {
        console.log(snap.exists);
        if (snap.exists) {
            var roomRef_1 = db_1.rtdb.ref("rooms/" + crypto.randomUUID()); // Acá se crea una nueva room en la Realtime DB
            roomRef_1
                .set({
                messages: [],
                owner: userId,
            })
                .then(function () {
                var longId = roomRef_1.key; // ID que Firebase nos devuelve al crear algo
                var roomId = 1000 + Math.floor(Math.random() * 9000); // Acá se crea un número aleatorio de 4 dígitos
                roomsCollection
                    .doc(roomId.toString()) // Este ID vas ver en Firetore
                    .set({
                    rtdbRoomId: longId, // Este ID es el que se va a guardar dentro del documento de Firestore que tiene el ID anterior
                })
                    .then(function () {
                    res.json({
                        id: roomId, // Le mostramos al cliente el ID de la room que se creó
                    });
                });
            });
        }
        else
            throw new Error();
    })
        .catch(function () {
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
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    usersCollection
        .doc(userId.toString())
        .get()
        .then(function (snap) {
        if (snap.exists) {
            roomsCollection
                .doc(roomId.toString())
                .get()
                .then(function (snapFinal) {
                if (!snapFinal.exists)
                    return res.status(404).json({ message: "Room not found" });
                var data = snapFinal.data();
                res.json(data.rtdbRoomId);
            });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    })
        .catch(function (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    });
});
//
//
//  Initialize
app.listen(port, function () {
    console.log("Ejecutando en : http://localhost:".concat(port));
});
