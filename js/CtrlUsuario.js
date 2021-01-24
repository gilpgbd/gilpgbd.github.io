import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  muestraError
} from "../lib/util.js";
import {
  muestraUsuarios
} from "./navegacion.js";
import {
  cargaRoles,
  iniciaSesión,
  noAutorizado
} from "./seguridad.js";
import {
  checksRoles,
  guardaUsuario,
  selectPasatiempos
} from "./usuarios.js";

const params = new URL(location.href).searchParams;
const id = params.get("id");
const firestore = getFirestore();
/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLButtonElement} */
const eliminar = document.
  querySelector("#eliminar");
const img = document.
  querySelector("img");
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
      busca();
    } else {
      noAutorizado();
    }
  } else {
    iniciaSesión();
  }
}

async function busca() {
  try {
    const doc = await firestore.
      collection("Usuario").
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      forma.cue.value = id || "";
      img.src =
        await urlStorage(id);
      selectPasatiempos(
        forma.pasatiempoId,
        data.pasatiempoId)
      checksRoles(
        listaRoles, data.rolIds);
      forma.addEventListener(
        "submit", guarda);
      eliminar.addEventListener(
        "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraUsuarios();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  await guardaUsuario(evt,
    new FormData(forma), id);
}

async function elimina() {
  try {
    if (confirm(
      "Confirmar la eliminación")) {
      await firestore.
        collection("Usuario").
        doc(id).delete();
      await eliminaStorage(id);
      muestraUsuarios();
    }
  } catch (e) {
    muestraError(e);
  }
}