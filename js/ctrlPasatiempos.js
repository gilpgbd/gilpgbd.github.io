import { procesaError, cod } from "./lib.js";
/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");
function muestraLista() {
  /* Pide todos los registros de la colección "PASATIEMPO" ordenados por
   * el campo "PAS_NOMBRE" de forma ascendente. */
  // @ts-ignore
  firestore.collection("PASATIEMPO").orderBy("PAS_NOMBRE").onSnapshot(
    documentos => {
      let inner = "";
      documentos.forEach(doc => {
        const data = doc.data();
        inner += /* html */
          `<li>
            <p>
              <a href="pasatiempo.html?id=${
                cod(encodeURIComponent(doc.id))}">${cod(data.PAS_NOMBRE)}</a>
            </p>
          </li>`});
      lista.innerHTML = inner;
    },
    e => {
      procesaError(e);
      muestraLista();
    }
  );
}