import { nuevoStorage } from "./XFabrica.js";

const storage = nuevoStorage();

/** @param {string} nombre nombre con que se sube el archivo.
 * @param {FormDataEntryValue} archivo archivo a subir. */
export async function subeAStorage(nombre, archivo) {
  await storage.ref(nombre).put(archivo);
}

/** @param {string} nombre nombre del archivo.
 * @returns {Promise<string>} */
export async function urlDeStorage(nombre) {
  try {
    return await storage.ref(nombre).getDownloadURL();
  } catch (e) {
    console.log(e);
    return "";
  }
}

/** @param {string} nombre nombre del archivo. */
export async function eliminaDeStorage(nombre) {
  return await storage.ref(nombre).delete();
}