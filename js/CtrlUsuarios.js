import { CtrlAbc } from "../lib/CtrlAbc";
import { DaoPasatiempos } from "./DaoPasatiempos";
import { DaoPrivilegios } from "./DaoPrivilegios";
import { DaoUsuarios } from "./DaoUsuarios";
import { InfoPasatiempo } from "./InfoPasatiempo";
import { InfoPrivilegio } from "./InfoPrivilegio";
import { InfoUsuario } from "./InfoUsuario";

/** @extends {CtrlAbc<InfoUsuario>} */
export class CtrlUsuarios extends CtrlAbc {
  /** @param {string} mensajeNoEncontrado
   * @param {DaoUsuarios} daoUsuarios
   * @param {DaoPasatiempos} daoPasatiempos
   * @param {DaoPrivilegios} daoPrivilegios */
  constructor(mensajeNoEncontrado, daoUsuarios, daoPasatiempos,
    daoPrivilegios) {
    super(mensajeNoEncontrado, daoUsuarios);
    this._daoPasatiempos = daoPasatiempos;
    this._daoPrivilegios = daoPrivilegios;
  }
  /** @param {(error: Error)=>void} callbackError
   * @param {(pasatiempos:InfoPasatiempo[])=>void} callbackPasatiempos
   * @param {(privilegios:InfoPrivilegio[])=>void} callbackPrivilegios */
  foráneas(callbackError, callbackPasatiempos, callbackPrivilegios) {
    this._daoPasatiempos.consulta(callbackError, callbackPasatiempos);
    this._daoPrivilegios.consulta(callbackError, callbackPrivilegios);
  }
}