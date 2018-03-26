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
	cargarOpcionesArchivos();

	//----- Carga todas las listas desplegables -----//
	cargarListas('cmbConvocatoria','SPCARGARCONVOCATORIA');
	cargarListas('cmbAgencia','SPCARGARAGENCIAS');
	cargarListas('cmbServicio','SPCARGARSERVICIOS');
	cargarListas('cmbMunicipioC','SPCARGARCIUDADES');
	cargarListas('cmbEstadoP','SPCARGARESTADOPARTICIPANTE');
	cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
	cargarListas('cmbInstitutoC','SPCARGARINSTITUTOCAPACITACION');
	cargarListas('cmbCertificacion','SPCARGARCERTIFICACION');

	//----- Establece los valores por defecto de las listas desplegables -----//
	cargarValorSelected('#cmbConvocatoria','14',1000);
	cargarValorSelected('#cmbMunicipioC','531',1000);
	cargarValorSelected('#cmbEstadoP','252',1000);
	cargarValorSelected('#cmbServicio','1',1000);
	cargarValorSelected('#cmbInstitutoC','187',1000);
	cargarValorSelected('#cmbCertificacion','188',1000);

	cargarInformacionTercero(pTipoIdentificacion,pIdentificacion);

	//----- Regresa a Busqueda -----//
	$("#btnRegresar").click(function(){ 
		window.location.href = "../html/busqueda.html"; 
	});

	//----- Da inicio al guardado de la nueva asignacion -----//
	$("#btnGuardar").click(function(){ 
		if($("#txtCodigoModulo").val() != "" && $("#txtCodigoCurso").val() != ""){
			if($("#cmbAgencia option:selected").val() == 0) {
				mostrarPopUpError('Por favor seleccione la agencia');
			}else{
				if($("#txtexaminararchivosAutorizacion").val() != ""){
					var mensaje="Procesando la información<br>Espere por favor";
					jsShowWindowLoad(mensaje);
					GuardarArchivoFuenteAutorizacion();
				}else{
					mostrarPopUpError('Por favor seleccione el archivo de autorización');	
				}
			}
		}else{
			mostrarPopUpError('Por favor diligencie los campos referentes al curso');
		}
	});

	//Captura el control para aplicar validacion al presionar una tecla
	window.addEventListener("load", function() {
		document.getElementById("txtCodigoCurso").addEventListener("keypress", soloNumeros, false);
	});

	//Solo permite introducir numeros, el punto y la tecla enter.
	function soloNumeros(e){
		var key = window.event ? e.which : e.keyCode;
		if (key != 13){
			if (key != 46){
				// if (key < 48 || key > 57){
				// 	e.preventDefault();
				// }
			}
		}else{
			if($("#txtCodigoCurso").val() != ""){
	        	var pCodigoCurso = $("#txtCodigoCurso").val();
	        	var pTipoIdentificacion = $("#cmbTipoIdentificacion option:selected").val();
	        	var pNumeroIdentificacion = $("#txtNumeroIdentificacion").val();
	        	CargarDatosPorCodigoCurso(pCodigoCurso,pTipoIdentificacion,pNumeroIdentificacion);
	        }else{
	        	mostrarPopUpError('Por favor escriba un código para buscar');
	        }  
		}
	}

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
					cargarValorSelected('#cmbTipoIdentificacion',pTipoIdentificacion,1000);
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
	    SetParametroCursoPorDefecto("#"+objeto, '0', 'Seleccione...');
	    for (i = 0; i < data.length; i++) {
	        $('#'+objeto).append($('<option>', {
	            value: data[i].Id,
	            text: data[i].Nombre
	        }));
	    }
	} 

	//----- Establece los valores por defecto de las listas -----//
	function cargarValorSelected(objeto,value,tiempo){
        setTimeout(function() {
            $(objeto+' option[value="'+value+'"]').attr('selected','selected');    
        }, tiempo);       
    }

    //----- Establece los valores por defecto de las listas a Seleccione...-----//
    function SetParametroCursoPorDefecto(atributo, valor, texto) {
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

	//----- Carga los controles ocultos del html necesarios para realizar la nueva asignacion y subir el archivo -----//
	function cargarOpcionesArchivos() { 
	    $.post("../../controlador/fachada.php", {
	         clase: 'clsGestorBDPlanas',
	         oper: 'cargarOpcionesArchivos',
			 valor: 1
	    }, function(data) { 
			console.log(data);
	        if (data !== 0) {
				$("#ruta").val(data[0].Ruta);
				$("#tabla").val(data[0].NombreTabla);
				$("#nombreCorto").val(data[0].NombreCorto);
				$("#hiddenexaminararchivosAutorizacion").val("Autorizacion");
	        }
	        else {
	            mostrarPopUpError('No se pudo cargar la lista de opciones archivos');
	        }
	    }, "json");
	}

	//----- Inserta en la tabla general y envia a guardar el archivo -----//
	function GuardarArchivoFuenteAutorizacion(){
		var observaciones = "Carga a través de InHouse";
		var tipoCarga = 1;
		var nombreCorto= $("#nombreCorto").val();
    	//Guarda en la tabla TCARGAGENERAL
    	$.post("../../controlador/fachada.php", {
	    	clase: 'clsCarga',
	        oper: 'AgregarCargaGeneral',
	        tipoCarga: tipoCarga,
	        Observaciones: observaciones
		    }, function(data) {
		     	if(data != ""){
			        var idTablaGeneral = "";
			        idTablaGeneral = data[0]["IdTabla"];
			        var archivoA = "Autorizacion";
			         ubicacionOriginalAutorizacion = $("#ruta").val()+"/Autorizacion/";
					 GuardarArchivoCarpeta(archivoA); //Guardar archivo autorizacion en carpeta
		       		 setTimeout(function(){
	        			nameArchivotmpAutorizacion = sessionStorage.nameArchivoAutorizacion;
						GuardarDocumentoRutaOriginalAutorizacion(idTablaGeneral, nameArchivotmpAutorizacion, ubicacionOriginalAutorizacion, nombreCorto, archivoA);
		        	},15000);
		       }else{
		       		 jsRemoveWindowLoad();
		       		 mostrarPopUpError("Error al guardar en tabla general");
		       }  
		    }, "json");
	}

	//----- Guarda el archivo en la carpeta temporal del servidor -----//
	function GuardarArchivoCarpeta(archivo){
		var ubicacion = "tmp/";  
		var valorSeleccionado = archivo; 		
        var archivos = document.getElementById("txtexaminararchivos"+archivo);
        var archivo = archivos.files;
        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].size < 100004857600000000) {
                var data = new FormData();
                data.append('vid', archivo[0]);
                $.ajax({
                    type: 'POST',
                    url: "../../controlador/fachada.php?clase=clsArchivo&oper=GuardarArchivoPlano&valorSeleccionado="+valorSeleccionado+"&ubicacion="+ubicacion,
                    data: data, //Le pasamos el objeto que creamos con los archivos
                    contentType: false, //Debe estar en false para que pase el objeto sin procesar
                    processData: false, //debe estar en false para que JQuery no procese los datos a enviar
                    cache: false //Para que el formulario no guarde cache
                }).done(function(data) { 
                	setTimeout(function(){ 
		                if(typeof(Storage) !== "undefined") {
		                	if(data != ""){
			                	sessionStorage.nameArchivoAutorizacion = data;
			                }else{
			                	jsRemoveWindowLoad();
		                		mostrarPopUpError("Error al guardar archivo en carpeta temporal");
			                }
			             }
	             	},7500);
                });
             } else {
            	jsRemoveWindowLoad();
                mostrarPopUpError('El tamaño del documento es demasiado grande, por favor redúzcalo');
            }
        }
	}

	//----- Guarda el archivo en la carpeta definitiva del servidor -----//
	function GuardarDocumentoRutaOriginalAutorizacion(idTablaGeneral,ArchivoAutorizacion,ubicacionAutorizacion,nombreCorto,tipoArchivo){
		//Guarda archivo en carpeta original Fuente
     	tipoarchivoA="Autorizacion";
     	//Guarda archivo en carpeta original autorizacion
     	$.post("../../controlador/fachada.php", {
	    	clase: 'clsArchivo',
	        oper: 'GuardarArchivoOriginal',
	        idTablaGeneral: idTablaGeneral,
	        archivo: ArchivoAutorizacion,
	        ubicacion: ubicacionAutorizacion,
	       	nombreCorto: nombreCorto,
	        tipoArchivo: tipoarchivoA
		    }, function(data) {
		        if(data != 2){
		         	archivoAutorizacion = data;
	         		$.post("../../controlador/fachada.php", {
			    	clase: 'clsAsignacion',
			        oper: 'guardarAsignacion',
			        pIdTablaGeneral: idTablaGeneral,
			        pArchivo: archivoAutorizacion,
			        pFechaAsignacion: $("#txtFechaA").val(),
			        pAgenciaEmpleo: $("#cmbAgencia option:selected").val(),
			        pServicioCapacitacion: $("#cmbServicio option:selected").val(),
			        pConvocatoria: $("#cmbConvocatoria option:selected").val(),
			        pInstitutoCapacitacion: $("#cmbInstitutoC option:selected").val(),
			        pMunicipioCapacitacion: $("#cmbMunicipioC option:selected").val(),
			        pRuta: $("#txtRuta").val(),
			        pCodigoCurso: $("#txtCodigoCurso").val(),
			        pCodigoModulo: $("#txtCodigoModulo").val(),
			        pEstadoParticipante: $("#cmbEstadoP option:selected").val(),
			        pNovedadEstado: $("#txtNovedad").val(),
			        pTipoIdentificacion: $("#cmbTipoIdentificacion option:selected").val(),
			        pNumeroIdentificacion: $("#txtNumeroIdentificacion").val()
				    }, function(data) {
				        if(data == 0){
				        	jsRemoveWindowLoad();
				        	mostrarPopUpError('No fue posible agregar la nueva Asignación');
				        	$("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });	
				        }else{
				       	 	jsRemoveWindowLoad();
				        	mostrarPopUpError('Asignación agregada de manera satisfactoria');
				        	$("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });
				        }
					}, "json");
		       }else{
		       	 	jsRemoveWindowLoad();
		        	mostrarPopUpError('No fue posible guardar el archivo de autorización');
		        	$("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });
		        }
			}, "json");       
	}

	//----- Quita la Cortina -----//
	function jsRemoveWindowLoad() {
	    // eliminamos el div que bloquea pantalla
	    $("#WindowLoad").remove();
	 
	}
	
	//----- Configuracion general de la cortina -----// 
	function jsShowWindowLoad(mensaje) {
	    //eliminamos si existe un div ya bloqueando
	    jsRemoveWindowLoad();
	 
	    //si no enviamos mensaje se pondra este por defecto
	    if (mensaje === undefined) mensaje = "Procesando la información<br>Espere por favor";
	 
	    //centrar imagen gif
	    height = 20;//El div del titulo, para que se vea mas arriba (H)
	    var ancho = 0;
	    var alto = 0;
	 
	    //obtenemos el ancho y alto de la ventana de nuestro navegador, compatible con todos los navegadores
	    if (window.innerWidth == undefined) ancho = window.screen.width;
	    else ancho = window.innerWidth;
	    if (window.innerHeight == undefined) alto = window.screen.height;
	    else alto = window.innerHeight;
	 
	    //operación necesaria para centrar el div que muestra el mensaje
	    var heightdivsito = alto/2 - parseInt(height)/2;//Se utiliza en el margen superior, para centrar
	 
	   //imagen que aparece mientras nuestro div es mostrado y da apariencia de cargando
	    imgCentro = "<div style='text-align:center;height:" + alto + "px;'><div  style='color:#000;margin-top:" + heightdivsito + "px; font-size:20px;font-weight:bold'>" + mensaje + "</div><img src='../images/loading.gif' width='107' height='106'></div>";
	 
	        //creamos el div que bloquea grande------------------------------------------
	        div = document.createElement("div");
	        div.id = "WindowLoad"
	        div.style.width = ancho + "px";
	        div.style.height = alto + "px";
	        $("body").append(div);
	 
	        //creamos un input text para que el foco se plasme en este y el usuario no pueda escribir en nada de atras
	        input = document.createElement("input");
	        input.id = "focusInput";
	        input.type = "text"
	 
	        //asignamos el div que bloquea
	        $("#WindowLoad").append(input);
	 
	        //asignamos el foco y ocultamos el input text
	        $("#focusInput").focus();
	        $("#focusInput").hide();
	 
	        //centramos el div del texto
	        $("#WindowLoad").html(imgCentro);
	 
	}

});


