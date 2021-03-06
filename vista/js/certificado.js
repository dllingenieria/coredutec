$(function () {
	//----- Direcciona a la lista de salones con estado por Certificar -----//
	$("#btnModulos").click(function(){
		window.location.href = "../html/modulosPorCertificar.html";
	});

	//----- Direcciona a la lista de salones con estado por Certificar -----//
	$("#btnCursos").click(function(){
		window.location.href = "../html/cursosPorCertificar.html";
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
			oper: 'certificarPorModulos',
			pIdPreprogramacion: sessionStorage.IdPreprogramacion
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					enviarCorreosPorModulos();
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
	function enviarCorreosPorModulos(){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'enviarCorreosPorModulos',
			pIdPreprogramacion: sessionStorage.IdPreprogramacion
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
					popUpConfirmacion("No fue posible enviar los correos");
				}
			}else {
				jsRemoveWindowLoad();
				popUpConfirmacion("No fue posible enviar los correos");
			}
		}, "json");
	};

	var table;
	var tabla;
	var seleccionado = false;
	nombreArchivo = "";
	obtenerIdTercero(function(idDocente){
		idDocenteG = idDocente; 
		obtenerIdTerceroModulos();
	});
	
	function obtenerIdTerceroModulos(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'ConsultarModulosPorCertificar',
			IdDocente: idDocenteG
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					// $("#sectCuerpo").show();
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
            $('#tablaModulos').empty();
        }
		 table = $('#tablaModulos').DataTable({
			"data": data,
			columns: [
			{ title: "Docente" },
			{ title: "Id Preprogramacion" },
			{ title: "Salón" },
			{ title: "Id Curso" },
			{ title: "Curso" },
			{ title: "Id Módulo" },
			{ title: "Módulo" },
			{ title: "Fecha Inicial" },
			{ title: "Fecha Final" },
			{ title: "Duración" },
			{ title: "Sede" },
			{ title: "Días Curso" },
			{ title: "Horario" },
			{ title: "IntensidadHorariaDiaria" },
			{ title: "Por Certificar" },
			{ title: "Ruta" },
			{ title: "Modalidad" },
			{ title: "cantidadSesiones" },
			{ title: "Estado" },
			{data: null, className: "center", defaultContent: '<a id="certificar-link" class="edit-link" href="#" title="Edit">Certificar</a>'}
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
			{"targets": [ 1 ],"visible": false,"searchable": false},
			{"targets": [ 3 ],"visible": false,"searchable": false},
			{"targets": [ 5 ],"visible": false,"searchable": false},
			{"targets": [ 15 ],"visible": false,"searchable": false},
			{"targets": [ 13 ],"visible": false,"searchable": false},
			{"targets": [ 16 ],"visible": false,"searchable": false},
			{"targets": [ 17 ],"visible": false,"searchable": false}
			],
			"language": {
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}
		});
		$('#tablaModulos tbody').on('click', 'tr', function () {
			if ( $(this).hasClass('selected')) {
				$(this).removeClass('selected');
				seleccionado = false;
			}else{
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				seleccionado = true;
			}
			if(typeof(Storage) !== "undefined") {
				sessionStorage.Docente = table.row(this).data()[0];
				sessionStorage.IdPreprogramacion = table.row(this).data()[1];
				sessionStorage.Salon = table.row(this).data()[2];
				sessionStorage.IdCurso = table.row(this).data()[3];
				sessionStorage.Curso = table.row(this).data()[4];
				sessionStorage.IdModulo = table.row(this).data()[5];
				sessionStorage.Modulo = table.row(this).data()[6];
				sessionStorage.FechaInicial = table.row(this).data()[7];
				sessionStorage.FechaFinal = table.row(this).data()[8];
				sessionStorage.Duracion = table.row(this).data()[9];
				sessionStorage.Sede = table.row(this).data()[10];
				sessionStorage.DiasCurso = table.row(this).data()[11];
				sessionStorage.Horario = table.row(this).data()[12];
				sessionStorage.IntensidadHorariaDiaria = table.row(this).data()[13];
				sessionStorage.Inscritos = table.row(this).data()[14];
				sessionStorage.Ruta = table.row(this).data()[15];
				sessionStorage.Modalidad = table.row(this).data()[16];
				sessionStorage.cantidadSesiones = table.row(this).data()[17];
				sessionStorage.Estado = table.row(this).data()[18];
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
					popUpConfirmacion1("¿Desea certificar el Salón usando la firma de abajo?");
				}else {
					popUpConfirmacion("Aún no ha registrado su firma");
				}
			}else {
				popUpConfirmacion("Existe un error, consulte con el administrador");
			}
		}, "json");
	};

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