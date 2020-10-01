export function muestraSesion() {
  location.href = "index.html";
}

export function muestraPasatiempos() {
  location.href = "pasatiempos.html";
}

export function muestraUsuarios() {
  location.href = "usuarios.html";
}

/** Indica si un input type="file" tiene un archivo seleccionado.
 * @param {HTMLInputElement} file input que se analiza.
 * @returns {File} devuelve el archivo seleccionado; en otro caso, false. */
export function fileSeleccionado(file) {
  return file.files && file.files[0];
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