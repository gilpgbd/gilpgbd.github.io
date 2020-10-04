import { DaoAbc } from "../lib/DaoAbc.js";
import { paraTodos } from "../lib/util.js";
import { InfoPasatiempo } from "./InfoPasatiempo.js";

/** @implements {DaoAbc<InfoPasatiempo>} */
export class DaoPasatiempos {
  /** @param {{collection: (col: string) => any; }} firestore */
  constructor(firestore) {
    this.colección = firestore.collection("PASATIEMPO");
  }
  /** Crea un pasatiempo a partir de un documento.
 * @return {InfoPasatiempo} */
  cargaPasatiempo(doc) {
    if (doc.exists) {
      const data = doc.data();
      return new InfoPasatiempo({
        id: doc.id,
        nombre: data.PAS_NOMBRE
      });
    } else {
      return null;
    }
  }

  /** @param {(error: Error)=>void} callbackError
   * @param {(modelos:InfoPasatiempo[])=>void} callback */
  consulta(callbackError, callback) {
    /* Pide todos los registros de la colección "PASATIEMPO" ordenados por
     * el campo "PAS_NOMBRE" de forma ascendente. */
    this.colección.orderBy("PAS_NOMBRE").onSnapshot(
      querySnapshot => callback(
        paraTodos(querySnapshot, doc => this.cargaPasatiempo(doc))),
      /** @param {Error} error */
      error => {
        callbackError(error);
        // Intenta reconectarse.
        this.consulta(callbackError, callback);
      }
    );
  }
  /** @param {string} id
   * @returns {Promise<InfoPasatiempo>} */
  async busca(id) {
    let doc = id ? await this.colección.doc(id).get() : { exists: false };
    return this.cargaPasatiempo(doc);
  }
  /** @param {InfoPasatiempo} modelo
   * @returns {Promise<void>} */
  async agrega(modelo) {
    modelo.valida();
    await this.colección.add({
      PAS_NOMBRE: modelo.nombre
    });
  }
  /** @param {InfoPasatiempo} modelo
   * @returns {Promise<void>} */
  async modifica(modelo) {
    modelo.valida();
    await this.colección.doc(modelo.id).set({
      PAS_NOMBRE: modelo.nombre
    });
  }
  /** @param {string} id
   * @returns {Promise<void>} */
  async elimina(id) {
    await this.colección.doc(id).delete();
  }
}