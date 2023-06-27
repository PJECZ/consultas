//
// Consultas Agendas de Audiencias
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-fecha.js
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const audienciasFormCard = document.getElementById("audienciasFormCard");
const audienciasTableCard = document.getElementById("audienciasTableCard");
const audienciasTableSpinner = document.getElementById("audienciasTableSpinner");

// Consultar las audiencias para llenar la tabla
function consultarAudiencias(autoridadClave, fecha) {
  audienciasTableSpinner.style.display = "block";
  console.log("Clave de la autoridad: " + autoridadClave);
  console.log("Fecha: " + fecha);
  $("#audienciasTable").DataTable({
    lengthChange: false,
    ordering: false,
    searching: false,
    scrollX: true,
    serverSide: true,
    ajax: {
      url: apiUrl + "/audiencias/datatable",
      headers: { "X-Api-Key": apiKey },
      data: {
        autoridad_clave: autoridadClave,
        fecha: fecha,
      },
      type: "GET",
      dataType: "json",
    },
    columns: [
      { data: "tiempo", width: "20%" },
      { data: "sala", width: "20%" },
      { data: "tipo_audiencia", width: "40%" },
      { data: "expediente", width: "20%" },
    ],
    columnDefs: [
      {
        targets: 0,
        data: null,
        render: function (data, type, row) {
          return moment(data).format("DD/MMM/YYYY HH:mm");
        },
      },
    ],
    language: {
      lengthMenu: "Mostrar _MENU_",
      search: "Filtrar:",
      zeroRecords: "No hay registros.",
      info: "Página _PAGE_ de _PAGES_",
      infoEmpty: "No hay registros",
      infoFiltered: "(filtrados desde _MAX_ registros totales)",
      oPaginate: {
        sFirst: "Primero",
        sLast: "Último",
        sNext: "Siguiente",
        sPrevious: "Anterior",
      },
    },
  });
  audienciasTableSpinner.style.display = "none";
}

//
// Proceso inicial
//

// Obtener los parametros de la URL
const urlParams = new URLSearchParams(window.location.search);
const autoridadClave = urlParams.get("autoridad_clave");
let fecha = urlParams.get("fecha");

// Si NO viene la fecha, se toma la fecha actual
if (fecha == null) {
  fecha = new Date().toISOString().slice(0, 10);
}

// Si viene la clave de la autoridad
if (autoridadClave != null) {
  // Mostrar el card con la tabla DataTable
  audienciasFormCard.style.display = "none";
  audienciasTableCard.style.display = "block";
  consultarAutoridad(autoridadClave);
  inicializarFecha(autoridadClave, fecha);
  consultarAudiencias(autoridadClave, fecha);
} else {
  // Mostrar el card con el formulario para elegir el distrito y la autoridad
  audienciasFormCard.style.display = "block";
  audienciasTableCard.style.display = "none";
  consultarDistritos();
}
