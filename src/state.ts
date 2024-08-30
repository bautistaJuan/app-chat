const API_URL = "http://localhost:3000";
import { rtdb } from "./rtdb";
import { map } from "lodash";
import { Router } from "@vaadin/router";

// import map from "lodash/map";
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
    rtdb
      .ref("/rooms/" + currentState.rtdbroomId + "/messages")
      .push()
      .set({
        from: currentState.fullName,
        text: message,
      });
  },
  signup(callback?) {
    const currentState = this.data;
    if (!currentState.email && !currentState.fullName) callback(false);

    fetch(API_URL + "/signup", {
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

    try {
      fetch(API_URL + "/auth", {
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
        });
    } catch (error) {
      console.error(error);
    }
  },
  newRoom(callback?) {
    const currenState = this.getState();
    if (!currenState.userId) {
      console.error("UserId empty");
      return callback(false);
    }
    fetch(API_URL + "/rooms", {
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

    fetch(API_URL + "/rooms/" + roomId + "?userId=" + userId)
      .then(res => {
        if (!res.ok) {
          if (callback) callback(false);
          throw new Error();
        }
        return res.json();
      })
      .then(data => {
        currenState.rtdbroomId = data;
        this.setState(currenState);
        this.listenRoom();
        if (callback) callback(true);
      })
      .catch(error => {
        console.error(error);
        callback(false);
        return;
      });
  },
  listenRoom() {
    const currentState = this.getState();
    const rtdbRoomId = currentState.rtdbroomId;

    const chatroomsRef = rtdb.ref("/rooms/" + rtdbRoomId + "/messages");
    chatroomsRef.on("value", snaps => {
      const messageFromServer = snaps.val();
      const messageList = map(messageFromServer);
      currentState.messages = messageList;
      return this.setState(currentState);
    });
  },
  getState() {
    return this.data;
  },

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("Soy el state y he cambiado", this.data);
  },
  reset() {
    localStorage.clear();
  },
  subscribe(callback: (cosa: any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
