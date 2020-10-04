import { CtrlSesión } from "./CtrlSesion.js";

/** Usa el patrón Singleton. */
export class Fábrica {
  constructor() {
    // @ts-ignore
    const auth = firebase.auth();
    /** Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = firebase.auth();
    /* Configura el proveedor de Google para que permita seleccionar el
     * nombre de usuario en una lista. */
    provider.setCustomParameters({ prompt: "select_account" });
    // @ts-ignore
    this.storage = firebase.storage();
    this.ctrlSesion = new CtrlSesión(auth, provider);
  }
}
Fábrica.instancia = Object.freeze(new Fábrica());