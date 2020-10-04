import { valida } from "../lib/util.js";

export class InfoUsuario {
  constructor({email, avatar, urlDeAvatar, pasatiempo, privilegios}) {
    this.email = email;
    this.avatar = avatar;
    this.urlDeAvatar = urlDeAvatar;
    this.pasatiempo = pasatiempo;
    this.privilegios = privilegios;
  }
  validaAlAgregar() {
    valida(this.email, "Falta proporcionar el email.");
    valida(this.avatar, "Falta proporcionar el avatar.");
  }
  validaAlModificar() {
    valida(this.email, "Falta proporcionar el email.");
  }
}