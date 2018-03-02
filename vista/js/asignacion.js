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

	//----- Rregresa a BUsqueda -----//
	$("#btnRegresar").click(function(){ 
		window.location.href = "../html/busqueda.html"; 
	});

	//----- Valida cuando se presiona la tecla enter -----//
	$('#txtCodigoCurso').change(function() {
        if($("#txtCodigoCurso").val() != ""){
        	var pCodigoCurso = $("#txtCodigoCurso").val();
        	var pTipoIdentificacion = $("#cmbTipoIdentificacion option:selected").val();
        	var pNumeroIdentificacion = $("#txtNumeroIdentificacion").val();
        	CargarDatosPorCodigoCurso(pCodigoCurso,pTipoIdentificacion,pNumeroIdentificacion);
        }else{
        	mostrarPopUpError('Por favor escriba un código para buscar');
        }  
    });

	//----- Valida que el curso no haya sido asignado anteriormente -----//
    function CargarDatosPorCodigoCurso(pCodigoCurso,pTipoIdentificacion,pNumeroIdentificacion){   
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsAsignacion',
	        oper: 'CargarCursosPorCodigo',
	        pCodigoCurso: pCodigoCurso,
	        pTipoIdentificacion: pTipoIdentificacion,
	        pNumeroIdentificacion: pNumeroIdentificacion
	    }, function(data) {
	        if (data[0]['pResultado'] == '0') {
	            mostrarPopUpError('Verifique el código del curso que ingresó, está errado');
	            $("#txtCodigoCurso").val('');
	            $("#txtNombreCurso").val('');
	            $("#txtCodigoModulo").val('');
	            $("#txtNombreModulo").val('');
	            $("#txtRuta").val('');
	        }
	        else {
	             if (data[0]['pResultado'] == '-1'){
	             	mostrarPopUpError('El oferente ya tiene asignado el curso consultado');
	             	$("#txtCodigoCurso").val('');
	             	//$("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });
	             }else{
	             	$("#txtCodigoCurso").val(data[0]['CodigoCurso']);
	             	$("#txtNombreCurso").val(data[0]['NombreCurso']);
	             	$("#txtCodigoModulo").val(data[0]['CodigoModulo']);
	             	$("#txtNombreModulo").val(data[0]['NombreModulo']);
	             	$("#txtRuta").val(data[0]['Ruta']);
	             }
	        }
	    }, "json");
	}

	//----- Consulta la informacion del tercero y la coloca en el formulario -----//
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

	//----- Coloca la fecha de hoy en el campo fecha -----//
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

	//----- Establece los valores por defecto de las listas -----//
	function setParametroPorDefecto(atributo, valor, texto) {
	    $(atributo).append($('<option>', {
	        value: valor,
	        text: texto
	    }));
	}

	//----- Recupera las variables enviadas desde la pagina anterior -----//
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

    //----- Muestra el PopUp -----//
    function mostrarPopUpError(err_men) {
	    $("#textoError").text(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}

});


