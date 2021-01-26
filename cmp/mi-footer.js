class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        Gilberto Pacheco Gallegos.
      </p>`;
  }
}
customElements.define(
  "mi-footer", MiFooter);