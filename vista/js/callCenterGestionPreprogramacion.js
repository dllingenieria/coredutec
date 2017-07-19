$(function(){
	var dataSetGestionados = [];
	var dataSetNoGestionados = [];
	var dataSetTodos = [];
	var cargasGestionadas={};
	var cargasGestionadasObservaciones={};
	var tabla;
	var dataTipificaciones="";
	
	//inicializarTabla();
	
	cargarTipificacion();    
	cargarGestionados();
	consultarCargaJornada();

	inicializar();
	
	function inicializar(){

		$("#guardarGestionPreprogramacion").click(function(){
			
		for (var idTercero in cargasGestionadas){
			if(cargasGestionadasObservaciones[idTercero] === undefined){
				mostrarPopUpError("Algunos observaciones estan vacias favor verificar");
			}else{
				var mensaje="Guardando la informaci&oacute;n<br>Espere por favor";
				jsShowWindowLoad(mensaje);
				$.post("../../controlador/fachada.php", {
					clase: 'clsProgramacion',
					oper: 'AgregarGestionPreprogramacion',
					IdTercero: idTercero,
					IdPreprogramacion: sessionStorage.IdPreprogramacion,
					IdTipificacion:cargasGestionadas[idTercero],
					Observaciones:cargasGestionadasObservaciones[idTercero]
				}, function(data) {
					if (data !== 0) {
						cargasGestionadas= {};
						popUpConfirmacion("Guardado Satisfactoriamente");
						jsRemoveWindowLoad();
					}else {
						console.log('error gestión Preprogramación');
					}}, "json");
			}
		}
		
	});

  		$("#codPreprogramacion").text(sessionStorage.Salon);
	}


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
                 
                        var IdTercero=data[i][0];
                        array.push(data[i][0]);
                        array.push(data[i][1]);
                        array.push(data[i][2]);
                        array.push(data[i][3]); 
                        array.push(data[i][4]); 
                        var gestionado = data[i][6];
                        array.push(""); 
						var htmlSelect ="<select data-idTercero='"+IdTercero+"'  class='tipificacion' >";
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
                        array.push("<textarea class='observaciones' name='"+IdTercero+"'></textarea>");
                      
						dataSetTodos.push(array);
						
                    }
					}else{
						alert("Error - No hay tipificaciones");
					}
					 cargarInformacionEnTabla(dataSetTodos);
					 llenarGestion();
				}else{console.log("error 1");}             
			}else {console.log("error 2");}
			jsRemoveWindowLoad();	
		}, "json"); 




	}


	function llenarGestion(){ 
		$.post("../../controlador/fachada.php", {
			clase: 'clsProgramacion',
			oper: 'consultarGestionPreprogramacion',
			IdPreprogramacion: sessionStorage.IdPreprogramacion
		}, function(data) {

			 if(data !== null){
				
				//se recorre data con todos los valores
				 for (var i = 0; i < data.length; i++) {
					 
					//recorre los todos los textarea
					$("[class^=tipificacion]").each(function(e){
						idTextA= $( this ).attr( "name" );
						
						var idTerceroTextA = res[1];
						
						//se valida que ese textarea tenga ese tercero para poner el valor
						if(idTerceroTextA == data[i].IdTercero){
							$( this ).val( data[i].Observacion );
							
						}
					});


					$("[class^=tipificacion]").each(function(e){
						idSelM= $( this ).attr( "data-idtercero" );
						
					
						var idTerceroSelM = res[1];
						
						//se valida que ese select tenga ese tercero para poner el valor
						if(idTerceroSelM == data[i].IdTercero){  
							// $( this ).val( data[i].Motivo );
							
							$("#"+idSelM+" option[value="+ data[i].Motivo +"]").attr("selected",true);
							//$(  this ).val( data[i].Motivo ) tambien funciona
						}
					});
				 }
            }



			console.log("data"+data);
		
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
			{ title: "IdTercero" },
			{ title: "Identificación" },
			{ title: "Nombres" },
			{ title: "Telefono" },
			{ title: "Email" },
			{ title: "Gestionado" },
			{ title: "Gestión" },
			{ title: "Observaciones" }
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
			{"targets": [ 5 ],"visible": false,"searchable": false} ],
			"language": {
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}});     



        $(".tipificacion").change(function() {
			console.log("gola");
			var cargaTercero= $(this).attr("data-idtercero");
			var valor = $(this).val();
			
			if (valor !== "-1") {
				cargasGestionadas[cargaTercero] = $(this).val();
			}
		});

		$(".observaciones").change(function() {
				console.log("golao");
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