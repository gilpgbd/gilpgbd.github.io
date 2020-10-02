import { consultaUsuarios } from "./bdUsuarios.js";
import { renderPrivilegio } from "./ctrlForaneas.js";
import { muestraSesion } from "./navegacion.js";
import { protege } from "./seguridad.js";
import { cod, procesaError } from "./util.js";
const lista = document.getElementById("lista");
protege("Usuarios", muestraSesion,
  () => consultaUsuarios(procesaError, muestraUsuarios));
/** @param {import("./bdUsuarios.js").InfoUsuario[]} usuarios */
async function muestraUsuarios(usuarios) {
  const lis = await Promise.all(usuarios.map(async u => {
    const codId = cod(encodeURIComponent(u.email))
    const nombre = u.pasatiempo ? u.pasatiempo.nombre : "";
    return (/* html */
      `<div>
        <dt><a href="usuario.html?id=${codId}">${cod(u.email)}</a></dt>
        <dd>
          ${cod(nombre)}<br>
          ${u.privilegios.map(p => renderPrivilegio(p)).join("<br>")}
        </dd>
        <dd><img src="${cod(u.urlDeAvatar)}" alt="Falta el Avatar"></dd>
      </div>`);
  }));
  lista.innerHTML = lis.join("");
}