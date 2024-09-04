const API_BASE_URL = "https://backend-chat-lac.vercel.app";
import { ref, onValue } from "firebase/database";
import { rtdb } from "./rtdb";
import { map } from "lodash";
import { Router } from "@vaadin/router";
/**
 * The application state management object. It handles the state of the application, including user data, room information, and message history.
 *
 * The state object provides methods to initialize the state, set the room ID, set the user's name and email, push messages to the current room, sign up a new user, sign in an existing user, create a new room, access an existing room, and listen for changes to the room's message history.
 *
 * The state is stored in the browser's local storage, and is automatically loaded and updated when the application is loaded.
 */
const state = {
  data: {
    email: "",
    fullName: "",
    userId: "",
    roomId: "",
    rtdbroomId: "",
    messages: [],
  },
  listeners: [],
  init() {
    const currentState = this.getState();

    const localData = localStorage.getItem("state");
    let upDateState;

    try {
      upDateState = JSON.parse(localData);
    } catch (error) {
      console.error("Error al parsear el estado desde localStorage:", error);
      Router.go("/");
      return;
    }
    if (
      upDateState &&
      upDateState.email &&
      upDateState.fullName &&
      upDateState.roomId &&
      upDateState.userId &&
      upDateState.rtdbroomId
    ) {
      currentState.email = upDateState.email;
      currentState.fullName = upDateState.fullName;
      currentState.roomId = upDateState.roomId;
      currentState.userId = upDateState.userId;
      currentState.rtdbroomId = upDateState.rtdbroomId;

      // Actualiza el estado y escucha la sala
      this.setState(currentState);
      this.listenRoom();
      Router.go("/chat");
    } else {
      // Si no se encuentran los datos necesarios, redirige a la página de inicio
      Router.go("/");
    }
  },
  setRoomId(id: string) {
    const currentState = this.getState();
    currentState.roomId = id;
    this.setState(currentState);
  },
  setNameAndEmail({ name, email }: { name: string; email: string }) {
    const currentState = this.getState();
    currentState.fullName = name;
    currentState.email = email;
    this.setState(currentState);
  },
  pushMessages(message: string) {
    const currentState = this.getState();
    const roomId = currentState.rtdbroomId;
    fetch(API_BASE_URL + "/rooms/" + roomId, {
      headers: { "content-type": "application/json" },
      method: "post",
      body: JSON.stringify({
        from: currentState.fullName,
        text: message,
      }),
    });
  },
  signup(callback?) {
    const currentState = this.data;
    if (!currentState.email && !currentState.fullName) callback(false);

    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: currentState.fullName,
        email: currentState.email,
      }),
    })
      .then(res => {
        if (res.status == 409) throw new Error("Ese usuario ya existe");
        return res.json();
      })
      .then(data => {
        console.error("DATA", data);
        currentState.userId = data.id;
        this.setState(currentState);
        callback(true);
      })
      .catch(err => {
        console.error(err);
        callback(false);
      });
  },
  signing(callback?) {
    const currentState = this.getState();
    if (!currentState.email) {
      console.error("Email no encontrado");
      callback(false);
      return;
    }
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: currentState.email,
        name: currentState.fullName,
      }),
    })
      .then(res => {
        if (!res.ok) {
          if (callback) callback(false);
          throw new Error("Error en la autenticación");
        }
        return res.json();
      })
      .then(data => {
        currentState.userId = data.id;
        this.setState(currentState);
        if (callback) callback(true);
      })
      .catch(error => {
        console.error(error);
        callback(false);
      });
  },
  newRoom(callback?) {
    const currenState = this.getState();
    if (!currenState.userId) {
      console.error("UserId empty");
      return callback(false);
    }
    fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ userId: currenState.userId }),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        currenState.roomId = data.id;
        currenState.messages = [];
        this.setState(currenState);
        this.accesRoom();
        callback(true);
      })
      .catch(error => {
        console.error("No se pudo crear nueva room");
        return;
      });
  },
  accesRoom(callback?) {
    const currenState = this.getState();
    const userId = currenState.userId;
    const roomId = currenState.roomId;

    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then(res => {
        if (!res.ok) {
          if (callback) callback(false);
          throw new Error();
        }
        return res.json();
      })
      .then(data => {
        currenState.rtdbroomId = data;
        this.listenRoom();
        this.setState(currenState);
        if (callback) callback(true);
      })
      .catch(error => {
        console.error(error);
        callback(false);
        return;
      });
  },
  listenRoom() {
    // console.log("Escuchando mensajes");

    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbroomId;

    const chatroomsRef = ref(rtdb, "rooms/" + rtdbRoomId + "/messages");
    onValue(chatroomsRef, snaps => {
      if (snaps.val() === null) {
        console.error("No hay mensajes");
        currentState.messages = [];
        return this.setState(currentState);
      } else {
        const messageFromServer = snaps.val();
        const messageList = map(messageFromServer);
        currentState.messages = messageList;
        return this.setState(currentState);
      }
    });
  },
  getState() {
    return this.data;
  },
  resetState() {
    localStorage.removeItem("state");
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    // console.log("Soy el state y he cambiado", this.data);
  },
  subscribe(callback: (cosa: any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
