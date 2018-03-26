$(function() {
	//----- Carga todas las listas desplegables -----//
	cargarListas('cmbDocente','SPCARGARDOCENTES2');

	//----- Se ejecuta cuando se escoge un ítem de la lista y es diferente de Seleccione -----//
	$('#cmbDocente').change(function() {
        if($("#cmbDocente option:selected").val() == 0){
			$("#ModulosDisponibles").empty();
			$("#ModulosAsignados").empty();
        }else{
        	$("#ModulosDisponibles").empty();
			$("#ModulosAsignados").empty();
        	cargarModulosDisponibles($("#cmbDocente option:selected").val());
        	cargarModulosAsignados($("#cmbDocente option:selected").val());
        }
    });

	$('#ModulosDisponibles').on('click', 'li', function(){   
		$(this).appendTo('#ModulosAsignados'); 
       	var Modulo = $(this).text();
       	var CodigoModulo = Modulo.split("-");
       	//----- Agrega o elimina los registros en la tabla TDOCENTEDICTA -----//
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsDocente',
	        oper: 'actualizarDocenteDicta',
	        CodigoModulo: CodigoModulo[0],
	        IdDocente: $("#cmbDocente option:selected").val(),
	        Bandera: 1
	    }, function(data) {
	        if (data == 0) {
	            mostrarPopUpError('No fue posible realizar la actualización');
	        }
	        else {
	        	if(data[0]['pResultado'] == 'A') {
	        		$("#ModulosAsignados").empty();
		            cargarModulosAsignados($("#cmbDocente option:selected").val());
		        }
	        }
	    }, "json");
    });

    $('#ModulosAsignados').on('click', 'li', function(){  
    	$(this).appendTo('#ModulosDisponibles');  
    	var Modulo = $(this).text();
       	var CodigoModulo = Modulo.split("-");
       	//----- Agrega o elimina los registros en la tabla TDOCENTEDICTA -----//
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsDocente',
	        oper: 'actualizarDocenteDicta',
	        CodigoModulo: CodigoModulo[0],
	        IdDocente: $("#cmbDocente option:selected").val(),
	        Bandera: 2
	    }, function(data) {
	        if (data == 0) {
	            mostrarPopUpError('No fue posible realizar la actualización');
	        }
	        else {
	        	if(data[0]['pResultado'] == 'B') {
	        		$("#ModulosDisponibles").empty();
		            cargarModulosDisponibles($("#cmbDocente option:selected").val());
		        }
	        }
	    }, "json");
    });

	//----- Regresa a Busqueda -----//
	$("#btnRegresar").click(function(){ 
		window.location.href = "busqueda.html"; 
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
	    SetParametroCursoPorDefecto("#"+objeto, '0', 'Seleccione...');
	    for (i = 0; i < data.length; i++) {
	        $('#'+objeto).append($('<option>', {
	            value: data[i].Id,
	            text: data[i].Nombre
	        }));
	    }
	} 

    //----- Establece los valores por defecto de las listas a Seleccione...-----//
    function SetParametroCursoPorDefecto(atributo, valor, texto) {
	    $(atributo).append($('<option>', {
	        value: valor,
	        text: texto
	    }));
	}

	//----- Carga la lista de los módulos disponibles -----//
	function cargarModulosDisponibles(IdDocente) {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsDocente',
	        oper: 'cargarModulosDisponibles',
	        IdDocente: IdDocente
	    }, function(data) {
	        if (data !== 0) {
	            for (i = 0; i < data.length; i++) {
	            	$("#ModulosDisponibles").append("<li>" + data[i].Modulos + "</li>");
	            }
	        }
	        else {
	            alert('error');
	        }
	    }, "json");
	}

	//----- Carga la lista de los módulos asignados -----//
	function cargarModulosAsignados(IdDocente) {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsDocente',
	        oper: 'cargarModulosAsignados',
	        IdDocente: IdDocente
	    }, function(data) {
	        if (data !== 0) {
	            for (i = 0; i < data.length; i++) {
	            	$("#ModulosAsignados").append("<li>" + data[i].Modulos + "</li>");
	            }
	        }
	        else {
	            alert('error');
	        }
	    }, "json");
	}

	//----- Agrega o elimina los registros en la tabla TDOCENTEDICTA -----//
	function cargarModulosAsignados(IdDocente) {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsDocente',
	        oper: 'cargarModulosAsignados',
	        IdDocente: IdDocente
	    }, function(data) {
	        if (data !== 0) {
	            for (i = 0; i < data.length; i++) {
	            	$("#ModulosAsignados").append("<li>" + data[i].Modulos + "</li>");
	            }
	        }
	        else {
	            alert('error');
	        }
	    }, "json");
	}

    //----- Muestra el PopUp -----//
    function mostrarPopUpError(err_men) {
	    $("#textoError").text(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
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