import { muestraPasatiempos, nuevoFirestore, procesaError } from "./lib.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLButtonElement} */
const eliminar = forma["eliminar"];
const firestore = nuevoFirestore();
const params = new URLSearchParams(location.search?.substring(1))
const id = params.get("id");

muestra();
/** Prepara la forma para modificar el documento que corresponde al
 * id recibido. */
async function muestra() {
  try {
    /* Recupera el documento con el id recibido en la colección "PASATIEMPO". */
    let doc = await firestore.collection("PASATIEMPO").doc(id).get();
    if (doc.exists) {
      let data = doc.data();
      forma["nombre"].value = data.PAS_NOMBRE || "";
      forma.addEventListener("submit", guarda);
      eliminar.addEventListener("click", elimina);
    } else {
      alert("El pasatiempo selecionado no está registrado.");
      muestraPasatiempos();
    }
  } catch (e) {
    procesaError(e);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const data = new FormData(forma);
    const modelo = {
      PAS_NOMBRE: data.get("nombre").toString().trim()
    };
    /* Modifica el modelo en la base de datos en base al id y espera a que
     * termine. */
    await firestore.collection("PASATIEMPO").doc(id).set(modelo);
    muestraPasatiempos();
  } catch (e) {
    procesaError(e);
  }
}
async function elimina() {
  try {
    if (confirm("Confirmar la eliminación")) {
      /* Elimina el documento en la base de datos usando el id y espera a que
       * termine. */
      await firestore.collection("PASATIEMPO").doc(id).delete();
      muestraPasatiempos();
    }
  } catch (e) {
    procesaError(e);
  }
}