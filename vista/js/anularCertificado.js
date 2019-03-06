$(function() {
	var table;
	document.getElementById("txtCodigoCertificado").focus(); 
	//----- Inicia el proceso para guardar la firma -----//
	$("#btnConsultar").click(function(){ 
		if($("#txtCodigoCertificado").val() == ''){
			mostrarPopUpError("Por favor ingrese un código para la búsqueda");
		}else{
			consultarCertificadosPorRegistro();
		}
	});

	//----- Recarga la página -----//
	$("#btnCancelar").click(function(){ 
		window.location.href = "../html/anularCertificado.html";
	});

	//----- Recarga la página -----//
	$("#btnAcePop1").click(function(){ 
		window.location.href = "../html/anularCertificado.html";
	});
	
	//----- Valida que solo se ingrese en las cajas de texto los valores apropiados -----//
	$('#txtCodigoCertificado').validCampoFranz('SECMPCAB1234567890-');

	//----- Consulta en la base de datos los certificados disponibles por # de registro -----//
	function consultarCertificadosPorRegistro(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'consultarCertificadosPorRegistro',
			pCodigoCertificado: $("#txtCodigoCertificado").val()
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
				}else{
					jsRemoveWindowLoad();
					mostrarPopUpError("No existen certificados con los datos suministrados");
					document.getElementById("txtCodigoCertificado").focus();
				}             
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("No existen certificados con los datos suministrados");
				document.getElementById("txtCodigoCertificado").focus();
			}
		}, "json");
	};

	//----- Crea la tabla y carga la información -----//
	function cargarInformacionEnTabla(data){
		//se destruye el datatable al inicio
		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaCertificados').empty();
        }
		table = $('#tablaCertificados').DataTable({
			"data": data,
			columns: [
			{ title: "Id" },
			{ title: "Anular", data: null, className: "center", defaultContent: '<a id="anular-link" class="anular-link" href="#" title="Edit">Anular</a>'},
			{ title: "Código" },
			{ title: "Programa" },
			{ title: "Curso" },
			{ title: "Fecha" }
			],
			"paging":   false,
			"info":     false,
			"order": [[ 3, "desc" ]],
			"scrollY": "300px",
			"scrollX": true,
			"bDestroy": true,
			"scrollCollapse": true,
			"columnDefs": [
			{"targets": [ 0 ],"visible": false,"searchable": false}
			],
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}
		});
		$('#tablaCertificados tbody').on('click', 'tr', function () {
			if ( $(this).hasClass('selected')) {
				$(this).removeClass('selected');
				seleccionado = false;
			}else{
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				seleccionado = true;
			}
			if(typeof(Storage) !== "undefined") {
				sessionStorage.IdCertificado = table.row(this).data()[0];				
			} else {
				mostrarPopUpError("Por favor actualice su navegador o utilice otro: SessionStorage");
			}
		} );
	}

	//----- Consulta los datos para el certificado y lo muestra en pantalla -----//
	$(document).on('click', '#anular-link', function() {	
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
	   	$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'anularCertificadoPorId',
			pIdCertificado: sessionStorage.IdCertificado
			}, function(data) {
			if (data !== 0) {
				if (data == -1) {
					jsRemoveWindowLoad();
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
	        		jsRemoveWindowLoad();
					mostrarPopUpError("Certificado anulado de manera satisfactoria");
				}else {
					jsRemoveWindowLoad();
					mostrarPopUpError("No fue posible anular el certificado");
				}
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("No fue posible enviar los correos");
			}		
		}, "json");
	});

    //----- Muestra el PopUp -----//
    function mostrarPopUpError(err_men) {
	    $("#textoError").html(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}

	//----- Muestra el PopUp -----//
    function mostrarPopUpConfirmacion(err_men) {
	    $("#textoConfirmacion1").html(err_men);
	    $('#element_to_pop_upCon').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}

	//----- Muestra el PopUp -----//
    function mostrarPopUpConfirmacion1(err_men) {
	    $("#textoConfirmacion").html(err_men);
	    $('#element_to_pop_upPregunta').bPopup({
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