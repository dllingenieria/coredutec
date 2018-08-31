$(function() {
	cargarListas('cmbAnios','SPCARGARANIOSPREPROGRAMACION');

	if ($("#nombre").length > 0) {
        $("#nombre").html(sessionStorage.nombreUsuario);
    }
    //Vieja  implementacion
    if ($("#titulo3").length > 0) {
        $("#titulo3").empty();
        $("#titulo3").append("Bienvenido (a)          " + sessionStorage.nombreUsuario);
    }
    $("#usuarios").append($("<option></option>").attr("value",0).html("Seleccione..."));
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

	//----- Dirige al HTML correspondiente de acuerdo con el roll -----//
	$("#continuar").click(function(){
		sessionStorage.rolSeleccionado = $("#usuarios").val();
		switch($("#usuarios").val()){
			case "1":
			window.location = "busqueda.html";
			break;
			case "2":
			sessionStorage.anioPreprogramacion = $("#cmbAnios option:selected").text();
			window.location = "docente.html";
			break;
			case "3":
			window.location = "busqueda.html";
			break;
			case "4":
			window.location = "callCenter.html";
			break;
			case "5":
			sessionStorage.anioPreprogramacion = $("#cmbAnios option:selected").text();
			window.location = "reporteAlimentacion.html";
			break;
			case "6":
			sessionStorage.anioPreprogramacion = $("#cmbAnios option:selected").text();
			window.location = "academico.html";
			break;
			case "7":
			sessionStorage.anioPreprogramacion = $("#cmbAnios option:selected").text();
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

	//----- Muestra u oculta la lista de años -----//
	$("#usuarios").change(function(){
		switch($("#usuarios").val()){
			case "2":
			case "5":
			case "6":
			case "7":
				$("#Anio").show();
				break;
			case "0":
			case "1":
			case "3":
			case "4":
			case "8":
			case "9":
				$("#Anio").hide();
				break;
		}
	});

	//----- Consulta en la base de datos los valores de las listas -----//
	function cargarListas(objeto,procedimiento) {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsUtilidades',
	        oper: 'cargarListas',
	        objeto: objeto,
	        procedimiento: procedimiento
	    }, function(data) {
	        if (data !== 0) {
	            formarOptionValueLista(data,objeto);
	        }
	        else {
	            alert('error');
	        }
	    }, "json");
	}

	//----- Llena las listas -----//
	function formarOptionValueLista(data,objeto) {
	    $('#'+objeto).find('option').remove();
	    for (i = 0; i < data.length; i++) {
	        $('#'+objeto).append($('<option>', {
	            value: data[i].Id,
	            text: data[i].Nombre
	        }));
	    }
	} 
});