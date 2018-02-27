$(function() {
	//----- Recupera datos del tercero para agregar la nueva asignacion -----//
	var pTipoIdentificacion = getQueryVariable("tipoidentificacion");
	var pIdentificacion = getQueryVariable("identificacion");

	//----- Configura el campo de fecha, colocando por defecto la fecha actual -----//
	$.datepicker.regional['es'] = {
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
		
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
	$("#txtFechaA").datepicker();
	obtenerFechaActual();

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

	//----- Busca los datos del curso y los coloca en el formulario -----//
	$('#txtCodigoCurso').change(function() {
        CargarDatosPorCodigoCurso($("#txtCodigoCurso").val());
    });

    function CargarDatosPorCodigoCurso(codCurso) {    
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsCurso',
	        oper: 'CargarCursosPorCodigo',
	        codCurso: codCurso
	    }, function(data) {
	        // console.log("pasa");
	        // console.log(data);
	        if (data !== 0) {
	            FormarOptionValueCursos(data);
	        }
	        else {
	             mostrarPopUpError('No se cargaron los cursos por código');
	        }
	    }, "json");
	}

	//----- Consulta la informaicion del tercero y la coloca en el formulario -----//
	function cargarInformacionTercero(pTipoIdentificacion,pIdentificacion) {
		if(pTipoIdentificacion !== null){	
			$.post("../../controlador/fachada.php", {
			clase: 'clsParticipante',
			oper: 'verificarParticipante',
			pNumeroIdentificacion: pIdentificacion,
			pTipoIdentificacion: pTipoIdentificacion
			}, function(data) {
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

	function obtenerFechaActual(){
		var hoy = new Date();
		var dd = hoy.getDate();
		var mm = hoy.getMonth()+1; //hoy es 0!
		var yyyy = hoy.getFullYear();
		if(dd<10) {
			dd='0'+dd
		} 
		if(mm<10) {
			mm='0'+mm
		} 
		hoy = yyyy+'-'+mm+'-'+dd;
		$("#txtFechaA").val(hoy);
	}

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


