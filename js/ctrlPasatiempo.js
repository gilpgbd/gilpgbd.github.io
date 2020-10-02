import {
  buscaPasatiempo, eliminaPasatiempo, modificaPasatiempo
} from "./bdPasatiempos.js";
import { muestraPasatiempos, muestraSesion } from "./fabrica.js";
import { protege } from "./seguridad.js";
import { procesaError } from "./util.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLButtonElement} */
const eliminar = forma["eliminar"];
const params = new URL(location.href).searchParams;
const id = params.get("id");

protege("Pasatiempos", muestraSesion, busca);

/** Busca y muestra los datos que corresponden al id recibido. */
async function busca() {
  try {
    const modelo = await buscaPasatiempo(id);
    if (modelo) {
      forma["nombre"].value = modelo.nombre;
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
    await modificaPasatiempo({
      id,
      nombre: data.get("nombre").toString().trim()
    });
    muestraPasatiempos();
  } catch (e) {
    procesaError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la eliminación")) {
      await eliminaPasatiempo(id);
      muestraPasatiempos();
    }
  } catch (e) {
    procesaError(e);
  }
}