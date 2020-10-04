import { paraTodos } from "../lib/util.js";
import { InfoPrivilegio } from "./InfoPrivilegio.js";

export class DaoPrivilegios {
  /** @param {{collection: (col: string) => any; }} firestore */
  constructor(firestore) {
    this._colección = firestore.collection("PRIVILEGIO");
  }
  /** Crea un pasatiempo a partir de un documento.
 * @return {InfoPrivilegio} */
  cargaPrivilegio(doc) {
    if (doc.exists) {
      const data = doc.data();
      return new InfoPrivilegio({
        nombre: doc.id,
        descripción: data.PRIV_DESCR || ""
      });
    } else {
      return null;
    }
  }

  /** @param {(error: Error)=>void} callbackError
   * @param {(modelos:InfoPrivilegio[])=>void} callback */
  consulta(callbackError, callback) {
    /* Pide todos los documentos de la colección "PRIVILEGIO". */
    this._colección.onSnapshot(
      querySnapshot => callback(
        paraTodos(querySnapshot, doc => this.cargaPrivilegio(doc))),
      /** @param {Error} error */
      error => {
        callbackError(error);
        // Intenta reconectarse.
        this.consulta(callbackError, callback);
      }
    );
  }
  /** Busca privilegios en base a sus id.
   * @param {string[]} ids
   * @returns {Promise<InfoPrivilegio[]>} */
  async buscaMuchos(ids) {
    ids = ids || [];
    let docs = await Promise.all(ids.map(
      id => id ? this._colección.doc(id).get() : { exists: false }));
    return docs.map(doc => {
      if (doc.exists) {
        let data = doc.data();
        return new InfoPrivilegio({
          nombre: doc.id,
          descripción: data.PRIV_DESCR || ""
        });
      } else {
        return null;
      }
    }).filter(Boolean);
  }
}