$(function() { 
	
	
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "academico.html";
    }
		
	recuperarDatos();
	consultarSeguimientoGeneral();
		
	
    
    function recuperarDatos() { 
	
        $("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria );
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
	
    $("#volverAcademico").click(function(){
    	window.location.href = "academico.html";
	});

	function consultarSeguimientoGeneral(){ 
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		 $.ajax({
	        url: '../../controlador/fachada.php',
	        type: 'POST',
	        dataType: 'json',
	        async :false,
	        data: {
	            clase: 'clsAcademico',
	            oper: 'consultarSeguimiento',
	            IdPreprogramacion: sessionStorage.IdPreprogramacion,
	            tipo: 1,
	            }
	    }).done(function(data) {
	    	jsRemoveWindowLoad();

	    	if (data!="" && data!=null){
		    	asistencia= data[0].SAsistencia;
		    	notas=data[0].SNotas;
		    	planeacion= data[0].SPlaneacion;
		    	general= data[0].SGeneral;        

		        if(asistencia!="" && asistencia!=null){
		        	$("#txtSeguimientoAsistencia").text(asistencia);
		        }else{
		        	$("#txtSeguimientoAsistencia").text("No se han registrado datos");
		        }

		        if(notas!="" && notas!=null){
		        	$("#txtSeguimientoNotas").text(notas);
		        }else{
		        	$("#txtSeguimientoNotas").text("No se han registrado datos");
		        }

				if(planeacion!="" && planeacion!=null){
		        	$("#txtSeguimientoPlaneacion").text(planeacion);
		        }else{
		        	$("#txtSeguimientoPlaneacion").text("No se han registrado datos");
		        }


		        if(general!=""){
		        	$("#txtSeguimiento").val(general);
		        }

	    	}else{
	    		$("#txtSeguimientoAsistencia").text("No se han registrado datos");
	    		$("#txtSeguimientoNotas").text("No se han registrado datos");
	    		$("#txtSeguimientoPlaneacion").text("No se han registrado datos");
	    	}

	    });
	
	
 }

    
    $("#guardarAcademico").click(function(){ 
        if (!validarInformacion()) {
            mostrarPopUpError("Por favor ingrese la información de seguimiento");
        }else{
            agregarSeguimientoGeneral();
        }
    });
    

    function validarInformacion(){
        var valido=true;
        
			
			if ($("#txtaSeguimiento").val() == ""){
				valido=false;
			}
        
        
        return valido;
    }


function agregarSeguimientoGeneral(){ 
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsAcademico',
			oper: 'agregarSeguimiento',
			IdPreprogramacion: sessionStorage.IdPreprogramacion,
			seguimiento: $("#txtSeguimiento").val(),
			tipo:4
		},
		
		function(data) {
			
			if (data !== 0) {
				
					 
				jsRemoveWindowLoad();
				popUpConfirmacion("Guardado Satisfactoriamente");
						
				            
			}else {mostrarPopUpError("No se guardo el seguimiento");}
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
