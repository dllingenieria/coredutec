$(function() {
	 if ($("#nombre").length > 0) {
        $("#nombre").html(sessionStorage.nombreUsuario);
    }
    //Vieja  implementacion
    if ($("#titulo3").length > 0) {
        $("#titulo3").empty();
        $("#titulo3").append("Bienvenido (a)          " + sessionStorage.nombreUsuario);
    }
	if (sessionStorage.esAdministrador==="1") {
		$("#usuarios").append($("<option></option>").attr("value",1).html("Administrador"));
	}
	if (sessionStorage.esAvanzado==="1") {
		$("#usuarios").append($("<option></option>").attr("value",9).html("Avanzado"));
	}
	if (sessionStorage.esDocente==="1") {
		$("#usuarios").append($("<option></option>").attr("value",2).html("Docente"));
	}
	if (sessionStorage.esMatriculador==="1") {
		$("#usuarios").append($("<option></option>").attr("value",3).html("Matriculador"));
	}
	if (sessionStorage.esCallCenter==="1") {
		$("#usuarios").append($("<option></option>").attr("value",4).html("Call Center"));
	}
	if (sessionStorage.esAlimentacion==="1") {
		$("#usuarios").append($("<option></option>").attr("value",5).html("Alimentaci&oacute;n"));
	}
	if (sessionStorage.esAcademico==="1") {
		$("#usuarios").append($("<option></option>").attr("value",6).html("Seguimiento"));
	}
	if (sessionStorage.esCalidad==="1") {
		$("#usuarios").append($("<option></option>").attr("value",7).html("Calidad"));
	}
	if (sessionStorage.esSAcademica==="1") {
		$("#usuarios").append($("<option></option>").attr("value",8).html("S. Acad&eacute;mica"));
	}
	$("#continuar").click(function(){
		sessionStorage.rolSeleccionado = $("#usuarios").val();
		switch($("#usuarios").val()){
			case "1":
			window.location = "busqueda.html";
			break;
			case "2":
			window.location = "docente.html";
			break;
			case "3":
			window.location = "busqueda.html";
			break;
			case "4":
			window.location = "callCenter.html";
			break;
			case "5":
			window.location = "alimentacion.html";
			break;
			case "6":
			window.location = "academico.html";
			break;
			case "7":
			window.location = "calidad.html";
			break;
			case "8":
			window.location = "certificado.html";
			break;
			case "9":
			window.location = "busqueda.html";
			break;
		}
	});
});