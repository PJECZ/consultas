//
// Consultas REPSVM
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-distritos.js
//

document.addEventListener("DOMContentLoaded", function() {

  // Definir elementos del DOM
  const repsvmFormCard = document.getElementById("repsvmFormCard");
  const repsvmFormSpinner = document.getElementById("repsvmFormSpinner");
  const repsvmForm = document.getElementById("repsvmForm");
  const repsvmTableCard = document.getElementById("repsvmTableCard");
  const repsvmTableTitle = document.getElementById("repsvmTableTitle");
  const repsvmTableSpinner = document.getElementById("repsvmTableSpinner");
  const repsvmTable = document.getElementById("repsvmTable");
  const nombreInput = document.getElementById("nombreInput");
  const consultarButton = document.getElementById("consultarButton");
  const regresarConsultaButton = document.getElementById("regresarConsultaButton");

  // Consultar el repsvm para llenar la tabla
  async function consultarRepsvm(nombre, distritoClave) {
    repsvmTableSpinner.style.display = "block";
    await esperar(1000); // Esperar 1 segundo
    let encabezado = "Personas";
    if (nombre != "") {
      encabezado = encabezado + " con nombre " + nombre;
    }
    if (distritoClave != "") {
      encabezado = encabezado + " con clave del distrito " + distritoClave;
    }
    repsvmTableTitle.innerHTML = encabezado;
    $("#repsvmTable").DataTable({
      lengthChange: false,
      ordering: false,
      searching: false,
      scrollX: true,
      serverSide: true,
      ajax: {
        url: apiUrl + "/repsvm_agresores/datatable",
        headers: { "X-Api-Key": apiKey },
        type: "GET",
        data: {
          nombre: nombre,
          distrito_clave: distritoClave,
        },
        dataType: "json",
      },
      columns: [
        { data: "distrito_nombre_corto", width: "10%" },
        { data: "nombre", width: "20%" },
        { data: "tipo_juzgado", width: "10%" },
        { data: "delito_generico", width: "10%" },
        { data: "delito_especifico", width: "10%" },
        { data: "tipo_sentencia", width: "10%" },
        { data: "numero_causa", width: "10%" },
        { data: "pena_impuesta", width: "10%" },
        { data: "observaciones", width: "10%" },
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
    repsvmTableSpinner.style.display = "none";
  }

  // Definir URL sin parámetros
  const actualUrl = window.location.href.split(/[?#]/)[0];

  // Recargar la pagina esta página sin parámetros
  function recargarSinParametros() {
    window.location.href = actualUrl + "#instrucciones";
  }

  // Recargar la pagina con los parametros del formulario
  function recargarConParametros() {
    const elNombre = nombreInput.value;
    const elDistrito = distritoSelect.value;
    window.location.href = actualUrl + "?distrito_clave=" + elDistrito + "&nombre=" + elNombre + "#instrucciones";
  }

  // Limpiar los valores del formulario y regresar a consultar
  function regresarConsulta(){
    nombreInput.value = "";
    recargarSinParametros();
  }

  //
  // Proceso inicial
  //

  // Obtener los parametros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  var nombre = urlParams.get("nombre");
  var distrito_clave = urlParams.get("distrito_clave");

  // Si se recibio el nombre
  if (nombre != null) {
    // Mostrar el card con la tabla DataTable
    repsvmFormCard.style.display = "none";
    repsvmTableCard.style.display = "block";
    consultarRepsvm(nombre, distrito_clave);
    regresarConsultaButton.addEventListener("click", (thisEvent) => {
      regresarConsulta();
    });
  } else {
    // Mostrar el card con el formulario para consultar
    repsvmFormCard.style.display = "block";
    repsvmFormSpinner.style.display = "none";
    repsvmForm.style.display = "block";
    repsvmTableCard.style.display = "none";
    consultarDistritos();
    consultarButton.addEventListener("click", (thisEvent) => {
      recargarConParametros();
    });
  }

});
