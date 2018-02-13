$(function() { 

	$("#btnAModulos").hide();
	//configuracion del calendario
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
	
	$("#txtFecha").datepicker();
	obtenerFechaActual();
	
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "calidad.html";
    }
    var columnas = new Array(
        { title: "IdPreprogramacion" },
        { title: "Salon" },
        { title: "Curso" },
        { title: "Modulo" },
        { title: "Estado" },
        { title: "Sesion" },
        { title: "Fecha" },
		{ title: "Cantidad" },
        { title: "Refrigerio" });

	$("#btnConsularReporte").click(function(){ 
		var fechai = $("#txtFechai").val();
        var fechaf = $("#txtFechaf").val();
		if (fechai == "" || fechaf == ""){
		mostrarPopUpError("Por favor ingrese una fecha inicial y una fecha final ");	
		}
		else{
			obtenerReporteAlimentacion(fechai,fechaf);
		}
	});
	
    function obtenerReporteAlimentacion(fechai,fechaf){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsAlimentacion',
			oper: 'consultarReporteAlimentacionPorPreprogramacion',
			fechai: fechai,
			fechaf: fechaf			
			}, function(data) {
			if (data !== 0) {
				if(data !== null){
					$("#sectCuerpo").show();
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
					$("#btnAModulos").show();
				}else{mostrarPopUpError("No se ha retornado ningun dato, intente nuevamente.");}             
			}else {mostrarPopUpError("No se ha retornado ningun dato, intente nuevamente");}
		}, "json");
	};

    function cargarInformacionEnTabla(data){ //alert(data);
	if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaReporteAlimentacion').empty();
        }
        var table = $('#tablaReporteAlimentacion').DataTable({
            "data": data,
            columns: columnas,
            "paging":   false,
            "info":     false,
			"scrollY": "300px",
			"scrollX": true,
			"bDestroy": true,
            "columnDefs": [{"className": "dt-left", "targets": "_all"}, 
			{"targets": [ 0 ],"visible": false,"searchable": false},
			{ "width": "13%", "targets": 1 }
			],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "language": {
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            }
        });
    }
	
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
		$(".fecha").val(hoy);
	}
	
	$("#btnAModulos").click(function(){
    window.location.href = "alimentacion.html";
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

function popUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function mostrarPopUpError(err_men) {
    $("#textoError").text(err_men);
    $('#element_to_pop_upMen').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

});
