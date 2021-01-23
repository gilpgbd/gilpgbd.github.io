/**
 * @param {string} nombre nombre
 *  con que se sube el archivo.
 * @param {FormDataEntryValue} archivo archivo
 *  a subir.
 * @returns {Promise<void>} */
export async function
  subeStorage(nombre, archivo) {
  const storage =
    // @ts-ignore
    await firebase.storage();
  storage.ref(nombre).
    put(archivo);
}
/**
 * @param {string} nombre nombre
 *  del archivo.
 * @returns {Promise<string>} */
export async function
  urlStorage(nombre) {
  try {
    const storage =
      // @ts-ignore
      await firebase.storage();
    return await storage.
      ref(nombre).
      getDownloadURL();
  } catch (e) {
    console.log(e);
    return "";
  }
}
/**
 * @param {string} nombre nombre
 *  del archivo.
 * @returns {Promise<void>} */
export async function
  eliminaStorage(nombre) {
  const storage =
    // @ts-ignore
    await firebase.storage();
  return await storage.
    ref(nombre).delete();
}