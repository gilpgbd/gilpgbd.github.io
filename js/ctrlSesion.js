import { protege, terminaSesión } from "./seguridad.js";
import { muestraSesion } from "./util.js";
/** @type {HTMLButtonElement} */
const terminarSesión = document.querySelector("#terminarSesión");
/** @type {HTMLOutputElement} */
const email = document.querySelector("#email");
/** @type {HTMLOutputElement} */
const nombre = document.querySelector("#nombre");
/** @type {HTMLImageElement} */
const avatar = document.querySelector("#avatar");
terminarSesión.addEventListener("click", terminaSesión);
protege("", muestraSesion, usuarioAutorizado => {
  email.value = usuarioAutorizado.email;
  nombre.value = usuarioAutorizado.nombre || "";
  avatar.src = usuarioAutorizado.urlFoto || "";
});