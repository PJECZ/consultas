//
// Rangos Fechas
//
// Cargar previemante
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const rangoFechasFiltrarButton = document.getElementById("rangoFechasFiltrarButton");
const rangoFechasLimpiarButton = document.getElementById("rangoFechasLimpiarButton");

// Recargar la pagina validando los parámetros a enviar
function recargarConRangoFechas(autoridadClave, fechaDesde, fechaHasta) {
  let url = actualUrl + "?autoridad_clave=" + autoridadClave;
  if(fechaDesde != null){ url = url + "&fecha_desde=" + fechaDesde; }
  if(fechaHasta != null){ url = url + "&fecha_hasta=" + fechaHasta; }
  window.location.href = url + "#instrucciones";
}

// Inicializar el formulario de rango de fechas
function inicializarRangoFechas(autoridadClave, fechaDesde, fechaHasta) {
  // Formulario con bootstrap-datepicker
  $("#rangoFechas").datepicker({
    format: "yyyy-mm-dd",
    language: "es",
    weekStart: 0,
  });

  // Si viene la fecha_desde, ponerla en el formulario
  if (fechaDesde != null) {
    $("#fechaDesde").datepicker("setDate", fechaDesde);
  }

  // Si viene la fecha_hasta, ponerla en el formulario
  if (fechaHasta != null) {
    $("#fechaHasta").datepicker("setDate", fechaHasta);
  }

  // Al dar click en el botón de filtrar se recarga la página con los parámetros
  rangoFechasFiltrarButton.addEventListener("click", (thisEvent) => {
    let fechaDesde = $("#fechaDesde").datepicker("getDate");
    let fechaHasta = $("#fechaHasta").datepicker("getDate");

    if (fechaDesde != null) {
      fechaDesde = fechaDesde.toISOString().split("T")[0];
    }
    if (fechaHasta != null) {
      fechaHasta = fechaHasta.toISOString().split("T")[0];
    }

    recargarConRangoFechas(autoridadClave, fechaDesde, fechaHasta); // Llamar a la función de búsqueda
  });

  // Al dar click en el botón de limpiar se recarga la página solo con la clave de la autoridad
  rangoFechasLimpiarButton.addEventListener("click", (thisEvent) => {
    recargarConAutoridadClave(autoridadClave);
  });
}
