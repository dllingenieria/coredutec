$(function(){

	var asistenciaParaImprimir;

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

	function inicializar(){
		consultarJornadas();
		consultarRutas();
		$("#jornadas, #rutas, #fecha, #usuarios").change(verificarInformacion);
		$("#imprimir").click(imprimirAsistencia);
	}

	function consultarJornadas() {
		var postData = {clase:'clsCarga', oper:'CargarJornadasConvocatorias'};
		postAJAX(postData, cargarJornadas);
	}

	function cargarJornadas(informacion){
		for (i = 0; i < informacion.length; i++) {
			agregarOptionSelect("#jornadas", informacion[i].Id,informacion[i].Descripcion);
		}
	}

	function consultarRutas() {
		var postData = {clase:'clsCurso', oper:'CargarRutas'};
		postAJAX(postData, cargarRutas);
	}

	function cargarRutas(informacion){
		for (i = 0; i < informacion.length; i++) {
			agregarOptionSelect("#rutas", informacion[i].Id,informacion[i].Nombre);
		}
	}

	function verificarInformacion(){
		var jornada = $("#jornadas").val();
		var ruta = $("#rutas").val();
		var fecha = $("#fecha").val();
		var usuario = $("#usuarios").val();
		if (jornada && ruta && fecha && usuario) {
			if (usuario !== -1) {
				consultarEstudiantes(jornada, ruta, fecha, usuario);
			}
		}else if(jornada && ruta && fecha){
			consultarUsuarios(jornada, ruta, fecha);
		}
	}

	function imprimirAsistencia(){
		if (asistenciaParaImprimir) {
			sessionStorage.asistencia = JSON.stringify(asistenciaParaImprimir);
			sessionStorage.fecha = $("#fecha").val();
			window.location = 'formatoInduccion.html';
		}else{
			swal({title: "No hay información disponible",   
				text: "Seleccione una asistencia",
				timer: 1500,
				showConfirmButton: false,
				type: "warning"});
		}
	}

	function consultarUsuarios(jornada, ruta, fecha){
		var postData = {clase:'clsAsistencia', oper:'consultarUsuariosRegistraronAsistencia', jornada:jornada, ruta:ruta, fecha:fecha};
		postAJAX(postData, cargarUsuarios);
	}

	function cargarUsuarios(informacion){
		agregarOptionSelect("#usuarios", -1,"Seleccione un usuario");
		for (i = 0; i < informacion.length; i++) {
			agregarOptionSelect("#usuarios", informacion[i].Id, informacion[i].Nombres + informacion[i].Apellidos);
		}
	}

	function consultarEstudiantes(jornada, ruta, fecha, usuario){
		var postData = {clase:'clsAsistencia', oper:'consultarEstudiantesAsistieronConvocatoria',
		jornada:jornada, ruta:ruta, fecha:fecha, usuario:usuario};
		postAJAX(postData, cargarEstudiantes);
	}

	function cargarEstudiantes(informacion){
		asistenciaParaImprimir = informacion;
		var informacionFormateada = formatearInformacion(informacion);
		generarTabla(informacionFormateada);
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

	function agregarOptionSelect(atributo, valor, texto) {
		$(atributo).append($('<option>', {
			value: valor,
			text: texto
		}));
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
});
