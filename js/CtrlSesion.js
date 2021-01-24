import {
  getAuth
} from "../lib/fabrica.js";
import {
  muestraError
} from "../lib/util.js";
import {
  iniciaSesión,
  terminaSesión
} from "./seguridad.js";

/** @type {HTMLOutputElement} */
const email = document.
  querySelector("#email");
/** @type {HTMLOutputElement} */
const nombre = document.
  querySelector("#nombre");
/** @type {HTMLImageElement} */
const avatar = document.
  querySelector("#avatar");
/** @type {HTMLButtonElement} */
const terminarSesión = document.
  querySelector(
    "#terminarSesión");

/* Escucha cambios de usuario.
 * El primer parámetro es una
 * función que se invoca cada que
 * hay un cambio de usuario y
 * recibe los datos del usuario.
 * El segundo parámetro es una
 * función que se invoca cuando se
 * presenta un error en un cambio
 * de usuario y recibe un Error.
 */
getAuth().onAuthStateChanged(
  muestraSesión, muestraError);

/** Muestra los datos del usuario
 * o manda a iniciar sesión en
 * caso de que no haya empezado.
 * @param {import(
    "../lib/tiposFire").
    User} usuario modelo con las
 *    características del usuario
 *    o null si no ha iniciado
 *    sesión. */
async function
  muestraSesión(usuario) {
  if (usuario && usuario.email) {
    // Usuario aceptado.
    email.value =
      usuario.email || "";
    nombre.value =
      usuario.displayName || "";
    avatar.src =
      usuario.photoURL || "";
    terminarSesión.
      addEventListener(
        "click", terminaSesión);
  } else {
    // No ha iniciado sesión.
    iniciaSesión();
  }
}