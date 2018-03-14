$(function() { 

	$("#btnVolver").hide();
    $("#btnConsularReporteDetallado").hide();
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
    // if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
    //     window.location.href = "calidad.html";
    // }

	$("#btnConsularReporte").click(function(){ 
		var fechai = "";
        var fechaf = "";
        fechai = $("#txtFechai").val();
        fechaf = $("#txtFechaf").val();
		if (fechai == "" || fechaf == ""){
		mostrarPopUpError("Por favor ingrese una fecha inicial y una fecha final ");
		}
		else{
            var mensaje="Procesando la información<br>Espere por favor";
            jsShowWindowLoad(mensaje);
			recuperarDatos(fechai,fechaf);
		}
	});


    $("#btnConsularReporteDetallado").click(function(){ 
        var fechai = "";
        var fechaf = "";
        fechai = $("#txtFechai").val();
        fechaf = $("#txtFechaf").val();
        if (fechai == "" || fechaf == ""){
        mostrarPopUpError("Por favor ingrese una fecha inicial y una fecha final ");
        }
        else{
            var mensaje="Procesando la información<br>Espere por favor";
            jsShowWindowLoad(mensaje);
            $.post("../../controlador/fachada.php", {
                    clase: 'clsCalidad',
                    oper: 'consultarEvaluacionTabuladaDetalle',
                    fechai:fechai,
                    fechaf: fechaf
                    }, function(data) {
                    if (data.mensaje == 1 && data.html!=""){
                        nombreArchivo=data.html;
                        jsRemoveWindowLoad();
                        window.location.href = "../"+nombreArchivo;
                        popUpConfirmacion("Generado correctamente el reporte");
                            
                    }
                    else if(data.error == 2){
                        jsRemoveWindowLoad();
                        popUpConfirmacion("No se encontraron datos para generar"); //$('#descargar').show();
                    }
                    else{
                        jsRemoveWindowLoad();
                        mostrarPopUpError("No se ha generado el reporte");
                    }       
                }, "json"); 
        }
    });
	
    function recuperarDatos(fechai,fechaf){ //alert(data);
        //----- Recupera los resultados de Satisfaccion -----//
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async :false,
            data: {
                clase: 'clsCalidad',
                oper: 'consultarEvaluacionTabulada',
                fechai: fechai,
                fechaf: fechaf,
                bandera: 1,
                }
        }).done(function(data) {
            if(data == 0){
                    jsRemoveWindowLoad();
                    $("#sectCuerpo").hide();
                    $("#btnVolver").hide();
                    $("#btnConsularReporteDetallado").hide();
                    mostrarPopUpError("No se encontraron evaluaciones");
                }else{ 
                    if(data !== null){
                var Total = 0;
                var Puntos = 0;
                for (var i = 0; i < data.length; i++){
                    for(var j = 1; j < 6; j++){
                        if(data[i].Satisfaccion == j){
                            /*console.log("Ingresó a colocar el varlor en el html. Valor devuelto: "+data[i].Satisfaccion+" Valor de j: "+j);
                            console.log(data[i].TotalSatisfaccion);*/
                            $("#txt"+j).html(data[i].TotalSatisfaccion);
                            Total = Total + parseInt(data[i].TotalSatisfaccion);
                            switch (j){
                                case 1:
                                    Puntos = Puntos + parseInt(data[i].TotalSatisfaccion)*0.2;
                                    break;
                                case 2:
                                    Puntos = Puntos + parseInt(data[i].TotalSatisfaccion)*0.4;
                                    break;
                                case 3:
                                    Puntos = Puntos + parseInt(data[i].TotalSatisfaccion)*0.6;
                                    break;
                                case 4:
                                    Puntos = Puntos + parseInt(data[i].TotalSatisfaccion)*0.8;
                                    break;
                                case 5:
                                    Puntos = Puntos + parseInt(data[i].TotalSatisfaccion)*1;
                                    break;
                            }
                        }else{
                            //$("#txt"+j).html(0);
                        }
                    }
                }
                Puntos = Math.round((Puntos / Total)*100);
                $("#txtNR").html(0);
                $("#txtTotal").html(Total);
                $("#txtPuntos").html(Puntos);

                //----- Recupera los resultados de la Pregunta1 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 2,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Claridad == j){
                                    //console.log("Ingresó a colocar el varlor en el html. Valor devuelto: "+data[i].Claridad+" Valor de j: "+j);
                                    $("#txtR1"+j).html(data[i].TotalClaridad);
                                    Total = Total + parseInt(data[i].TotalClaridad);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalClaridad)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalClaridad)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalClaridad)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalClaridad)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalClaridad)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR1"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR1").html(0);
                        $("#txtRTotal1").html(Total);
                        $("#txtRPuntos1").html(Puntos);
                    }
                });

                //----- Recupera los resultados de la Pregunta2 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 3,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Metodologia == j){
                                    $("#txtR2"+j).html(data[i].TotalMetodologia);
                                    Total = Total + parseInt(data[i].TotalMetodologia);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalMetodologia)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalMetodologia)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalMetodologia)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalMetodologia)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalMetodologia)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR2"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR2").html(0);
                        $("#txtRTotal2").html(Total);
                        $("#txtRPuntos2").html(Puntos);
                    }
                });

                //----- Recupera los resultados de la Pregunta3 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 4,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Contenidos == j){
                                    $("#txtR3"+j).html(data[i].TotalContenidos);
                                    Total = Total + parseInt(data[i].TotalContenidos);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalContenidos)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalContenidos)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalContenidos)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalContenidos)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalContenidos)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR3"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR3").html(0);
                        $("#txtRTotal3").html(Total);
                        $("#txtRPuntos3").html(Puntos);
                    }
                });

                //----- Recupera los resultados de la Pregunta4 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 5,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Material == j){
                                    $("#txtR4"+j).html(data[i].TotalMaterial);
                                    Total = Total + parseInt(data[i].TotalMaterial);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalMaterial)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalMaterial)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalMaterial)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalMaterial)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalMaterial)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR4"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR4").html(0);
                        $("#txtRTotal4").html(Total);
                        $("#txtRPuntos4").html(Puntos);
                    }
                });

                //----- Recupera los resultados de la Pregunta5 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 6,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Instalaciones == j){
                                    $("#txtR5"+j).html(data[i].TotalInstalaciones);
                                    Total = Total + parseInt(data[i].TotalInstalaciones);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalInstalaciones)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalInstalaciones)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalInstalaciones)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalInstalaciones)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalInstalaciones)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR5"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR5").html(0);
                        $("#txtRTotal5").html(Total);
                        $("#txtRPuntos5").html(Puntos);
                    }
                });

                //----- Recupera los resultados de la Pregunta6 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 7,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Objetivos == j){
                                    $("#txtR6"+j).html(data[i].TotalObjetivos);
                                    Total = Total + parseInt(data[i].TotalObjetivos);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalObjetivos)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalObjetivos)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalObjetivos)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalObjetivos)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalObjetivos)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR6"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR6").html(0);
                        $("#txtRTotal6").html(Total);
                        $("#txtRPuntos6").html(Puntos);
                    }
                });

                //----- Recupera los resultados de la Pregunta7 -----//
                $.ajax({
                    url: '../../controlador/fachada.php',
                    type: 'POST',
                    dataType: 'json',
                    async :false,
                    data: {
                        clase: 'clsCalidad',
                        oper: 'consultarEvaluacionTabulada',
                        fechai: fechai,
                        fechaf: fechaf,
                        bandera: 8,
                        }
                }).done(function(data) {
                    if(data !== null){
                        var Total = 0;
                        var Puntos = 0;
                        for (var i = 0; i < data.length; i++){
                            for(var j = 1; j < 6; j++){
                                if(data[i].Tiempos == j){
                                    $("#txtR7"+j).html(data[i].TotalTiempos);
                                    Total = Total + parseInt(data[i].TotalTiempos);
                                    switch (j){
                                        case 1:
                                            Puntos = Puntos + parseInt(data[i].TotalTiempos)*0.2;
                                            break;
                                        case 2:
                                            Puntos = Puntos + parseInt(data[i].TotalTiempos)*0.4;
                                            break;
                                        case 3:
                                            Puntos = Puntos + parseInt(data[i].TotalTiempos)*0.6;
                                            break;
                                        case 4:
                                            Puntos = Puntos + parseInt(data[i].TotalTiempos)*0.8;
                                            break;
                                        case 5:
                                            Puntos = Puntos + parseInt(data[i].TotalTiempos)*1;
                                            break;
                                    }
                                }else{
                                    //$("#txtR7"+j).html(0);
                                }
                            }
                        }
                        Puntos = Math.round((Puntos / Total)*100);
                        $("#txtRNR7").html(0);
                        $("#txtRTotal7").html(Total);
                        $("#txtRPuntos7").html(Puntos);
                    }
                });

                $("#sectCuerpo").show();
                $("#btnVolver").show();
                $("#btnConsularReporteDetallado").show();
                jsRemoveWindowLoad();
                    }
                }
        });
    }

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
					$("#btnVolver").show();
				}else{mostrarPopUpError("No se ha retornado ningun dato, intente nuevamente.");}             
			}else {mostrarPopUpError("No se ha retornado ningun dato, intente nuevamente");}
		}, "json");
	};

    
	
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
	
	$("#btnVolver").click(function(){
    window.location.href = "calidad.html";
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
