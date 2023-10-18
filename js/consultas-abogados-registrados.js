//
// Consultas Abogados Registrados
//
// Cargar previemante
// - consultas-api-url.js
//
document.addEventListener("DOMContentLoaded", function() {

  // Definir elementos del DOM
  const abogadosRegistradosFormCard = document.getElementById("abogadosRegistradosFormCard");
  const abogadosRegistradosFormSpinner = document.getElementById("abogadosRegistradosFormSpinner");
  const abogadosRegistradosForm = document.getElementById("abogadosRegistradosForm");
  const abogadosRegistradosTableCard = document.getElementById("abogadosRegistradosTableCard");
  const abogadosRegistradosTableTitle = document.getElementById("abogadosRegistradosTableTitle");
  const abogadosRegistradosTableSpinner = document.getElementById("abogadosRegistradosTableSpinner");
  const abogadosRegistradosTable = document.getElementById("abogadosRegistradosTable");
  const nombreInput = document.getElementById("nombreInput");
  const anioDesdeInput = document.getElementById("anioDesdeInput");
  const anioHastaInput = document.getElementById("anioHastaInput");
  const consultarButton = document.getElementById("consultarButton");
  const regresarConsultaButton = document.getElementById("regresarConsultaButton");

  // Consultar los abogados registrados para llenar la tabla
  async function consultarAbogadosRegistrados(nombre, anioDesde, anioHasta) {
    abogadosRegistradosTableSpinner.style.display = "block";
    await esperar(1000); // Esperar 1 segundo
    if (nombre == null) {
      nombre = "";
    }
    if (anioDesde == null || anioDesde == "") {
      anioDesde = "1925";
    }
    if (anioHasta == null || anioHasta == "") {
      anioHasta = new Date().getFullYear();
    }
    abogadosRegistradosTableTitle.innerHTML = "Resultados con nombre '" + nombre + "' entre " + anioDesde + " y " + anioHasta;
    $("#abogadosRegistradosTable").DataTable({
      lengthChange: false,
      ordering: false,
      searching: false,
      scrollX: true,
      serverSide: true,
      ajax: {
        url: apiUrl + "/abogados/datatable",
        headers: { "X-Api-Key": apiKey },
        data: {
          nombre: nombre,
          anio_desde: anioDesde,
          anio_hasta: anioHasta,
        },
        type: "GET",
        dataType: "json",
      },
      columns: [
        { data: "fecha", width: "10%" },
        { data: "libro", width: "10%" },
        { data: "numero", width: "10%" },
        { data: "nombre", width: "60%" },
      ],
      columnDefs: [
        {
          targets: 0,
          data: null,
          render: function (data, type, row) {
            return moment(data).format("DD/MMM/YYYY");
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
    abogadosRegistradosTableSpinner.style.display = "none";
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
    const elAnioDesde = anioDesdeInput.value;
    const elAnioHasta = anioHastaInput.value;
    window.location.href = actualUrl + "?nombre=" + elNombre + "&anio_desde=" + elAnioDesde + "&anio_hasta=" + elAnioHasta + "#instrucciones";
  }

  // Limpiar los valores del formulario y regresar a consultar
  function regresarConsulta() {
    nombreInput.value = "";
    anioDesdeInput.value = "";
    anioHastaInput.value = "";
    recargarSinParametros();
  }

  //
  // Proceso inicial
  //

  // Obtener los parametros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  var nombre = urlParams.get("nombre");
  var anioDesde = urlParams.get("anio_desde");
  var anioHasta = urlParams.get("anio_hasta");

  // Si se recibio por lo menos un parametro
  if (nombre != null || anioDesde != null || anioHasta != null) {
    // Mostrar el card con la tabla DataTable
    abogadosRegistradosFormCard.style.display = "none";
    abogadosRegistradosTableCard.style.display = "block";
    consultarAbogadosRegistrados(nombre, anioDesde, anioHasta);
    regresarConsultaButton.addEventListener("click", (thisEvent) => {
      regresarConsulta();
    });
  } else {
    // Mostrar el card con el formulario para consultar
    abogadosRegistradosFormCard.style.display = "block";
    abogadosRegistradosFormSpinner.style.display = "none";
    abogadosRegistradosForm.style.display = "block";
    abogadosRegistradosTableCard.style.display = "none";
    consultarButton.addEventListener("click", (thisEvent) => {
      recargarConParametros();
    });
  }

});
