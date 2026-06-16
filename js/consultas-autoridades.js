//
// Consultas Autoridades
//
// Sirve para elegir una Autoridad con un select
//
// Cargar previemante
// - consultas-api-url.js
//

// Definir URL sin parámetros
const actualUrl = window.location.href.split(/[?#]/)[0];

// Definir elementos del DOM del select autoridades
const autoridadesSpinner = document.getElementById("autoridadesSpinner");
const autoridadesFormGroup = document.getElementById("autoridadesFormGroup");
const autoridadesOptions = document.getElementById("autoridadesOptions");

// Definir elementos del DOM del encabezado donde se muestra la autoridad seleccionada
const encabezadoSpinner = document.getElementById("encabezadoSpinner");
const encabezadoDiv = document.getElementById("encabezadoDiv");
const autoridadTitle = document.getElementById("autoridadTitle");
const cambiarAutoridadButton = document.getElementById("cambiarAutoridadButton");
const rangoFechasDiv = document.getElementById("rangoFechasDiv");

// Recargar la pagina esta página sin parámetros
function recargarSinParametros() {
  window.location.href = actualUrl + "#instrucciones";
}

// Recargar la pagina con la clave de la autoridad
function recargarConAutoridadClave(autoridadClave) {
  window.location.href = actualUrl + "?autoridad_clave=" + autoridadClave + "#instrucciones";
}

// Consultar las autoridades para llenar el select
async function consultarAutoridades() {
  autoridadesSpinner.style.display = "block";
  autoridadesFormGroup.style.display = "none";
  await esperar(1000); // Esperar 1 segundo
  fetch(apiUrl + "/autoridades?es_creador_glosas=true&es_notaria=false", { headers: { "X-Api-Key": apiKey } })
    .then((response) => response.json())
    .then((data) => {
      // Si la respuesta es exitosa, agregarlos como opciones al select
      if (data.success === true) {
        data.items.forEach((item) => {
          let thisLink = document.createElement("a");
          thisLink.textContent = item.descripcion_corta;
          thisLink.addEventListener("click", (thisEvent) => {
            recargarConAutoridadClave(item.clave);
            thisEvent.preventDefault();
          });
          let thisOption = document.createElement("li");
          thisOption.className = "nav-item";
          thisOption.appendChild(thisLink);
          autoridadesOptions.appendChild(thisOption);
        });
        autoridadesSpinner.style.display = "none";
        autoridadesFormGroup.style.display = "block";
      }
    })
    .catch((error) => console.log(error));
}

// Consultar la autoridad para llenar el encabezado
function consultarAutoridad(autoridadClave) {
  if (autoridadClave == null) {
    console.log("Falta la clave de la autoridad");
    return;
  }
  encabezadoSpinner.style.display = "block";
  encabezadoDiv.style.display = "none";
  fetch(apiUrl + "/autoridades/" + autoridadClave, { headers: { "X-Api-Key": apiKey } })
    .then((response) => response.json())
    .then((data) => {
      // Si la respuesta es exitosa, mostrar el distrito y la autoridad seleccionados, asi como el rango de fechas
      if (data.success === true) {
        autoridadTitle.innerText = data.descripcion;
        cambiarDistritoAutoridadButton.addEventListener("click", (thisEvent) => {
          recargarSinParametros();
        });
        encabezadoSpinner.style.display = "none";
        encabezadoDiv.style.display = "block";
      }
    })
    .catch((error) => console.log(error));
}
