import { getStorage } from "./fabrica";

/**
 * @param {string} nombre nombre
 *  con que se sube el archivo.
 * @param {
    FormDataEntryValue}
    archivo archivo a subir. */
export async function
  subeStorage(nombre, archivo) {
  if (archivo instanceof File &&
    archivo.size > 0) {
    await getStorage().ref(nombre).
      put(archivo);
  }
}
/**
 * @param {string} nombre nombre
 *  del archivo. */
export async function
  urlStorage(nombre) {
  try {
    return await getStorage().
      ref(nombre).
      getDownloadURL();
  } catch (e) {
    console.log(e);
    return "";
  }
}
/**
 * @param {string} nombre nombre
 *  del archivo. */
export async function
  eliminaStorage(nombre) {
  return await getStorage().
    ref(nombre).delete();
}