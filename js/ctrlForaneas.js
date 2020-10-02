import { consultaPasatiempos } from "./bdPasatiempos.js";
import { consultaPrivilegios } from "./bdPrivilegios.js";
import { cod, procesaError } from "./util.js";

/** @param {HTMLSelectElement} select
 * @param {string} valor */
export function cargaPasatiempos(select, valor) {
  consultaPasatiempos(procesaError, pasatiempos => {
    const opPasatiempoNoDefinido = /* html */
      `<option value="">-- Sin Pasatiempo --</option>`;
    select.innerHTML = opPasatiempoNoDefinido +
      pasatiempos.map(p => /* html */
        `<option value="${cod(p.id)}">${cod(p.nombre)}</option>`).join();
    select.value = valor || "";
  });
}

/** @param {HTMLElement} elemento
 * @param {string[]} valor */
export function cargaPrivilegios(elemento, valor) {
  const set = new Set(valor || []);
  consultaPrivilegios(procesaError, privilegios =>
    elemento.innerHTML = privilegios.map(p => {
      const checked = set.has(p.nombre) ? "checked" : "";
      return (/* html */
        `<li>
          <label>
            <input type="checkbox" name="privilegios"
                value="${cod(p.nombre)}" ${checked}>
            <span>${renderPrivilegio(p)}</span>
          </label>
        </li>`)
    }).join(""));
}

/**@param {import("./bdPrivilegios").InfoPrivilegio} privilegio */
export function renderPrivilegio(privilegio) {
  return (/* html */
    `<em>${cod(privilegio.nombre)}</em><br>
    ${cod(privilegio.descripcion)}`)
}