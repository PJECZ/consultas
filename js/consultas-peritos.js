//
// Consultas Peritos
//
// Cargar previemante
// - consultas-api-url.js
// - consultas-distritos.js
// - consultas-peritos-tipos.js
//

document.addEventListener("DOMContentLoaded", function() {

  // Definir elementos del DOM
  const peritosFormCard = document.getElementById("peritosFormCard");
  const peritosFormSpinner = document.getElementById("peritosFormSpinner");
  const peritosForm = document.getElementById("peritosForm");
  const peritosTableCard = document.getElementById("peritosTableCard");
  const peritosTableTitle = document.getElementById("peritosTableTitle");
  const peritosTableSpinner = document.getElementById("peritosTableSpinner");
  const peritosTable = document.getElementById("peritosTable");
  const nombreInput = document.getElementById("nombreInput");
  const consultarButton = document.getElementById("consultarButton");
  const regresarConsultaButton = document.getElementById("regresarConsultaButton");

  // Consultar los peritos para llenar la tabla
  async function consultarPeritos(nombre, distritoClave, peritoTipoId) {
    peritosTableSpinner.style.display = "block";
    await esperar(1000); // Esperar 1 segundo
    params = {}
    titulo = "Peritos";
    if (nombre != null && nombre != "") {
      params["nombre"] = nombre;
      titulo += " con nombre '" + nombre + "'";
    }
    if (distritoClave != null && distritoClave != "") {
      params["distrito_clave"] = distritoClave;
      titulo += " con clave del distrito " + distritoClave;
    }
    if (peritoTipoId != null && peritoTipoId != "") {
      params["perito_tipo_id"] = peritoTipoId;
      const peritoTipoNombre = await consultarTipoDePerito(peritoTipoId);
      console.log(peritoTipoNombre);
      titulo += " con tipo de perito " + peritoTipoNombre;
    }
    peritosTableTitle.innerHTML = titulo;
    $("#peritosTable").DataTable({
      lengthChange: false,
      ordering: false,
      searching: false,
      scrollX: true,
      serverSide: true,
      ajax: {
        url: apiUrl + "/peritos/datatable",
        headers: { "X-Api-Key": apiKey },
        type: "GET",
        data: params,
        dataType: "json",
      },
      columns: [
        { data: "distrito_nombre_corto", width: "auto" },
        { data: "perito_tipo_nombre", width: "auto" },
        { data: "nombre", width: "auto" },
        { data: "domicilio", width: "auto" },
        { data: "telefono_fijo", width: "auto" },
        { data: "telefono_celular", width: "auto" },
        { data: "email", width: "auto" },
        { data: "notas", width: "auto" }
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
    peritosTableSpinner.style.display = "none";
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
    const elTipoDePerito = tipoDePeritoSelect.value;
    if (elNombre == null) { elNombre = ""; }
    if (elDistrito == null) { elDistrito = ""; }
    if (elTipoDePerito == null) { elTipoDePerito = ""; }
    window.location.href = actualUrl +
      "?nombre=" + elNombre +
      "&distrito_clave=" + elDistrito +
      "&perito_tipo_id=" + elTipoDePerito +
      "#instrucciones";
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
  var perito_tipo_id = urlParams.get("perito_tipo_id");

  // Si se recibio el distrito o el tipo de perito o el nombre
  if (nombre != null || distrito_clave != null || perito_tipo_id != null) {
    // Mostrar el card con la tabla DataTable
    peritosFormCard.style.display = "none";
    peritosTableCard.style.display = "block";
    consultarPeritos(nombre, distrito_clave, perito_tipo_id);
    regresarConsultaButton.addEventListener("click", (thisEvent) => {
      regresarConsulta();
    });
  } else {
    // Mostrar el card con el formulario para consultar
    peritosFormCard.style.display = "block";
    peritosFormSpinner.style.display = "none";
    peritosForm.style.display = "block";
    peritosTableCard.style.display = "none";
    consultarDistritos();
    consultarTiposDePeritos();
    consultarButton.addEventListener("click", (thisEvent) => {
      recargarConParametros();
    });
  }

});
