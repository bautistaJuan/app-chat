import { state } from "../state";
import { handleSelectRoom } from "../utils/utils";
class SelectRoom extends HTMLElement {
  connectedCallback() {
    state.subscribe(() => {
      this.render();
    });
    this.render();
    const salasOption: HTMLSelectElement =
      document.querySelector("#salas-select");
    const optionContainer: HTMLElement =
      document.querySelector("#option-container");
    salasOption?.addEventListener("change", (event: Event) =>
      handleSelectRoom(event, optionContainer)
    );
  }
  render() {
    this.innerHTML = `
      <div class="container">
       <h1>Antes de continuar</h1>
        <label for="salas-select">Elige una opción:</label>
        <select name="salas" id="salas-select">
          <option value="">--Por favor, elige uno--</option>
          <option value="NewRoom">NUEVA SALA</option>
          <option value="OldRoom">SALA EXISTENTE</option>
        </select>
        <div id="option-container"></div>
      </div>
    `;
  }
}

customElements.define("room-selection", SelectRoom);
