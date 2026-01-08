//
// Consultas Listas de Acuerdos
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const listasDeAcuerdosFormCard = document.getElementById("listasDeAcuerdosFormCard");
const listasDeAcuerdosTableCard = document.getElementById("listasDeAcuerdosTableCard");
const listasDeAcuerdosTableSpinner = document.getElementById("listasDeAcuerdosTableSpinner");

// Consultar las listas de acuerdos para llenar la tabla
async function consultarListasDeAcuerdos(autoridadClave, fechaDesde, fechaHasta) {
  let parametros = {
    autoridad_clave: autoridadClave
  };

  if(fechaDesde != null || fechaDesde != undefined){
    parametros = { ...parametros, fecha_desde:fechaDesde }
  }
  if(fechaHasta != null || fechaHasta != undefined){
    parametros = { ...parametros, fecha_hasta:fechaHasta }
  }

  listasDeAcuerdosTableSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  $("#listasDeAcuerdosTable").DataTable({
    lengthChange: false,
    ordering: false,
    searching: false,
    scrollX: true,
    serverSide: true,
    ajax: {
      url: apiUrl + "/listas_de_acuerdos/datatable",
      headers: { "X-Api-Key": apiKey },
      data: parametros,
      type: "GET",
      dataType: "json",
    },
    columns: [
      { data: "fecha", width: "20%" },
      { data: "descripcion", width: "60%" },
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
        targets: 2,
        data: null,
        render: function (data, type, row) {
          return '<a href="javascript:void(0)" onClick="lanzarModal(\'' + data + '\' , \'listas_de_acuerdos\')"><i class="fa fa-file"></i> PDF</a>';
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
  listasDeAcuerdosTableSpinner.style.display = "none";
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
  listasDeAcuerdosFormCard.style.display = "none";
  listasDeAcuerdosTableCard.style.display = "block";
  consultarAutoridad(autoridadClave);
  inicializarRangoFechas(autoridadClave, fechaDesde, fechaHasta);
  consultarListasDeAcuerdos(autoridadClave, fechaDesde, fechaHasta);
} else {
  // Mostrar el card con el formulario para elegir el distrito y la autoridad
  listasDeAcuerdosFormCard.style.display = "block";
  listasDeAcuerdosTableCard.style.display = "none";
  consultarDistritos();
}
