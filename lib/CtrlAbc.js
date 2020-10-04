import { DaoAbc } from "./DaoAbc.js";

/** Controlador de catálogo.
 * Es un ejemplo de Business Process (Proceso de Negocio).
 * @template T
 * @implements {DaoAbc<T>} */
export class CtrlAbc {
  /** @param {DaoAbc<T>} infoAbc */
  constructor(infoAbc) {
    this.infoAbc = infoAbc;
  }
  /** @param {(error:Error)=>void} callbackError
   * @param {(modelos:T[])=>void} callback */
  consulta(callbackError, callback) {
    this.infoAbc.consulta(callbackError, callback);
  }
  /** @param {string} id
   * @returns {Promise<T>} */
  async busca(id) {
    const modelo = await this.infoAbc.busca(id);
    if (modelo) {
      return modelo;
    } else {
      throw new Error("No se encontraron datos.");
    }
  }
  /** @param {T} modelo */
  async agrega(modelo) {
    await this.infoAbc.agrega(modelo);
  }
  /** @param {T} modelo */
  async modifica(modelo) {
    await this.infoAbc.modifica(modelo);
  }
  /** @param {string} id */
  async elimina(id) {
    await this.infoAbc.elimina(id);
  }
}