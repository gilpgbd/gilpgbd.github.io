export function nuevoAuth() {
  // @ts-ignore
  return firebase.auth();
}

export function nuevoProvider() {
  /** Tipo de autenticación de usuarios. En este caso es con Google. */
  // @ts-ignore
  const provider = new firebase.auth.GoogleAuthProvider();
  /* Configura el proveedor de Google para que permita seleccionar el
   * nombre de usuario en una lista. */
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

/** Usa el patrón Singleton. */
let storage = null;
export function nuevoStorage() {
  if (!storage) {
    // @ts-ignore
    storage = firebase.storage();
  }
  return storage;
}

/** Usa el patrón Singleton. */
let firestore = null;
export function nuevoFirestore() {
  if (!firestore) {
    // @ts-ignore
    firestore = firebase.firestore();
  }
  return firestore;
}

export function muestraSesion() {
  location.href = "index.html";
}

export function muestraPasatiempos() {
  location.href = "pasatiempos.html";
}

export function muestraUsuarios() {
  location.href = "usuarios.html";
}