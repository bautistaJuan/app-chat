import { Router } from "@vaadin/router";
import { state } from "../state";
/**
 * Handles the form data submission, including setting the user's name and email in the application state, and performing either a sign-in or sign-up operation based on the form submission button clicked.
 *
 * @param e - The form submission event object.
 */
function handleFormData(e) {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  if (!name || !email)
    return alert(
      "Llena el formulario con tus datos y presiona uno de los botones"
    );

  state.setNameAndEmail({ name, email });
  if (e.submitter.id == "signing") {
    state.signing(permition => {
      if (!permition) return alert("Intenta de nuevo");
      Router.go("/room-selection");
    });
  } else if (e.submitter.id == "signup") {
    state.signup(permition => {
      if (!permition)
        return alert(
          "Por favor, verifica bien los datos y vuelve a intentarlo!"
        );
      Router.go("/room-selection");
    });
  }
}
/**
 * Handles the logic for selecting a room option, either creating a new room or joining an existing one.
 *
 * @param event - The event object from the room selection UI.
 * @param optionContainer - The DOM element that contains the room selection options.
 */
function handleSelectRoom(event, optionContainer) {
  event.preventDefault();
  const selected = (event.target as HTMLSelectElement).value;
  // Limpiar el contenedor de opciones cada vez que se selecciona una opción
  optionContainer.innerHTML = "";

  switch (selected) {
    case "NewRoom":
      optionContainer.innerHTML = `
           <p>Crear una nueva sala. A continuación vas a ingresar a tu sala de chat y podrás encontrar tu ID en la parte superior izquierda</p>
            <form id="new-room-form">
             <button type="submit">Crear Sala</button>
            </form>
          `;
      const newRoomForm = optionContainer.querySelector("#new-room-form");
      newRoomForm?.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        state.newRoom(permition => {
          if (!permition) return alert("Error al crear la sala");
          Router.go("/chat");
        });
      });
      break;

    case "OldRoom":
      optionContainer.innerHTML = `
            <p>Ingresa el ID de la sala al que deseas unirte:</p>
            <form id="join-room-form">
              <input type="text" id="room-id" placeholder="1234" name="room-id" />
              <button type="submit">Ingresar</button>
            </form>
          `;
      const joinRoomForm = optionContainer.querySelector("#join-room-form");
      joinRoomForm?.addEventListener("submit", (e: Event) => {
        e.preventDefault();
        const roomId = (
          optionContainer.querySelector("#room-id") as HTMLInputElement
        ).value.toString();
        state.setRoomId(roomId);
        state.accesRoom(permition => {
          if (!permition) {
            alert("Error al ingresar a la sala");
            state.resetState();
            location.reload();
            return;
          }
          Router.go("/chat");
        });
      });
      break;

    default:
      alert("Por favor, selecciona una opción");
      break;
  }
}

export { handleFormData, handleSelectRoom };
