import { consultaPasatiempos } from "./bdPasatiempos.js";
import { muestraSesion } from "./navegacion.js";
import { protege } from "./seguridad.js";
import { cod, procesaError } from "./util.js";
const lista = document.getElementById("lista");
protege("Pasatiempos", muestraSesion,
  () => consultaPasatiempos(procesaError, muestraPasatiempos));
/** @param {import("./bdPasatiempos.js").InfoPasatiempo[]} pasatiempos */
function muestraPasatiempos(pasatiempos) {
  lista.innerHTML = pasatiempos.map(p => /* html */
    `<li>
      <a href="pasatiempo.html?id=${cod(encodeURIComponent(p.id))}">${cod(p.nombre)}</a>
    </li>`
  ).join("");
}