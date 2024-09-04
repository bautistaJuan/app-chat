import { handleFormData } from "../utils/utils.js";
class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.innerHTML = `
      .form {
        display:flex;
        flex-direction: column;
        min-width: 350px;
        margin-top: 5rem;
      }
      h1 {
        text-align: center;
        color: #fff;
        font-size: 3rem;
      }  
      .input-section {
        display:flex;
        flex-direction: column;
        gap: 10px;
      }
      #name, #email{
       height: 3rem;
       border: none;
       border-radius: 10px;
       padding: 10px;
       margin-top: 10px;
       font-size: 1.4rem;
       padding: .4rem;
       transition: all 0.5s ease;
       padding-left: .9rem;
       }
       input:focus{
        outline: none;
        background-color: #000;
        color: #fff;
       }
       .button-section{
        margin-top: 50px;
         display:flex;
         flex-direction: column;
       }
      .button-section button{
        margin-top: 10px;
        height: 3rem;
        border: none;
        border-radius: 5px;
        color: #fff;
        font-size: 1.4rem;
        font-weight: bold;
        cursor: pointer;
        }
        #signing{
          background-color: #fff;
          color: #000;
        }
        #signup{
         background-color: #000;
        }
    `;
    this.shadow.appendChild(style);
  }

  connectedCallback() {
    this.render();
  }
  formListener() {
    const form = this.shadow.querySelector("#form");
    form.addEventListener("submit", (e: any) => {
      handleFormData(e);
    });
  }
  render() {
    const container = document.createElement("div");
    container.innerHTML = `
      <h1>¡ Bienvenidx !</h1>
      <form id="form" class="form">
        <div class="input-section">
          <input id="name" type="text" placeholder="Nombre..." name="name"/>
          <input id="email" type="email" placeholder="Email..." name="email"/>
        </div>
        <div class="button-section">
          <button type="submit" id="signing">Ingresar</button>
          <button type="submit" id="signup">Registrarse</button>
        </div>
      </form>
    `;
    this.shadow.appendChild(container);
    this.formListener();
  }
}

customElements.define("home-page", Home);
