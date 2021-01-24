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
/** @type {HTMLFormElement} */
const forma = document["forma"];
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
      forma.addEventListener(
        "submit", guarda);
    } else {
      noAutorizado();
    }
  } else {
    iniciaSesión();
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
      add(modelo);
    muestraPasatiempos();
  } catch (e) {
    muestraError(e);
  }
}