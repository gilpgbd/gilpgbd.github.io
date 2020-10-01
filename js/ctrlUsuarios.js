import { urlDeStorage } from "./accesaStorage.js";
import { consultaUsuarios } from "./bdUsuarios.js";
import { renderPrivilegio } from "./ctrlForaneas.js";
import { protege } from "./seguridad.js";
import { cod, muestraSesion, procesaError } from "./util.js";
const lista = document.getElementById("lista");
protege("Pasatiempos", muestraSesion,
  () => consultaUsuarios(procesaError, muestraUsuarios));
/** @param {import("./bdUsuarios.js").InfoUsuario[]} usuarios */
async function muestraUsuarios(usuarios) {
  const lis = await Promise.all(usuarios.map(async u => {
    const url = await urlDeStorage(u.id);
    const codId = cod(encodeURIComponent(u.id))
    return (/* html */
      `<div>
        <dt><a href="usuario.html?id=${codId}">${cod(u.id)}</a></dt>
        <dd>
          ${cod(u.pasatiempo.nombre)}<br>
          ${u.privilegios.map(p => renderPrivilegio(p)).join("<br>")}
        </dd>
        <dd><img src="${cod(url)}" alt="${cod(u.id)}"></dd>
      </div>`);
  }));
  lista.innerHTML = lis.join();
}