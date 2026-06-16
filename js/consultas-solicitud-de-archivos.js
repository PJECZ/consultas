//
// Solicitud de Archivos
//

var grecaptchaId;
const recaptchaSiteKey ="6LdBVYYnAAAAADxeQUvhC82bgLHw3IPLdiuvydxU";
  
var onloadCallback =  function(){
  grecaptchaId = grecaptcha.enterprise.render('recaptchaTest', {
      "sitekey" : recaptchaSiteKey,
     "action": "LOGIN",
    });
} 

function lanzarModal(archivo, modulo) {

  const url =    "descargar/" + "?id=" + archivo ;
  window.open(url, '_blank');

  /*document.getElementById("botonDescarga").style.display = "block";
  document.getElementById("botonDescargando").style.display = "none";
  $.ajax({
    url: apiUrl + "/" + modulo + "/" + archivo,
    method: "get",
    headers: { "X-Api-Key": apiKey },
    dataTyp: "json",
    success: function (data) {
      $("#distrito").text(data.distrito_nombre);
      $("#autoridad").text(data.autoridad_descripcion);
      $("#descripcion").text(data.descripcion);
      $("#fecha").text(data.fecha);
      $("#nombre_archivo").val(data.archivo);
    },
  });

  $("#solicitudDeArchivosModal").modal("show");
  $("#archivo").val(archivo);
  $("#modulo").val(modulo); */
}

function validarInformacion() {
  document.getElementById("botonDescarga").style.display = "none";
  document.getElementById("botonDescargando").style.display = "block";

  const token = grecaptcha.enterprise.getResponse(grecaptchaId); 

  const archivo = $("#archivo").val();
  const nombre_archivo = $("#nombre_archivo").val();
  const modulo = $("#modulo").val();

  $.ajax({
    url: apiUrlPrometeo + "/" + modulo + "/recaptcha/" + archivo,
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
      $("#solicitudDeArchivosModal").modal("hide");
    },
    error: function(xhr, status, error){
          document.getElementById("botonDescarga").style.display = "none";
          document.getElementById("botonDescargando").style.display = "block";
          $("#solicitudDeArchivosModal").modal("hide");
          alert("Error al descargar el archivo, intente nuevamente");
    }
  });
  grecaptcha.enterprise.reset() ;

}
