
export class DaoStorage {
  constructor(storage) {
    this.storage = storage;
  }
  /** @param {string} nombre nombre con que se sube el archivo.
   * @param {FormDataEntryValue} archivo archivo a subir. */
  async sube(nombre, archivo) {
    await this.storage.ref(nombre).put(archivo);
  }
  /** @param {string} nombre nombre del archivo.
   * @returns {Promise<string>} */
  async url(nombre) {
    try {
      return await this.storage.ref(nombre).getDownloadURL();
    } catch (e) {
      console.log(e);
      return "";
    }
  }
  /** @param {string} nombre nombre del archivo. */
  async elimina(nombre) {
    return await this.storage.ref(nombre).delete();
  }
}