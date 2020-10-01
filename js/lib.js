/** Usa el patrón Factory. */
export function nuevoAuth() {
  // @ts-ignore
  return firebase.auth();
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
export function muestraPasatiempos() {
  location.href = "pasatiempos.html";
}
export function procesaError(e) {
  console.log(e);
  alert(e.message);
}
export function cod(valor) {
  return (valor || "").toString()
    .replace(/[<>"']/g,
      /** @param {string} letra */
      letra => {
        switch (letra) {
          case "<": return "&lt;";
          case ">": return "&gt;";
          case '"': return "&quot;";
          case "'": return "&#039;";
          default: return letra;
        }
      });
}