import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  muestraError
} from "../lib/util.js";


export async function
  iniciaSesión() {
  /** Tipo de autenticación de
   * usuarios. En este caso es con
   * Google.
   * @type {import(
      "../lib/tiposFire.js").
      GoogleAuthProvider} */
  const provider =
    // @ts-ignore
    new firebase.auth.
      GoogleAuthProvider();
  /* Configura el proveedor de
   * Google para que permita
   * seleccionar de una lista. */
  provider.setCustomParameters(
    { prompt: "select_account" });
  await getAuth().
    signInWithRedirect(provider);
}

export function noAutorizado() {
  //Despliega un cuadro de alerta.
  alert("No autorizado.");
  // Abre la página index.html.
  location.href = "index.html";
}

export async function
  terminaSesión() {
  try {
    await getAuth().signOut();
  } catch (e) {
    muestraError(e);
  }
}

/** @param {string} email
 * @returns {Promise<Set<string>>}
 */
export async function
  cargaRoles(email) {
  let doc =
    await getFirestore().
      collection("Usuario").
      doc(email).
      get();
  if (doc.exists) {
    /**
     * @type {
        import("./tipos.js").
        Usuario} */
    const data = doc.data();
    return new Set(
      data.rolIds || []);
  } else {
    return new Set();
  }
}