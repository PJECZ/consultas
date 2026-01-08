//
// Consultas Edictos
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-distritos-autoridades.js
//

// Definir elementos del DOM
const edictosFormCard = document.getElementById("edictosFormCard");
const edictosTableCard = document.getElementById("edictosTableCard");
const edictosTableSpinner = document.getElementById("edictosTableSpinner");

// Consultar los edictos para llenar la tabla
async function consultarEdictos(autoridadClave, fechaDesde, fechaHasta, expediente) {
  let parametros = {
    autoridad_clave: autoridadClave
  };

  if(fechaDesde != null || fechaDesde != undefined){
    parametros = { ...parametros, fecha_desde:fechaDesde }
  }
  if(fechaHasta != null || fechaHasta != undefined){
    parametros = { ...parametros, fecha_hasta:fechaHasta }
  }

  if(expediente != null && expediente != ""){
    parametros = { ...parametros, expediente}
  }
  console.log(parametros)
  edictosTableSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  $("#edictosTable").DataTable({
    lengthChange: false,
    ordering: false,
    searching: false,
    scrollX: true,
    serverSide: true,
    ajax: {
      url: apiUrl + "/edictos/datatable",
      headers: { "X-Api-Key": apiKey },
      data: parametros,
      type: "GET",
      dataType: "json",
    },
    columns: [
      { data: "fecha", width: "10%" },
      { data: "descripcion", width: "60%" },
      { data: "expediente", width: "10%" },
      { data: "numero_publicacion", width: "10%" },
      { data: "id", width: "10%" },
    ],
    columnDefs: [
      {
        targets: 0,
        data: null,
        render: function (data, type, row) {
          return moment(data).format("DD/MM/YYYY");
        },
      },
      {
        targets: 4,
        data: null,
        render: function (data, type, row) {
          return '<a href="javascript:void(0)" onClick="lanzarModal(\'' + data + '\' , \'edictos\')"><i class="fa fa-file"></i> PDF</a>';
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
  edictosTableSpinner.style.display = "none";
}

//
// Proceso inicial
//

// Obtener los parametros de la URL
const urlParams = new URLSearchParams(window.location.search);
const autoridadClave = urlParams.get("autoridad_clave");
const fechaDesde = urlParams.get("fecha_desde");
const fechaHasta = urlParams.get("fecha_hasta");
const expediente = urlParams.get("expediente");

// Si viene la clave de la autoridad
if (autoridadClave != null) {
  // Mostrar el card con la tabla DataTable
  edictosFormCard.style.display = "none";
  edictosTableCard.style.display = "block";
  consultarAutoridad(autoridadClave);
  inicializarRangoFechasExpedientes(autoridadClave, fechaDesde, fechaHasta);
  consultarEdictos(autoridadClave, fechaDesde, fechaHasta, expediente);
} else {
  // Mostrar el card con el formulario para elegir el distrito y la autoridad
  edictosFormCard.style.display = "block";
  edictosTableCard.style.display = "none";
  consultarDistritos(conNotarias = true);
}