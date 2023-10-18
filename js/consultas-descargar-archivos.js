//
// Descargar archivos
//

const urlParams = new URLSearchParams(window.location.search);
const idArchivo = urlParams.get("id");

const url = window.location.href;
const parts = url.split("/");
modulo = parts[parts.length - 3].replaceAll("-", "_");

const recaptchaSiteKey = "6LdrwtYnAAAAADqz-cUpRkC8JE0bGDAeNSbCr7L3";

//  Variable para capturar el token generado en el checkbox 'No soy robot' 
var grecaptchaId;

// Funcion que se ejecuta al cargar la pagina por primera vez , genera el checkbox 'No soy robot'
var onloadCallback = function () {
  grecaptchaId = grecaptcha.enterprise.render("divRecaptcha", {
    sitekey: recaptchaSiteKey,
  });
};

const iAmNotARobot = document.getElementById("divRecaptcha");


$.ajax({
  url: apiUrl + "/" + modulo + "/" + idArchivo,
  method: "get",
  headers: { "X-Api-Key": apiKey },
  dataTyp: "json",
  success: function (data) {
    if(data.success == true){
      $("#distritoLabel").text("Distrito");
      $("#distritoTitle").text(data.distrito_nombre);
      $("#autoridadLabel").text("Autoridad");
      $("#autoridadTitle").text(data.autoridad_descripcion);
      $("#descripcionLabel").text("Descripción");
      $("#descripcionTitle").text(data.descripcion);
      $("#fechaLabel").text("Fecha");
      $("#fechaTitle").text(data.fecha);
      $("#nombreArchivo").val(data.archivo);
    }
    else{
      document.getElementById("mensaje").style.display="block" ;
      $("#mensaje").text("El Id del archivo a descargar no existe , revise que sea correcto");
      document.getElementById("divRecaptcha").style.display="none" ;
      document.getElementById("botonDescarga").style.display = "none";
    }
    
  },
});

function descargarArchivo() {
  document.getElementById("botonDescarga").style.display = "none";
  document.getElementById("botonDescargando").style.display = "block";

  token = grecaptcha.enterprise.getResponse(grecaptchaId);
  const nombre_archivo = $("#nombreArchivo").val();

  $.ajax({
    url: apiUrlPrometeo + "/" + modulo + "/recaptcha/" + idArchivo,
    method: "get",
    headers: { "X-Api-Key": apiKey },
    data: { token: token },
    xhrFields: {
      responseType: "blob",
    },
    success: function (data) {
      var blob = new Blob([data]);
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = nombre_archivo;
      link.click();
    },
  });

  document.getElementById("botonDescarga").style.display = "block";
  document.getElementById("botonDescargando").style.display = "none";
}
