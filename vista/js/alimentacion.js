$(function(){
	$("#btnReporteAlimentacion").css("display","none");
	$("#regresar").hide();
	$('#spanTotal').hide();
	$("#descargar").hide();
	$("#regresarR").hide();
	$('#spanTotalR').hide();
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
			clase: 'clsDocente',
			oper: 'ConsultarModulosPorDocente',
			IdDocente: idDocenteG,
			Anio: sessionStorage.anioPreprogramacion,
			// salon: salon
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					// $("#sectCuerpo").show();
					
					
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
					$("#btnReporteAlimentacion").css("display","");
				}else{PopUpError("No se ha retornado ningun dato, intente nuevamente.");}       
			}else {PopUpError("No se ha retornado ningun dato, intente nuevamente");}
		}, "json");
	};

	function cargarInformacionEnTabla(data){
		
		$("#botonera").hide();
		//se destruye el datatable al inicio
	if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaModulos').empty();
        }
		
		$(".cuerpoEstudiantes").hide();
		
		$("#regresar").hide();
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
			{ title: "Inscritos" },
			{ title: "Ruta" },
			{ title: "Modalidad" },
			{ title: "cantidadSesiones" },
			{ title: "Estado" },
			{data: null, className: "center", defaultContent: '<a id="reporteAlimentacionPorSalon" class="reporteAlimentacionPorSalon" href="#" title="Edit">Refrigerios</a>'}
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
				
			} else {
				PopUpError("Por favor actualice su navegador o utilice otro: SessionStorage");
			}
		} );
	}
	
	$("#btnReporteAlimentacion").click(function(){
		window.location.href = "reporteAlimentacion.html";
	});

function cantidadSesiones(){
	$.post("../../controlador/fachada.php", {
		clase: 'clsDocente',
		oper: 'consultarCalendarioPreprogramacion',
		idPreprogramacion: sessionStorage.IdPreprogramacion
	}, function(data) {
			if (data !== 0) {
				if(data !== null){
					sessionStorage.NoSesiones = data;
				}else{
					sessionStorage.NoSesiones=0;
				}             
			}else {sessionStorage.NoSesiones=0;
				}
	}, "json");
}


function popUpConfirmacion(msj){
	    $("#textoConfirmacion1").text(msj);
	    $('#element_to_pop_upCon').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
}


$(document).on('click', '#regresarR', function() {
		 location.reload();
});



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


	function PopUpError(msj){
    $("#textoError").text(msj);
    $('#element_to_pop_upMen').bPopup({
       speed: 450,
       transition: 'slideDown'
   });
}

	function popUpConfirmacion(msj){
		$("#textoConfirmacion1").text(msj);
		$('#element_to_pop_upCon').bPopup({
		   speed: 450,
		   transition: 'slideDown'
	   });
	}

	//----- Genera el reporte alimentacion por salon -----//
	$(document).on('click', '#reporteAlimentacionPorSalon', function() {
		cantidadSesiones();
		aprobadosAsistentesFormato();
		setTimeout(function(){
			var mensaje="Procesando la información<br>Espere por favor";
			jsShowWindowLoad(mensaje);
		   	$.post("../../controlador/fachada.php", {
				clase: 'clsAlimentacion',
				oper: 'consultarReporteAlimentacionPorEstudiante',
				idPreprogramacion: sessionStorage.IdPreprogramacion,
				NoSesiones: sessionStorage.NoSesiones,
				Curso: sessionStorage.Curso,
				Modulo: sessionStorage.Modulo,
				Inscritos: sessionStorage.Inscritos,
				Horario: sessionStorage.Horario,
				FechaInicial: sessionStorage.FechaInicial,
				Sede: sessionStorage.Sede,
				Salon: sessionStorage.Salon,
				IdCurso: sessionStorage.IdCurso,
				IdModulo: sessionStorage.IdModulo,
				FechaFinal: sessionStorage.FechaFinal,
				Duracion: sessionStorage.Duracion,
				Docente: sessionStorage.Docente,
				DiasCurso: sessionStorage.DiasCurso,
				Ruta: sessionStorage.Ruta,
				CantidadAsistentes: sessionStorage.cantidadAsistentes,
				EstudiantesGanando: sessionStorage.EstudiantesGanando
				}, function(data) {
				if (data.mensaje == 1 && data.html!=""){
					nombreArchivo=data.html;
					jsRemoveWindowLoad();
					popUpConfirmacion("Reporte generado correctamente");
					window.location.href = "../"+nombreArchivo;
				}
				else if(data.error == 2){
					jsRemoveWindowLoad();
					popUpConfirmacion("No se encontraron datos para el reporte"); //$('#descargar').show();
					setTimeout(function(){
					location.reload();},2000);
				}
				else{
					jsRemoveWindowLoad();
					mostrarPopUpError("No se ha generado el reporte");
					setTimeout(function(){
					location.reload();},2000);
				}		
			}, "json");		
		},2000);	
	});

	function cargarReporteAlimentacionPorSalon(params){
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsDocente',
			oper: 'consultarReporteAlimentacionPorSalon',
		    idpreprogramacion: params
		 }, function(data) {
				//if (data !== 0) {
					if(data !== null){
					    $('#spanTotalR').show();
                        $('#numero_estudiantesR').text(data.length);
                        console.log("data");
					   formatearReporteAlimentacionPorSalon(data);		        			
					}else{alert("error 1");}             
				//}else {alert("error 2");}
				jsRemoveWindowLoad();	
		}, "json");                
	}

	function formatearReporteAlimentacionPorSalon(data){
			$('.cuerpo').hide();
			$(".cuerpoEstudiantes").hide();
			$(".cuerpoRefrigerios").show();
			$("#regresarR").show();
			if(typeof table !== "undefined"){
	            table.destroy(); 
	       	    $('#tablarefrigerios').empty();
        	}

	         table = $('#tablarefrigerios').DataTable({
				"data": data,
				columns: [
					{ title: "Idtercero" },
					{ title: "Estudiante" },
					{ title: "Número de Identificación" },
					{ title: "Cantidad" },
					{ title: "Rfrigerio" }
				],
				"paging":   true,
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
	}

	function aprobadosAsistentesFormato(){
		$.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async :false,
            data: {
                clase: 'clsUtilidades',
                oper: 'consultarCantidadAsistentesPorSalon',
                IdPreprogramacion: sessionStorage.IdPreprogramacion,
                }
        }).done(function(data) {
            if(data[0].cantidadAsistentes !== null){
               sessionStorage.cantidadAsistentes=data[0].cantidadAsistentes;
            }
        });
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async :false,
            data: {
                clase: 'clsUtilidades',
                oper: 'consultarNotaParcialPorSalon',
                IdPreprogramacion: sessionStorage.IdPreprogramacion,
                }
        }).done(function(data) {
            if(data[0].pEstudiantesGanando !== null){
                sessionStorage.EstudiantesGanando=data[0].pEstudiantesGanando;
            }
        });
	}
});