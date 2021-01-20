import { muestraError, cargaRoles } from "./js/util.js";

class MiNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<ul>
        <li><a href="index.html">Sesión</a></li>
      </ul>`;
    this.ul = this.querySelector("ul");
    const auth = firebase.auth();
    auth.onAuthStateChanged(usuario => {
      if (usuario && usuario.email) {
        const roles = cargaRoles(usuario.email);
        // Enlaces para solo para clientes.
        if (roles.has("Cliente")) {
          html += /* html */
            `<li><a href="chat.html">Chat</a></li>`;
        }
        // Enlaces para solo para administradores.
        if (roles.has("Administrador")) {
          html += /* html */
            `<li><a href="pasatiempos.html">Pasatiempos</a></li>
            <li><a href="usuarios.html">Usuarios</a></li>`;
        }
        this.ul.innerHTML += html;
      }
    },
      muestraError);
  }
}
customElements.define("mi-nav", MiNav);