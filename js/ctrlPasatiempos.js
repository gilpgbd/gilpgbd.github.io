import { nuevoFirestore } from "./fabrica.js";
import { cod, procesaError } from "./util.js";
/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");
muestraLista();
function muestraLista() {
  /* Pide todos los registros de la colección "PASATIEMPO" ordenados por
   * el campo "PAS_NOMBRE" de forma ascendente. */
  nuevoFirestore().collection("PASATIEMPO").orderBy("PAS_NOMBRE").onSnapshot(
    documentos => {
      let inner = "";
      documentos.forEach(doc => {
        const data = doc.data();
        inner += /* html */
          `<li>
            <p>
              <a href="pasatiempo.html?id=${cod(encodeURIComponent(doc.id))}">${cod(data.PAS_NOMBRE)}</a>
            </p>
          </li>`});
      lista.innerHTML = inner;
    },
    e => {
      procesaError(e);
      // Intenta reconectarse.
      muestraLista();
    }
  );
}