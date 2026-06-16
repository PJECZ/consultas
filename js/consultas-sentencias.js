//
// Consultas Sentencias
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const sentenciasFormCard = document.getElementById("sentenciasFormCard");
const sentenciasTableCard = document.getElementById("sentenciasTableCard");
const sentenciasTableSpinner = document.getElementById("sentenciasTableSpinner");

// Consultar las sentencias para llenar la tabla
async function consultarSentencias(autoridadClave, fechaDesde, fechaHasta) {
  let parametros = {
    autoridad_clave: autoridadClave
  };

  if(fechaDesde != null || fechaDesde != undefined){
    parametros = { ...parametros, fecha_desde:fechaDesde }
  }
  if(fechaHasta != null || fechaHasta != undefined){
    parametros = { ...parametros, fecha_hasta:fechaHasta }
  }

  sentenciasTableSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  $("#sentenciasTable").DataTable({
    lengthChange: false,
    ordering: false,
    searching: false,
    scrollX: true,
    serverSide: true,
    ajax: {
      url: apiUrl + "/sentencias/datatable",
      headers: { "X-Api-Key": apiKey },
      data: parametros,
      type: "GET",
      dataType: "json",
    },
    columns: [
      { data: "fecha", width: "15%" },
      { data: "sentencia", width: "15%" },
      { data: "expediente", width: "15%" },
      { data: "materia_tipo_juicio_descripcion", width: "35%" },
      { data: "es_perspectiva_genero", width: "10%" },
      { data: "id", width: "10%" },
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
        targets: 4,
        data: null,
        render: function (data, type, row) {
          if (data == true) {
            return '<i class="fa fa-check"></i>';
          } else {
            return '<i class="fa fa-times"></i>';
          }
        },
      },
      {
        targets: 5,
        data: null,
        render: function (data, type, row) {
          return '<a href="javascript:void(0)" onClick="lanzarModal(\'' + data + '\' , \'sentencias\')"><i class="fa fa-file"></i> PDF</a>';
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
  sentenciasTableSpinner.style.display = "none";
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
  sentenciasFormCard.style.display = "none";
  sentenciasTableCard.style.display = "block";
  consultarAutoridad(autoridadClave);
  inicializarRangoFechas(autoridadClave, fechaDesde, fechaHasta);
  consultarSentencias(autoridadClave, fechaDesde, fechaHasta);
} else {
  // Mostrar el card con el formulario para elegir el distrito y la autoridad
  sentenciasFormCard.style.display = "block";
  sentenciasTableCard.style.display = "none";
  consultarDistritos();
}
