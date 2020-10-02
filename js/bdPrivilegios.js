import { nuevoFirestore } from "./fabrica.js";

const firestore = nuevoFirestore();

/** @typedef {Object} InfoPrivilegio
 * @property {string} nombre
 * @property {string} descripcion */

/** @param {(e: Object) => void} fnError
 * @param {(privilegios: InfoPrivilegio[]) => void} callback */
export function consultaPrivilegios(fnError, callback) {
  /* Pide todos los documentos de la colección "PRIVILEGIO". */
  firestore.collection("PRIVILEGIO").onSnapshot(
    documentos => {
      /** @type {InfoPrivilegio[]} */
      const privilegios = [];
      documentos.forEach(doc => {
        const data = doc.data();
        privilegios.push({
          nombre: doc.id,
          descripcion: data.PRIV_DESCR
        });
      });
      callback(privilegios);
    },
    e => {
      fnError(e);
      // Intenta reconectarse.
      consultaPrivilegios(fnError, callback);
    }
  );
}

/** Busca un privilegio en base a su id.
 * @param {string[]} ids
 * @returns {Promise<InfoPrivilegio[]>} */
export async function buscaPrivilegios(ids) {
  ids = ids || [];
  let docs = await Promise.all(ids.map(
    id => firestore.collection("PRIVILEGIO").doc(id).get()));
  return docs.map(doc => {
    if (doc.exists) {
      let data = doc.data();
      return {
        id: doc.id,
        descripcion: data.PRIV_DESCR || ""
      };
    } else {
      return null;
    }
  }).filter(Boolean);
}