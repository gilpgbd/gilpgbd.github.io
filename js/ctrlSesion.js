import { nuevoAuth, procesaError } from "./util.js";
/** @type {HTMLButtonElement} */
const terminarSesión = document.querySelector("#terminarSesión");
/** @type {HTMLOutputElement} */
const email = document.querySelector("#email");
/** @type {HTMLOutputElement} */
const nombre = document.querySelector("#nombre");
/** @type {HTMLImageElement} */
const avatar = document.querySelector("#avatar");
terminarSesión.addEventListener("click", terminaSesión);
/** Conexión al sistema de autenticación de Firebase. */
const auth = nuevoAuth();
/** Tipo de autenticación de usuarios. En este caso es con Google. */
// @ts-ignore
const provider = new firebase.auth.GoogleAuthProvider();
/* Configura el proveedor de Google para que permita seleccionar el
 * nombre de usuario en una lista. */
provider.setCustomParameters({ prompt: "select_account" });
/* Recibe una función que se invoca cada que hay un cambio en la
 * autenticación y recibe el modelo con las características del usuario.*/
auth.onAuthStateChanged(
  /** Recibe las características del usuario o null si no ha iniciado
   * sesión. */
  usuarioAuth => {
    if (usuarioAuth && usuarioAuth.email) {
      // Usuario aceptado.
      email.value = usuarioAuth.email;
      nombre.value = usuarioAuth.displayName || "";
      avatar.src = usuarioAuth.photoURL || "";
    } else {
      // No ha iniciado sesión. Pide datos para iniciar sesión.
      auth.signInWithRedirect(provider);
      //auth.signInWithPopup(provider);
      //auth.signInAnonymously();
    }
  },
  // Función que se invoca si hay un error al verificar el usuario.
  procesaError
);
async function terminaSesión() {
  try {
    await auth.signOut();
  } catch (e) {
    procesaError(e);
  }
}