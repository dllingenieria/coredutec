$(function(){
	

//alert("hi");
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
        yearSuffix: ''
		
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
	
	$("#txtFecha").datepicker();
	var tablaPaneacion;
	//para las cajas de texto con la clase number solo se permite ingresar numeros
	$(".number").keydown(function (e) {
           
           // Permite: backspace, delete, tab, escape, enter and .
           if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
               // Permite: Ctrl+A
               (e.keyCode == 65 && e.ctrlKey === true) ) {
               // solo permitir lo que no este dentro de estas condiciones es un return false
               return;
           }
		   // Solo numeros
           if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
               e.preventDefault();
           }
    });
	
	
	
    listarPlaneacion();
	recuperarDatos();
	mostrarNumeroSesiones();
    consultarSeguimientoGeneral();
	
	var seleccionado = false;
	$("#divEditar").css("display","none");
	$("#PlaneacionSeguimiento").css("display","none");

		 
    function listarPlaneacion(){ 
   // alert(sessionStorage.IdPreprogramacion);
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
            $.post("../../controlador/fachada.php", {
                clase: 'clsPlaneacion',
                oper: 'listarPlaneacion',
                IdPreprogramacion: sessionStorage.IdPreprogramacion
            }, function(data) {
			console.log(data);
                 if (data !== 0) {
                     if(data !== null){ 
                        cargarInformacionEnTabla(data);
						jsRemoveWindowLoad();
                     }else{mostrarPopUpError("error 1");}             
                 }else {mostrarPopUpError("error 2");}
            }, "json");
    }
    //);

    
//----------


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
                tipo:3,
                }
        }).done(function(data) {
            if(data!=""){
                $("#txtaSeguimiento").val(data[0].SPlaneacion);
            }

        });

     }

function cargarInformacionEnTabla(data){ 
      
	  $('#tablaPaneacion').removeClass('selected');
	  //modulo = nombre curso
        tablaPaneacion = $('#tablaPlaneacion').DataTable({
            "data": data,
            columns: [
			{ title: "Id" }, 
            { title: "Numero Sesión" },
            { title: "Fecha" },
            { title: "Salón" }, 				
            { title: "Nombre" }],
            "paging":   true,
            "info":     false,
            "order": [[ 3, "desc" ]],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "columnDefs": [
            {"targets": [ 0 ],"visible": true,"searchable": false} ],
            "language": {
				 "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            }
        });
        $('#tablaPlaneacion tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { //alert("hi");
                $(this).removeClass('selected'); 
				 seleccionado = false;
            }else{ //alert("ho");
                tablaPaneacion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
				seleccionado = true;
				
            }
             if(typeof(Storage) !== "undefined") {
                sessionStorage.IdPlaneacion = tablaPaneacion.row(this).data()[0];
                //sessionStorage.IdPreprogramacion = table.row(this).data()[1];
                // sessionStorage.Salon = table.row(this).data()[2];
                // sessionStorage.IdPlaneacion = table.row(this).data()[3];
                sessionStorage.Sesion = tablaPaneacion.row(this).data()[1];
                // sessionStorage.Fecha = table.row(this).data()[5];
                // sessionStorage.Modulo = table.row(this).data()[6];
                
             } else {
                // alert("Por favor actualice su navegador o utilice otro: SessionStorage");
				sessionStorage.IdPlaneacion = "";
             }
			 
        } );
    }
	


 /*Boton para ver detalle de la programacion debe estar seleccionada una planeacion
*/
    $("#verDetalle").click(function(){ 
        if (typeof(sessionStorage.IdPlaneacion) !== "undefined" && seleccionado == true) {
            // window.location.href = "planeacion.html";
            cargarDetallePlaneacion(); //pendiente si se envia el IdPlaneacion como parametro
         }else{
             mostrarPopUpError("Por favor seleccione una Planeación");
         }
    });

  
    
     //cuando se le da clic al boton de guardar
    $("#guardarSeguimientoPlaneacion").click(function(){
        if (validarInformacion() == false) {
            mostrarPopUpError("Por favor la información de seguimiento");
        }else{
            agregarSeguimientoPlaneacion();
        }
    });
	
	
 
    function agregarSeguimientoPlaneacion(){ 
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsAcademico',
			oper: 'agregarSeguimiento',
			IdPreprogramacion: sessionStorage.IdPreprogramacion,
			seguimiento: $("#txtaSeguimiento").val(),
			tipo:3
		},
		
		function(data) {
			
			if (data !== 0) {
				
					 
				jsRemoveWindowLoad();
				popUpConfirmacion("Guardado Satisfactoriamente");
						
				            
			}else {mostrarPopUpError("No se guardo el seguimiento");}
		}, "json");
	
	
 }
 
