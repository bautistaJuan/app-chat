import { state } from "../state";
import { handleSelectRoom } from "../utils/utils";
class SelectRoom extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.innerHTML = `
       select {
        width: 200px;
        padding: 10px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        background-color: #fff;
        color: #000;
        cursor: pointer;
       } 
        .container {
         display:flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         gap: 1rem;
         margin-top: 3rem;
        }
        h1 {
          color: #fff;
          font-size: 2rem;
        }
        #option-container{
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         background-color: #f0f0f0;
         border-radius: 10px;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
         padding: 20px;
         margin-top: 20px;
         width: 100%;
         max-width: 300px;
         height: 200px;
         }
         #option-container input:focus{
          outline: none;
         }
         #option-container input,
         #option-container button {
         width: 100%;
         padding: 10px;
         margin: 10px 0;
         border: 1px solid #ddd;
         border-radius: 5px;
         font-size: 16px;
        }
       #option-container button {
        background-color: #4CAF50;
         color: white;
         border: none;
         cursor: pointer;
         transition: background-color 0.3s;
        }
        #option-container button:hover {
         background-color: #45a049;
        }
        #join-room-form, #new-room-form{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
    `;
    this.shadow.appendChild(style);
  }
  connectedCallback() {
    this.render();
  }
  listeners() {
    const salasOption: HTMLSelectElement =
      this.shadow.querySelector("#salas-select");
    const optionContainer: HTMLElement =
      this.shadow.querySelector("#option-container");
    salasOption?.addEventListener("change", (event: Event) =>
      handleSelectRoom(event, optionContainer)
    );
  }

  render() {
    const container = document.createElement("div");
    container.innerHTML = `
      <div class="container">
       <h1>Antes de continuar</h1>
        <select name="salas" id="salas-select">
          <option value="">Por favor, elige uno</option>
          <option value="NewRoom">NUEVA SALA</option>
          <option value="OldRoom">SALA EXISTENTE</option>
        </select>
        <div id="option-container"></div>
      </div>
    `;
    this.shadow.appendChild(container);
    this.listeners();
  }
}

customElements.define("room-selection", SelectRoom);
