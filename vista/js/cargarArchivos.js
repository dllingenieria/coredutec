$(function(){
	var table;
	CargarListaCargasMasivas("#selCargaConsulta");
	cargarTiposDocumentos();
	function CargarListaCargasMasivas(SelectCarga) {  
	    $.post("../../controlador/fachada.php", {
	         clase: 'clsGestorBDPlanas',
	         oper: 'CargarListaCargasMasivas',
	    }, function(data) { 
	        if (data !== 0) {
	            FormarOptionValueLista(data, SelectCarga);
	        }
	        else {
	            mostrarPopUpError('No se pudo cargar la lista de cargas, intentelo nuevamente');
	        }
	    }, "json");
	}

	function FormarOptionValueLista(data, SelectCarga) {
	    $('#selCarga').find('option').remove();
	    SetParametroCursoPorDefecto(SelectCarga, '00', 'Seleccione...');
	    for (i = 0; i < data.length; i++) {
	        $(SelectCarga).append($('<option>', {
	            value: data[i].Id,
	            text: data[i].Nombre
	        }))
	    }
	}

	function SetParametroCursoPorDefecto(atributo, valor, texto){
	    $(atributo).append($('<option>', {
	        value: valor,
	        text: texto
	    }));
	}

	function cargarTiposDocumentos() {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsNovedades',
	        oper: 'consultarTiposDocumentos'
	    }, function(data) {
	        if (data !== 0) { 
	            //setParametroPorDefecto("#cmbTipoDocumento", '3', "CC");
	            formarOptionValueTipoDocumentos(data);
	        }
	    }, "json");
	}

	function formarOptionValueTipoDocumentos(tiposDocumentos) { 
	    for (i = 0; i < tiposDocumentos.length; i++) { 
	        $('#cmbTipoIdentificacion').append($('<option>', {
	            value: tiposDocumentos[i][0],
	            text: tiposDocumentos[i][1]
	        }));
	    }
	}

	$("#selCargaConsulta" ).change(function() { 
		valorSeleccionado = $("#selCargaConsulta").val();
		
		switch (valorSeleccionado) {
			case "00":
				$(".form").hide();
				mostrarPopUpError("Debe seleccionar una opción");
				break;
			case "1":
				$("#form-tercero").show();	
				$("#form-preprogramacion").hide();
				$("#buscar").show();				 
				break;
			case "2":		
				$("#form-tercero").show();
				$("#form-preprogramacion").hide();
				$("#buscar").show();	
				break;
			case "3":
				$("#form-preprogramacion").show();
				$("#form-tercero").hide();
				$("#buscar").show();	
				break;
			case "4":
				$("#form-tercero").show();
				$("#form-preprogramacion").hide();
				$("#buscar").show();
				break;
			case "5":
				$("#form-preprogramacion").show();
				$("#form-tercero").hide();
				$("#buscar").show();
				break;
			case "6":
				$("#form-preprogramacion").show();
				$("#form-tercero").hide();
				$("#buscar").show();
		}
	});


	$("#buscar").click(function() {
		var selCarga = $("#selCargaConsulta option:selected").val();
		var selCargaConsulta = $("#selCargaConsulta option:selected").val();
		switch (selCarga) {
			case '1':
		    case '2':
		    case '4':
		    	if($("#identificacion").val() != ''){
		    		var mensaje="Procesando la información<br>Espere por favor";
					var busqueda="";
					var tipodocumento="";
			        jsShowWindowLoad(mensaje);
			        var parametros= {};
			        consultarTabla="";
			        switch (selCargaConsulta) {
			        	case "1":
							busqueda=$("#identificacion").val();
							tipodocumento=$("#cmbTipoIdentificacion option:selected").val();
							parametros= { clase: 'clsCarga',
									oper: 'ConsultarAsignaciones',
									tipodocumento: tipodocumento,
									busqueda: busqueda
									};
							consultarTabla=cargarInformacionEnTablaAsignaciones;
						break;
						case "2":
							busqueda=$("#identificacion").val();
							tipodocumento=$("#cmbTipoIdentificacion option:selected").val();
							parametros= { clase: 'clsCarga',
									oper: 'ConsultarSoporteMatricula',
									tipodocumento: tipodocumento,
									busqueda: busqueda
									};
							consultarTabla=cargarInformacionEnTablaMatricula;
						break;
						case "4":
							busqueda=$("#identificacion").val();
							tipodocumento=$("#cmbTipoIdentificacion option:selected").val(); 
							parametros= { clase: 'clsCarga',
									oper: 'ConsultarCambioEstados',
									tipodocumento: tipodocumento,
									busqueda: busqueda
									};
							consultarTabla=cargarInformacionEnTablaEstado;
						break;
			        }
		    	}else{
		    		mostrarPopUpError("Debe escribir un número de documento");
		    	}
		    	break;
		    case '3':
		    case '5':
		    case '6':
		    	if($("#Preprogramacion").val() != ''){
		    		var mensaje="Procesando la información<br>Espere por favor";
					var busqueda="";
			        jsShowWindowLoad(mensaje);
			        var parametros= {};
			        consultarTabla="";
			       	switch (selCargaConsulta) {
			       		case "3":
							busqueda=$("#Preprogramacion").val(); // los que buscan por preprogramacion
							parametros= { clase: 'clsCarga',
									oper: 'ConsultarSoporteFirmas',
									busqueda: busqueda
									};
							consultarTabla=cargarInformacionEnTablaFirmas;
						break;
						case "5":
							busqueda=$("#Preprogramacion").val(); // los que buscan por preprogramacion
							parametros= { clase: 'clsCarga',
									oper: 'ConsultarSoporteRefrigerios',
									busqueda: busqueda
									};
							consultarTabla=cargarInformacionEnTablaRefrigerios;
						break;
						case "6":
							busqueda=$("#Preprogramacion").val(); // los que buscan por preprogramacion
						break;
			       	}
		    	}else{
		    		mostrarPopUpError("Debe escribir un código de salón");
		    	}
		}
		$.post("../../controlador/fachada.php", 
			parametros
			, function(data) {
			if (data !== 0) {
				if(data !== null){
					consultarTabla(data);
					jsRemoveWindowLoad();
					$('#imprimir').hide();
				}else{alert("error 1");}             
			}else {alert("error 2");}
		}, "json");
 	});


	function cargarInformacionEnTablaEstado(data){ 
		console.log("data"+data);

		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaContenidoGenerado').empty();
        }

		table = $('#tablaContenidoGenerado').DataTable({
			"data": data,
			columns: [
			{title: "TipoIdentificacion"},
			{title: "NumeroIdentificacion"},
			{title: "Nombres" },
			{title: "Fecha" },
			{title: "EstadoAnterior" },
			{title: "EstadoNuevo" },
			{title: "TipoArchivo" },
			{title: "Archivo"}	
			],
				"paging":   false,
				"pageLength": 7,
				"bLengthChange": false,
				"bDestroy": true,
				"info":     false,
				"scrollY": "240px",
				"scrollX": true,
				"scrollCollapse": true,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }	
		});
    }

    function cargarInformacionEnTablaAsignaciones(data){ 
		console.log("data"+data);

		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaContenidoGenerado').empty();
        }

		table = $('#tablaContenidoGenerado').DataTable({
			"data": data,
			columns: [
			{title: "TipoIdentificacion"},
			{title: "NumeroIdentificacion"},
			{title: "Nombres" },
			{title: "Fecha" },
			{title: "Modulo" },
			{title: "TipoArchivo" },
			{title: "Archivo"}	
			],
				"paging":   false,
				"pageLength": 7,
				"bLengthChange": false,
				"bDestroy": true,
				"info":     false,
				"scrollY": "240px",
				"scrollX": true,
				"scrollCollapse": true,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }	
		});
    }


    function cargarInformacionEnTablaMatricula(data){ 
		console.log("data"+data);

		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaContenidoGenerado').empty();
        }

		table = $('#tablaContenidoGenerado').DataTable({
			"data": data,
			columns: [
			{title: "TipoIdentificacion"},
			{title: "NumeroIdentificacion"},
			{title: "Nombres" },
			{title: "Fecha" },
			{title: "Salon" },
			{title: "Ruta Fuente" },
			{title: "Ruta Soporte" },
			],
				"paging":   false,
				"pageLength": 7,
				"bLengthChange": false,
				"bDestroy": true,
				"info":     false,
				"scrollY": "240px",
				"scrollX": true,
				"scrollCollapse": true,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }	
		});
    }


 function cargarInformacionEnTablaFirmas(data){ 
		console.log("data"+data);

		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaContenidoGenerado').empty();
        }

		table = $('#tablaContenidoGenerado').DataTable({
			"data": data,
			columns: [
			{title: "Salon"},
			{title: "Fecha" },
			{title: "Ruta Fuente" },
			{title: "Ruta Soporte" }
			],
				"paging":   false,
				"pageLength": 7,
				"bLengthChange": false,
				"bDestroy": true,
				"info":     false,
				"scrollY": "240px",
				"scrollX": true,
				"scrollCollapse": true,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }	
		});
    }

     function cargarInformacionEnTablaRefrigerios(data){ 
		console.log("data"+data);

		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaContenidoGenerado').empty();
        }

		table = $('#tablaContenidoGenerado').DataTable({
			"data": data,
			columns: [
			{title: "Salon"},
			{title: "Fecha" },
			{title: "Ruta Fuente" },
			{title: "Ruta Soporte" }
			],
				"paging":   false,
				"pageLength": 7,
				"bLengthChange": false,
				"bDestroy": true,
				"info":     false,
				"scrollY": "240px",
				"scrollX": true,
				"scrollCollapse": true,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }	
		});
    }




	function mostrarPopUpError(err_men) {
		$("#textoError").text(err_men);
		$('#element_to_pop_upMen').bPopup({
			speed: 450,
			transition: 'slideDown'
		});
	}


function jsRemoveWindowLoad() {
    // eliminamos el div que bloquea pantalla
    $("#WindowLoad").remove();
 
}
 
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