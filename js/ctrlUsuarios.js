import { nuevoFirestore, nuevoStorage } from "./fabrica.js";
import { cod, procesaError } from "./util.js";
/** @type {HTMLUListElement} */
const lista = document.querySelector("#lista");
const firestore = nuevoFirestore();
const storage = nuevoStorage();
muestraLista();
function muestraLista() {
  firestore.collection("USUARIO").onSnapshot(
    async querySnapshot => {
      /* Genera un listado de Promise que descargan datos de la base de
      * datos y espera a que todas terminen. */
      const promesas = [];
      // Agrega una Promise al erreglo.
      querySnapshot.forEach(doc => promesas.push(calculaCelda(doc)));
      // Espera a que todas las Promise terminen.
      const celdas = await Promise.all(promesas);
      // Llena la lista con los resultados de la consulta.
      lista.innerHTML = "";
      for (const celda of celdas) {
        lista.innerHTML += celda;
      }
    },
    e => {
      procesaError(e);
      muestraLista();
    }
  );
}
/** Calcula el contenido de una celda del listado de usuarios. El doc que
 * recibe de parámetro contiene llaves foráneas, mas no los detalles de
 * los registros a los que apunta, por lo que necesita acceder a la base
 * de datos. Devuelve una Promise con el HTML de cada documento. */
async function calculaCelda(doc) {
  const data = doc.data();
  // Obtiene lo datos del pasatiempo.
  const pasaDoc = data.PAS_ID
    ? await firestore.collection("PASATIEMPO").doc(data.PAS_ID).get()
    : { exists: false };
  const pasaNombre = pasaDoc.exists ?
    pasaDoc.data().PAS_NOMBRE : "-- Sin Pasatiempo --";
  // Obtiene los datos de los id de los roles.
  const rolDocs = (await Promise.all((data.ROL_IDS || [])
    .map(async rolId =>
      await firestore.collection("ROL").doc(rolId).get())))
    .filter(doc => doc.exists);
  const roles = rolDocs
    .map(doc => `${doc.id}: ${doc.data().ROL_DESCR}`)
    .sort();
  // url de la imagen. Usan como nombre el id del usuario.
  const url = await storage.ref(doc.id).getDownloadURL();
  return (/* html */
    `<li class="doc" onclick="muestra('${cod(doc.id)}')">
      <figure>
        <img src="${cod(url)}" alt="${cod(doc.id)}">
      </figure>
      <div>
        <strong>${cod(doc.id)}</strong><br>
        ${cod(pasaNombre)}<br>
        ${roles.map(cod).join("<br>")}
      </div>
    </li>`);
}