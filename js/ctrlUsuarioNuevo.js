import { subeAStorage } from "./accesaStorage.js";
import { agregaUsuario } from "./bdUsuarios.js";
import { cargaPasatiempos, cargaPrivilegios } from "./ctrlForaneas.js";
import { protege } from "./seguridad.js";
import {
  fileSeleccionado, muestraSesion, muestraUsuarios, procesaError
} from "./util.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLInputElement} */
const avatar = document["avatar"];
const privilegios = document.getElementById("privilegios");

protege("Pasatiempos", muestraSesion,
  () => {
    cargaPasatiempos(forma["pasatiempo"], null);
    cargaPrivilegios(privilegios, []);
    forma.addEventListener("submit", guarda);
  });

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const data = new FormData(forma);
    const email = data.get("cue").toString().trim();
    const pasatiempo = { id: data.get("pasatiempo").toString(), nombre: null };
    const privilegios = data.getAll("privilegios").
      map(id => ({ id: id.toString(), descripcion: null }));
    /**@type {import("./bdUsuarios.js").InfoUsuario} */
    const modelo = {
      id: email,
      pasatiempo,
      privilegios
    };
    /* Si se ha seleccionado un archivo para el avatar, se agrega a Storage. */
    if (fileSeleccionado(avatar)) {
      await subeAStorage(email, avatar.files[0]);
    }
    await agregaUsuario(modelo);
    muestraUsuarios();
  } catch (e) {
    procesaError(e);
  }
}