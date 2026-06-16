//
// Consultas Glosas
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-autoridades.js
//

// Definir elementos del DOM
const glosasFormCard = document.getElementById("glosasFormCard");
const glosasTableCard = document.getElementById("glosasTableCard");
const glosasTableSpinner = document.getElementById("glosasTableSpinner");

// Consultar las glosas para llenar la tabla
async function consultarGlosas(autoridadClave, fechaDesde, fechaHasta) {
  glosasTableSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  $("#glosasTable").DataTable({
    lengthChange: false,
    ordering: false,
    searching: false,
    scrollX: true,
    serverSide: true,
    ajax: {
      url: apiUrl + "/glosas/datatable",
      headers: { "X-Api-Key": apiKey },
      data: {
        autoridad_clave: autoridadClave,
        fecha_desde: fechaDesde != null ? fechaDesde : "1900-01-01",
        fecha_hasta: fechaHasta != null ? fechaHasta : "2100-01-01",
      },
      type: "GET",
      dataType: "json",
    },
    columns: [
      { data: "fecha", width: "20%" },
      { data: "expediente", width: "20%" },
      { data: "tipo_juicio", width: "40%" },
      { data: "id", width: "20%" },
    ],
    columnDefs: [
      {
        targets: 0,
        data: null,
        render: function (data, type, row) {
          return moment(data).format("DD/MMM/YYYY");
        },
      },
      {
        targets: 3,
        data: null,
        render: function (data, type, row) {
          return '<a href="javascript:void(0)" onClick="lanzarModal(\'' + data + '\' , \'glosas\')"><i class="fa fa-file"></i> PDF</a>';
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
  glosasTableSpinner.style.display = "none";
}

//
// Proceso inicial
//

// Obtener los parametros de la URL
const urlParams = new URLSearchParams(window.location.search);
const autoridadClave = urlParams.get("autoridad_clave");
const fechaDesde = urlParams.get("fecha_desde");
const fechaHasta = urlParams.get("fecha_hasta");

// Si viene la clave de la autoridad
if (autoridadClave != null) {
  // Mostrar el card con la tabla DataTable
  glosasFormCard.style.display = "none";
  glosasTableCard.style.display = "block";
  consultarAutoridad(autoridadClave);
  inicializarRangoFechas(autoridadClave, fechaDesde, fechaHasta);
  consultarGlosas(autoridadClave, fechaDesde, fechaHasta);
} else {
  // Mostrar el card con el formulario para elegir la autoridad
  glosasFormCard.style.display = "block";
  glosasTableCard.style.display = "none";
  consultarAutoridades();
}
