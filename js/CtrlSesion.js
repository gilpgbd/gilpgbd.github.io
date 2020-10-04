import { buscaUsuario } from "./bdUsuarios.js";

/** @typedef {Object} UsuarioAutorizado
 * @property {string} email
 * @property {string} nombre
 * @property {string} urlFoto
 * @property {Set<string>} privilegios  */

export class CtrlSesión {
  /** @param {Object} auth Sistema de autenticación de Firebase.
   * @param {Object} provider Proveedor de autenticación de Firebase. */
  constructor(auth, provider) {
    this.provider = provider;
    this.auth = auth;
  }

  /**
   * @param {string} privilegio
   * @returns {Promise<UsuarioAutorizado>}  */
  async protege(privilegio) {
    return new Promise((resolve, reject) => {
      /* Escucha cambios de usuario. Recibe una función que se invoca cada que
       * hay un cambio en la autenticación y recibe el modelo con las
       * características del usuario o null si no ha iniciado sesión .*/
      this.auth.onAuthStateChanged(async usuarioAuth => {
        if (usuarioAuth && usuarioAuth.email) {
          // Usuario aceptado.
          /** @type {Set<string>} */
          let privilegios = new Set();
          const usuario = await buscaUsuario(usuarioAuth.email);
          if (usuario) {
            if (!privilegio) {
              resolve({
                email: usuarioAuth.email,
                nombre: usuarioAuth.displayName || "",
                urlFoto: usuarioAuth.photoURL || "",
                privilegios
              });
            } else if (privilegios.has(privilegio)) {
              const arrPrivilegios = usuario.privilegios.map(p => p.nombre);
              privilegios = new Set(arrPrivilegios);
              resolve({
                email: usuarioAuth.email,
                nombre: usuarioAuth.displayName || "",
                urlFoto: usuarioAuth.photoURL || "",
                privilegios
              });
            } else {
              reject(new Error("El usuario no está autorizado."));
            }
          } else {
            reject(new Error("El usuario no está registrado."));
          }
        } else {
          // No ha iniciado sesión. Pide datos para iniciar sesión.
          this.auth.signInWithRedirect(this.provider);
          //auth.signInWithPopup(provider);
          //auth.signInAnonymously();
        }
      },
        // Función que se invoca si hay un error al verificar el usuario.
        reject
      );
    });
  }

  async terminaSesión() {
    await this.auth.signOut();
  }
}