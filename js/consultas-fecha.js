//
// Fecha
//
// Cargar previemante
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const fechaFiltrarButton = document.getElementById("fechaFiltrarButton");

// Recargar la pagina validando los parámetros a enviar
function recargarConFecha(autoridadClave, fecha) {
  let url = actualUrl + "?autoridad_clave=" + autoridadClave;
  if(fecha != null){ url = url + "&fecha=" + fecha; }
  window.location.href = url + "#instrucciones";
}

// Inicializar el formulario para elegir una fecha
function inicializarFecha(autoridadClave, fecha) {
  // Formulario con bootstrap-datepicker
  $("#fechaInput").datepicker({
    format: "yyyy-mm-dd",
    language: "es",
    weekStart: 0,
  });

  // Si NO viene la fecha, se toma la fecha actual
  if (fecha == null) {
    fecha = new Date().toISOString().slice(0, 10);
  }

  // Poner la fecha en el campo fechaInput
  $("#fechaInput").datepicker("setDate", fecha);

  // Al dar click en el botón de filtrar se recarga la página con los parámetros
  fechaFiltrarButton.addEventListener("click", (thisEvent) => {
    let laFecha = $("#fechaInput").datepicker("getDate");
    if (laFecha != null) {
      laFecha = laFecha.toISOString().split("T")[0];
    }
    recargarConFecha(autoridadClave, laFecha);
  });
}
