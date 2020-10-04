import { eliminaDeStorage, subeAStorage, urlDeStorage } from "./DaoStorage.js";
import { buscaPasatiempo } from "./DaoPasatiempos.js";
import { buscaPrivilegios } from "./bdPrivilegios.js";
import { nuevoFirestore } from "./Fabrica.js";
import { paraTodos } from "../lib/util.js";

const firestore = nuevoFirestore();

/** @typedef {Object} InfoUsuario
 * @property {string} email
 * @property {FormDataEntryValue} avatar
 * @property {string} urlDeAvatar
 * @property {import("./DaoPasatiempos").InfoPasatiempo} pasatiempo
 * @property {import("./bdPrivilegios").InfoPrivilegio[]} privilegios */

/** @param {(e: Object) => void} fnError
 * @param {(usuarios: InfoUsuario[]) => void} callback */
export function consultaUsuarios(fnError, callback) {
  firestore.collection("USUARIO").onSnapshot(
    async querySnapshot =>
      callback(await Promise.all(paraTodos(querySnapshot, cargaUsuario))),
    e => {
      fnError(e);
      consultaUsuarios(fnError, callback);
    }
  );
}

/** Crea un usuario a partir de un documento y le agrega los objetos asociados.
 * @return {Promise<InfoUsuario>} */
async function cargaUsuario(doc) {
  if (doc.exists) {
    const data = doc.data();
    return {
      email: doc.id,
      avatar: null,
      urlDeAvatar: await urlDeStorage(doc.id),
      pasatiempo: await buscaPasatiempo(data.PAS_ID),
      privilegios: await buscaPrivilegios(data.PRIV_IDS)
    };
  } else {
    return null;
  }
}

/** Busca un pasatiempo en base a su id.
 * @param {string} id
 * @returns {Promise<InfoUsuario>} */
export async function buscaUsuario(id) {
  let doc = id ? await firestore.collection("USUARIO").doc(id).get()
    : { exists: false };
  return cargaUsuario(doc);
}

/** Agrega el modelo a la base de datos y espera a que termine.
 * @param {InfoUsuario} modelo */
export async function agregaUsuario(modelo) {
  await modificaUsuario(modelo);
}

/** Modifica el modelo en la base de datos en base al id y espera a que termine.
 * @param {InfoUsuario} modelo */
export async function modificaUsuario(modelo) {
  await firestore.collection("USUARIO").doc(modelo.email).set({
    PAS_ID: modelo.pasatiempo.id,
    PRIV_IDS: modelo.privilegios.map(p => p.nombre)
  });
  if (modelo.avatar) {
    await subeAStorage(modelo.email, modelo.avatar);
  }
}

/** Elimina el documento en la base de datos usando el id y espera a que
 * termine.
 * @param {string} id */
export async function eliminaUsuario(id) {
  await firestore.collection("USUARIO").doc(id).delete();
  await eliminaDeStorage(id);
}