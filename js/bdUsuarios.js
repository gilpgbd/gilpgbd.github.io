import { buscaPasatiempo } from "./bdPasatiempos.js";
import { buscaPrivilegios } from "./bdPrivilegios.js";
import { nuevoFirestore } from "./fabrica.js";

const firestore = nuevoFirestore();

/** @typedef {Object} InfoUsuario
 * @property {string} id
 * @property {import("./bdPasatiempos").InfoPasatiempo} pasatiempo
 * @property {import("./bdPrivilegios").InfoPrivilegio[]} privilegios */

/** @param {(e: Object) => void} fnError
 * @param {(usuarios: InfoUsuario[]) => void} callback */
export function consultaUsuarios(fnError, callback) {
  firestore.collection("USUARIO").onSnapshot(
    async querySnapshot => {
      /* Genera un listado de Promise que descargan datos de la base de
       * datos y espera a que todas terminen. */
      /** @type {Promise<InfoUsuario>[]} */
      const promesas = [];
      // Agrega una Promise al erreglo.
      querySnapshot.forEach(doc => promesas.push(joinUsuario(doc)));
      // Espera a que todas las Promise terminen.
      callback(await Promise.all(promesas));
    },
    e => {
      fnError(e);
      consultaUsuarios(fnError, callback);
    }
  );
}

/** Crea un usuario y le agrega los objetos asociados.
 * @return {Promise<InfoUsuario>} */
async function joinUsuario(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    pasatiempo: await buscaPasatiempo(data.PAS_ID),
    privilegios: await buscaPrivilegios(data.PRIV_IDS)
  };
}

/** Busca un pasatiempo en base a su id.
 * @param {string} id
 * @returns {Promise<InfoUsuario>} */
export async function buscaUsuario(id) {
  let doc = await firestore.collection("USUARIO").doc(id).get();
  if (doc.exists) {
    return joinUsuario(doc);
  } else {
    return null;
  }

}

/** Agrega el modelo a la base de datos y espera a que termine.
 * @param {InfoUsuario} modelo */
export async function agregaUsuario(modelo) {
  await firestore.collection("USUARIO").doc(modelo.id).set({
    PAS_ID: modelo.pasatiempo,
    PRIV_IDS: modelo.privilegios
  });
}

/** Modifica el modelo en la base de datos en base al id y espera a que termine.
 * @param {InfoUsuario} modelo */
export async function modificaUsuario(modelo) {
  await firestore.collection("USUARIO").doc(modelo.id).set({
    PAS_ID: modelo.pasatiempo,
    PRIV_IDS: modelo.privilegios
  });
}

/** Elimina el documento en la base de datos usando el id y espera a que
 * termine.
 * @param {string} id */
export async function eliminaUsuario(id) {
  await firestore.collection("USUARIO").doc(id).delete();
}