//validacion pra los campos del formulario
    function validarInformacion(){
        var valido=true;
        
			
			if ($("#txtaSeguimiento").val() == ""){
				valido=false;
			}
        
        return valido;
    }


	
      //cuando se le da clic al boton de volver en listarPlaneacion
  $("#volverListar").click(function(){
        window.location.href = "academico.html";
    });

 
      //cuando se le da clic al boton de volver en planeacion (nueva)
  $("#volver").click(function(){
        window.location.href = "listarPlaneacionSeguimiento.html";
    }); 
	


 /*Trae la informacion del detalle de una planeacion seleccionada
*/
 function cargarDetallePlaneacion(){ 

	// idPreprogramacion: sessionStorage.IdPreprogramacion,
    // idPlaneacion:sessionStorage.IdPlaneacion
	
    $.post("../../controlador/fachada.php", {
            clase: 'clsPlaneacion',
            oper: 'cargarDetallePlaneacionSeguimiento',
             idPlaneacion: sessionStorage.IdPlaneacion
			}, function(data) { 
             if (data !== 0) {
                 if(data !== null){
					
					// window.location.href = "planeacion.html";
					
					$("#divListar").css("display","none");
					$("#divEditar").html(data.html);
					
					//para las cajas de texto con la clase number solo se permite ingresar numeros
						$( ".number", $("#divEditar" ) ).keydown(function (e) {
						   
						   // Permite: backspace, delete, tab, escape, enter and .
						   if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
							   // Permite: Ctrl+A
							   (e.keyCode == 65 && e.ctrlKey === true) ) {
							   // solo permitir lo que no este dentro de estas condiciones es un return false
							   return;
						   }
						   // Solo numeros
						   if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
							   e.preventDefault();
						   }
					});
					$("#txtFecha", $("#divEditar" )).datepicker();
					
					$("#divEditar").css("display","block");
					$("#PlaneacionSeguimiento").css("display","block");
					
					
					
					
					//se agrega el boton adicionar recurso al div
									   
					// $('#divAdicionarRecurso').append('<button id="btnAdicionar" type="button" class="boton final" onclick="alert(\'You are clicking on me\');">Adicionar Recursos</button>');
					$('#divAdicionarRecurso').append('<button id="btnAdicionar" type="button" class="boton final" onclick="">Adicionar Recursos</button>');
					//boton de adicionar una fila de recurso
					$("#btnAdicionar").click(function(){ adicionarRecursoEditar(); })
					//boton de eliminar una fila de recurso boton traido desde php
					$("button[id^=btnEliminar]").click(function(){ var id = $(this).attr("id"); eliminarRecursoEditar(id); })
					//$("#btnEliminar").click(function(){ eliminarRecursoEditar(); })
					
					
					//$("#btnAdicionar").attr("onclick","hola(a,b,c);");
		
                 } else{
                         mostrarPopUpError("error 1");
                       }             
             } 
             else {
                     mostrarPopUpError("error 2");
                 }
        }, "json");
}


    

function mostrarNumeroSesiones(){ 
   //alert(sessionStorage.IdPreprogramacion);
            $.post("../../controlador/fachada.php", {
                clase: 'clsPlaneacion',
                oper: 'consultarNumeroSesiones',
                IdPreprogramacion: sessionStorage.IdPreprogramacion
            }, function(data) {
			//console.log(data);
                 if (data !== 0) {
                     if(data !== null){ 
                        $("#sesiones").html(data);
                     }else{mostrarPopUpError("error 1");}             
                 }else {mostrarPopUpError("error 2");}
            }, "json");
    }
    //);

	
	function recuperarDatos() { 
		$("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+" - "+sessionStorage.Horario+" - "+sessionStorage.IntensidadHorariaDiaria+" Horas" );
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
	
	
function popUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function popUpConfirmacion1(msj){
    $("#textoConfirmacion2").text(msj);
    $('#element_to_pop_upCon2').bPopup({
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

//para el confirm
function popUpConfirmacion3(msj, fn, fn1){
	//contenedor vacion
	 var contenedor = $( "#contenedor" );
	 //se le envia a contenedor el contenido de element_to_pop_upCon1
	contenedor.html( $( "#element_to_pop_upCon3" ).html() );
	/*como el id textoConfirmacion2 esta dos veces (en contenedor y en element_to_pop_upCon1)
    * se esta poniendo el texto en el de contenedor
	*/
	$("#textoConfirmacion3", contenedor ).text(msj);
	// $('#divAceptar').html("");
	// $('.botonAceptar').attr("id","btnAceptar");
	$("[id=btnAceptar]:button", contenedor ).click(function(){ 
		if( fn ) fn(); 
	} );
	
	$("[id=btnCerrar]:button", contenedor ).click(function(){ 
		if( fn1 ) fn1(); 
	} );
	
	//se muestra el conetenedor 
    $('#contenedor').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
	
	// $('#divAceptar').
        // append($('<button>').
            // attr("name", "element_to_pop_upConf").
            // attr("type", "button").
            // attr("class", "b-close").
            // attr("Id", "btnAceptar").
            // text("Aceptar")
        // );
}

function quitarTrSeleccion(){
	tablaPaneacion.$('tr.selected').removeClass('selected');
}

$("#volverAcademico").click(function(){
    window.location.href = "listarPlaneacionSeguimiento.html";
});

  

}); //cerrar