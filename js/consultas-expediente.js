//
// Filtro Expediente
//
// Cargar previemante
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const expedienteFiltrarButton = document.getElementById("expedienteFiltrarButton");
const expedienteLimpiarButton = document.getElementById("expedienteLimpiarButton");

// Recargar la pagina validando los parámetros a enviar
function recargarConExpediente(autoridadClave, expediente) {
  let url = actualUrl + "?autoridad_clave=" + autoridadClave;
  if(expediente != null || expediente != ""){ url = url + "&expediente=" + expediente; }
  window.location.href = url + "#instrucciones";
}

// Inicializar el formulario de filtrar expediente
function inicializarExpedientes(autoridadClave) {
  // Al dar click en el botón de filtrar se recarga la página con los parámetros
  expedienteFiltrarButton.addEventListener("click", (thisEvent) => {
    let expediente = document.getElementById("expediente").value.trim(); // Obtener el valor del expediente
    recargarConExpediente(autoridadClave, expediente); // Llamar a la función de búsqueda 
  });

  // Al dar click en el botón de limpiar se recarga la página solo con la clave de la autoridad
  expedienteLimpiarButton.addEventListener("click", (thisEvent) => {
    recargarConAutoridadClave(autoridadClave);
  });
}
