import { nuevoFirestore } from "./XFabrica.js";
import { paraTodos } from "./util.js";

const firestore = nuevoFirestore();

/** @typedef {Object} InfoPrivilegio
 * @property {string} nombre
 * @property {string} descripcion */

/** @param {(e: Object) => void} fnError
 * @param {(privilegios: InfoPrivilegio[]) => void} callback */
export function consultaPrivilegios(fnError, callback) {
  /* Pide todos los documentos de la colección "PRIVILEGIO". */
  firestore.collection("PRIVILEGIO").onSnapshot(
    querySnapshot => callback(paraTodos(querySnapshot, cargaPrivilegio)),
    e => {
      fnError(e);
      // Intenta reconectarse.
      consultaPrivilegios(fnError, callback);
    }
  );
}

/** Crea un privilegio a partir de un documento.
 * @return {InfoPrivilegio} */
function cargaPrivilegio(doc) {
  if (doc.exists) {
    const data = doc.data();
    return {
      nombre: doc.id,
      descripcion: data.PRIV_DESCR || ""
    };
  } else {
    return null;
  }
}

/** Busca un privilegio en base a su id.
 * @param {string[]} ids
 * @returns {Promise<InfoPrivilegio[]>} */
export async function buscaPrivilegios(ids) {
  ids = ids || [];
  let docs = await Promise.all(ids.map(
    id => id ? firestore.collection("PRIVILEGIO").doc(id).get()
      : { exists: false }));
  return docs.map(doc => {
    if (doc.exists) {
      let data = doc.data();
      return {
        nombre: doc.id,
        descripcion: data.PRIV_DESCR || ""
      };
    } else {
      return null;
    }
  }).filter(Boolean);
}