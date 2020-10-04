import { DaoAbc } from "../lib/DaoAbc.js";
import { paraTodos } from "../lib/util.js";
import { DaoPasatiempos } from "./DaoPasatiempos.js";
import { DaoPrivilegios } from "./DaoPrivilegios.js";
import { DaoStorage } from "./DaoStorage.js";
import { InfoUsuario } from "./InfoUsuario.js";

/** @implements {DaoAbc<InfoUsuario>} */
export class DaoUsuarios {
  /** @param {{collection: (col: string) => any;}} firestore
   * @param {DaoPasatiempos} daoPasatiempos
   * @param {DaoPrivilegios} daoPrivilegios
   * @param {DaoStorage} daoStorage */
  constructor(firestore, daoPasatiempos, daoPrivilegios, daoStorage) {
    this.colección = firestore.collection("USUARIO");
    this.daoPasatiempos = daoPasatiempos;
    this.daoPrivilegios = daoPrivilegios;
    this.daoStorage = daoStorage;
  }
  /** Crea un pasatiempo a partir de un documento.
 * @return {Promise<InfoUsuario>} */
  async cargaUsuario(doc) {
    if (doc.exists) {
      const data = doc.data();
      return new InfoUsuario({
        email: doc.id,
        avatar: null,
        urlDeAvatar: await this.daoStorage.url(doc.id),
        pasatiempo: await this.daoPasatiempos.busca(data.PAS_ID),
        privilegios: await this.daoPrivilegios.buscaMuchos(data.PRIV_IDS)
      });
    } else {
      return null;
    }
  }

  /** @param {(error: Error)=>void} callbackError
   * @param {(modelos:InfoUsuario[])=>void} callback */
  consulta(callbackError, callback) {
    this.colección.onSnapshot(
      async querySnapshot => callback(await Promise.all(
        paraTodos(querySnapshot, doc => this.cargaUsuario(doc))))),
      /** @param {Error} error */
      error => {
        callbackError(error);
        // Intenta reconectarse.
        this.consulta(callbackError, callback);
      }
    );
  }
  /** @param {string} id
   * @returns {Promise<InfoUsuario>} */
  async busca(id) {
    let doc = id ? await this.colección.doc(id).get() : { exists: false };
    return this.cargaUsuario(doc);
  }
  /** @param {InfoUsuario} modelo
   * @returns {Promise<void>} */
  async _modificaInterno(modelo) {
    await this.colección.doc(modelo.email).set({
      PAS_ID: modelo.pasatiempo.id,
      PRIV_IDS: modelo.privilegios.map(p => p.nombre)
    });
    if (modelo.avatar) {
      await this.daoStorage.sube(modelo.email, modelo.avatar);
    }
  }
  /** @param {InfoUsuario} modelo
   * @returns {Promise<void>} */
  async agrega(modelo) {
    modelo.validaAlAgregar();
    this._modificaInterno(modelo);
  }
  /** @param {InfoUsuario} modelo
   * @returns {Promise<void>} */
  async modifica(modelo) {
    modelo.validaAlModificar();
    this._modificaInterno(modelo);
  }
  /** @param {string} id
   * @returns {Promise<void>} */
  async elimina(id) {
    await this.colección.doc(id).delete();
    await this.daoStorage.elimina(id);
  }
}