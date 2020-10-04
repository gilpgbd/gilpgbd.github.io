import { CtrlAbc } from "../lib/CtrlAbc.js";
import { CtrlSesión } from "./CtrlSesion.js";
import { DaoPasatiempos } from "./DaoPasatiempos.js";
import { DaoPrivilegios } from "./DaoPrivilegios.js";
import { DaoStorage } from "./DaoStorage.js";
import { DaoUsuarios } from "./DaoUsuarios.js";
import { ForáneasDeUsuarios } from "./ForaneasDeUsuarios.js";

/** Usa el patrón Singleton. */
export class Fábrica {
  constructor() {
    // @ts-ignore
    const auth = firebase.auth();
    // @ts-ignore
    const firestore = firebase.firestore();
    // @ts-ignore
    const storage = firebase.storage();
    /** Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = firebase.auth();
    /** Tipo de autenticación de usuarios. En este caso es con Google. */
    // @ts-ignore
    const provider = new firebase.auth.GoogleAuthProvider();
    /* Configura el proveedor de Google para que permita seleccionar el
     * nombre de usuario en una lista. */
    provider.setCustomParameters({ prompt: "select_account" });
    // @ts-ignore
    this.storage = firebase.storage();
    this.ctrlSesión = new CtrlSesión(auth, provider);
    this.daoStorage = new DaoStorage(storage);
    this.daoPasatiempos = new DaoPasatiempos(firestore);
    this.daoPrivilegios = new DaoPrivilegios(firestore);
    this.daoUsuarios = new DaoUsuarios(firestore, this.daoPasatiempos,
      this.daoPrivilegios, this.daoStorage);
    this.ctrlPasatiempos = new CtrlAbc(this.daoPasatiempos);
    this.ctrlUsuarios = new CtrlAbc(this.daoUsuarios);
    this.foráneasDeUsuarios =
      new ForáneasDeUsuarios(this.daoPasatiempos, this.daoPrivilegios);
  }
}
Fábrica.instancia = Object.freeze(new Fábrica());