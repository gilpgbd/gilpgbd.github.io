import { nuevoFirestore } from "./fabrica.js";
import { muestraPasatiempos, procesaError } from "./util.js";

/** @type {HTMLFormElement} inNombre */
const forma = document["forma"];
forma.addEventListener("submit", guarda);

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const data = new FormData(forma);
    const modelo = {
      PAS_NOMBRE: data.get("nombre").toString().trim()
    };
    /* Agrega el modelo a la base de datos, genera automáticamente el
     * id y espera a que termine. */
    await nuevoFirestore().collection("PASATIEMPO").add(modelo);
    muestraPasatiempos();
  } catch (e) {
    procesaError(e);
  }
}