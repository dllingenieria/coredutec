$(function(){
	var tabla;
	var cargasPorJornada={};
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
	inicializar();
	
	// Funciones que sólo se ejecutan 1 vez
	function inicializar(){
		$("#formularioCedula").submit(buscarCedula);
		$("#registrarAsistencia").click(registrarAsistencia);
	}

	function buscarCedula(event){
		event.preventDefault();
		mostrarAlertCargando();
		var cedula = $("#cedula").val();
		var postData = {clase:'clsCarga', oper:'consultarCargaPorCedula', cedula:cedula};
		postAJAX(postData, organizarCargasPorJornada);
	}

	function organizarCargasPorJornada(informacion){
		for (var i = 0; i < informacion.length; i++) {
			var carga = informacion[i];
			if (cargasPorJornada[carga.Descripcion]) {
				cargasPorJornada[carga.Descripcion].push(carga.IdCarga);
				informacion.splice(i, 1);
			}else{
				cargasPorJornada[carga.Descripcion] = [carga.IdCarga];
			}
		}
		mostrarInformacion(informacion);
	}

	function registrarAsistencia(){
		if (tabla) {
			var fila = tabla.row(".selected").data();
			if (fila) {
				tabla.row(".selected").remove().draw();
				var convocatoria = fila[3];
				for (var i = 0; i < cargasPorJornada[convocatoria].length; i++) {
					var idCarga = cargasPorJornada[convocatoria][i];
					var postData = {clase:'clsCarga', oper:'modificarAsistenciaConvocatoria', idCarga:idCarga};
					postAJAX(postData);
				}
				mostrarAlertExito();
			}else{
				swal({title: "Seleccione una jornada",   
					timer: 1500,
					showConfirmButton: false,
					type: "info"});
			}
		}else{
			swal({title: "Por favor busque una cédula",   
				timer: 1500,
				showConfirmButton: false,
				type: "error"});
		}
	}

	function mostrarInformacion(informacion){
		var informacionFormateada = formatearInformacion(informacion);
		generarTabla(informacionFormateada);
	}

	function mostrarAlertCargando() {
		swal({title: "Consultando Información",   
			text: "Espere un momento...",
			timer: 1000,
			showConfirmButton: false,
			type: "success"});
	}

	function mostrarAlertExito() {
		swal({title: "Registro realizado con éxito",   
			timer: 1000,
			showConfirmButton: false,
			type: "success"});
	}

	//Realizar una peticion genérica de AJAX
	function postAJAX(parametros, callback){
		$.post("../../controlador/fachada.php", parametros, function(informacion) {
			if (informacion !== 0) {
				if (callback) {
					callback(informacion);
				}
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
	function generarTabla(informacion){
		destruirTablaSiExiste();
		tabla = $('#tablaDinamica').DataTable({
			"data": informacion.datos,
			"columns": informacion.columnas
		});
		hacerTablaSeleccionable();
	}

	//Destruye la tabla y vacío su contenido si esta existe. Esto con el fin de 
	//reinicializarla
	function destruirTablaSiExiste(){
		if(typeof tabla !== "undefined"){
			tabla.destroy();
			$('#tablaDinamica').empty();
		}
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

	function reemplazarColumnas(nombresColumnas, informacion){
		for (var key in nombresColumnas) {
			informacion.columnas[key].title = nombresColumnas[key];
		}
		return informacion;
	}
});