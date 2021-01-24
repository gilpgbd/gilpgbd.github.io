import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraPasatiempos
} from "./navegacion.js";
import {
  cargaRoles,
  iniciaSesión,
  noAutorizado
} from "./seguridad.js";

const firestore = getFirestore();
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLButtonElement} */
const eliminar = document.
  querySelector("#eliminar");

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
    if (roles.
      has("Administrador")) {
      busca();
    } else {
      noAutorizado();
    }
  } else {
    iniciaSesión();
  }
}
/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc = await firestore.
      collection("Pasatiempo").
      doc(id).get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Pasatiempo} */
      const data = doc.data();
      forma.nombre.value =
        data.nombre || "";
      forma.addEventListener(
        "submit", guarda);
      eliminar.addEventListener(
        "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraPasatiempos();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const nombre = getString(
      formData, "nombre").trim();
    /**
     * @type {
        import("./tipos.js").
                Pasatiempo} */
    const modelo = {
      nombre
    };
    await firestore.
      collection("Pasatiempo").
      doc(id).
      set(modelo);
    muestraPasatiempos();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm(
      "Confirmar la eliminación")) {
      await firestore.
        collection("Pasatiempo").
        doc(id).delete();
      muestraPasatiempos();
    }
  } catch (e) {
    muestraError(e);
  }
}