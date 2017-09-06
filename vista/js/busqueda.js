$(function() {
	var idModuloSeleccionado=0;
	var convocatoriaSeleccionada="";
	var rutaSeleccionada="";
	cursosInscritos = [];
	var modulosVistos = [];
	var tabla;
	idTerceroCarga="";
	informacionTabla=[];

	$.extend( true, $.fn.dataTable.defaults, {
		"order": [[ 0, "asc" ]],
		"paging":   false,
		"info":     false,
		"filter": false,
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
		$("#buscar").click(consultarCargasTercero);
		$('#matricular').click(matricularModulo);
		//$('input[id=identificacion]').change(consultarCargasTercero);

	}

	function consultarCargasTercero(){
		cursosInscritos=[];
		$('#modulosCursados').text('');
		// swal({title: "Consultando Información",   
		// 	text: "Espere un momento...",
		// 	timer: 3000,
		// 	showConfirmButton: false,
		// 	type: "success"});
		var identificacion = $("#identificacion").val();
		$.post("../../controlador/fachada.php", {
			clase: 'clsParticipante',
			oper: 'ConsultarParticipante',
			pNumeroIdentificacion: identificacion
		}, function(data) {
			if(data !== null){
				if (data !== 0) { 
					data.forEach(function(carga){
						$.cookie("nombre", carga[0]);
						$.cookie("apellido", carga[1]);
						$("#nombreApellido").val($.cookie("nombre") + " " + $.cookie("apellido"));
						var telefonos = carga[2] + " - " + carga[3] + " - " + carga[4];
						$.cookie("telefono", telefonos);
						$("#telefono").val(telefonos);
						$.cookie("convocatoria", carga[5]);
						$.cookie("curso", carga[6]);
						$.cookie("cursoId", carga[7]);
						$.cookie("fechaAsignacion", carga[8]);
						$.cookie("estado", carga[9]);
						$("#estado").val($.cookie("estado"));
						$.cookie("cargaId", carga[10]);
						$.cookie("rutaId", carga[11]);
						idTerceroCarga=carga[12]; //alert(idTerceroCarga);
						$.cookie("tercertoId", idTerceroCarga);
						//$.cookie("tercertoId", carga[12]);
						
						cursosInscritos.push({"rutaId": $.cookie("rutaId"),
							"cursoId":$.cookie("cursoId"),
							"curso":$.cookie("curso"),
							"convocatoria":$.cookie("convocatoria"),
							"cargaId":$.cookie("cargaId")
						});

					});
					consultarModulosVistos();
				}else{
						swal({title: "No se encontraron registros",   
						text: "",
						timer: 2000,
						showConfirmButton: false,
						type: "error"});
					}
			}else{
						swal({title: "No se encontraron registros",   
						text: "",
						timer: 2000,
						showConfirmButton: false,
						type: "error"});
			}
		},"json");
	}

	function consultarModulosVistos(){ 
		$.post("../../controlador/fachada.php", {
			clase: 'clsModulo',
			oper: 'ConsultarModulosVistosPorTercero',
			idTercero: idTerceroCarga
		}, function(data) {
			if(data !== null){ 
				if (data !== 0) { 
					 for(i = 0; i < data.length; i++) {
						//modulosVistos.push(modulo.Nombre );
						$("#modulosCursados").append(data[i].Nombre + ", " + data[i].NombreCurso + ", " + data[i].Salon+ ", " + data[i].Estado + "\n-------------------\n") ; 
					 
					 }
					// data.forEach(function(modulo){ alert("hola");
						// modulosVistos.push(modulo.Nombre );
						// $("#modulosCursados").append(modulo.Nombre + ", " + modulo.NombreCurso + ", " + modulo.Salon+ ", " + modulo.Estado + "\n-------------------\n") ;
					// });
				}
				llenarTablaModulos();
			}else{alert("Error en la búsqueda - Módulos");}
		},"json");
	}

	function llenarTablaModulos(){
		obtenerInformacionCursoRecursivo(0, [], [], [], function(informacionTabla){
			generarTabla(formatearInformacion(informacionTabla));
		});
	}

	function obtenerInformacionCursoRecursivo(indice, modulosAgregados, modulosAgregadosId,informacionTabla, callback){
		
		if (indice >= cursosInscritos.length) {
			callback(informacionTabla);
			return;
		}else{
			var curso = cursosInscritos[indice]; //console.log(cursosInscritos);
			//alert(curso.rutaId+"-"+curso.cursoId);
			$.post("../../controlador/fachada.php", {
				clase: 'clsModulo',
				oper: 'ConsultarModulosPorRutaCurso',
				rutaId: curso.rutaId,
				cursoId: curso.cursoId
			}, function(data) { 
				if(data !== null){
					if (data !== 0) {
						for (var i = 0; i < data.length; i++) { 
						//if(i==0){alert(i);modulosAgregados.length=0;}
						
							var modulo = data[i];					
							//if (!isInArray(modulo.Modulo,modulosVistos)) {
						
								//if (!isInArray(modulo.Modulo, modulosAgregados)) {
								  if(!isInArray(modulo.IdModulo, modulosAgregadosId)) {
										modulo.idCarga = curso.cargaId;
									if (modulo.rutaId === "1" || modulo.rutaId === "10") {
										modulo.Curso = modulo.Modulo;
									}else{
										modulo.Curso = curso.curso;
									}
									modulo.Convocatoria = curso.convocatoria;
									modulosAgregados.push(modulo.Modulo);
									informacionTabla.push(modulo);
									modulosAgregadosId.push(modulo.IdModulo);
									
								}
							//}
						}
						indice++;
						obtenerInformacionCursoRecursivo(indice, modulosAgregados, modulosAgregadosId,informacionTabla, callback);
					}else{ alert("No se encontraron registros - Cursos");}
				}else{alert("Error en la búsqueda - Cursos");}
			},"json");
		}
	}

	function isInArray(value, array) {
		return array.indexOf(value) > -1;
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
		var nombresColumnas = {0:"Módulo", 1:"Ruta", 2:"idModulo", 3:"idCarga", 4:"Ruta Id", 5:"Curso", 6:"Convocatoria"};
		informacion = reemplazarColumnas(nombresColumnas, informacion);
		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [2,3,4]});
		tabla = $('#tablaDinamica').DataTable({
			"data": informacion.datos,
			"columns": informacion.columnas,
			"columnDefs": definicionColumnas,
			colReorder: true
		});
		tabla.colReorder.order( [ 1, 0, 2, 3, 4, 5, 6] );
		hacerTablaSeleccionable();
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

	//Destruye la tabla y vacío su contenido si esta existe. Esto con el fin de 
	//reinicializarla
	function destruirTablaSiExiste(){ 
		if(typeof tabla !== "undefined"){
			tabla.destroy();
			$('#tablaDinamica').empty();
		}
	}

	function matricularModulo(){
		if (tabla) {
			var fila = tabla.row(".selected").data();
			if (fila) {
				$.cookie("pModulo", fila[2]);
				$.cookie("pIdCarga", fila[4]);
				$.cookie("convocatoria", fila[6]);
				$.cookie("ruta", fila[3]);
				// $.cookie("pIdTercero", $.cookie("tercertoId"));
				$.cookie("pIdTercero", idTerceroCarga);
				$.cookie("pNumeroIdentificacion", $("#identificacion").val());
				$.cookie("pEstado", $.cookie("estado"));
				$.cookie("est_pre", $.cookie("estado"));
				$.cookie("pEstadoMatricula", 'SinMatricular');
				window.open('matricula.html', '_self');
			}else{
				swal({title: "Seleccione un módulo",   
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
});


