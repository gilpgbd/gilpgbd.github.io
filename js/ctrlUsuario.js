import { buscaUsuario, eliminaUsuario, modificaUsuario } from "./bdUsuarios.js";
import { cargaPasatiempos, cargaPrivilegios } from "./ctrlForaneas.js";
import { muestraSesion, muestraUsuarios } from "./navegacion.js";
import { protege } from "./seguridad.js";
import { procesaError } from "./util.js";

/** @type {HTMLFormElement} inNombre */
const forma = document["forma"];
const privilegios = document.getElementById("privilegios");
/** @type {HTMLButtonElement} */
const eliminar = forma["eliminar"];
/** @type {HTMLImageElement} */
const img = document.querySelector("#img");
const params = new URL(location.href).searchParams;
const id = params.get("id");

protege("Usuarios", muestraSesion, busca);

/** Busca y muestra los datos que corresponden al id recibido. */
async function busca() {
  try {
    const modelo = await buscaUsuario(id);
    if (modelo) {
      forma["cue"].value = id;
      const pasatiempoId = modelo.pasatiempo ? modelo.pasatiempo.id : "";
      cargaPasatiempos(forma["pasatiempo"], pasatiempoId);
      cargaPrivilegios(privilegios, modelo.privilegios.map(p => p.nombre));
      forma.addEventListener("submit", guarda);
      eliminar.addEventListener("click", elimina);
      img.src = modelo.urlDeAvatar;
    } else {
      alert("El usuario selecionado no está registrado.");
      muestraUsuarios();
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
    const idPasatiempo = data.get("pasatiempo").toString();
    const privilegios = data.getAll("privilegios").
      map(id => ({ nombre: id.toString(), descripcion: null }));
    /**@type {import("./bdUsuarios.js").InfoUsuario} */
    const modelo = {
      email: id,
      avatar: data.get("avatar"),
      urlDeAvatar: null,
      pasatiempo: { id: idPasatiempo || null, nombre: null },
      privilegios
    };
    await modificaUsuario(modelo);
    muestraUsuarios();
  } catch (e) {
    procesaError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la eliminación")) {
      await eliminaUsuario(id);
      muestraUsuarios();
    }
  } catch (e) {
    procesaError(e);
  }
}