import { agregaPasatiempo } from "./bdPasatiempos.js";
import { protege } from "./seguridad.js";
import { muestraPasatiempos, muestraSesion, procesaError } from "./util.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];

protege("Pasatiempos", muestraSesion,
  () => forma.addEventListener("submit", guarda));

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const data = new FormData(forma);
    const modelo = {
      id: null,
      nombre: data.get("nombre").toString().trim()
    };
    await agregaPasatiempo(modelo);
    muestraPasatiempos();
  } catch (e) {
    procesaError(e);
  }
}