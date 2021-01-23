import {
  muestraUsuarios
} from "./navegacion.js";
import {
  subeStorage
} from "./storage.js";
import {
  cod, muestraError
} from "./util.js";

const SIN_PASATIEMPO = /* html */
  `<option value="">
    -- Sin Pasatiempo --
  </option>`;

/**@param {Object} doc */
export function rnRol(doc) {
  const data = doc.data();
  return (/* html */
    `<em>${cod(doc.id)}</em>
    <span class="secundario">
      ${cod(data.descripción)}
    </span>`);
}

/**
 * @param {HTMLSelectElement} select
 * @param {string} valor */
export function
  rnPasatiempos(select, valor) {
  const firestore =
    firebase.firestore();
  valor = valor || "";
  firestore.
    collection("Pasatiempo").
    orderBy("nombre").
    onSnapshot(querySnapshot => {
      let html = SIN_PASATIEMPO;
      querySnapshot.forEach(doc => {
        const selected = doc.id === valor ? "selected" : "";
        const data = doc.data();
        html += /* html */
          `<option value="${cod(doc.id)}" ${selected}>
            ${cod(data.nombre)}
          </option>`;
      });
      select.innerHTML = html;
    },
      e => {
        muestraError(e);
        rnPasatiempos(select, valor);
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
              <label class="fila">
                <input type="checkbox" name="rolIds"
                    value="${cod(docRol.id)}" ${checked}>
                <span>${rnRol(docRol)}</span>
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
export async function
  guardaUsu(evt, formData, id) {
  try {
    evt.preventDefault();
    const pasatiempoId =
      formData.
        get("pasatiempoId") ||
      null;
    const rolIds =
      formData.getAll("rolIds");
    const firestore =
      firebase.firestore();
    await firestore.
      collection("Usuario").
      doc(id).
      set({
        pasatiempoId,
        rolIds
      });
    const avatar =
      formData.get("avatar");
    if (avatar &&
      avatar.size > 0) {
      await subeStorage(
        id, avatar);
    }
    muestraUsuarios();
  } catch (e) {
    muestraError(e);
  }
}