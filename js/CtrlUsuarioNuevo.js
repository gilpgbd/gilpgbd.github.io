import {
  getAuth, getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  cargaRoles,
  iniciaSesión,
  noAutorizado
} from "./seguridad.js";
import { checksRoles, guardaUsuario, selectPasatiempos } from "./usuarios.js";

const firestore = getFirestore();
/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLUListElement} */
const listaRoles = document.
  querySelector("#listaRoles");
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (usuario && usuario.email) {
    const roles =
      await cargaRoles(
        usuario.email);
    if (roles.has(
      "Administrador")) {
      forma.addEventListener(
        "submit", guarda);
      selectPasatiempos(
        forma.pasatiempoId, "");
      checksRoles(listaRoles, []);
    } else {
      noAutorizado();
    }
  } else {
    iniciaSesión();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  const formData =
    new FormData(forma);
  const id = getString(
    formData, "cue").trim();
  await guardaUsuario(evt,
    formData, id);
}