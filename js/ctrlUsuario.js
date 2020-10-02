import {
  eliminaDeStorage, subeAStorage, urlDeStorage
} from "./accesaStorage.js";
import { buscaUsuario, eliminaUsuario, modificaUsuario } from "./bdUsuarios.js";
import { cargaPasatiempos, cargaPrivilegios } from "./ctrlForaneas.js";
import { protege } from "./seguridad.js";
import {
  fileSeleccionado, muestraSesion, muestraUsuarios, procesaError
} from "./util.js";

/** @type {HTMLFormElement} inNombre */
const forma = document["forma"];
const avatar = forma["avatar"];
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
      const pasatiempoId = modelo.pasatiempo ? modelo.pasatiempo.id  : "";
      cargaPasatiempos(forma["pasatiempo"], pasatiempoId);
      cargaPrivilegios(privilegios, modelo.privilegios.map(p => p.id));
      forma.addEventListener("submit", guarda);
      eliminar.addEventListener("click", elimina);
      img.src = await urlDeStorage(id);
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
    const pasatiempo = { id: idPasatiempo || null, nombre: null };
    const privilegios = data.getAll("privilegios").
      map(id => ({ id: id.toString(), descripcion: null }));
    /**@type {import("./bdUsuarios.js").InfoUsuario} */
    const modelo = {
      id,
      pasatiempo,
      privilegios
    };
    if (fileSeleccionado(avatar)) {
      await subeAStorage(id, avatar.files[0]);
    }
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
      eliminaDeStorage(id);
      muestraUsuarios();
    }
  } catch (e) {
    procesaError(e);
  }
}