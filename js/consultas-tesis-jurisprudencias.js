//
// Consultas Tesis Jurisprudencias
//
// Cargar previemante
// - consultas-api-url.js
//

// Definir elementos del DOM
const tesisJurisprudenciasTableCard = document.getElementById("tesisJurisprudenciasTableCard");
const tesisJurisprudenciasTableSpinner = document.getElementById("tesisJurisprudenciasTableSpinner");
const tesisJurisprudenciasDetailCard = document.getElementById("tesisJurisprudenciasDetailCard");
const tesisJurisprudenciasDetailSpinner = document.getElementById("tesisJurisprudenciasDetailSpinner");

// Consultar las Tesis y Jurisprudencias para llenar la tabla
async function consultarTesisJurisprudencias() {
  tesisJurisprudenciasTableSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  $("#tesisJurisprudenciasTable").DataTable({
    lengthChange: false,
    ordering: false,
    searching: false,
    scrollX: true,
    serverSide: true,
    ajax: {
      url: apiUrl + "/tesis_jurisprudencias/datatable",
      headers: { "X-Api-Key": apiKey },
      type: "GET",
    },
    columns: [
      { data: "id", width: "auto" },
      { data: "aprobacion_fecha", width: "auto" },
      { data: "titulo", width: "auto" },
      { data: "subtitulo", width: "auto" },
      { data: "autoridad_descripcion_corta", width: "auto" },
    ],
    columnDefs: [
      {
        targets: 0,
        data: null,
        render: function (data, type, row, meta) {
          return '<button type="button" class="btn btn-secondary" onClick="recargarConParametros(' + data + ')">' + data + "</button>";
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
  tesisJurisprudenciasTableSpinner.style.display = "none";
}

// Mostrar el detalle de una Tesis o Jurisprudencia
async function mostrarTesisJurisprudencia(tesisJurisprudenciaId) {
  tesisJurisprudenciasDetailSpinner.style.display = "block";
  await esperar(1000); // Esperar 1 segundo
  $.ajax({
    url: apiUrl + "/tesis_jurisprudencias/" + tesisJurisprudenciaId,
    headers: { "X-Api-Key": apiKey },
    type: "GET",
    dataType: "json",
    success: function (datos) {
      $("#detalleTitulo").text(datos.titulo);
      $("#detalleTituloTJ").text(datos.titulo);
      $("#detalleRegistro").text(datos.id);
      $("#detalleSubtitulo").text(datos.subtitulo);
      $("#detalleDistrito").text(datos.distrito_nombre);
      $("#detalleAutoridad").text(datos.autoridad_descripcion);
      $("#detalleTipo").text(datos.tipo);
      $("#detalleClaveControl").text(datos.clave_control);
      $("#detalleClase").text(datos.clase);
      $("#detalleRubro").text(datos.rubro);
      $("#detalleTexto").text(datos.texto);
      $("#detallePrecedentes").text(datos.precedentes);
      $("#detalleVotacion").text(datos.votacion);
      $("#detalleVotosParticulares").text(datos.votos_particulares);
      $("#detalleEpoca").text(datos.epoca_nombre);
      $("#detalleMateria").text(datos.materia_nombre);
      $("#detalleAprobacionFecha").text(datos.aprobacion_fecha);
      $("#detallePublicacionTiempo").text(datos.publicacion_tiempo);
      $("#detalleAplicacionTiempo").text(datos.aplicacion_tiempo);
      tesisJurisprudenciasDetailSpinner.style.display = "none";
    },
  });
}

// Obtener la URL actual sin parametros
const actualUrl = window.location.href.split(/[?#]/)[0];

// Recargar la pagina sin parámetros
function recargarSinParametros() {
  window.location.href = actualUrl + "#tesisJurisprudenciasTableCard";
}

// Recargar la pagina con parametros, se usa al dar clic en el boton de una fila
function recargarConParametros(id) {
  window.location.href = actualUrl + "?tesis_jurisprudencia_id=" + id + "#tesisJurisprudenciasDetailCard";
}

//
// Proceso inicial
//

// Obtener los parametros de la URL
const urlParams = new URLSearchParams(window.location.search);
const tesisJurisprudenciaId = urlParams.get("tesis_jurisprudencia_id");

// Si viene el tesis_jurisprudencia_id
if (tesisJurisprudenciaId != null) {
  // Mostrar el detalle y ocultar la tabla
  tesisJurisprudenciasTableCard.style.display = "none";
  tesisJurisprudenciasDetailCard.style.display = "block";
  mostrarTesisJurisprudencia(tesisJurisprudenciaId);
} else {
  // Mostrar la tabla y ocultar el detalle
  tesisJurisprudenciasTableCard.style.display = "block";
  tesisJurisprudenciasDetailCard.style.display = "none";
  consultarTesisJurisprudencias();
}
