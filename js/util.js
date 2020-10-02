/** param {{forEach:(doc:Object)=>void}} usaForEach
 * @param {(doc: Object) => Object} funcion */
export function paraTodos(usaForEach, funcion){
  const arr = [];
  usaForEach.forEach(doc => arr.push(funcion(doc)));
  return arr;
}

/** Procesa un error. Muestra el objeto en la consola y un cuadro de
 * alerta con el mensaje.
 * @param {Error} e descripción del error. */
export function procesaError(e) {
  console.log(e);
  alert(e.message);
}

/** Codifica un texto para que escape los caracteres especiales y no se
 * pueda interpretar como HTML. Esta técnica evita la inyección de código.
 * @param {string} texto
 * @returns {string} un texto que no puede interpretarse como HTML. */
export function cod(texto) {
  return (texto || "").toString()
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