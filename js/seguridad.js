import { buscaUsuario } from "./bdUsuarios.js";
import { nuevoAuth, nuevoProvider } from "./fabrica.js";
import { procesaError } from "./util.js";

const auth = nuevoAuth();

/** @typedef {Object} UsuarioAutorizado
 * @property {string} email
 * @property {string} nombre
 * @property {string} urlFoto */

/**
 * @param {string} privilegio
 * @param {() => void} acciónDeEscape
 * @param {(usuarioAutorizado: UsuarioAutorizado) => void} acción */
export function protege(privilegio, acciónDeEscape, acción) {
  /** Conexión al sistema de autenticación de Firebase. */
  const provider = nuevoProvider();
  /* Recibe una función que se invoca cada que hay un cambio en la
   * autenticación y recibe el modelo con las características del usuario.*/
  auth.onAuthStateChanged(
    /** Recibe las características del usuario o null si no ha iniciado
     * sesión. */
    async usuarioAuth => {
      if (usuarioAuth && usuarioAuth.email) {
        // Usuario aceptado.
        /** @typedef {UsuarioAutorizado} */
        const usuarioAutorizado = {
          email: usuarioAuth.email,
          nombre: usuarioAuth.displayName || "",
          urlFoto: usuarioAuth.photoURL || "",
        };
        if (privilegio) {
          const usuario = await buscaUsuario(usuarioAuth);
          if (usuario) {
            const set = new Set(usuario.privilegios.map(p => p.id))
            if (set.has(privilegio)) {
              acción(usuarioAutorizado);
            } else {
              alert("El usuario no está autorizado.");
              acciónDeEscape();
            }
          } else {
            alert("El usuario no está registrado.");
            await terminaSesión();
          }
        } else {
          acción(usuarioAutorizado);
        }
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
}

export async function terminaSesión() {
  try {
    await auth.signOut();
  } catch (e) {
    procesaError(e);
  }
}