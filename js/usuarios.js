import { muestraUsuarios } from "./navegacion.js";
import { subeStorage } from "./storage.js";
import { cod, muestraError } from "./util.js";

const SIN_PASATIEMPO = /* html */
  `<option value="">-- Sin Pasatiempo --</option>`;

/**@param {Object} docRol */
export function renderRol(docRol) {
  const data = docRol.data();
  return (/* html */ `<em>${cod(docRol.id)}</em><br>${cod(data.descripción)}`);
}

/**
 * @param {HTMLSelectElement} select
 * @param {string} valor */
export function renderPasatiempos(select, valor) {
  // @ts-ignore
  const firestore = firebase.firestore();
  valor = valor || "";
  firestore.collection("Pasatiempo").orderBy("nombre").onSnapshot(
    querySnapshot => {
      let html = SIN_PASATIEMPO;
      querySnapshot.forEach(docPas => {
        const selected = docPas.id === valor ? "selected" : "";
        const data = docPas.data();
        html += /* html */
          `<option value="${cod(docPas.id)}" ${selected}>
            ${cod(data.nombre)}
          </option>`;
      });
      select.innerHTML = html;
    },
    e => {
      muestraError(e);
      renderPasatiempos(select, valor);
    }
  );
}
/**
 * @param {HTMLElement} elemento
 * @param {string[]} valor */
export function renderRoles(elemento, valor) {
  const set = new Set(valor || []);
  const firestore = firebase.firestore();
  firestore.collection("Rol").onSnapshot(
    querySnapshot => {
      let html = "";
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(docRol => {
          const checked = set.has(docRol.id) ? "checked" : "";
          html += /* html */
            `<li>
              <label>
                <input type="checkbox" name="rolIds"
                    value="${cod(docRol.id)}" ${checked}>
                <span>${renderRol(docRol)}</span>
              </label>
            </li>`;
        });
      } else {
        html += /* html */
          `<li>No hay roles registrados.</li>`;
      }
      elemento.innerHTML = html;
    },
    e => {
      muestraError(e);
      renderRoles(elemento, valor);
    }
  );
}

/**
 * @param {Event} evt
 * @param {FormData} formData
 * @param {string} id  */
export async function guardaUsuario(evt, formData, id) {
  try {
    evt.preventDefault();
    // @ts-ignore
    const firestore = firebase.firestore();
    await firestore.collection("Usuario").doc(id).set({
      pasatiempoId: formData.get("pasatiempoId") || null,
      rolIds: formData.getAll("rolIds")
    });
    const avatar = formData.get("avatar");
    // @ts-ignore
    if (avatar && avatar.size > 0) {
      await subeStorage(id, avatar);
    }
    muestraUsuarios();
  } catch (e) {
    muestraError(e);
  }
}