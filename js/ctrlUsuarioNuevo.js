import { agregaUsuario } from "./bdUsuarios.js";
import { cargaPasatiempos, cargaPrivilegios } from "./ctrlForaneas.js";
import { muestraSesion } from "./fabrica.js";
import { protege } from "./seguridad.js";
import { procesaError } from "./util.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
const privilegios = document.getElementById("privilegios");

protege("Usuarios", muestraSesion,
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
    const idPasatiempo = data.get("pasatiempo").toString();
    const privilegios = data.getAll("privilegios").
      map(id => ({ nombre: id.toString(), descripcion: null }));
    /**@type {import("./bdUsuarios.js").InfoUsuario} */
    const modelo = {
      email: data.get("cue").toString().trim(),
      avatar: data.get("avatar"),
      urlDeAvatar: null,
      pasatiempo: { id: idPasatiempo || null, nombre: null },
      privilegios
    };
    await agregaUsuario(modelo);
    muestraUsuarios();
  } catch (e) {
    procesaError(e);
  }
}