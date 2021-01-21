import { muestraError } from "./util.js";

export function iniciaSesión() {
  /** Conexión al sistema de autenticación de Firebase. */
  const auth = firebase.auth();
  /** Tipo de autenticación de usuarios. En este caso es con Google. */
  const provider = new firebase.auth.GoogleAuthProvider();
  /* Configura el proveedor de Google para que permita seleccionar de una
   * lista. */
  provider.setCustomParameters({ prompt: "select_account" });
  auth.signInWithRedirect(provider);
  //auth.signInWithPopup(provider);
  //auth.signInAnonymously();
}

/**
 * @param {string} email */
export async function cargaRoles(email) {
  const firestore = firebase.firestore();
  let doc = await firestore.collection("Usuario").doc(email).get();
  if (doc.exists) {
    const data = doc.data();
    return new Set(data.rolIds || []);
  } else {
    return new Set();
  }
}

export function noAutorizado() {
  alert("No tienes autorización.");
  location.href = "index.html";
}
export async function terminaSesión() {
  try {
    await auth.signOut();
  } catch (e) {
    muestraError(e);
  }
}