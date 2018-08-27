$(function() { 

	
	obtenerEvaluacionesPorCedula();
	recuperarDatos();
	
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "calidad.html";
    }
	
    var columnas = new Array(
        { title: "IdEvaluacion" },
        { title: "Número Identificación" },
        { title: "Fecha" },
        { title: "Estudiante" },
        { title: "Docente" },
		{ title: "Módulo" },
        { title: "Sede" });
		
	
	// $("#btnConsularCedula").click(function(){ 
		// var cedula = $("#txtCedula").val();
		// if (cedula == ""){
		// PopUpError("Por favor ingrese una Cédula");	
		// }
		// else{
			// obtenerEvaluacionesPorCedula(cedula);
		// }
	// });
	
    function obtenerEvaluacionesPorCedula(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCalidad',
			oper: 'ConsultarEvaluacionesPorCedula',
			IdPreprogramacion: sessionStorage.IdPreprogramacion
			
			}, function(data) {
			if (data !== 0) {
				if(data !== null){
					$("#sectCuerpo").show();
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
					// recuperarDatos();
					
					$("#btnVerDetalle").css("display","");
					$("#btnAModulos").css("display","");
					
				}else{PopUpError("No se ha retornado ningun dato, intente nuevamente.");}             
			}else {PopUpError("No se ha retornado ningun dato, intente nuevamente");}
		}, "json");
	};
	

    function cargarInformacionEnTabla(data){ //alert(data);
        var table = $('#tablaCalidad').DataTable({
            "data": data,
            columns: columnas,
            "paging":   false,
            "info":     false,
            "columnDefs": [{"className": "dt-left", "targets": "_all"}, //alinear texto a la izquierda
			{"targets": [ 0 ],"visible": false,"searchable": false},
            {"targets": [ 2 ],"visible": false,"searchable": false},
			{ "width": "13%", "targets": 1 }//se le da ancho al td de estudiante
			//{ "width": "8%", "targets": 8 }, //se le da ancho al td de total horas
			//{ "width": "8%", "targets": 9 } //se le da ancho al td de observacion
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
		$('#tablaCalidad tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { //alert("hi");
                $(this).removeClass('selected'); 
				 seleccionado = false;
            }else{
                table.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
				seleccionado = true;
            }
             if(typeof(Storage) !== "undefined") {
                sessionStorage.IdEvaluacion = table.row(this).data()[0];
                sessionStorage.NumeroIdentificacion = table.row(this).data()[1];
                sessionStorage.Fecha = table.row(this).data()[2];
                sessionStorage.Estudiante = table.row(this).data()[3];
                sessionStorage.Docente = table.row(this).data()[4];
                sessionStorage.Modulo = table.row(this).data()[5];
                sessionStorage.Sede = table.row(this).data()[6];
             } else {
                // alert("Por favor actualice su navegador o utilice otro: SessionStorage");
				sessionStorage.IdEvaluacion = "";
             }
        } );
    }
	
	function recuperarDatos() {
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
        var saber =  new Array();
        var hacer =  new Array();
        var ser =  new Array();
        var notas =  new Array();
        
		$("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria+" Horas" );
        $("#fechaInicial").html(sessionStorage.FechaInicial);
        $("#lugar").html(sessionStorage.Sede + " - " + sessionStorage.Salon);
        $("#codigo").html(sessionStorage.IdCurso + " - " + sessionStorage.IdModulo);
        $("#fechaFinal").html(sessionStorage.FechaFinal);
        $("#txtDuracion").html(sessionStorage.Duracion+" Horas");
		$("#txtSalon").html(sessionStorage.Salon);
        $("#txtSede").html(sessionStorage.Sede); 
		$("#txtDocente").html(sessionStorage.Docente);
		$("#txtRuta").html(sessionStorage.Ruta);
		$("#txtNoSessiones").html(sessionStorage.cantidadSesiones);
		
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
                $("#asistentes").html(data[0].cantidadAsistentes);
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
                $("#aprobados").html(data[0].pEstudiantesGanando);
            }
            
        });
	}
	
	$("#btnAModulos").click(function(){
    window.location.href = "calidad.html";
});
	
	$("#btnVerDetalle").click(function(){ 
        if (typeof(sessionStorage.IdEvaluacion) !== "undefined" && seleccionado == true) {
            // window.location.href = "planeacion.html";
            cargarDetalleEvaluacion(); 
         }else{
             mostrarPopUpError("Por favor seleccione una Evaluación");
         }
    });
	

 

 /*Trae la informacion del detalle de una evaluacion seleccionada
*/
 function cargarDetalleEvaluacion(){ 

		
    $.post("../../controlador/fachada.php", {
            clase: 'clsCalidad',
            oper: 'cargarDetalleEvaluacion',
            IdEvaluacion: sessionStorage.IdEvaluacion
			}, function(data) { 
             if (data !== 0) {
                 if(data !== null){
					
					console.log(data[0]);
					$(".filtro").hide();
					$("#sectCuerpo").hide();
					
					// $("#divDetalle").html(data.html);
					
					$("#divDetalle").show();
					$("#divBoton").show();
					
					$("#btnVolverABusqueda").click(function(){ window.location.href = "ingresarCalidad.html"; })
					//llenar los datos
					
					$("#fechaEvaluacion").val(sessionStorage.Fecha);
					$("#docentes").val(sessionStorage.Docente);
					$("#lugarServicio").val(sessionStorage.Sede);
					$("#servicioEducativo").val(sessionStorage.Modulo);
					$("#divNombre").html("<b>Bienvenido (a): "+sessionStorage.Estudiante+"</b>");
					
					//falta poner el modulo
						//sessionStorage.Modulo = table.row(this).data()[4];
					//llenar datos evaluacion
					$("#satisfaccion").val(); $("#satisfaccion option[value="+ data[0].Satisfaccion +"]").attr("selected",true);
					$("#descripcionSatisfaccion").html(data[0].DescripcionSatisfaccion);
					$("input:radio[name=claridad]", "#divEvaluacion").filter("[value="+data[0].Claridad+"]").prop("checked", true);
					$("input:radio[name=metodologia]", "#divEvaluacion").filter("[value="+data[0].Metodologia+"]").prop("checked", true);
					$("input:radio[name=contenidos]", "#divEvaluacion").filter("[value="+data[0].Contenidos+"]").prop("checked", true);
					$("input:radio[name=material]", "#divEvaluacion").filter("[value="+data[0].Material+"]").prop("checked", true);
					$("input:radio[name=instalaciones]", "#divEvaluacion").filter("[value="+data[0].Instalaciones+"]").prop("checked", true);
					$("input:radio[name=objetivos]", "#divEvaluacion").filter("[value="+data[0].Objetivos+"]").prop("checked", true);
					$("input:radio[name=tiempos]", "#divEvaluacion").filter("[value="+data[0].Tiempos+"]").prop("checked", true);
					$("#descripcionServicio").html(data[0].DescripcionServicio);
					$("#aspectosPositivos").html(data[0].AspectosPositivos);
					$("#aspectosParaMejorar").html(data[0].AspectosParaMejorar);
					
		
                 } else{
                         mostrarPopUpError("No hay datos");
                       }             
             } 
             else {
                     mostrarPopUpError("No se encontraron los datos");
                 }
        }, "json");
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
