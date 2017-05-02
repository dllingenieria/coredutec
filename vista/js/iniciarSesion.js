$(function() {
	if (sessionStorage.esAdministrador==="1") {
		$("#usuarios").append($("<option></option>").attr("value",1).text("Administrador"));
	}
	if (sessionStorage.esDocente==="1") {
		$("#usuarios").append($("<option></option>").attr("value",2).text("Docente"));
	}
	if (sessionStorage.esMatriculador==="1") {
		$("#usuarios").append($("<option></option>").attr("value",3).text("Matriculador"));
	}
	if (sessionStorage.esCallCenter==="1") {
		$("#usuarios").append($("<option></option>").attr("value",4).text("Call Center"));
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
		}
	});
});