$(function(){
	var table;
	var tabla;
	var seleccionado = false;
	inicializar();

	
	function inicializar(){
		obtenerPreprogramacionesActivas();


		$("#Consultar").click(function(){ 
			var FechaInicial = $("#fechaInicial").val();
			var FechaFinal = $("#fechaFinal").val();
			console.log(sessionStorage.IdPreprogramacion);

			if (typeof(sessionStorage.IdPreprogramacion) !== "undefined" && seleccionado == true) {

				if (FechaInicial == "" || FechaFinal==""){
					PopUpError("Por favor ingrese un Fecha Inicial y Fecha Final");	
				}else{
					sessionStorage.pFechaInicial=FechaInicial;
					sessionStorage.pFechaFinal=FechaFinal;
					window.location.href = "callCenterGestionPreprogramacion.html";
				}
		
			}else{
				PopUpError("Por favor seleccione una Preprogramación");
			}
				
		});


			$("#Regresar").click(function(){ 
				window.location = "callCenter.html";
			});

	}





	function obtenerPreprogramacionesActivas(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsDocente',
			oper: 'ConsultarPreprogramacionesActivas'
		}, function(data) {
			if (data !== 0) {
				if(data !== null){							
					
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
					$("#planeacion").css("display","");
				}else{PopUpError("No se ha retornado ningun dato, intente nuevamente.");}             
			}else {PopUpError("No se ha retornado ningun dato, intente nuevamente");}
		}, "json");
	};



	function cargarInformacionEnTabla(data){
		
		//se destruye el datatable al inicio
	if(typeof table !== "undefined"){
            tabla.destroy(); 
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
			{ title: "Horario" }
			],
			"paging":   false,
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
			{"targets": [ 5 ],"visible": false,"searchable": false}],
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
			} else {
				PopUpError("Por favor actualice su navegador o utilice otro: SessionStorage");
			}
		} );
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


function PopUpError(msj){
    $("#textoError").text(msj);
    $('#element_to_pop_upMen').bPopup({
       speed: 450,
       transition: 'slideDown'
   });
}

function popUpConfirmacion(msj){
    $("#textoConfirmacion1").html(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function mostrarPopUpError(err_men) {
    $("#textoError").html(err_men);
    $('#element_to_pop_upMen').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

$("#descargarReporte").click(function(){
			var FechaInicial = $("#fechaInicial").val();
			var FechaFinal = $("#fechaFinal").val();

			console.log("fecha".FechaFinal);
			if(FechaInicial=="" || FechaFinal==""){
				PopUpError("Por favor seleccione un Fecha Inicial y Fecha Final");	
			}else{
			var mensaje="Procesando la información<br>Espere por favor";
			jsShowWindowLoad(mensaje);
			var IdJornada=$("#jornadas").val();
			   	$.post("../../controlador/fachada.php", {
					clase: 'clsProgramacion',
					oper: 'ReporteCallcenterGestionados',
					FechaInicial: FechaInicial,
					FechaFinal: FechaFinal
					}, function(data) {
					if (data.mensaje == 1 && data.html!=""){
						nombreArchivo=data.html;
						jsRemoveWindowLoad();
						//popUpConfirmacion("Generado correctamente el reporte");
						window.location.href = "../"+nombreArchivo;
							setTimeout(function(){
						location.reload();},2000);
						
					}
					else if(data.error == 2){
						jsRemoveWindowLoad();
						popUpConfirmacion("No se encontraron datos para generar"); //$('#descargar').show();
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
			  }

	});
});
