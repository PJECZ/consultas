// Consultas Distritos
//
// Sirve para elegir un Distrito con un select
//
// Cargar previemante
// - consultas-api-url.js
//

// Definir URL sin parámetros
const actualUrl = window.location.href.split("?")[0];

// Definir elementos del DOM del select distritos
const distritoSpinner = document.getElementById("distritoSpinner");
const distritoSelect = document.getElementById("distritoSelect");

// Definir elementos del DOM del encabezado donde se muestra el distrito y la autoridad seleccionados
const encabezadoSpinner = document.getElementById("encabezadoSpinner");
const encabezadoDiv = document.getElementById("encabezadoDiv");
const distritoTitle = document.getElementById("distritoTitle");
const regresarButton = document.getElementById("regresarButton");

// Recargar la pagina esta página sin parámetros
function recargarSinParametros() {
  window.location.href = actualUrl;
}

// Consultar los distritos para llenar el select
async function consultarDistritos() {
  distritoSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  fetch(apiUrl + "/distritos?es_distrito=true", { headers: { "X-Api-Key": apiKey } })
    .then((response) => response.json())
    .then((data) => {
      // Si la respuesta es exitosa, agregarlos como opciones al select
      if (data.success === true) {
        // Agregar la opción de "Todos los Distritos"
        let allOption = document.createElement("option");
        allOption.value = "";
        allOption.text = "Todos los Distritos";
        distritoSelect.appendChild(allOption);
        // Agregar el resto de los distritos
        data.items.forEach((item) => {
          let thisOption = document.createElement("option");
          thisOption.value = item.clave;
          thisOption.text = item.nombre_corto;
          distritoSelect.appendChild(thisOption);
        });
        distritoSpinner.style.display = "none";
      }
    })
    .catch((error) => console.log(error));
}
