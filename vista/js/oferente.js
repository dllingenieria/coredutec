$(function() {
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
	$("#txtFechaN").datepicker();
	obtenerFechaActual();

	//----- Carga todas las listas desplegables -----//
	cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
	cargarListas('cmbExpedicion','SPCARGARCIUDADES');
	cargarListas('cmbSexo','SPCARGARSEXO');
	cargarListas('cmbEstadoCivil','SPCARGARESTADOCIVIL');
	cargarListas('cmbGradoEscolaridad','SPCARGARGRADOESCOLARIDAD');
	cargarListas('cmbLocalidad','SPCARGARLOCALIDAD');
	cargarListas('cmbCiudad','SPCARGARCIUDADES');

	//----- Dispara el proceso para guardar un nuevo oferente -----//
	$("#btnGuardar").click(function(){ 
		if(($("#txtNumeroIdentificacion").val() == "") || ($("#txtNombres").val() == "") || ($("#txtApellidos").val() == "") || ($("#txtTelefono1").val() == "") || ($("#txtTelefono2").val() == "") || ($("#txtTelefono3").val() == "") || ($("#txtEmail1").val() == "") || ($("#txtEmail2").val() == "") || ($("#txtDireccion").val() == "")){
			mostrarPopUpError('Por favor diligencie todos los campos');
		}else{
			guardarOferente();
		}
	});

	//----- Rregresa a Busqueda -----//
	$("#btnRegresar").click(function(){ 
		window.location.href = "../html/busqueda.html"; 
	});

	//----- Valida que solo se ingrese en las cajas de texto los valores apropiados -----//
	//$('#txtNumeroIdentificacion').validCampoFranz('0123456789');
	$('#txtTelefono1').validCampoFranz('0123456789');
	$('#txtTelefono2').validCampoFranz('0123456789');
	$('#txtTelefono3').validCampoFranz('0123456789');
	$('#txtNombres').validCampoFranz('ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ ');
	$('#txtApellidos').validCampoFranz('ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ ');
	
	//Captura el control para aplicar validacion al presionar una tecla
	window.addEventListener("load", function() {
		document.getElementById("txtNumeroIdentificacion").addEventListener("keypress", soloNumeros, false);
		});

	//Solo permite introducir numeros y la tecla enter.
	function soloNumeros(e){
		var key = window.event ? e.which : e.keyCode;
		if (key != 13){
			if (key < 48 || key > 57) {
				e.preventDefault();
			}
		}else{
			if($("#txtNumeroIdentificacion").val() != ""){
	        	var mensaje="Procesando la información<br>Espere por favor";
				jsShowWindowLoad(mensaje);
	        	var pTipoIdentificacion = $("#cmbTipoIdentificacion option:selected").val();
	        	var pNumeroIdentificacion = $("#txtNumeroIdentificacion").val();
	        	cargarInformacionTercero(pTipoIdentificacion,pNumeroIdentificacion);
	        }else{
	        	mostrarPopUpError('Por favor escriba un número de cédula');
	        }
		}
	}

	//----- Consulta la informacion del tercero y la coloca en el formulario -----//
	function cargarInformacionTercero(pTipoIdentificacion,pNumeroIdentificacion) {
		if(pTipoIdentificacion !== null){	
			$.post("../../controlador/fachada.php", {
			clase: 'clsParticipante',
			oper: 'verificarParticipante',
			pNumeroIdentificacion: pNumeroIdentificacion,
			pTipoIdentificacion: pTipoIdentificacion
			}, function(data) {
				if(data !== 0){
		        	$("#txtNumeroIdentificacion").val(pNumeroIdentificacion);
	        		$("#txtNombres").val(data[0][1]);
	        		$("#txtApellidos").val(data[0][2]);
	        		$("#txtFechaN").val(data[0][4]);
	        		$("#txtTelefono1").val(data[0][8]);
	        		$("#txtTelefono2").val(data[0][9]);
	        		$("#txtTelefono3").val(data[0][10]);
	        		$("#txtEmail1").val(data[0][12]);
	        		$("#txtEmail2").val(data[0][13]);
	        		$("#txtDireccion").val(data[0][11]);
	        		cargarValorSelected('#cmbTipoIdentificacion',pTipoIdentificacion,500);
	        		cargarValorSelected('#cmbExpedicion',data[0][3],500);
	        		cargarValorSelected('#cmbSexo',data[0][5],500);
	        		cargarValorSelected('#cmbEstadoCivil',data[0][6],500);
	        		cargarValorSelected('#cmbGradoEscolaridad',data[0][7],500);
	        		cargarValorSelected('#cmbLocalidad',data[0][14],500);
	        		cargarValorSelected('#cmbCiudad',data[0][15],500);
				}else{
					mostrarPopUpError('El oferente no existe, puede continuar');
					$("#txtNombres").val('');
	        		$("#txtApellidos").val('');
	        		$("#txtTelefono1").val('');
	        		$("#txtTelefono2").val('');
	        		$("#txtTelefono3").val('');
	        		$("#txtEmail1").val('');
	        		$("#txtEmail2").val('');
	        		$("#txtDireccion").val('');
	        		cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
					cargarListas('cmbExpedicion','SPCARGARCIUDADES');
					cargarListas('cmbSexo','SPCARGARSEXO');
					cargarListas('cmbEstadoCivil','SPCARGARESTADOCIVIL');
					cargarListas('cmbGradoEscolaridad','SPCARGARGRADOESCOLARIDAD');
					cargarListas('cmbLocalidad','SPCARGARLOCALIDAD');
					cargarListas('cmbCiudad','SPCARGARCIUDADES');
				}
				jsRemoveWindowLoad();
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

	//----- Guarda la informacion del oferente -----//
	function guardarOferente() {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsAsignacion',
	        oper: 'guardarOferente',
	        pTipoIdentificacion: $("#cmbTipoIdentificacion option:selected").val(),
        	pNumeroIdentificacion: $("#txtNumeroIdentificacion").val(),
        	pExpedicion: $("#cmbExpedicion option:selected").val(),
        	pNombres: $("#txtNombres").val(),
	        pApellidos: $("#txtApellidos").val(),
	        pFechaN: $("#txtFechaN").val(),
	        pSexo: $("#cmbSexo option:selected").val(),
	        pEstadoCivil: $("#cmbEstadoCivil option:selected").val(),
	        pGradoEscolaridad: $("#cmbGradoEscolaridad option:selected").val(),
	        pTelefono1: $("#txtTelefono1").val(),
	        pTelefono3: $("#txtTelefono2").val(),
	        pTelefono3: $("#txtTelefono3").val(),
	        pDireccion: $("#txtDireccion").val(),
	        pEmail1: $("#txtEmail1").val(),
	        pEmail2: $("#txtEmail2").val(),
	        pLocalidad: $("#cmbLocalidad option:selected").val(),
	        pCiudad: $("#cmbCiudad option:selected").val()
	    }, function(data) {
	        if (data == 0) {
	           mostrarPopUpError('No fue posible agregar o modificar el Oferente');
	           $("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });
	        }
	        else {
	            if(data[0]['pResultado'] == 'A') {
	            	mostrarPopUpError('Oferente agregado correctamente');
	            	$("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });
	            }else{
	            	mostrarPopUpError('Oferente actualizado correctamente');
	            	$("#btnAcePop").click(function(){ window.location.href = "../html/busqueda.html"; });
	            }
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
		$("#txtFechaN").val(hoy);
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
	function cargarValorSelected(objeto,value,tiempo){
        setTimeout(function() {
            $(objeto+' option[value="'+value+'"]').attr('selected','selected');    
        }, tiempo);       
    }

    //----- Muestra el PopUp -----//
    function mostrarPopUpError(err_men) {
	    $("#textoError").text(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
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