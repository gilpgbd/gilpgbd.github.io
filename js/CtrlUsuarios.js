import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  urlStorage
} from "../lib/storage.js";
import {
  cod,
  muestraError
} from "../lib/util.js";
import {
  cargaRoles,
  iniciaSesión,
  noAutorizado
} from "./seguridad.js";
import {
  htmlRol
} from "./usuarios.js";

const lista =
  document.querySelector("ul");
const firestore = getFirestore();
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (usuario && usuario.email) {
    const roles =
      await cargaRoles(
        usuario.email);
    if (roles.has(
      "Administrador")) {
      consulta();
    } else {
      noAutorizado();
    }
  } else {
    iniciaSesión();
  }
}
function consulta() {
  firestore.
    collection("Usuario")
    .onSnapshot(
      htmlLista, errConsulta);
}
/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    /** @type {
          Promise<string>[]} */
    let usuarios = [];
    snap.forEach(doc =>
      usuarios.push(
        htmlFila(doc)));
    const htmlFilas =
      await Promise.all(usuarios);
    /* Junta el todos los
     * elementos del arreglo en
     * una cadena. */
    html += htmlFilas.join("");
  } else {
    html += /* html */
      `<li>
        No hay usuarios
        registrados.
      </li>`;
  }
  lista.innerHTML = html;
}
/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
  /**
   * @type {import("./tipos.js").
                      Usuario} */
  const data = doc.data();
  const img = cod(
    await urlStorage(doc.id));
  const pasatiempo =
    await buscaPasatiempo(
      data.pasatiempoId);
  const roles =
    await buscaRoles(data.rolIds);
  const parámetros =
    new URLSearchParams();
  parámetros.append("id", doc.id);
  return (/* html */
    `<li>
      <a class="fila conImagen"
          href=
    "usuario.html?${parámetros}">
        <span class="marco">
          <img src="${img}"
            alt="Falta el Avatar">
        </span>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.id)}
          </strong>
          <span
              class="secundario">
            ${pasatiempo}
            ${roles}
          </span>
        </span>
      </a>
    </li>`);
}
/** Recupera el html de un
 * pasatiempo en base a su id.
 * @param {string} id */
async function buscaPasatiempo(id) {
  if (id) {
    const doc =
      await firestore.
        collection("Pasatiempo").
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {import(
          "./tipos.js").
            Pasatiempo} */
      const data = doc.data();
      return (/* html */
        `<div>
          ${cod(data.nombre)}
        </div>`);
    }
  }
  return (/* html */
    `<span class="secundario">
      -- Sin Pasatiempo --
    </span>`);
}
/** Recupera el html de los
 * roles en base a sus id
 * @param {string[]} ids */
async function buscaRoles(ids) {
  let html = "";
  if (ids &&
    ids.length > 0) {
    for (const id of ids) {
      const doc =
        await firestore.
          collection("Rol").
          doc(id).
          get();
      html += htmlRol(doc);
    }
    return html;
  } else {
    return (/* html */
      `<span class="secundario">
        -- Sin Roles --
      </span>`);
  }
}
/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}