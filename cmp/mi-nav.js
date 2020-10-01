customElements.define("mi-nav", class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<ul>
        <li><a href="index.html">Sesión</a></li>
        <li><a href="pasatiempos.html">Pasatiempos</a></li>
        <li><a href="usuarios.html">Usuarios</a></li>
      </ul>`;
  }
});