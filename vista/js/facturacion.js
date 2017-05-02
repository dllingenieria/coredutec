$(function(){
	var tabla;
	inicializar();
	solicitarReporte=0;
	nombreArchivo = "";
	detallado = false;
	consolidado = false;
	
	function inicializar(){
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
        yearSuffix: ''
		
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
		
		ocultarTablas();
		cargarReportes();
		CargarConvocatoria();
		$("#txtFechaInicial").datepicker();
		$("#txtFechaFinal").datepicker();
		
	}

	function ocultarTablas(){
		$('#verDetalle').hide();
		$('#verConsolidado').hide();
		$('#imprimir').hide();
		$('#descargar').hide();
	}

	function cargarReportes(){
		var tipoReportes = obtenerTipoReportes();
		formarOptionValue("#seleccionarReporte", tipoReportes);
	}
	
	function obtenerTipoReportes(){
		var tipos= [
		{"Id":"","Nombre":"Seleccione reporte"},
		{"Id":"1","Nombre":"40 MIL"},
		{"Id":"2","Nombre":"AGENCIAS"},
		{"Id":"3","Nombre":"ASISTENCIAS"},
		{"Id":"4","Nombre":"*FACTURACIÓN"},
		{"Id":"5","Nombre":"INFORME 057"},
		{"Id":"6","Nombre":"RESOL_4547"},
		{"Id":"7","Nombre":"SAP"}
		]; 
		return tipos;
	}

	function formarOptionValue(idObjeto,dataSet){
		for (i = 0; i < dataSet.length; i++) {
			$(idObjeto).append($('<option>', {
				value: dataSet[i].Id,
				text: dataSet[i].Nombre
			}));
		}
	}

	$("#seleccionarReporte").change(mostrarReporte);

	function mostrarReporte(element){
		var reporte = parseInt(element.target.value);
		obtenerReporte(reporte,function(informacion){
			//inicializarTablaDinamica(reporte, informacion);
		});
	}

	function obtenerReporte(reporte, callback){
		switch(reporte){
			case 1:
			obtenerReporte1();
			break;
			case 2:
			obtenerReporte2();
			break;
			case 3:
			obtenerReporte3();
			break;
			case 4:
			obtenerReporte4();
			break;
			case 5:
			obtenerReporte5();
			break;
			case 6:
			obtenerReporte6();
			break;
			case 7:
			obtenerReporte7();
			break;
		}
	}

	/*Reporte de 40Mil*/
	function obtenerReporte1(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').show();
		solicitarReporte=1;
		
	}
	
	/*Reporte de Agencias*/
	function obtenerReporte2(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').show();
		solicitarReporte=2;
		
	}
	
	/*Reporte de asistencias*/
	function obtenerReporte3(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').show();
		solicitarReporte=3;
		
	}
	
	/*Reporte de facturacion*/
	function obtenerReporte4(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').show();
		solicitarReporte=4;
		
	}
	
	/*Reporte de Informe 057*/
	function obtenerReporte5(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').hide();
		solicitarReporte=5;
		
	}

	
	/*Reporte de RESOL_4547*/
	function obtenerReporte6(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').hide();
		solicitarReporte=6;
		
	}
	
	/*Reporte de SAP*/
	function obtenerReporte7(){ 
		
		$('#verDetalle').show();
		$('#verConsolidado').hide();
		solicitarReporte=7;
		
	}
	
	function numberFormat(_number, _sep) {
		_number = typeof _number != "undefined" && _number > 0 ? _number : "";
		_number = _number+"";
		_number = _number.replace(new RegExp("^(\\d{" + (_number.length%3? _number.length%3:0) + "})(\\d{3})", "g"), "$1 $2").replace(/(\d{3})+?/gi, "$1 ").trim();
		if(typeof _sep != "undefined" && _sep != " ") {
			_number = _number.replace(/\s/g, _sep);
		}
		return "$ "+_number;
	}

	$("#verDetalle").click(function(){ //alert("hola");
		
		//Se oculta el boton de descarga
		$('#descargar').hide();
		fechaIni=$("#txtFechaInicial").val(); 
		fechaFin=$("#txtFechaFinal").val();
		convocatoria =$("#cmbConvocatorias").val();
		detallado = true;
		//alert(solicitarReporte+"-"+fechaIni+"-"+fechaFin);//$('#cmbEstado option[value=1]').attr('selected','selected');
	   //validarFechas();
	   
		if(fechaIni == "" || fechaFin == "" || convocatoria == ""){
			mostrarPopUpError("Debe llenar los campos fecha inicial, fecha final y la convocatoria");
		}
		else{
				var mensaje="Procesando la información<br>Espere por favor";
				jsShowWindowLoad(mensaje);
			   	$.post("../../controlador/fachada.php", {
					clase: 'clsFacturacion',
					oper: 'consultarReporte',
					solicitarReporte:solicitarReporte,
					fechaInicial: fechaIni,
					fechaFinal: fechaFin,
					convocatoria: convocatoria
					}, function(data) {
					if (data.mensaje == 1 && data.html!=""){
						nombreArchivo=data.html;
						jsRemoveWindowLoad();
						popUpConfirmacion("Generado correctamente el reporte");
						$('#descargar').show();
						
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
	
	$("#verConsolidado").click(function(){ 
		
		//Se oculta el boton de descarga
		$('#descargar').hide();
		fechaIni=$("#txtFechaInicial").val(); 
		fechaFin=$("#txtFechaFinal").val();
		convocatoria =$("#cmbConvocatorias").val();
		consolidado = true;
		//alert(solicitarReporte+"-"+fechaIni+"-"+fechaFin);//$('#cmbEstado option[value=1]').attr('selected','selected');
	   //validarFechas();
	   
		if(fechaIni == "" || fechaFin == "" || convocatoria == ""){
			mostrarPopUpError("Debe llenar los campos fecha inicial, fecha final y la convocatoria");
		}
		else{
				var mensaje="Procesando la información<br>Espere por favor";
				jsShowWindowLoad(mensaje);
			   $.post("../../controlador/fachada.php", {
					clase: 'clsFacturacion',
					oper: 'consultarReporteConsolidado',
					solicitarReporte:solicitarReporte,
					fechaInicial: fechaIni,
					fechaFinal: fechaFin,
					convocatoria: convocatoria
					}, function(data) {
					if (data.mensaje == 1 && data.html!=""){
						nombreArchivo=data.html;
						jsRemoveWindowLoad();
						popUpConfirmacion("Generado correctamente el reporte");
						$('#descargar').show();
						
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
	
	$("#descargar").click(function(){ //alert("hola");
		
		if(solicitarReporte==3 && detallado == true){ 
			window.location.href = "../"+nombreArchivo;
		}
		else if (solicitarReporte==3 && consolidado == true){
			window.location.href = "../"+nombreArchivo;
		}	else{ 
			window.location.href = "../"+nombreArchivo;
		}
		// window.location.href = "../../tmp/reporteAsistencias/asistencias_"+nombreArchivo+".xls";
		
     });
	 
	$('#txtFechaInicial').change(function() {
     validarFechas();
 });
    $('#txtFechaFinal').change(function() {
     validarFechas();
 });
	 
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

function validarFechas() {
    var flag = true;  
    var fec_ini = Date.parse($("#txtFechaInicial").val());
    var fec_fin = Date.parse($("#txtFechaFinal").val());
    if(!isNaN(fec_ini) && !isNaN(fec_fin)){
        if (fec_ini <= fec_fin) {
            flag = true;
        } else {
            flag = false;
            mostrarPopUpError("La fecha final debe ser mayor a la fecha inicial");
        }   
    }
    return flag;
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

function CargarConvocatoria() { 
    $.post("../../controlador/fachada.php", {
        clase: 'clsConvocatoria',
        oper: 'ConsultarConvocatorias'
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueConvocatorias(data);
        }
        else {
            alert('error CargarConvocatoria');
        }
    }, "json");
}

function FormarOptionValueConvocatorias(pConvocatorias) {
    $('#cmbConvocatorias').find('option').remove();
    SetParametroCursoPorDefecto("#cmbConvocatorias", '', 'Seleccione...');
    for (i = 0; i < pConvocatorias.length; i++) {
        $('#cmbConvocatorias').append($('<option>', {
            value: pConvocatorias[i].Id,
            text: pConvocatorias[i].Nombre
        }));
    }
}

function SetParametroCursoPorDefecto(atributo, valor, texto) {
    $(atributo).append($('<option>', {
        value: valor,
        text: texto
    }));
}

 });