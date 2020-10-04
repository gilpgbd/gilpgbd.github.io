import { cod, muestraError } from "../lib/util.js";
import { DaoPasatiempos } from "./DaoPasatiempos.js";
import { DaoPrivilegios } from "./DaoPrivilegios.js";
import { InfoPrivilegio } from "./InfoPrivilegio.js";

export class ForáneasDeUsuarios {
  /** @param {DaoPasatiempos} daoPasatiempos
   * @param {DaoPrivilegios} daoPrivilegios */
  constructor(daoPasatiempos, daoPrivilegios) {
    this.daoPasatiempos = daoPasatiempos;
    this.daoPrivilegios = daoPrivilegios;
  }
  /**@param {InfoPrivilegio} privilegio */
  renderPrivilegio(privilegio) {
    return (/* html */
      `<em>${cod(privilegio.nombre)}</em><br>
      ${cod(privilegio.descripción)}`)
  }
  /** @param {HTMLSelectElement} select
   * @param {string} valor */
  cargaPasatiempos(select, valor) {
    this.daoPasatiempos.consulta(muestraError, pasatiempos => {
      const opPasatiempoNoDefinido = /* html */
        `<option value="">-- Sin Pasatiempo --</option>`;
      select.innerHTML = opPasatiempoNoDefinido +
        pasatiempos.map(p => /* html */
          `<option value="${cod(p.id)}">${cod(p.nombre)}</option>`).join("");
      select.value = valor || "";
    });
  }
  /** @param {HTMLElement} elemento
   * @param {string[]} valor */
  cargaPrivilegios(elemento, valor) {
    const set = new Set(valor || []);
    this.daoPrivilegios.consulta(muestraError, privilegios =>
      elemento.innerHTML = privilegios.map(p => {
        const checked = set.has(p.nombre) ? "checked" : "";
        return (/* html */
          `<li>
            <label>
              <input type="checkbox" name="privilegios"
                  value="${cod(p.nombre)}" ${checked}>
              <span>${this.renderPrivilegio(p)}</span>
            </label>
          </li>`)
      }).join(""));
  }

}