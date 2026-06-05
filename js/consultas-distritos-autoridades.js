//
// Consultas Distritos-Autoridades
//
// Sirve para el Formulario Distrito-Autoridad
//
// Cargar previemante
// - consultas-api-url.js
//

// Definir URL sin parámetros
const actualUrl = window.location.href.split(/[?#]/)[0];

// Definir elementos del DOM del select distritos
const distritosSpinner = document.getElementById("distritosSpinner");
const distritosFormGroup = document.getElementById("distritosFormGroup");
const distritosOptions = document.getElementById("distritosOptions");

// Definir elementos del DOM del select autoridades
const autoridadesSpinner = document.getElementById("autoridadesSpinner");
const autoridadesFormGroup = document.getElementById("autoridadesFormGroup");
const autoridadesOptions = document.getElementById("autoridadesOptions");

// Definir elementos del DOM del encabezado donde se muestra el distrito y la autoridad seleccionados
const encabezadoSpinner = document.getElementById("encabezadoSpinner");
const encabezadoDiv = document.getElementById("encabezadoDiv");
const distritoTitle = document.getElementById("distritoTitle");
const autoridadTitle = document.getElementById("autoridadTitle");
const cambiarDistritoAutoridadButton = document.getElementById("cambiarDistritoAutoridadButton");
const rangoFechasDiv = document.getElementById("rangoFechasDiv");
const expedienteDiv = document.getElementById("expedienteDiv");

// Recargar la pagina esta página sin parámetros
function recargarSinParametros() {
  window.location.href = actualUrl + "#instrucciones";
}

// Recargar la pagina con la clave de la autoridad
function recargarConAutoridadClave(autoridadClave) {
  window.location.href = actualUrl + "?autoridad_clave=" + autoridadClave + "#instrucciones";
}

// Cambiar el estilo a INACTIVO de todas las opciones de distritos a nav-item
function cambiarEstiloAInactivoDistritos() {
  distritosOptions.querySelectorAll("a").forEach((item) => {
    item.className = "nav-link-distrito";
  });
}

// Consultar los distritos para llenar las opciones
async function consultarDistritos(conNotarias = false) {
  distritosSpinner.style.display = "block";
  distritosFormGroup.style.display = "none";
  autoridadesSpinner.style.display = "none";
  await esperar(1000); // Esperar 1 segundo
  fetch(apiUrl + "/distritos?es_jurisdiccional=true", { headers: { "X-Api-Key": apiKey } })
    .then((response) => response.json())
    .then((data) => {
      // Si la respuesta es exitosa, agregarlos
      if (data.success === true) {
        data.items.forEach((item) => {
          let thisLink = document.createElement("a");
          thisLink.textContent = item.nombre_corto;
          thisLink.addEventListener("click", (thisEvent) => {
            cambiarEstiloAInactivoDistritos();
            thisEvent.target.className = "nav-link-distrito active";
            consultarAutoridades(item.clave, conNotarias);
            thisEvent.preventDefault();
          });
          let thisOption = document.createElement("li");
          thisOption.className = "nav-li-distrito";
          thisOption.appendChild(thisLink);
          distritosOptions.appendChild(thisOption);
        });
        distritosSpinner.style.display = "none";
        distritosFormGroup.style.display = "block";
      }
    })
    .catch((error) => console.log(error));
}

// Consultar las autoridades para llenar las opciones
async function consultarAutoridades(distritoClave, conNotarias = false) {
  if (distritoClave == null) {
    console.log("Falta la clave del distrito");
    return;
  }
  autoridadesSpinner.style.display = "block";
  autoridadesFormGroup.style.display = "none";
  autoridadesOptions.innerHTML = ""; // Limpiar las opciones
  await esperar(1000); // Esperar 1 segundo
  if (conNotarias) {
    fullApiUrl = apiUrl + "/autoridades?distrito_clave=" + distritoClave + "&es_jurisdiccional=true"
  } else {
    fullApiUrl = apiUrl + "/autoridades?distrito_clave=" + distritoClave + "&es_jurisdiccional=true&es_notaria=false"
  }
  fetch(fullApiUrl, { headers: { "X-Api-Key": apiKey } })
    .then((response) => response.json())
    .then((data) => {
      // Si la respuesta es exitosa, agregarlos
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
        distritoTitle.innerText = data.distrito_nombre;
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
