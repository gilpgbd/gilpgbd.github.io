export function nuevoAuth() {
  // @ts-ignore
  return firebase.auth();
}
export function nuevoFirestore() {
  // @ts-ignore
  return firestore.auth();
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