import { muestraUsuarios } from "./navegacion.js";
import { cod, muestraError } from "./util.js";

const SIN_PASATIEMPO = /* html */
  `<option value="">-- Sin Pasatiempo --</option>`;

/**@param {Object} docPriv */
export function renderPrivilegio(docPriv) {
  const data = docPriv.data();
  return (/* html */ `<em>${cod(docPriv.id)}</em><br>${cod(data.descripción)}`);
}

/**
 * @param {HTMLSelectElement} select
 * @param {string} valor */
export function renderPasatiempos(select, valor) {
  const firestore = firebase.firestore();
  valor = valor || "";
  firestore.collection("Pasatiempo").orderBy("nombre").onSnapshot(
    querySnapshot => {
      let html = SIN_PASATIEMPO;
      querySnapshot.forEach(docPas => {
        const selected = docPas.id === valor ? "selected" : "";
        const data = docPas.data();
        html += /* html */
          `<option value="${cod(docPas.id)}" ${selected}>${cod(data.nombre)}</option>`;
      });
      select.innerHTML = html;
    },
    error => {
      muestraError(error);
      renderPasatiempos(select, valor);
    }
  );
}
/**
 * @param {HTMLElement} elemento
 * @param {string[]} valor */
export function renderPrivilegios(elemento, valor) {
  const set = new Set(valor || []);
  const firestore = firebase.firestore();
  firestore.collection("Privilegio").onSnapshot(
    querySnapshot => {
      let html = "";
      querySnapshot.forEach(docPriv => {
        const checked = set.has(docPriv.id) ? "checked" : "";
        html += /* html */
          `<li>
            <label>
              <input type="checkbox" name="privilegios"
                  value="${cod(docPriv.id)}" ${checked}>
              <span>${renderPrivilegio(docPriv)}</span>
            </label>
          </li>`;
      });
      elemento.innerHTML = html;
    },
    error => {
      muestraError(error);
      renderPrivilegios(elemento, valor);
    }
  );
}

/**
 * @param {Event} evt
 * @param {HTMLFormElement} forma
 * @param {string} id  */
export async function guardaUsuario(evt, forma, id) {
  try {
    evt.preventDefault();
    const formData = new FormData(forma);
    const firestore = firebase.firestore();
    await firestore.collection("Usuario").doc(id).set({
      pasId: formData.get("pasatiempo") || null,
      privIds: formData.getAll("privilegios")
    });
    const avatar = data.get("avatar");
    if (avatar && avatar.size > 0) {
      await subeStorage(id, modelo.avatar);
    }
    muestraUsuarios();
  } catch (error) {
    muestraError(error);
  }
}