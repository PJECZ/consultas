//
// Consultas REDAM
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-distritos.js
//

document.addEventListener("DOMContentLoaded", function() {

  // Definir elementos del DOM
  const redamFormCard = document.getElementById("redamFormCard");
  const redamFormSpinner = document.getElementById("redamFormSpinner");
  const redamForm = document.getElementById("redamForm");
  const redamTableCard = document.getElementById("redamTableCard");
  const redamTableTitle = document.getElementById("redamTableTitle");
  const redamTableSpinner = document.getElementById("redamTableSpinner");
  const redamTable = document.getElementById("redamTable");
  const nombreInput = document.getElementById("nombreInput");
  const consultarButton = document.getElementById("consultarButton");
  const regresarConsultaButton = document.getElementById("regresarConsultaButton");

  // Consultar el redam para llenar la tabla
  async function consultarRedam(nombre, distritoClave) {
    redamTableSpinner.style.display = "block";
    await esperar(1000); // Esperar 1 segundo
    let encabezado = "Personas";
    if (nombre != "") {
      encabezado = encabezado + " con nombre " + nombre;
    }
    if (distritoClave != "") {
      encabezado = encabezado + " con clave del distrito " + distritoClave;
    }
    redamTableTitle.innerHTML = encabezado;
    $("#redamTable").DataTable({
      lengthChange: false,
      ordering: false,
      searching: false,
      scrollX: true,
      serverSide: true,
      ajax: {
        url: apiUrl + "/redam/datatable",
        headers: { "X-Api-Key": apiKey },
        type: "GET",
        data: {
          nombre: nombre,
          distrito_clave: distritoClave,
        },
        dataType: "json",
      },
      columns: [
        { data: "fecha", width: "20%" },
        { data: "nombre", width: "20%" },
        { data: "distrito_nombre_corto", width: "20%" },
        { data: "autoridad_descripcion_corta", width: "20%" },
        { data: "expediente", width: "20%" },
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
    redamTableSpinner.style.display = "none";
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
  if (nombre != null && distrito_clave != null) {
    // Mostrar el card con la tabla DataTable
    redamFormCard.style.display = "none";
    redamTableCard.style.display = "block";
    consultarRedam(nombre, distrito_clave);
    regresarConsultaButton.addEventListener("click", (thisEvent) => {
      regresarConsulta();
    });
  } else {
    // Mostrar el card con el formulario para consultar
    redamFormCard.style.display = "block";
    redamFormSpinner.style.display = "none";
    redamForm.style.display = "block";
    redamTableCard.style.display = "none";
    consultarDistritos();
    consultarButton.addEventListener("click", (thisEvent) => {
      recargarConParametros();
    });
  }

});
