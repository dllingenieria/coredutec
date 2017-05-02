$(function(){
	inicializar();
	solicitarReporte=0;
	nombreArchivo = "";
	necesitaFecha=0;
	var tabla;
	var f = new Date();
	var fecha = f.getFullYear() + "-"+ ("0" + (f.getMonth() + 1)).slice(-2) + "-"+ f.getDate();
	$('#fecha_matriculados').val(fecha);
	$.extend( true, $.fn.dataTable.defaults, {
		"order": [[ 0, "asc" ]],
		"paging":   false,
		"info":     false,
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

    
	///////////////////////

    $('#descargar').on('click',function(){
            var reporte = $('#reporteexcel').val();

            switch (reporte) {
            	case 'matriculados':
            	swal({title:"", text:"Exportando a Excel", imageUrl: "../images/carga.gif", showConfirmButton:false,      allowOutsideClick:false});
					$.ajax({
		                url : '../../modelo/exportarReportes.php',
		                type : 'POST',
		                dataType: 'json',
		                data: {
		                    rep : reporte,
		                    fecha_inicio : $('#fecha_matriculados').val()
                		}
		            }).done(function(data){
		            	setTimeout(function(){swal.close();}, 1000);
		            	
		               window.open('http://localhost/cet/modelo/'+data['nombrearchivo']);
		            });
		            break;

		        case 'convocados':
		        	var datos = new Array();
            		tabla.rows().eq(0).each(function (index) {
	                var row = tabla.row(index);
	                var data = row.data();
	                datos.push(data);
                	});
            		swal({title:"", text:"Exportando a Excel", imageUrl: "../images/carga.gif", showConfirmButton:false,      allowOutsideClick:false});
		            $.ajax({
		                url : '../../modelo/exportarReportes.php',
		                type : 'POST',
		                dataType: 'json',
		                data: {
		                    rep : reporte,
		                    datos : datos
		                    
		                }
		            }).done(function(data){
		            	setTimeout(function(){swal.close();}, 1000);
		               window.open('http://localhost/cet/modelo/'+data['nombrearchivo']);
		            });
            	break;
            	
            	default:
            	break;
            }
		})
	


	// Funciones que sólo se ejecutan 1 vez
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
		ocultarElementos();
		cargarJornadas();
		$("#reportes").change(seleccionarReporte);
		$("#txtFechaInicial").datepicker();
		$("#txtFechaFinal").datepicker();
	}


	// Oculta todos los elementos innecesarios en la interfaz
	function ocultarElementos(){
		var elementos = ['#spanFechaFinal','#spanFechaInicial','#spanTotal','#spanSalones','#contenedorTabla', '#spanJornadas', '#spanFecha', '#verDetalle', '#verConsolidado', '#contenedorDiagrama',
		'#spanMatriculados'];
		for (var i = 0; i < elementos.length; i++) {
			$(elementos[i]).hide();
		}

		$('#verDetalle').hide();
		$('#verConsolidado').hide();
		$('#imprimir').hide();
		$('#descargar').hide();
		$('#txtFechaInicial').hide();
		$('#txtFechaFinal').hide();
	}

	//Oculta todos los componenetes adicionales cada vez que seleccione un reporte
	//Remueve el elemento "Seleccionar reporte"
	//Utiliza un mapa para filtrar la función necesaria
	function seleccionarReporte(element){
		ocultarElementos();
		$("#reportes option[value='0']").remove();
		var reporte = parseInt(element.target.value);
		var funciones = {1:reporte1, 2:reporte2, 3:reporte3, 4:reporte4, 5:reporte5, 7:reporte7, 8:reporte8, 9:reporte9,10:reporte10};
		funciones[reporte]();
	}

	// ############ REPORTE 1 ############

	//Muestra los componenetes necesario para el reporte #1. Además verifica si ya
	//había una fecha seleccionada y muestra la información correpondiente
	function reporte1(){
		$("#spanJornadas").show();
                $('#reporteexcel').val('convocados');
		$("#jornadas").change(cargarReporte1);
		var jornada = $('#jornadas').val();
		if (jornada) {
			cargarReporte1("",jornada);
		}
	}

	//Muestra un alert cargando. Verifica si viene el valor de la fecha por parámetro, 
	//de lo contrario lo extrae del elemento. Realiza la consulta a la BD por el reporte1
	function cargarReporte1(element, value){
		mostrarAlertCargando();
		var jornada = value || parseInt(element.target.value);
		var postData = {clase:'clsMatricula', oper:'consultarEstudiantesNoMatriculados', jornada:jornada};
		postAJAX(postData, formatearReporte1);
	}

	//Organiza la información traída de la base de datos para mostrar en la tabla
	//Especialmente para el reporte 1
	function formatearReporte1(informacion){
		var informacionFormateada = formatearInformacion(informacion);
		informacionFormateada.columnas[3].title="Identificación";
		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		definicionColumnas.unshift({"className": "dt-center resaltar", "targets": [4,5,6]});
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [0]});
		generarTabla(informacionFormateada, definicionColumnas);
	}

	// ############ REPORTE 2 ############

	//Muestra los componenetes necesario para el reporte #1. Además verifica si ya
	//había una fecha seleccionada y muestra la información correpondiente	
	function reporte2(){
		cargarReporte2();
	}

	//Muestra un alert cargando. Realiza la consulta a la BD por el reporte1
	function cargarReporte2(){
		mostrarAlertCargando();
		var postData = {clase:'clsProgramacion', oper:'consultarPreprogramacionDesdeFecha'};
		postAJAX(postData, formatearReporte2);
	}

	//Organiza la información traída de la base de datos para mostrar en la tabla
	//Especialmente para el reporte 2
	function formatearReporte2(informacion){
		var nombresColumnas = {0:"Código Curso", 1:"Curso", 3:"Código Módulo", 4:"Módulo", 5:"Docente", 6:"Fecha Inicio", 7:"Sede"};
		informacion = formatearInformacion(informacion);
		informacion = reemplazarColumnas(nombresColumnas, informacion);

		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		definicionColumnas.unshift({"className": "dt-center resaltar", "targets": [0,3]});
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [2]});

		generarTabla(informacion, definicionColumnas, true);
	}

	//Muestra un alert cargando. Realiza la consulta a la BD por el reporte #2 detalle
	function cargarDetalleReporte2(fila){
		mostrarAlertCargando();
		var codigoModulo = fila[3];
		var postData = {clase:'clsModulo', oper:'consultarEstudiantesPorModulo', codigoModulo:codigoModulo};
		postAJAX(postData, formatearDetalleReporte2);
	}

	//Organiza la información traída de la base de datos para mostrar en la tabla
	//Especialmente para el detalle del reporte 2
	function formatearDetalleReporte2(informacion){
		informacion = formatearInformacion(informacion);
		var nombresColumnas = {3:"Identificación"};
		informacion = reemplazarColumnas(nombresColumnas, informacion);

		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [0]});
		generarTabla(informacion, definicionColumnas, false);
	}

	// ############ REPORTE 3 ############

	function reporte3(){
		$('#spanFecha').show();
		$("#fecha").change(cargarReporte3);
		var fecha = $('#fecha').val();
		if (fecha) {
			cargarReporte3("",fecha);
		}
	}

	function cargarReporte3(element, value){
		mostrarAlertCargando();
		var fecha = value || element.target.value;
		var postData = {clase:'clsModulo', oper:'consultarModulosConInasistencias', fecha:fecha};
		postAJAX(postData, formatearReporte3);
	}

	//Organiza la información traída de la base de datos para mostrar en la tabla
	//Especialmente para el reporte 3
	function formatearReporte3(informacion){
		informacion = formatearInformacion(informacion);
		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		generarTabla(informacion, definicionColumnas, true);
	}

	//Muestra un alert cargando. Realiza la consulta a la BD por el reporte #3 detalle
	function cargarDetalleReporte3(fila){
		mostrarAlertCargando();
		var idModulo = fila[0];
		var fecha = $('#fecha').val();
		var postData = {clase:'clsModulo', oper:'consultarestudiantesInasistenciaModulo', idModulo:idModulo, fecha:fecha};
		postAJAX(postData, formatearDetalleReporte3);
	}

	//Organiza la información traída de la base de datos para mostrar en la tabla
	//Especialmente para el detalle del reporte 3
	function formatearDetalleReporte3(informacion){
		informacion = formatearInformacion(informacion);
		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		generarTabla(informacion, definicionColumnas, false);
	}
	
	// ############ REPORTE 4 ############

	function reporte4(){
		$("#spanJornadas").show();
		$("#contenedorTabla").hide();
		$("#jornadas").change(cargarReporte4);
		var jornada = $('#jornadas').val();
		if (jornada) {
			cargarReporte4("",jornada);
		}
	}

	function cargarReporte4(element, value){
		mostrarAlertCargando();
		var jornada = value || parseInt(element.target.value);
		$("#diagrama").remove();
		$("#contenedorDiagrama").show();
		$("#contenedorDiagrama").append("<canvas id='diagrama'></canvas>");
		var ctx = $("#diagrama");
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ["Asistencia", "No asistenca"],
					datasets: [{data: [parseInt(Math.random() * 800), parseInt(Math.random() * 800)], backgroundColor: ["#FF6384","#36A2EB"]}] //,"#FFCE56"
				}
			});
	}
	
	// ############ REPORTE 5 ############

	function reporte5(){
		
	}

	function reporte7(){
		$("#spanSalones").show();
		$("#buscarSalon").on('click',cargarReporte7);
	}

	function cargarReporte7(){
		var salon = $("#codigo_salon").val();

		$.ajax({
			url: '../../controlador/fachada.php',
			type: 'POST',
			dataType: 'json',
			data: {	clase:'clsParticipante', 
					oper:'consultarEstudiantesPorSalonDadoSalon',
					codigo_salon : salon
					},
		}).done(function(data) {
			if(data != null){
                            if(data == 0){
                                swal({   
					title: "No existe el salón",   
					text: "Código de salón no encontrado",   
					type: "error",   
					confirmButtonText: "Aceptar" });

				$('#codigo_salon').focus();
                            }else if(data == 1){
                                swal({   
					title: "No existen estudiantes matriculados en el salón",   
					text: "No existen estudiantes",   
					type: "error",   
					confirmButtonText: "Aceptar" });

				$('#codigo_salon').focus();
                            }else{
                                $('#spanTotal').show();
                                $('#numero_estudiantes').text(data.length);
                                formatearReporte7(data);	
                            }
                            
			}else{
				
			}
			

		});
		

	}

	function reporte8(){
		$('#reporteexcel').val('matriculados');
		$('#spanMatriculados').show();
		$("#buscarMatriculados").on('click',cargarReporte8);
	}

	function cargarReporte8(){
		var fechaInicio = $("#fecha_matriculados").val();

		$.ajax({
			url: '../../controlador/fachada.php',
			type: 'POST',
			dataType: 'json',
			data: {	clase:'clsMatricula', 
					oper:'consultarMatriculadosFecha',
					fecha_inicio : fechaInicio
					},
		}).done(function(data) {
			if(data != null){
                if(data == 0){
                    swal({   
						title: "No existen matriculados",   
						text: "No existen maticulados para el período indicado",   
						type: "error",   
						confirmButtonText: "Aceptar" });

				}else{
	                formatearReporte8(data);	
            	}
            }
		});
	}


	////////// Inicio Reporte 9 /////////////

	function reporte9(){
		$('#verDetalle').show();
		solicitarReporte=9;
	}

	function reporte10(){
		$("#spanFechaInicial").show();
		$('#txtFechaInicial').show();
		$('#verDetalle').show();
		necesitaFecha=1;
		solicitarReporte=10;
	}

	//////////Fin Reporte 9 /////////////////

	//////Click boton detalle ////////////
	$("#verDetalle").click(function(){ //alert("hola");
		//Se oculta el boton de descarga
		$('#descargar').hide();
		if(necesitaFecha==1){
			fechaIni=$("#txtFechaInicial").val();	
		}else{
			fechaIni=0;
		}
		//convocatoria =$("#cmbConvocatorias").val();
		detallado = true;
		//alert(solicitarReporte+"-"+fechaIni+"-"+fechaFin);//$('#cmbEstado option[value=1]').attr('selected','selected');
	   //validarFechas();
	  if(necesitaFecha==1 && fechaIni == ""){
					mostrarPopUpError("Debe llenar los campos fecha inicial");
	  }else{
				var mensaje="Procesando la información<br>Espere por favor";
				jsShowWindowLoad(mensaje);
			   	$.post("../../controlador/fachada.php", {
					clase: 'clsReporte',
					oper: 'consultarReporte',
					solicitarReporte:solicitarReporte,
					fechaInicial: fechaIni
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


	$("#descargar").click(function(){ //alert("hola");
		if(solicitarReporte==9 && detallado == true){ 
			window.location.href = "../"+nombreArchivo;
		}else{
			window.location.href = "../"+nombreArchivo;
		}
		
     });

    ////////////////////

	function formatearReporte7(informacion){
		var informacionFormateada = formatearInformacion(informacion);
		var definicionColumnas = [];
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [0]});
		generarTabla(informacionFormateada,definicionColumnas);
	}

	function formatearReporte8(informacion){
		var informacionFormateada = formatearInformacion(informacion);
		var definicionColumnas = [];
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [0]});
		generarTabla(informacionFormateada,definicionColumnas);
	}
	
	function cargarJornadas() {
		var postData = {clase:'clsCarga', oper:'CargarJornadasConvocatorias'};
		postAJAX(postData, mostrarJornadas);
	}

	function mostrarJornadas(data){
		$('#jornadas').find('option').remove();
		agregarOptionSelect("#jornadas", "", "Seleccione una opción...");
		for (i = 0; i < data.length; i++) {
			agregarOptionSelect("#jornadas", data[i].Id, data[i].Descripcion);
		}
	}

	function agregarOptionSelect(atributo, valor, texto) {
		$(atributo).append($('<option>', {
			value: valor,
			text: texto
		}));
	}

	function mostrarAlertCargando() {
		swal({title: "Generando reporte",   
			text: "Espere un momento...",
			timer: 1500,
			showConfirmButton: false,
			type: "success"});
	}

	//Realizar una peticion genérica de AJAX
	function postAJAX(parametros, callback){
		$.post("../../controlador/fachada.php", parametros, function(informacion) {
			if (informacion !== 0) {
				callback(informacion);
			}else{
				swal({title: "No hay información disponible",   
					text: "Intente con otro reporte",
					timer: 1500,
					showConfirmButton: false,
					type: "warning"});
				console.log('Error en postAJAX');
				console.log(parametros);
				console.log(informacion);
			}
		}, "json");
	}

	//Recibe un set de información de la base de datos y lo organiza para 
	//mostrarlo en la base de datos
	function formatearInformacion(informacion){
		var columnas = obtenerColumnas(informacion);
		var datos = obtenerDatos(informacion);
		return {"columnas":columnas, "datos":datos};
	}

	//Extrae los keys del set de entrada en un array
	function obtenerColumnas(informacion){
		var columnas = [];
		for (var clave in informacion[0]){
			columnas.push({"title":clave});
		}
		return columnas;
	}

	//Extrae la información del set de entrada en un array
	function obtenerDatos(informacion){
		var datos = [];
		for (var i = 0; i < informacion.length; i++) {
			var registro = informacion[i];
			var fila = [];
			for(var key in registro) {
				var value = registro[key];
				fila.push(value);
			}
			datos.push(fila);
		}
		return datos;
	}

	//Genera la base de datos de manera genérica con la información de entrada
	function generarTabla(informacion, definicionColumnas, detalleHabilitado){
		$("#contenedorTabla").show();
		destruirTablaSiExiste();
		tabla = $('#tablaDinamica').DataTable({
			"data": informacion.datos,
			"columns": informacion.columnas,
			"columnDefs": definicionColumnas
		});
		if (detalleHabilitado) {
			habilitarDetalle();
		}
	}

	//Destruye la tabla y vacío su contenido si esta existe. Esto con el fin de 
	//reinicializarla
	function destruirTablaSiExiste(){
		if(typeof tabla !== "undefined"){
			tabla.destroy();
			$('#tablaDinamica').empty();
		}
	}

	//Llama las funciones necesarias para poder ver el detalle de la información
	function habilitarDetalle(){
		hacerTablaSeleccionable();
		agregarBotonesDetalleConsolidado();
	}

	//Agrega o quita la clase "selected" cuando una fila es clickeada
	function hacerTablaSeleccionable(){
		$('#tablaDinamica tbody').find('tr').click(function () {
			if ($(this).hasClass('selected') ) {
				$(this).removeClass('selected');
				$('#verDetalle').hide();
			}else {
				tabla.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				$('#verDetalle').show();
			}
		});
	}

	//Agrega los botones de detalle y consolidado a la intefaz
	//con sus respectivos eventos
	function agregarBotonesDetalleConsolidado(){
		var reporte = $("#reportes :selected").val();
		var funcionesDetalle = {"2":cargarDetalleReporte2, "3":cargarDetalleReporte3};
		var funcionesConsolidado = {"2":reporte2, "3":reporte3};

		$('#verDetalle').unbind();
		$('#verDetalle').click(function(){
			var fila = tabla.row(".selected").data();
			$('#verDetalle').hide();
			$('#verConsolidado').show();
			funcionesDetalle[reporte](fila);
		});

		//CHAIN EVENTS
		$('#verConsolidado').unbind();
		$('#verConsolidado').click(function(){
			$('#verConsolidado').hide();
			funcionesConsolidado[reporte]();
		});
	}

	function reemplazarColumnas(nombresColumnas, informacion){
		for (var key in nombresColumnas) {
			informacion.columnas[key].title = nombresColumnas[key];
		}
		return informacion;
	}

	function consultarInformacionDetalleReporte3(fila, callback){
		var data = [];
		data.push({"N°":"1", "Identificación":"1023896822", "Apellido":"PARDO MORA", "Nombre":"JEISSON ALEXANDER", "Ruta":"4", "Código Curso":"4.07", "Capacitación":"C.E. - ELECTRICIDAD Y ELECTRÓNICA RESIDENCIAL", "Código Módulo":"4.07.T2", "Módulo":"NORMATIVIDAD ELÉCTRICA Y PLANIMETRÍA", "Grupo Facturación":"FLPF0894_T1"});
		data.push({"N°":"2", "Identificación":"79853912", "Apellido":"GARZON SANTA", "Nombre":"CARLOS ANDRES", "Ruta":"4", "Código Curso":"4.07", "Capacitación":"C.E. - ELECTRICIDAD Y ELECTRÓNICA RESIDENCIAL", "Código Módulo":"4.07.T2", "Módulo":"NORMATIVIDAD ELÉCTRICA Y PLANIMETRÍA", "Grupo Facturación":"FLPF0894_T1"});
		data.push({"N°":"3", "Identificación":"13643747", "Apellido":"GONZALEZ ARDILA", "Nombre":"OMAR", "Ruta":"4", "Código Curso":"4.07", "Capacitación":"C.E. - ELECTRICIDAD Y ELECTRÓNICA RESIDENCIAL", "Código Módulo":"4.07.T2", "Módulo":"NORMATIVIDAD ELÉCTRICA Y PLANIMETRÍA", "Grupo Facturación":"FLPF0894_T1"});
		data.push({"N°":"4", "Identificación":"4060835", "Apellido":"BERRIO MOJICA", "Nombre":"MAURICIO ALBERTO", "Ruta":"4", "Código Curso":"4.07", "Capacitación":"C.E. - ELECTRICIDAD Y ELECTRÓNICA RESIDENCIAL", "Código Módulo":"4.07.T2", "Módulo":"NORMATIVIDAD ELÉCTRICA Y PLANIMETRÍA", "Grupo Facturación":"FLPF0894_T1"});
		callback(data);
	}
});