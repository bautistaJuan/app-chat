import { Router } from "@vaadin/router";
import { state } from "../state";
import iconOut from "data-url:../asset/4115235-exit-logout-sign-out_114030.png";
import iconBack from "data-url:../asset/plus_create_new_icon_145949.png";
import iconSend from "data-url:../asset/ic_send_128_28719.png";
import bg from "data-url:../asset/bg-chat.png";
type Message = {
  from: string;
  text: string;
};
class Chat extends HTMLElement {
  id: "";
  messages: Message[] = [];
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    let style = document.createElement("style");
    style.textContent = `
      .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100vh;
        min-width: 100vw;
        background-image: url(${bg});
        background-size: cover;
        background-repeat: no-repeat;
        background-color: rgba(129, 126, 126, 0.3);
        background-blend-mode: darken;
      }

      .header {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background-color: #33383F;
        color: white;
      }
                    
      .header-title {
        font-size: 18px;
        text-align: left;
        margin: 0;
      }

      #back, #end {
        display: flex;
        align-items: center;
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
      }

      #back img.out, #end img.out {
        width: 30px;
        height: 30px;
        margin-right: 5px;
      }

      .messages {
        height: 420px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: auto;
        word-break: break-word;
        width: 100%;
      }

      .messages::-webkit-scrollbar {
        width: 5px;
      }
      @media (width > 768px) {
        .messages::-webkit-scrollbar {
          width: 12px;
        }
      }
      .messages::-webkit-scrollbar-track {
       background: #fff;
      border-radius: 20px;
      }
    
      .messages::-webkit-scrollbar-thumb {
      background-color: #9cbbe9;
      border-radius: 20px;
      }
      .message {      
      text-align: left;
      } 
      .message, .message-me{
        margin-bottom: 10px;
        border-radius: 5px;
        display: flex;
      }
      .message span{
        background-color: #f1f1f1;
      }
      .message span, .message-me span{
        padding: 10px;
        font-size: 1.2rem;
        max-width: 320px;
      }
      .message-me{
        justify-content: end;
      }
      .message-me span{
        background-color: #7EB6FF;
        color: #fffc;
        text-align: right;
      }
      .form-messages {
        display: flex;
        padding: 10px;
      }
      .form-messages input[type="text"] {
        flex-grow: 1;
        padding: 10px;
        border: none;
        border-radius: 5px;
        margin-right: 10px;
        font-size: 16px;
        }
        .form-messages input[type="text"]:focus {
         outline: none;
        }

      .btn-send {
        background: none;
        border: none;
        cursor: pointer;
        width: 60px;
        height: 60px;
      }

      .send {
        width: 60px;
        height: 60px;
      }

   `;

    this.shadow.appendChild(style);
  }
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.id = currentState.roomId;
      this.shadow.lastChild.remove();
      this.render();
    });

    const currentState = state.getState();
    this.messages = currentState.messages;

    this.render();
  }
  eventListenersFromChat() {
    const form = this.shadow.querySelector(".form-messages");
    const back = this.shadow.querySelector("#back");
    const chatSection = this.shadow.querySelector(".messages");
    chatSection?.scrollTo({
      top: 10000,
      left: 0,
      behavior: "instant",
    });
    const end = this.shadow.querySelector("#end");
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
    const container = document.createElement("div");
    const currentState = state.getState();
    container.innerHTML = `
    <div class="container">
     <div class="header">
        <h5 class="header-title">ID: ${this.id} </h5>
        <button id="back">
          <img class="out" src=${iconBack} />
          Atrás
        </button> 
        <button id="end">
          <img class="out" src=${iconOut} />
          Salir
        </button> 
      </div>
      <div class="messages">
        ${this.messages
          .map(m => {
            if (m.from !== currentState.fullName) {
              return `<div class="message"><span>${m.from}: ${m.text}<span></div>`;
            } else {
              return `<div class="message-me"><span>${m.text}</span></div>`;
            }
          })
          .join(" ")}
      </div>
      <form action="submit" class="form-messages">
       <input type="text" placeholder="Ecribe tu mensaje..." name="new-message" />
        <button type="submit" class="btn-send">
         <img class="send" src=${iconSend} />
        </button>
      </form>
    </div>
    `;

    this.shadow.appendChild(container);
    this.eventListenersFromChat();
  }
}
customElements.define("chat-page", Chat);
