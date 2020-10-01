export function nuevoAuth() {
  // @ts-ignore
  return firebase.auth();
}
export function nuevoStorage() {
  // @ts-ignore
  return firebase.storage();
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