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
	
	var seleccionado = false;
	$("#divEditar").css("display","none");
	$("#divBoton").css("display","none");

		 
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

  //cuando se le da clic al boton de nueva planeacion
    $("#nuevaPlaneacion").click(function(){
        
        if (typeof(sessionStorage.IdPreprogramacion) !== "undefined") {
            //window.location.href = "listarPlaneacion.html";
            window.location.href = "planeacion.html";
        }else{
            mostrarPopUpError("Por favor seleccione un módulo");
        }
    }); 

     //cuando se le da clic al boton de eliminar planeacion
    $("#eliminarPlaneacion").click(function(){
        
        if (typeof(sessionStorage.IdPlaneacion) !== "undefined") {
			popUpConfirmacion3("Confirma que desea eliminar la Sesión No "+sessionStorage.Sesion+" ?", eliminarPlaneacion, quitarTrSeleccion);
            // var r = confirm("Confirma que desea eleminar la planeación!");
			// if (r == true) {
				//eliminarPlaneacion();
			// }
        }else{
            mostrarPopUpError("Por favor seleccione una Planeación");
        }
    });

     //cuando se le da clic al boton de guardar
    $("#guardarPlaneacion").click(function(){
        if (validarInformacion() == false) {
            mostrarPopUpError("Por favor llene los campos requeridos");
        }else{
            guardarPlaneacion();
        }
    });
	
	/*Adiciona una fila para agregar un recurso*/
	 $("#btnAdicionar").click(function(){ 
		 
		 var id="";
		 var res="";
        
        //extraer el ultimo id fila
		$("input[name=recurso]").each(function(){
			id = $(this).attr("id");
			
    });  
		res = id.substr(7, 8);
		
		
	// alert(res);
		
		$.post("../../controlador/fachada.php", {
        clase: 'clsPlaneacion',
        oper: 'adicionarFilaRecurso',
		res: res
        
		}, function(data) {
			 if (data !== null) {
			   
				  //$("#div_adicionados").css("display", "");
				  
					  
				  var dvAux = document.createElement( "table" );
				  dvAux.innerHTML = data.html;
				  
				  //para las cajas de texto con la clase number solo se permite ingresar numeros
						$( ".number", dvAux ).keydown(function (e) {
						   
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
				  
				  $("#div_adicionados").append( dvAux.childNodes[0] );
				  //boton adicionado desde nueva planeacion
				  $("button[id^=btnEliminar]").click(function(){ var id = $(this).attr("id"); eliminarRecursoEditar(id); })
					  
			 }else {mostrarPopUpError("Se ha presentado un error");}
		}, "json");
    });
	
 
    /*Captura los datos del formulario y los envia al controlador facada.php
  y este a la clase clsPlaneacion método guardarPlaneacion  
*/
    function guardarPlaneacion(){
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
        var listaRecursos = new Array();
        var listaRecursosId = new Array();
		 cont=0;
		// $("input[name=recurso][type!=hidden]:visible").each(function(){
		$("input[name=recurso][type!=hidden]:visible").each(function(){
			id = $(this).attr("id");
			// cont = id.substr(7, 8);
			res = id.substr(0, 7);
			
			//alert(cont);
			listaRecursos[cont] = {};
			
			if(cont % 2 == 0){
				listaRecursos[cont]['cantidad']=$(this).val();
			}
			else{
				listaRecursos[cont-1]['recursos']=$(this).val();
				
			}
			cont++;
			
		});  
		
		$("input[name=recurso][type=hidden]").each(function(){
			id = $(this).attr("id");
			contId = id.substr(8, 9);
			// res = id.substr(0, 7);
			
			// alert(contId);
			listaRecursosId[contId] = {};
			listaRecursosId[contId]['id']=$(this).val();
			
			//preguntar si esa caja de texto tiene el atributo eliminar
			if ($( this ).attr("eliminar") != undefined){
				eliminar =2;
			}
			else{
				eliminar =1;
			}
			
				listaRecursosId[contId]['eliminar']=eliminar;
		
	}); 

    $.post("../../controlador/fachada.php", {
        clase: 'clsPlaneacion',
        oper: 'guardarPlaneacion',
        sesionPla: $("#txtSesion").val(),
        fecha: $("#txtFecha").val(),
        unidTema: $("#txtUnidadTematica").val(),
        estrDesa: $("#txtEstrategiasDesarrollar").val(),
        tecn: $("#txtTecnicaInstrumento").val(),
        segu: $("#txtSeguimiento").val(),
        reci: $("#txtRecibido").val(),
        obse: $("#txtObservaciones").val(),
        listaRecursos: listaRecursos,
		listaRecursosId: listaRecursosId,
        idPreprogramacion: sessionStorage.IdPreprogramacion
        
    }, function(data) {
         if (data !== null) {
            if(data[0].pIdPlaneacion !== ""){
                // alert(data[0].pIdPlaneacion);
				jsRemoveWindowLoad();
				popUpConfirmacion("Se ha guardado exitosamente la planeación");
				tablaPaneacion.$('tr.selected').removeClass('selected');
				setTimeout( function(){window.location.href = "listarPlaneacion.html";},3000);
                //se llama otra vez a la lista de planeacion
                
            }else{mostrarPopUpError("Se ha presentado un error");}             
         }else {mostrarPopUpError("Se ha presentado un error");}
    }, "json");
}

//validacion pra los campos input del formulario
    function validarInformacion(){
    var val = true; 
    $("input[type!=hidden]").each(function(){
    if ($(this).val() == ''){ //alert($(this).attr("id"));
		val = false;} 
    });
        return val;
    }

      //cuando se le da clic al boton de actualizar
  $("#editarPlaneacion").click(function(){ 
        // if (validarInformacion() == false) {
             // alert("Por favor llene los campos requeridos");
         // }else{
            editarPlaneacion();
			seleccionado = false;
         // }
    });
	

      //cuando se le da clic al boton de volver en listarPlaneacion
  $("#volverListar").click(function(){
        window.location.href = "docente.html";
    });

 
      //cuando se le da clic al boton de volver en planeacion (nueva)
  $("#volver").click(function(){
        window.location.href = "listarPlaneacion.html";
    }); 
	
	      //cuando se le da clic al boton de volver en planeacion (nueva)
  $("#cerrarEditar").click(function(){ 
       $("#divListar").css("display","block");
	   $("#divEditar").css("display","none");
	   $("#divBoton").css("display","none"); 
	  seleccionado = false;
	  tablaPaneacion.$('tr.selected').removeClass('selected');
	   
    });

    /*Captura los datos del formulario y los envia al controlador fachada.php
  y este a la clase clsPlaneacion método EditarPlaneacion  
*/
function editarPlaneacion(){
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	//array de listaRecursos
	var listaRecursos = new Array();
	var listaRecursosId = new Array();
		 cont=0;
		 var estado="";
			
			
		// $("input[name=recurso]").each(function(){
		 // $("input[name=recurso][type!=hidden]:visible").each(function(){
	        $("input[name=recurso][type!=hidden]").each(function(){
				
			
		
			id = $(this).attr("id");
			// cont = id.substr(7, 8);
			res = id.substr(0, 7);
			
			//alert(cont);
			listaRecursos[cont] = {};
			
			if(cont % 2 == 0){
				listaRecursos[cont]['cantidad']=$(this).val();
			}
			else{
				listaRecursos[cont-1]['recursos']=$(this).val();
				
			}
			
			
			cont++;
	});  
	
	 $("input[name=recurso][type=hidden]").each(function(){
			
			id = $(this).attr("id");
			contId = id.substr(8, 9);
			// res = id.substr(0, 7);
			
			// alert(contId);
			listaRecursosId[contId] = {};
			listaRecursosId[contId]['id']=$(this).val();
			
			//preguntar si esa caja de texto tiene el atributo eliminar
		if ($( this ).attr("eliminar") != undefined){
			eliminar =2;
		}
		else{
			eliminar =1;
		}
		
			listaRecursosId[contId]['eliminar']=eliminar;
			//listaRecursos[contId]['eliminar']=eliminar;
			
	});  
	// alert(listaRecursosId[1]['id']);
	// var listaRecursos = new Array();
		// listaRecursos[0] = {};
		// listaRecursos[0]['id'] = $("#txtHidId1").val();
		// listaRecursos[0]['cantidad'] = $("#txtCant1").val();
		// listaRecursos[0]['recursos'] = $("#txtDesc1").val();
		// listaRecursos[1] = {};
		// listaRecursos[1]['id'] = $("#txtHidId2").val();
		// listaRecursos[1]['cantidad'] = $("#txtCant2").val();
		// listaRecursos[1]['recursos'] = $("#txtDesc2").val();
		// listaRecursos[2] = {};
		// listaRecursos[2]['id'] = $("#txtHidId3").val();
		// listaRecursos[2]['cantidad'] = $("#txtCant3").val();
		// listaRecursos[2]['recursos'] = $("#txtDesc3").val();
	
    $.post("../../controlador/fachada.php", {
        clase: 'clsPlaneacion',
        oper: 'editarPlaneacion',
        sesionPla: $("#txtSesion").val(),
        fecha: $("#txtFecha").val(),
        unidTema: $("#txtUnidadTematica").val(),
        estrDesa: $("#txtEstrategiasDesarrollar").val(),
        tecn: $("#txtTecnicaInstrumento").val(),
        segu: $("#txtSeguimiento").val(),
        reci: $("#txtRecibido").val(),
        obse: $("#txtObservaciones").val(),
		listaRecursos: listaRecursos,
		listaRecursosId: listaRecursosId,
        idPreprogramacion: sessionStorage.IdPreprogramacion,
        idPlaneacion: $("#txtIdPlaneacion").val()	
    }, function(data) {
        if (data !== 1) {
            if(data !== null){ 
				jsRemoveWindowLoad();
                popUpConfirmacion("Se ha actualizado exitosamente la Planeación");
				tablaPaneacion.$('tr.selected').removeClass('selected');
                // setTimeout(function(){//se llama otra vez a la lista de planeacion
                // $("#divEditar").css("display","none");
                // $("#divBoton").css("display","none");
                // $("#divListar").css("display","block");},4000);
				setTimeout( function(){window.location.href = "listarPlaneacion.html";},3000);
				
				
            }else{mostrarPopUpError(data.mensaje);}             
        }else {mostrarPopUpError("Se ha presentado un error");}
    }, "json");
}


 /*Trae la informacion del detalle de una planeacion seleccionada
*/
 function cargarDetallePlaneacion(){ 

	// idPreprogramacion: sessionStorage.IdPreprogramacion,
    // idPlaneacion:sessionStorage.IdPlaneacion
	
    $.post("../../controlador/fachada.php", {
            clase: 'clsPlaneacion',
            oper: 'cargarDetallePlaneacion',
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
					$("#divBoton").css("display","block");
					
					
					
					
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


    /*Funcion que elimina la planeacion seleccionada*/
function eliminarPlaneacion(){
    $.post("../../controlador/fachada.php", {
        clase: 'clsPlaneacion',
        oper: 'eliminarPlaneacion',
        idPreprogramacion: sessionStorage.IdPreprogramacion,
        idPlaneacion: sessionStorage.IdPlaneacion
   }, function(data) {
        if (data !== 1) {
            if(data !== null){ 
                popUpConfirmacion1("Se ha eliminado exitosamente la Planeación");
                setTimeout(function(){
				//se llama otra vez a la lista de planeacion
                window.location.href = "listarPlaneacion.html";},3000);
				
            }else{alert(data.mensaje);}             
        }else {mostrarPopUpError("Se ha presentado un error");}
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

//capturar los recursos y guardarlos en un array
  function caprutarRecursos(){

    var lista = new Array();
    $("input[name=recurso]").each(function(){
   // $("input").each(function(){
    
       
    });
        return lista;
    }
	
	function recuperarDatos() { 
        // $("#nombreServicio").html(sessionStorage.Curso + " - " + sessionStorage.Modulo);
        // $("#inscritos").html(sessionStorage.Inscritos);
        // $("#horario").html(sessionStorage.Horario);
        // $("#fechaInicial").html(sessionStorage.FechaInicial);
        // $("#lugar").html(sessionStorage.Sede + " - " + sessionStorage.Salon);
        // $("#codigo").html(sessionStorage.IdCurso + " - " + sessionStorage.IdModulo);
        // $("#fechaFinal").html(sessionStorage.FechaFinal);
        // $("#duracion").html(sessionStorage.Duracion);
        // $("#docente").html(sessionStorage.Docente);
		$("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria );
        $("#fechaInicial").html(sessionStorage.FechaInicial);
        $("#lugar").html(sessionStorage.Sede + " - " + sessionStorage.Salon);
        $("#codigo").html(sessionStorage.IdCurso + " - " + sessionStorage.IdModulo);
        $("#fechaFinal").html(sessionStorage.FechaFinal);
        $("#duracion").html(sessionStorage.Duracion);
		$("#txtSalon").html(sessionStorage.Salon);
        $("#txtSede").html(sessionStorage.Sede); 
		$("#txtDocente").html(sessionStorage.Docente);
		$("#txtRuta").html(sessionStorage.Ruta);
		$("#txtNoSessiones").html(sessionStorage.NoSession);
		
		
	}
	
	function adicionarRecursoEditar(){
		var id="";
		var res="";
        
        //extraer el ultimo id fila
		$("input[name=recurso]").each(function(){
			id = $(this).attr("id");
			
    });  
		res = id.substr(7, 8);
		
		
	// alert(res);
		
		$.post("../../controlador/fachada.php", {
        clase: 'clsPlaneacion',
        oper: 'adicionarFilaRecurso',
		res: res
        
		}, function(data) {
			 if (data !== null) {
			   
				  $("#div_adicionados").css("display", "");
					  
				  var dvAux = document.createElement( "table" );
				  dvAux.innerHTML = data.html;
				  
				  //para las cajas de texto con la clase number solo se permite ingresar numeros
						$( ".number", dvAux ).keydown(function (e) {
						   
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
				  
				  $("#div_adicionados").append( dvAux.childNodes[0] );
				  //boton adicionado desde el editar
				  $("button[id^=btnEliminar]").click(function(){ var id = $(this).attr("id"); eliminarRecursoEditar(id); })
					  
			 }else {mostrarPopUpError("Se ha presentado un error");}
		}, "json");
    }
	
	function eliminarRecursoEditar(id){ //alert(id);
		
		//alert(id);
		$( "#"+id ).parent().parent().hide();
		//extraer el ultimo caracter
		var con= id.substr(11); //alert(con);
		//se agrega atributo para saber si ese campo es para eliminar
		$("#txtHidId"+con).attr("eliminar",2);
		
		//$( "btnEliminar"+cont ).parent().parent().hide();
		//$( "button[id^=btnEliminar]" ).parent().hide();
		//$( "input[id^=txtCant]" ).parent().hide();
		//$( "input[id^=txtDesc]" ).parent().hide();
		
		//$( "button[id^=btnEliminar]" ).parent().css('display','none');
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


  

}); //cerrar