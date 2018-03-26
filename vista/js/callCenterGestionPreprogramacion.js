$(function(){


	var dataSetGestionados = [];
	var dataSetNoGestionados = [];
	var dataSetTodos = [];
	var cargasGestionadas={};
	var cargasGestionadasObservaciones={};
	var tabla;
	var dataTipificaciones="";
	callCenterPreprogramacion = new Array(); 
	
	//inicializarTabla();
	
	cargarTipificacion();    
	cargarGestionados();
	consultarCargaJornada();

	inicializar();
	
	function inicializar(){
		$("#Regresar").click(function(){
			window.location = "callCenterPreprogramacion.html";
		});
		$("#guardarGestionPreprogramacion").click(function(){	
			/*for (var idTercero in cargasGestionadas){
				if(cargasGestionadasObservaciones[idTercero] === undefined){
					mostrarPopUpError("Algunos observaciones estan vacias favor verificar");
			}else{
				var mensaje="Guardando la informaci&oacute;n<br>Espere por favor";
				jsShowWindowLoad(mensaje);
				console.log("aqui4");
				$.post("../../controlador/fachada.php", {
					clase: 'clsProgramacion',
					oper: 'AgregarGestionPreprogramacion',
					IdTercero: idTercero,
					IdPreprogramacion: sessionStorage.IdPreprogramacion,
					IdTipificacion:cargasGestionadas[idTercero],
					Observaciones:cargasGestionadasObservaciones[idTercero]
				}, function(data) {
					console.log("data"+data);
					if (data !== 0) {
						cargasGestionadas= {};
						popUpConfirmacion("Guardado Satisfactoriamente");
						jsRemoveWindowLoad();
					}else {
						console.log('error gestión Preprogramación');
					}}, "json");
			}
		}*/
		
	});

  		$("#codPreprogramacion").text(sessionStorage.Salon);
	}

		//Evento que guardar registro//
	$(document).on('click', '#guardarGestion', function() {
		var data = tabla.row($(this).parents('tr')).data();
		idTercero=data[1];
		RegistroNo=data[0];
		NoSesion=data[8];
		IdAsistenciaDetalle=0;
		
		if(NoSesion!="NA"){
			NoSesion=data[8];
			IdAsistenciaDetalle= data[11];
		}else{
			NoSesion=0;
			IdAsistenciaDetalle= 0;
		}
			console.log(idTercero);
			registrosel="#sel"+RegistroNo;
			registrotxt="#text"+RegistroNo;
			var selTipificacion =$(""+registrosel+"").val();
			var gestObservaciones =$(""+registrotxt+"").val();
			console.log(gestObservaciones);

			if((selTipificacion>0) && (gestObservaciones!="")){
				var mensaje="Guardando la informaci&oacute;n<br>Espere por favor";
					jsShowWindowLoad(mensaje);
					$.post("../../controlador/fachada.php", {
					clase: 'clsProgramacion',
					oper: 'AgregarGestionPreprogramacion',
					IdTercero: idTercero,
					IdPreprogramacion: sessionStorage.IdPreprogramacion,
					IdTipificacion:selTipificacion,
					Observaciones:gestObservaciones,
					NoSesion: NoSesion,
					IdAsistenciaDetalle: IdAsistenciaDetalle
				}, function(data) {
					if (data !== 0) {
						popUpConfirmacion("Guardado Satisfactoriamente");
						jsRemoveWindowLoad();
				}else {
						console.log('error gestión Preprogramación');
				}}, "json");

			}else{
				mostrarPopUpError("El campo gestión y observaciones deben tener datos");
			}
			

	});

	function cargarTipificacion() {
		$.post("../../controlador/fachada.php", {
			clase: 'clsCarga',
			oper: 'CargarTipificacion'
		}, function(data) {
			if (data !== 0) {
				dataTipificaciones = data;      
			}else {
				console.log('error cargando tipificaciones');
			}
		}, "json");
	}


	function cargarGestionados(){
		//agregarOptionSelect("#tipo", '3', 'Todos');
		agregarOptionSelect("#tipo", '3', 'No Gestionados');
		//agregarOptionSelect("#tipo", '1', 'Gestionados');
	}

	function agregarOptionSelect(atributo, valor, texto) {
		$(atributo).append($('<option>', {
			value: valor,
			text: texto
		}));
	}

	function cargarJornadas() {
		$.post("../../controlador/fachada.php", {
			clase: 'clsCarga',
			oper: 'CargarJornadasConvocatorias'
		}, function(data) {
			if (data !== 0) {
				$('#jornadas').find('option').remove();
				for (i = 0; i < data.length; i++) {
					agregarOptionSelect("#jornadas", data[i].Id,data[i].Descripcion);
				}
				if (typeof sessionStorage.jornada !== "undefined") {
					$('#jornadas').val(sessionStorage.jornada+"");
				}
				if (typeof sessionStorage.tipo !== "undefined") {
					$('#tipo').val(sessionStorage.tipo+"");
				}
				consultarCargaJornada($('#jornadas').find(":selected").val());
			}else {
				console.log('error tipo servicio');
			}}, "json");
	}

	/*$("#jornadas").on('change',function(){
		consultarCargaJornada($(this).val());
	});*/

	function consultarCargaJornada(){
		dataSetGestionados = [];
		dataSetNoGestionados = [];
		dataSetTodos = [];

		var mensaje="Procesando la informaci&oacute;n<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsAsistencia',
			oper: 'SPCONSULTARESTUDIANTESCONASISTENCIA0',
			pIdPreprogramacion:sessionStorage.IdPreprogramacion,
			pFechaInicial: sessionStorage.pFechaInicial,
			pFechaFinal:   sessionStorage.pFechaFinal
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
				
					if (typeof dataTipificaciones !== "undefined") {
                    for (var i = 0; i < data.length; i++) {
                        var array = [];

						var RegistroNo=data[i][0];                 
                        var IdTercero=data[i][1];
                        array.push(data[i][0]);
                        array.push(data[i][1]);
                        array.push(data[i][2]);
                        array.push(data[i][3]);
                        array.push(data[i][4]); 
                        array.push(data[i][5]);
                        array.push(data[i][6]);
                        array.push(data[i][7]); 
                        var numeroSesion=data[i][9];
                        array.push(data[i][8]); 
                        array.push(data[i][9]); 
                        array.push(data[i][10]); 
                        var IdAsistenciaDetalle=data[i][12];
                        array.push(data[i][11]); 
                        array.push(data[i][12]); 
                        var idSelect="sel"+RegistroNo;
						var htmlSelect ="<select id='"+idSelect+"' data-idTercero='"+IdTercero+"_"+RegistroNo+"' data-noSesion='"+numeroSesion+"' class='tipificacion' >";
							htmlSelect += "<option value='-1'>No gestionado </option>";
							var totalTipificacion=dataTipificaciones.length;
							for (var j = 0; j < totalTipificacion; j++) {								
									htmlSelect += "<option value='"+dataTipificaciones[j].Id+"'>"+dataTipificaciones[j].Nombre+"</option>";
							}
						htmlSelect +="</select>";
						array.push(htmlSelect);
						var idText="text"+RegistroNo;
                        array.push("<textarea id='"+idText+"' class='observaciones' name='"+IdTercero+"_"+RegistroNo+"'></textarea>");
                      
						dataSetTodos.push(array);
						
                    }
					}else{
						alert("Error - No hay tipificaciones");
					}
					 cargarInformacionEnTabla(dataSetTodos);
				}else{console.log("error 1");}             
			}else {console.log("error 2");}
			jsRemoveWindowLoad();	
		}, "json"); 
	}


	$("#tipo").on('change',function(){
		llenarTabla($(this).val());
	});



	function llenarTabla(tipo){
		//tabla.clear().draw();
		switch(tipo){
			case '1':
			tabla.rows.add(dataSetGestionados).draw();
			cargarInformacionEnTabla(dataSetGestionados);
			break;
			case '2':
			//tabla.rows.add(dataSetNoGestionados).draw();
			cargarInformacionEnTabla(dataSetNoGestionados);
			break;
			case '3':
			//tabla.rows.add(dataSetTodos).draw();
			cargarInformacionEnTabla(dataSetTodos);
			break;
		}
		triggerSelects();
	}


	function cargarInformacionEnTabla(data){ //alert(data);
		if(typeof tabla !== "undefined"){
            tabla.destroy();
            $('#tablaGestionPreprogramacion').empty();
        }
        tabla = $('#tablaGestionPreprogramacion').DataTable({
        	"data": data,
			columns: [
			{ title: "RegistroNo" },
			{ title: "IdTercero" },
			{ title: "IdMatricula" },
			{ title: "Identificación" },
			{ title: "Nombres" },
			{ title: "Telefono1" },
			{ title: "Telefono2" },
			{ title: "Telefono3" },
			{ title: "Email" },
			{ title: "No Sesión" },
			{ title: "Fecha Sesión" },
			{ title: "Asistencia" },
			{ title: "IdAsistenciaDetalle" },
			{ title: "Gestión" },
			{ title: "Observaciones" },
			{data: null, className: "center", defaultContent: '<input type="button" class="boton" id="guardarGestion" value="Guardar Gestión"/>'}
			],
			"paging":   false,
			"info":     false,
			"order":  false,
			"scrollY": "300px",
			"scrollX": true,
			"scrollCollapse": true,
			"pageLength": 8,
			"bLengthChange": false,
			"bDestroy": true,
			"columnDefs": [
			{"targets": [ 0 ],"visible": false,"searchable": false}, 
			{"targets": [ 1 ],"visible": false,"searchable": false}, 
			{"targets": [ 11 ],"visible": false,"searchable": false},
			],
			"language": {
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}});     



        $(".tipificacion").change(function() {
			var cargaTercero= $(this).attr("data-idtercero");
			var valor = $(this).val();
			
			if (valor !== "-1") {
				cargasGestionadas[cargaTercero] = $(this).val();
			}
		});

		$(".observaciones").change(function() {
			var observacionesId= $(this).attr("name");
			var valor=$(this).val();
			if (valor != "") {
				cargasGestionadasObservaciones[observacionesId]=$(this).val();
			}	

		});
    }



	//Evento que elimina pantalla de popup//
	 function jsRemoveWindowLoad() {
	    // eliminamos el div que bloquea pantalla
	    $("#WindowLoad").remove();
 
	}

	function popUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
    	onClose: function() {
             location.reload(true);  
            },
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

 	//Evento que muestra popup//
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