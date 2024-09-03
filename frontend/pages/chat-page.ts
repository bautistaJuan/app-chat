import { Router } from "@vaadin/router";
import { state } from "../state";
import iconOut from "../asset/4115235-exit-logout-sign-out_114030.png";
import iconBack from "../asset/plus_create_new_icon_145949.png";
type Message = {
  from: string;
  text: string;
};
class Chat extends HTMLElement {
  id: "";
  messages: Message[] = [];

  connectedCallback() {
    const currentState = state.getState();
    this.id = currentState.roomId;

    state.subscribe(() => {
      this.messages = currentState.messages;
      this.render();
    });

    this.render();
  }
  eventListenersFromChat() {
    /**
     * Adds event listeners to the chat page custom-element, including:
     * - A "Back" button that navigates to the room selection page
     * - An "End" button that navigates to the home page and resets the application state
     * - A form that allows the user to submit new messages, which are then added to the application state
     */
    const form = document.querySelector(".form-messages");
    const back = document.querySelector("#back");
    const end = document.querySelector("#end");
    back?.addEventListener("click", () => Router.go("/room-selection"));
    end?.addEventListener("click", () => {
      state.resetState();
      Router.go("/");
    });
    form?.addEventListener("submit", (e: any) => {
      let target = e.target;
      e.preventDefault();

      if (target["new-message"].value) {
        state.pushMessages(target["new-message"].value);
        target["new-message"].value;
      } else {
        return alert("No se puede enviar el mensaje");
      }
    });
  }
  render() {
    this.innerHTML = `
    <div class="container">
    <div class="header">
    <button id="back">
    <img class="out" src=${iconBack} />
    Atrás
    </button> 
    <button id="end">
      <img class="out" src=${iconOut} />
      Salir
      </button> 
    <h5 class="header-title">ID de la sala ${this.id} </h5>
    </div>
    <div class="messages">
      ${this.messages
        .map(m => {
          return `<div class="message">${m.from ? m.from : "Sin nombre"}:${
            m.text
          }</div>`;
        })
        .join(" ")}
     </div>
        <form action="submit" class="form-messages">
        <input type="text" placeholder="Ecribe tu mensaje..." name="new-message" />
        <button type="submit" class="enviar">Enviar</button>
        </form
    </div>
    `;
    this.eventListenersFromChat();
  }
}
customElements.define("chat-page", Chat);
