$(function () {
	//----- Oculta la tabla y el boton de certificados -----//
	$("#tablaCursos").hide();
	$("#btnCertificados").hide();

	//----- Coloca la fecha actual en los datepicker -----//
	obtenerFechaActual();

	var table;
	var tabla;
	var seleccionado = false;
	nombreArchivo = "";

	//----- Direcciona al módulo de certificados -----//
	$("#btnConsultar").click(function(){
		obtenerIdTerceroCursos();
	});

	//----- Direcciona al módulo de certificados -----//
	$("#btnCertificados").click(function(){
		window.location.href = "https://certificados.cetcolsubsidio.edu.co/vista/html/busqueda.html";
	});

	//----- Da inicio al proceso de generar los certificados y enviar los correos -----//
	$("#btnAcePop").click(function(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'certificarPorCursos',
			pIdCursoTemporal: sessionStorage.Id
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					enviarCorreoPorCurso(data[0].pIdCertificado);
				}else {
					jsRemoveWindowLoad();
					popUpConfirmacion("No fue posible certificar el Salón");
				}
			}else {
				jsRemoveWindowLoad();
				popUpConfirmacion("Existe un error, consulte con el administrador");
			}
		}, "json");
	});

	//----- Envía correos a todos los estudiantes que aprobaron el modulo cuando se genera el certificado -----//
	function enviarCorreoPorCurso(IdCertificado){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'enviarCorreoPorCurso',
			pIdCertificado: IdCertificado
		}, function(data) {
			if (data !== 0) {
				if (data == -1) {
					jsRemoveWindowLoad();
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
	        		jsRemoveWindowLoad();
					popUpConfirmacion("Certificados generados de manera satisfactoria");
				}else {
					jsRemoveWindowLoad();
					popUpConfirmacion("No fue posible enviar el correo");
				}
			}else {
				jsRemoveWindowLoad();
				popUpConfirmacion("No fue posible enviar el correo");
			}
		}, "json");
	};
	
	function obtenerIdTerceroCursos(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'ConsultarCursosPorCertificar',
			pFechaInicial: $("#txtFechaInicial").val(),
			pFechaFinal: $("#txtFechaFinal").val()
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					// $("#sectCuerpo").show();
					$("#tablaCursos").show();
					$("#btnCertificados").show();
					$("#fechas").hide();
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
					$("#btnAsistencias").css("display","");
					$("#btnAcademico").css("display","");
					$("#btnNotas").css("display","");
					$("#btnPlaneacion").css("display","");
				}else{popUpConfirmacion("No se ha retornado ningun dato, intente nuevamente.");}             
			}else {popUpConfirmacion("No se ha retornado ningun dato, intente nuevamente");}
		}, "json");
	};

	function cargarInformacionEnTabla(data){
	$("#botonera").hide();
	//se destruye el datatable al inicio
	if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaCursos').empty();
        }
		 table = $('#tablaCursos').DataTable({
			"data": data,
			columns: [
			{ title: "Id" },
			{ title: "IdTercero" },
			{ title: "Tipo Identificación" },
			{ title: "Número Identificación" },
			{ title: "Estudiante" },
			{ title: "Código Curso" },
			{ title: "Curso" },
			{ title: "Duración" },
			{ title: "Certificar", data: null, className: "center", defaultContent: '<a id="certificar-link" class="edit-link" href="#" title="Edit">Certificar</a>'}
			],
			"paging":   true,
			"info":     false,
			"order": [[ 3, "desc" ]],
			"scrollY": "300px",
			"scrollX": true,
			"bDestroy": true,
			"scrollCollapse": true,
			"columnDefs": [
			{"targets": [ 0 ],"visible": true,"searchable": true},
			{"targets": [ 1 ],"visible": false,"searchable": false}
			],
			"language": {
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}
		});
		$('#tablaCursos tbody').on('click', 'tr', function () {
			if ( $(this).hasClass('selected')) {
				$(this).removeClass('selected');
				seleccionado = false;
			}else{
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				seleccionado = true;
			}
			if(typeof(Storage) !== "undefined") {
				sessionStorage.Id = table.row(this).data()[0];
				sessionStorage.IdTercero = table.row(this).data()[1];
				sessionStorage.TipoIdentificacion = table.row(this).data()[2];
				sessionStorage.NumeroIdentificacion = table.row(this).data()[3];
				sessionStorage.Estudiante = table.row(this).data()[4];
				sessionStorage.CodigoCurso = table.row(this).data()[5];
				sessionStorage.Curso = table.row(this).data()[6];
				sessionStorage.Duracion = table.row(this).data()[7];
			} else {
				popUpConfirmacion("Por favor actualice su navegador o utilice otro: SessionStorage");
			}
		} );
	}

	$(document).on('click', '#certificar-link', function() {
		$.post("../../controlador/fachada.php", {
		clase: 'clsCertificados',
		oper: 'consultarTercero',
		pIdUsuario: sessionStorage.idUsuario
		}, function(data) {
			if (data !== 0) {
				consultarDatosFirmaDigital(data[0].Tercero);
			}else {
				popUpConfirmacion("No ha registrado su firma");
			}
		}, "json");
	});

	//----- Consulta los datos de la firma digital por Id de Firma-----//
	function consultarDatosFirmaDigital(tercero){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'consultarFirmaDigital2',
			pIdTercero: tercero
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					$("#imgFirma").attr('src',data[0].RutaFirma);
					popUpConfirmacion1("¿Desea certificar el Curso usando la firma de abajo?");
				}else {
					popUpConfirmacion("Aún no ha registrado su firma");
				}
			}else {
				popUpConfirmacion("Existe un error, consulte con el administrador");
			}
		}, "json");
	};

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
		$("#txtFechaInicial").val(hoy);
		$("#txtFechaFinal").val(hoy);
	}

	function popUpConfirmacion(msj){
			$("#textoConfirmacion1").html(msj);
			$('#element_to_pop_upCon').bPopup({
			   speed: 450,
			   transition: 'slideDown'
		   });
	}

	function popUpConfirmacion1(msj){
		    $("#textoError").html(msj);
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
	    imgCentro = "<div style='z-index:10;text-align:center;height:" + alto + "px;'><div  style='color:#000;margin-top:" + heightdivsito + "px; font-size:20px;font-weight:bold'>" + mensaje + "</div><img src='../images/loading.gif' width='107' height='106'></div>";
	 
	        //creamos el div que bloquea grande------------------------------------------
	        var altoDivGris=alto+500;
			div = document.createElement("div");
	        div.id = "WindowLoad"
	        div.style.width = ancho + "px";
	        div.style.height = altoDivGris + "px";
			$("#WindowLoad").css("z-index","50");
			
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