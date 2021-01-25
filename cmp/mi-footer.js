class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        Gilberto Pacheco Gallegos.
      </p>
      <p>
        <a
          href="https://github.com/gilpgbd/gilpgbd.github.io">
          Revisa la documentación
          en este enlace.
        </a>
      </p>`;
  }
}
customElements.define(
  "mi-footer", MiFooter);