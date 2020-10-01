import { nuevoFirestore } from "./fabrica.js";

const firestore = nuevoFirestore();

/** @typedef {Object} InfoPasatiempo
 * @property {string} id
 * @property {string} nombre */

/** @param {(e: Object) => void} fnError
 * @param {(pasatiempos: InfoPasatiempo[]) => void} callback */
export function consultaPasatiempos(fnError, callback) {
  /* Pide todos los registros de la colección "PASATIEMPO" ordenados por
   * el campo "PAS_NOMBRE" de forma ascendente. */
  firestore.collection("PASATIEMPO").orderBy("PAS_NOMBRE").onSnapshot(
    documentos => {
      /** @type {InfoPasatiempo[]} */
      const pasatiempos = [];
      documentos.forEach(doc => {
        const data = doc.data();
        pasatiempos.push({
          id: doc.id,
          nombre: data.PAS_NOMBRE
        });
      });
      callback(pasatiempos);
    },
    e => {
      fnError(e);
      // Intenta reconectarse.
      consultaPasatiempos(fnError, callback);
    }
  );
}

/** Agrega el modelo a la base de datos, genera automáticamente el
 * id y espera a que termine.
 * @param {InfoPasatiempo} modelo */
export async function agregaPasatiempo(modelo) {
  await firestore.collection("PASATIEMPO").add({
    PAS_NOMBRE: modelo.nombre
  });
}

/** Busca un pasatiempo en base a su id.
 * @param {string} id
 * @returns {Promise<InfoPasatiempo>} */
export async function buscaPasatiempo(id) {
  let doc = id ? await firestore.collection("PASATIEMPO").doc(id).get()
    : { exists: false };
  if (doc.exists) {
    let data = doc.data();
    return {
      id: doc.id,
      nombre: data.PAS_NOMBRE || ""
    };
  } else {
    return null;
  }

}

/** Modifica el modelo en la base de datos en base al id y espera a que termine.
 * @param {InfoPasatiempo} modelo */
export async function modificaPasatiempo(modelo) {
  await firestore.collection("PASATIEMPO").doc(modelo.id).set({
    PAS_NOMBRE: modelo.nombre
  });
}

/** Elimina el documento en la base de datos usando el id y espera a que
 * termine.
 * @param {string} id */
export async function eliminaPasatiempo(id) {
  await firestore.collection("PASATIEMPO").doc(id).delete();
}