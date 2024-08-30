import { handleFormData } from "../utils/utils";
class Home extends HTMLElement {
  constructor() {
    super();
  }

  //   import cssText from 'bundle-text:./test.css';

  // // inject <style> tag
  // let style = document.createElement('style');
  // style.textContent = cssText;
  // shadowRoot.appendChild(style);
  connectedCallback() {
    this.render();
    const form = this.querySelector("#form");
    form.addEventListener("submit", (e: any) => {
      handleFormData(e);
    });
  }
  render() {
    this.innerHTML = `
      <h1>¿Ya tienes una cuenta?</h1>
      <form id="form">
        <input id="name" type="text" placeholder="Name" name="name"/>
        <input id="email" type="email" placeholder="Email..." name="email"/>
        <button type="submit" id="signing">Ingresar</button>
        <button type="submit" id="signup">Registrarse</button>
      </form>
    `;
  }
}

customElements.define("home-page", Home);
