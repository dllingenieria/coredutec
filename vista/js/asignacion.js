$(function() {
	//----- Recupera datos del tercero para agregar la nueva asignacion -----//
	var pTipoIdentificacion = getQueryVariable("tipoidentificacion");
	var pIdentificacion = getQueryVariable("identificacion");

	//----- Carga todas las listas desplegables -----//
	cargarListas('cmbConvocatoria','SPCARGARCONVOCATORIA');
	cargarListas('cmbAgencia','SPCARGARAGENCIAS');
	cargarListas('cmbServicio','SPCARGARSERVICIOS');
	cargarListas('cmbMunicipioC','SPCARGARCIUDADES');
	cargarListas('cmbEstadoP','SPCARGARESTADOPARTICIPANTE');
	cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
	cargarListas('cmbInstitutoC','SPCARGARINSTITUTOCAPACITACION');
	cargarListas('cmbCertificacion','SPCARGARCERTIFICACION');
	cargarInformacionTercero(pTipoIdentificacion,pIdentificacion);

	//----- Consulta la informaicion del tercero y la coloca en el formulario -----//
	function cargarInformacionTercero(pTipoIdentificacion,pIdentificacion) {
		if(pTipoIdentificacion !== null){	
			$.post("../../controlador/fachada.php", {
			clase: 'clsParticipante',
			oper: 'verificarParticipante',
			pNumeroIdentificacion: pIdentificacion,
			pTipoIdentificacion: pTipoIdentificacion
			}, function(data) {
				console.log(data[0]);
				if(data !== null){
		        	$("#txtNumeroIdentificacion").val(pIdentificacion);
	        		$("#txtNombres").val(data[0][1]);
	        		$("#txtApellidos").val(data[0][2]);
				}
			},"json");
		}
	}

	function cargarListas(objeto,procedimiento) {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsUtilidades',
	        oper: 'cargarListas',
	        objeto: objeto,
	        procedimiento: procedimiento
	    }, function(data) {
	        if (data !== 0) {
	        	var seleccionado = 3;
	            formarOptionValueLista(data,objeto);
	        }
	        else {
	            alert('error');
	        }
	    }, "json");
	} 

	// function formarOptionValueLista(data,objeto) {
	//     $('#'+objeto).find('option').remove();
	//     for (i = 0; i < data.length; i++) {
	//     	if (data[i].Id == 7){
	//     		console.log("Ingreso al seleccionado: "+data[i].Id+data[i].Nombre);
	// 	        $('#'+objeto).append($('<option selected>', {
	// 	            value: data[i].Id,
	// 	            text: data[i].Nombre
	// 	        }));
	// 	    }else{
	// 	    	$('#'+objeto).append($('<option>', {
	// 	            value: data[i].Id,
	// 	            text: data[i].Nombre
	// 	        }));
	// 	    }
	//     }
	// } 

	function formarOptionValueLista(data,objeto) {
	    $('#'+objeto).find('option').remove();
	    for (i = 0; i < data.length; i++) {
	        $('#'+objeto).append($('<option>', {
	            value: data[i].Id,
	            text: data[i].Nombre
	        }));
	    }
	} 

	function setParametroPorDefecto(atributo, valor, texto) {
	    $(atributo).append($('<option>', {
	        value: valor,
	        text: texto
	    }));
	}

	function getQueryVariable(variable)
    {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

});


