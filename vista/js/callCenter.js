$(function(){
	var dataSetGestionados = [];
	var dataSetNoGestionados = [];
	var dataSetTodos = [];
	var dataTipificaciones;
	var cargasGestionadas={};
	var cargasGestionadasObservaciones={};
	var tabla;
	
	//inicializarTabla();
	cargarTipificacion();    
	cargarGestionados();
	cargarJornadas();

	inicializar();
	
	function inicializar(){
		$("#jornadas").change(function(){
	        	consultarCargaJornada($(this).val());
   		});

   		$("#Regresar").click(function(){ 
				window.location = "callCenter.html";
		});
	}



	//Evento que guardar registro//
	$(document).on('click', '#guardarGestion', function() {
		var data = tabla.row($(this).parents('tr')).data();
		idCarga=data[0];
		IdAsistenciaDetalle= data[10];
			$("[data-idcarga^="+idCarga+"]").each(function(e){
			 	var tip1= $(this).val();
			 	sessionStorage.tipifi=tip1;
			 	if(tip1<0){
			 		mostrarPopUpError("El campo tipificación debe tener algun valor");
			 		tip1=0;
			 	}else{			 	
			 		$("[name^="+idCarga+"]").each(function(e){
					 	var obs1= $(this).val();
					 	sessionStorage.observa= obs1;
					 	if(obs1==""){
					 		mostrarPopUpError("El campo observacion debe tener algun valor");
					 		obs1=0;
					 	}else{
					 		var mensaje="Guardando la informaci&oacute;n<br>Espere por favor";
								jsShowWindowLoad(mensaje);
								$.post("../../controlador/fachada.php", {
									clase: 'clsCarga',
									oper: 'AgregarGestion',
									IdCarga: idCarga,
									IdTipificacion:sessionStorage.tipifi,
									Observaciones:sessionStorage.observa
								}, function(data) {
									if (data !== 0) {
										cargasGestionadas= {};
										popUpConfirmacion("Guardado Satisfactoriamente");
										sessionStorage.jornada=$('#jornadas').find(":selected").val();
										sessionStorage.tipo=$('#tipo').find(":selected").val();
										jsRemoveWindowLoad();
									}else {
										console.log('error gestión Carga');
							}}, "json");
					 	}
					 });
			 	}
			 });
		
	});


	function cargarTipificacion() {
		$.post("../../controlador/fachada.php", {
			clase: 'clsCarga',
			oper: 'cargarTipificacion'
		}, function(data) {
			if (data !== 0) {
				dataTipificaciones = data;       
			}else {
				console.log('error cargando tipificaciones');
			}
		}, "json");
	}

	function cargarGestionados(){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCarga',
			oper: 'cargarTipificacion'
		}, function(data) {
			if (data !== 0) {
				dataTipificaciones = data;       
			}else {
				console.log('error cargando tipificaciones');
			}
		}, "json");



		agregarOptionSelect("#tipo", '3', 'Todos');
		agregarOptionSelect("#tipo", '2', 'No Gestionados');
		agregarOptionSelect("#tipo", '1', 'Gestionados');
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
					agregarOptionSelect("#jornadas", data[i].Id,data[i].Observaciones);
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

	function consultarCargaJornada(idJornada){
		dataSetGestionados = [];
		dataSetNoGestionados = [];
		dataSetTodos = [];
		var mensaje="Procesando la informaci&oacute;n<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCarga',
			oper: 'ConsultarCargaPorIdJornada',
			IdJornada:idJornada
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					if (typeof dataTipificaciones !== "undefined") {
                    for (var i = 0; i < data.length; i++) {
                        var array = [];
                        
                        var IdCarga=data[i][0];
                        array.push(data[i][0]);
                        array.push(data[i][1]);
                        array.push(data[i][2]);
                        array.push(data[i][3]); 
                        array.push(data[i][4]); 
                        array.push(data[i][5]);
                        array.push(data[i][6]);  
                        array.push(data[i][7]);
                        array.push(data[i][8]);     
                        var gestionado = data[i][9];
                        array.push(data[i][9]); 
						var htmlSelect ="<select data-idCarga='"+IdCarga+"'  class='tipificacion'>";
							htmlSelect += "<option value='-1'>No gestionado </option>";
							for (var j = 0; j < dataTipificaciones.length; j++) {
								if (gestionado !== "No") {
									if (dataTipificaciones[j].Id === gestionado) {
										htmlSelect += "<option selected value='"+dataTipificaciones[j].Id+"'>"+dataTipificaciones[j].Nombre+"</option>";
									}else{
										htmlSelect += "<option value='"+dataTipificaciones[j].Id+"'>"+dataTipificaciones[j].Nombre+"</option>";
									}
								}else{
									htmlSelect += "<option value='"+dataTipificaciones[j].Id+"'>"+dataTipificaciones[j].Nombre+"</option>";
								}
							}
							htmlSelect +="</select>";
						array.push(htmlSelect);
                        array.push("<textarea class='observaciones' name='"+IdCarga+"'></textarea>");

                        if(gestionado === 'No'){
						
							dataSetNoGestionados.push(array);
						}else{
							dataSetGestionados.push(array);
						}
							dataSetTodos.push(array);
                    }
					}else{
						alert("Error - No hay tipificaciones");
					}
					 llenarTabla($('#tipo').find(":selected").val());
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
			//tabla.rows.add(dataSetGestionados).draw();
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
            $('#tablaCargas').empty();
        }
        tabla = $('#tablaCargas').DataTable({
        	"data": data,
			columns: [
			{ title: "Id" },
			{ title: "IdTercero" },
			{ title: "Identificación" },
			{ title: "Nombres" },
			{ title: "Telefono1"},
			{ title: "Telefono2"},
			{ title: "Telefono3"},
			{ title: "Correo" },
			{ title: "Curso" },
			{ title: "Gestionado" },
			{ title: "Gestión" },
			{ title: "Observaciones" },
			{data: null, className: "center", defaultContent: '<input type="button" class="boton" id="guardarGestion" value="Guardar Gestión"/>'}
			],
			"paging":   false,
			"info":     false,
			"order": [[ 3, "desc" ]],
			"scrollY": "300px",
			"scrollX": true,
			"scrollCollapse": true,
			"pageLength": 8,
			"bLengthChange": false,
			"bDestroy": true,
			"columnDefs": [
			{"targets": [ 0 ],"visible": false,"searchable": false},
			{"targets": [ 1 ],"visible": false,"searchable": false},
			{"targets": [ 9 ],"visible": false,"searchable": false} ],
			"language": {
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}});     
    }

	function triggerSelects(){
		$(".tipificacion").change(function() {
			var cargaId= $(this).attr("data-idCarga");
			var valor = $(this).val();
			if (valor !== "-1") {
				cargasGestionadas[cargaId] = $(this).val();
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


	$("#descargarReporte").click(function(){
				var mensaje="Procesando la información<br>Espere por favor";
				jsShowWindowLoad(mensaje);
				var IdJornada=$("#jornadas").val();
			   	$.post("../../controlador/fachada.php", {
					clase: 'clsCarga',
					oper: 'ReporteCallcenterGestionados',
					IdJornada:IdJornada
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
		});



	$("#guardarGestion").click(function(){
		for (var idCarga in cargasGestionadas){
			if(cargasGestionadasObservaciones[idCarga] === undefined){
				mostrarPopUpError("Algunos observaciones estan vacias favor verificar");
			}else{
				var mensaje="Guardando la informaci&oacute;n<br>Espere por favor";
				jsShowWindowLoad(mensaje);
				$.post("../../controlador/fachada.php", {
					clase: 'clsCarga',
					oper: 'AgregarGestion',
					IdCarga: idCarga,
					IdTipificacion:cargasGestionadas[idCarga],
					Observaciones:cargasGestionadasObservaciones[idCarga]
				}, function(data) {
					if (data !== 0) {
						cargasGestionadas= {};
						popUpConfirmacion("Guardado Satisfactoriamente");
						sessionStorage.jornada=$('#jornadas').find(":selected").val();
						sessionStorage.tipo=$('#tipo').find(":selected").val();
						jsRemoveWindowLoad();
					}else {
						console.log('error tipo servicio');
					}}, "json");
			}
		}
		
	});

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