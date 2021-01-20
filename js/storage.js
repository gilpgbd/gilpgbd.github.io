/** @param {string} nombre nombre con que se sube el archivo.
 * @param {FormDataEntryValue} archivo archivo a subir.
 * @returns {Promise<void>} */
async function subeStorage(nombre, archivo) {
  await firebase.storage().ref(nombre).put(archivo);
}
/** @param {string} nombre nombre del archivo.
 * @returns {Promise<string>} */
async function urlStorage(nombre) {
  try {
    return await firebase.storage().ref(nombre).getDownloadURL();
  } catch (e) {
    console.log(e);
    return "";
  }
}
/** @param {string} nombre nombre del archivo.
 * @returns {Promise<void>} */
async function eliminaStorage(nombre) {
  return await firebase.storage().ref(nombre).delete();
}