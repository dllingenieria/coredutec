 $(function(){
 	moment.locale("es");
 	var formatoMomentJS = "YYYY-MM-DD";
 	var fechaInicial = "";
 	var fechaFinal = "";
 	var tabla;
 	var nombreModulo="";
 	var diasCurso=[];
 	var salones=[];
 	var horariosCurso=[];
 	var hayCruce=false;
 	var modulosConsultadosCruzados=[];
 	
 	inicializar();

 	function inicializar(){
 		$(".inferior").hide();
 		$(".medio").hide();
 		cargarJornadas();
 		cargarSedes();
 		cargarFechaInicial();
 		cargarHoras();
 		CargarConvocatoria();
 		cargarModalidades();
 		cargarEntregables();
 		CargarTipoCertificacion();
 	}

 	$("#preprogramarAutomaticamente").click(function(){
 		iniciarPreprogramacionAutomatica();
 	});

 	function iniciarPreprogramacionAutomatica(){
 		$(".medio").show();
 		$(".inferior").show();
 		swal({title: "Realizando preprogramacion automática",   
 			text: "Espere un momento...",   
 			showConfirmButton: false});
 		cargarInformacionModulo(function(){
 			cargarSalonesPorSede(function(){
 				cargarHorariosCurso(function(){
 					cargarDiasCurso(function(){
 						encontrarDisponibilidad();
 					});
 				});
 			});
 		});
 	}

 	function cargarJornadas() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCarga',
 			oper: 'CargarJornadasConvocatorias'
 		}, function(data) {
 			if (data !== 0) {
 				cargarSelect(data, "#jornadas");
 				$('#jornadas').find('option').remove();
 				for (i = 0; i < data.length; i++) {
 					agregarOptionSelect("#jornadas", data[i].Id,data[i].Descripcion);
 				}
 			}else {
 				alert('error cargarJornadas');
 			}}, "json");
 	}

 	function cargarSedes() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsSede',
 			oper: 'consultarSedes'
 		}, function(data) {
 			if (data !== 0) {
 				cargarSelect(data, "#sedes");
 				$('#sedes').val(117);
 			}else {
 				alert('error cargarSedes');
 			}}, "json");
 	}

 	function cargarFechaInicial() {
 		$("#fechaInicial").val(moment().format(formatoMomentJS));
 		//$("#fechaInicial").val(moment().subtract(20 ,'days').format(formatoMomentJS));
 	}

 	function cargarInformacionModulo(callback){
 		obtenerModuloParaPreprogramar(function(modulo){
 			if(modulo.Nombre.indexOf("-") > -1){
 				modulo.Nombre=modulo.Nombre.split("-")[0] + capitalizar(modulo.Nombre.split("-")[1]);
 			}
 			if(modulo.NombreCurso.indexOf("-") > -1){
 				modulo.NombreCurso=modulo.NombreCurso.split("-")[0] + capitalizar(modulo.NombreCurso.split("-")[1]);
 			}
 			sessionStorage.codigoModulo = modulo.Codigo;
 			sessionStorage.codigoCurso = modulo.CodigoCurso;
 			$("#modulo").html(modulo.Nombre);
 			$("#curso").html(modulo.NombreCurso);
 			$("#ruta").html(modulo.Ruta);
 			nombreModulo=modulo.Nombre;
 			callback();
 		});
 	}

 	function obtenerModuloParaPreprogramar(callback){
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsModulo',
 			oper: 'ConsultarModuloParaPreprogramar'
 		}, function(data) {
 			if (data !== 0) {
 				if (data !== null) {
 					callback(data[0]);
 				}else{
 					alert('No hay módulos para preprogramar');
 				}
 			}else {
 				alert('error obtenerModuloParaPreprogramar');
 			}
 		}, "json");
 		// callback({"Nombre":"Informática","Curso":"TIC","Ruta":"Ruta 4","Convocatoria":"FOSFEC","Inscritos":"17"});
 	}

 	function cargarModalidades() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'CargarModalidades'
 		}, function(data) {
 			if (data !== 0) {
 				cargarSelect(data,"#modalidadSelect");
 			}else {
 				alert('error cargarModalidades');
 			}
 		}, "json");
 	}

 	function cargarEntregables() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'CargarEntregables'
 		}, function(data) {
 			if (data !== 0) {
 				cargarSelect(data,"#entregablesSelect");
 			}
 			else {
 				alert('error cargarEntregables');
 			}
 		}, "json");
 	}

 	function cargarSalonesPorSede(callback) {
 		var sede = $("#sedes").val();
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'CargarSalonesPorSede',
 			sede: sede
 		}, function(data) {
 			if (data !== 0) {
 				salones = data;
 				cargarSelect(data,"#salonSelect");
 				callback();
 			}
 			else {
 				alert('error cargarSalonesPorSede');
 			}
 		}, "json");
 	}

 	function cargarHorariosCurso(callback) {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'CargarHorarios'
 		}, function(data) {
 			if (data !== 0) {
 				horariosCurso = data;
 				cargarSelect(data,"#horarioCursoSelect");
 				callback();
 			}
 			else {
 				alert('error cargarHorariosCurso');
 			}
 		}, "json");
 	}

 	function cargarDiasCurso(callback) {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'ConsultarDiasCurso'
 		}, function(data) {
 			if (data !== 0) {
 				diasCurso = data;
 				cargarSelect(data,"#diasCursoSelect");
 				callback();
 			}
 			else {
 				alert('error cargarDiasCurso');
 			}
 		}, "json");
 	}



 	function cargarHoras() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'cargarHoras'
 		}, function(data) {
 			if (data !== 0) {
 				if (data !== null) {
 					data.forEach(function(registro){
 						agregarOptionSelect("#horaInicialSelect", registro[0], registro[1]);
 						agregarOptionSelect("#horaFinalSelect", registro[0], registro[1]);
 					});
 				}else{
 					console.log('Error al consultar horas');
 				}
 			}else {
 				alert('Error al consultar horas');
 			}
 		}, "json");
 	}

 	function CargarConvocatoria() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsConvocatoria',
 			oper: 'ConsultarConvocatorias'
 		}, function(data) {
 			if (data !== 0) {
 				if (data !== null) {
 					data.forEach(function(registro){
 						agregarOptionSelect("#convocatoriaSelect", registro.Id, registro.Nombre);
 					});
 				}else{
 					console.log('Error al consultar CargarConvocatoria');
 				}
 			}else {
 				alert('error CargarConvocatoria');
 			}
 		}, "json");
 	}

 	function CargarTipoCertificacion() {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsCurso',
 			oper: 'CargarTipoCertificacion'
 		}, function(data) {
 			if (data !== 0) {
 				if (data !== null) {
 					cargarSelect(data,"#certificacionSelect");
 				}else{
 					alert('No hay certificaciones disponibles');
 				}
 			}else {
 				alert('Error al consultar las certificaciones');
 			}
 		}, "json");
 	}

 	function cargarSelect(data, selectId) {
 		$(selectId).find('option').remove();
 		data.forEach(function(registro){
 			agregarOptionSelect(selectId, registro.Id, registro.Nombre);
 		});
 	}

 	function agregarOptionSelect(selectId, valor, texto) {
 		$(selectId).append($('<option>', {value: valor,text: texto}));
 	}

 	function encontrarDisponibilidad(automatico){
 		modulosConsultadosCruzados=[];
 		var breakFor=false;
 		modulosConsultadosCruzados = [];
 		automatico = (typeof automatico === 'undefined') ? true : automatico;
 		if (validarFechaInicial()) {
 			var fechaInicial = $("#fechaInicial").val();
 			var nombreModulo = $("#modulo").val();
 			if (automatico) {
 				loop1 : for (var i = 0; i < salones.length; i++) {
 					var salonId = salones[i].Id;
 					for (var j = 0; j < diasCurso.length; j++) {
 						diaCursoId = diasCurso[j].Id;
 						diaCursoNombre = diasCurso[j].Nombre;
 						for (var k = 0; k < horariosCurso.length; k++) {
 							var horarioCursoId = horariosCurso[k].Id;
 							var horarioCursoNombre = horariosCurso[k].Nombre;
 							var mostrarCruces = (i===(salones.length-1));
 							encontrarDisponibilidad2(nombreModulo, salonId, diaCursoId, diaCursoNombre, horarioCursoId, horarioCursoNombre, fechaInicial, mostrarCruces, true);
 							if (!hayCruce) {
 								break loop1;
 							}
 						}
 					}
 				}
 			}else{
 				var salonIdSelect = $("#salonSelect :selected").val();
 				var diaCursoIdSelect = $("#diasCursoSelect :selected").val();
 				var diaCursoNombreSelect = $("#diasCursoSelect :selected").text();
 				var horarioCursoIdSelect = $("#horarioCursoSelect :selected").val();
 				var horarioCursoNombreSelect = $("#horarioCursoSelect :selected").text();
 				encontrarDisponibilidad2(nombreModulo, salonIdSelect, diaCursoIdSelect, diaCursoNombreSelect, horarioCursoIdSelect, horarioCursoNombreSelect, fechaInicial, true);
 			}
 		}else{
 			alert("Por favor utilice una fecha mayor a la actual");
 		}
 	}

 	function encontrarDisponibilidad2(nombreModulo, salonId, diaCursoId, diaCursoNombre, horarioCursoId, horarioCursoNombre, fechaInicial, mostrarCruces, automatico){
 		automatico = (typeof automatico === 'undefined') ? false : automatico;
 		var moduloTentativo = obtenerFechasTentativas(nombreModulo, horarioCursoNombre, diaCursoNombre, fechaInicial);
 		var fechaFinalTentativa = moduloTentativo.fechaFinal;
 		sessionStorage.fechaFinal = fechaFinalTentativa;
 		obtenerModulosCruzados(fechaInicial, fechaFinalTentativa, salonId, function(modulosCruzados){
 			encontrarCruce(moduloTentativo, modulosCruzados);
 			if (!hayCruce) {
 				$("#horarioCursoSelect").val(horarioCursoId);
 				$("#diasCursoSelect").val(diaCursoId);
 				$("#salonSelect :selected").val(salonId);
 				cargarDocentesDisponibles(fechaInicial, fechaFinalTentativa, horarioCursoId);
 				rellenarTabla(fechaInicial, fechaFinalTentativa, modulosCruzados, moduloTentativo);
 				if (automatico) {
 					swal({title: "¡Preprogramación Automática Terminada!",   
 						timer: 1500,
 						showConfirmButton: false,
 						type: "success"});
 				}
 			}else{
 				if (mostrarCruces) {
 					$("#horarioCursoSelect").val(horarioCursoId);
 					$("#diasCursoSelect").val(diaCursoId);
 					$("#salonSelect :selected").val(salonId);
 					rellenarTabla(fechaInicial, fechaFinalTentativa, modulosCruzados, moduloTentativo);
 					if (automatico) {
 						swal({title : "No hay disponibilidad",
 							text : "Por favor seleccione otra fecha inicial, sede o jornada",
 							showConfirmButton: true,
 							type: "error"});
 					}
 				}
 			}
 		});
 	}

 	function encontrarCruce(moduloTentativo, modulosCruzados){
 		hayCruce = false;
 		for (var i = 0; i < modulosCruzados.length; i++) {
 			moduloCruzado = modulosCruzados[i];
 			if (moduloCruzado.horarioCurso == moduloTentativo.horarioCurso) {
 				moduloTentativo.fechasOcupadas.forEach(function(fechaOcupada1){
 					moduloCruzado.fechasOcupadas.forEach(function(fechaOcupada2){
 						if (fechaOcupada1 === fechaOcupada2) {
 							hayCruce = true;
 						}
 					});
 				});
 			}
 		}
 	}

 	function cargarDocentesDisponibles(fechaInicial, fechaFinal, idHorarioCurso){
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsDocente',
 			oper: 'consultarDocentesEntreFechas',
 			idHorarioCurso : idHorarioCurso,
 			fechaInicial : fechaInicial,
 			fechaFinal : fechaFinal
 		}, function(data) {
 			if (data !== 0) {
 				if (data !== null) {
 					data.forEach(function(registro){
 						agregarOptionSelect("#docenteSelect", registro.Id, registro.Nombres);
 					});
 				}else{
 					console.log('No hay Docentes disponibles');
 				}
 			}else {
 				alert('error cargar Docentes');
 			}

 		}, "json");
 	}

 	function obtenerModulosCruzados(fechaInicial, fechaFinal, idSalon, callback){
 		consultarModulosCruzados(idSalon, fechaInicial, fechaFinal, function(modulosCruzados){
 			var modulosCruzadosFormateados = formatearModulosCruzados(modulosCruzados);
 			callback(modulosCruzadosFormateados);
 		});
 	}

 	function rellenarTabla(fechaInicial, fechaFinal, modulosCruzados, moduloTentativo){
 		moduloTentativo.nombre = "SELECCIÓN";
 		var modulosParaDibujar = modulosCruzados;
 		modulosParaDibujar.push(moduloTentativo);
 		dataSet = generarDataSet(fechaInicial, fechaFinal, modulosParaDibujar);
 		inicializarTabla(dataSet.datos, dataSet.columnas); 
 	}

 	function consultarModulosCruzados(idSalon, fechaInicial, fechaFinal, callback){
 		if (modulosConsultadosCruzados.length > 0) {
 			callback(modulosConsultadosCruzados);
 		}else{
 			$.ajax({
 				url: "../../controlador/fachada.php",
 				type: 'POST',
 				dataType: 'json',
 				async : false,
 				data: {
 					clase: 'clsModulo',
 					oper: 'ConsultarModulosCruzados',
 					idSalon : idSalon,
 					fechaInicial : fechaInicial,
 					fechaFinal : fechaFinal
 				}
 			}).done(function(data) {
 				if (data !== 0) {
 					if (data !== null) {
 						modulosConsultadosCruzados = data;
 						callback(data);
 					}else{
 						callback([]);
 					}
 				}else {
 					alert('error cargar Modulos Cruzados');
 				}
 			});
 		}
 		// var data = [{"NombreModulo":"Modulo1","HorarioCurso":"Mañana","DiasCurso":"Lunes a Viernes","FechaInicial":"2016-04-30"},
 		// {"NombreModulo":"Modulo2","HorarioCurso":"Tarde","DiasCurso":"Martes a Sabado","FechaInicial":"2016-05-05"},
 		// {"NombreModulo":"Modulo3","HorarioCurso":"Noche","DiasCurso":"Martes a Sabado","FechaInicial":"2016-05-05"},
 		// {"NombreModulo":"Modulo4","HorarioCurso":"Mañana","DiasCurso":"Sabado","FechaInicial":"2016-05-05"}
 		// ];
 		// callback(data);
 	}

 	function formatearModulosCruzados(modulosCruzados){
 		var modulosCruzadosFormateados=[];
 		for (var i = 0; i < modulosCruzados.length; i++) {
 			modulo = modulosCruzados[i];
 			var fechasOcupadas = obtenerFechasTentativas(modulo.NombreModulo, modulo.HorarioCurso, modulo.DiasCurso, modulo.FechaInicial);
 			modulosCruzadosFormateados.push(fechasOcupadas);
 		}
 		return modulosCruzadosFormateados;
 	}

 	function generarDataSet(fechaInicial, fechaFinal, modulos){
 		fechaInicial = moment(fechaInicial);
 		fechaFinal = moment(fechaFinal);
 		dataSetManana = ["Mañana"];
 		dataSetTarde = ["Tarde"];
 		dataSetNoche = ["Noche"];
 		columnas = [{"title":"Jornadas"}];
 		for (var iteradorFecha = fechaInicial; iteradorFecha.isBefore(fechaFinal) || iteradorFecha.isSame(fechaFinal)  ; iteradorFecha.add(1 ,'days')) {
 			var dataSetMananaModificado = false;
 			var dataSetTardeModificado = false;
 			var dataSetNocheModificado = false;
 			var iteradorFormateado = iteradorFecha.format(formatoMomentJS);
 			columnas.push({"title": iteradorFecha.format("dddd MM/DD")});
 			modulos.forEach(function(modulo){
 				modulo.fechasOcupadas.forEach(function(fechaOcupada){
 					fechaOcupadaFormateada = moment(fechaOcupada).format(formatoMomentJS);
 					if (iteradorFormateado === fechaOcupadaFormateada) {
 						if (modulo.horarioCurso === "Mañana") {
 							if (dataSetMananaModificado) {
 								dataSetManana[dataSetManana.length-1] = "Cruce";
 							}else{
 								dataSetManana.push(modulo.nombre);
 								dataSetMananaModificado=true;
 							}
 						}else if (modulo.horarioCurso === "Tarde") {
 							if (dataSetTardeModificado) {
 								dataSetTarde[dataSetTarde.length-1] = "Cruce";
 							}else{
 								dataSetTarde.push(modulo.nombre);
 								dataSetTardeModificado=true;
 							}
 						}else if (modulo.horarioCurso === "Noche") {
 							if (dataSetNocheModificado) {
 								dataSetNoche[dataSetNoche.length-1] = "Cruce";
 							}else{
 								dataSetNoche.push(modulo.nombre);
 								dataSetNocheModificado=true;
 							}
 						}
 					}
 				});
 			});
 			if (!dataSetMananaModificado) {
 				dataSetManana.push("Libre");
 			}
 			if (!dataSetTardeModificado) {
 				dataSetTarde.push("Libre");
 			}
 			if (!dataSetNocheModificado) {
 				dataSetNoche.push("Libre");
 			}
 		}
 		datos=[];
 		datos.push(dataSetManana, dataSetTarde, dataSetNoche);
 		return {"datos":datos, "columnas":columnas};
 	}

 	function inicializarTabla(datos, columnas){
 		if(typeof tabla !== "undefined"){
 			tabla.destroy();
 			$('#parrilla').empty();
 		}
 		tabla = $('#parrilla').DataTable( {
 			data: datos,
 			columns: columnas,
 			"paging":   false,
 			"info":     false,
 			"ordering": false,
 			"filter": 	false,
 			"order": [[ 0, "desc" ]],
 			"scrollY": "300px",
 			"scrollX": 	true,
 			"scrollCollapse": true,
 			"language": {
 				"sSearch": "Filtrar:",
 				"zeroRecords": "Ningún resultado encontrado",
 				"infoEmpty": "No hay registros disponibles",
 				"Search:": "Filtrar"
 			},
 			"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
 				for (var i = 1; i <= columnas.length; i++) {
 					if ( aData[i] == "SELECCIÓN" ){
 						$('td:eq('+i+')', nRow).html( '<b>SELECCIÓN</b>' );
 						$('td:eq('+i+')', nRow).addClass("seleccion");
 					}else if ( aData[i] == "Libre" ){
 						$('td:eq('+i+')', nRow).html( '<b>Libre</b>' );
 						$('td:eq('+i+')', nRow).addClass("libre");
 					}else if ( aData[i] == "Cruce" ){
 						$('td:eq('+i+')', nRow).html( '<b>Cruce</b>' );
 						$('td:eq('+i+')', nRow).addClass("cruce");
 					}else{
 						$('td:eq('+i+')', nRow).addClass("ocupado");
 					}
 				}
 			}
 		});
 	}

 	function obtenerFechasTentativas(modulo, horarioCurso, diasCurso, fechaInicial){
 		var informacionModulo = {
 			"nombre" : modulo,
 			"horarioCurso":horarioCurso,
 			"diasCurso": diasCurso,
 			"fechaInicial": fechaInicial,
 			"fechaFinal":"",
 			"fechasOcupadas": []
 		};
 		var moduloTentativo = agregarFechasOcupadas(informacionModulo);
 		return moduloTentativo;
 	}

 	function agregarFechasOcupadas(informacionModulo){
 		var diasClase = obtenerListaDiasCurso(informacionModulo.diasCurso);
 		var sesionesAsignadas = 0;
 		if (informacionModulo.horarioCurso === "Mañana") {
 			sesionesAsignadas = 10;
 		}else{
 			sesionesAsignadas = 13;
 		}
 		var iteradorFecha = moment(informacionModulo.fechaInicial);
 		while(sesionesAsignadas > 0){
 			if (isInArray(iteradorFecha.format("dddd"), diasClase)) {
 				informacionModulo.fechasOcupadas.push(iteradorFecha.format(formatoMomentJS));
 				sesionesAsignadas--;
 			}
 			if (sesionesAsignadas === 0) {
 				informacionModulo.fechaFinal=iteradorFecha.format(formatoMomentJS);
 			}
 			iteradorFecha = iteradorFecha.add(1, 'days');
 		}
 		return informacionModulo;
 	}

 	function obtenerListaDiasCurso(diasCurso){
 		var diasClase = [];
 		if (diasCurso === "Lunes a Viernes") {
 			diasClase = new Array("lunes","martes","miércoles","jueves","viernes");
 		}else if (diasCurso === "Lunes a Sabado") {
 			diasClase = new Array("lunes","martes","miércoles","jueves","viernes","sábado");
 		}else if (diasCurso === "Lunes a Miercoles") {
 			diasClase = new Array("lunes","martes","miércoles");
 		}else if (diasCurso === "Jueves a Sabados") {
 			diasClase = new Array("jueves","viernes","sábado");
 		}else if (diasCurso === "Martes a Miercoles") {
 			diasClase = new Array("martes","miércoles");
 		}else if (diasCurso === "Martes a Sabado") {
 			diasClase = new Array("martes","miércoles","jueves","viernes","sábado");
 		}else if (diasCurso === "Sabado") {
 			diasClase = new Array("sábado");
 		}
 		return diasClase;
 	}

 	function isInArray(value, array) {
 		return array.indexOf(value) > -1;
 	}

 	function validarFechaInicial(){
 		return true;
 	}

 	function preprogramar(callback){
 		obtenerMatricula(function(matricula, ultimaMatricula){
 			var codigoModulo = sessionStorage.codigoModulo;
 			var codigoSalon = matricula+"."+codigoModulo.split(".")[2];
 			var convocatoria = $("#convocatoriaSelect :selected").val();
 			var ruta = $("#ruta").html();
 			var codigoCurso = sessionStorage.codigoCurso;
 			var diasCurso = $("#diasCursoSelect :selected").val();
 			var horaInicial = $("#horaInicialSelect :selected").val();
 			var horaFinal = $("#horaFinalSelect :selected").val();
 			var modalidad = $("#modalidadSelect :selected").val();
 			var sede = $("#sedes :selected").val();
 			var fechaInicial = $("#fechaInicial").val();
 			var fechaFinal = sessionStorage.fechaFinal;
 			var entregable = $("#entregablesSelect :selected").val();
 			var docente = $("#docenteSelect :selected").val();
 			var certificacion = $("#certificacionSelect :selected").val();
 			var horarioCurso = $("#horarioCursoSelect :selected").val();
 			var salon = $("#salonSelect :selected").val();
 			$.post("../../controlador/fachada.php", {
 				clase: 'clsProgramacion',
 				oper: 'AgregarPreprogramacion2',
 				cod_mat: matricula,
 				cod_sal: codigoSalon,
 				tip_ser: convocatoria,
 				rut_for: ruta,
 				cur_cod: codigoCurso,
 				cur_dia: diasCurso,
 				hra_ini: horaInicial,
 				hra_fin: horaFinal,
 				cod_mod: codigoModulo,
 				mod_pre: modalidad,
 				id_sed: sede,
 				fec_ini: fechaInicial,
 				fec_fin: fechaFinal,
 				pro_ent: entregable,
 				id_doc: docente,
 				tip_cer: certificacion,
 				mat_num : ultimaMatricula,
 				salon : salon,
 				horarioCurso : horarioCurso
 			}, function(data) {
 				if (data !== 0) {
 					callback();
 				}else {
 					alert('Error preprogramando');
 				}
 			}, "json");  
 			
 		});
 	}

 	function obtenerMatricula(callback){
 		cargarUltimaMatricula(function(ultimaMatricula){
 			var convocatoria = $("#convocatoriaSelect :selected").text();
 			var matricula = formatearMatricula(ultimaMatricula, convocatoria);
 			callback(matricula, ultimaMatricula);
 		});
 	}

 	function cargarUltimaMatricula(callback) {
 		$.post("../../controlador/fachada.php", {
 			clase: 'clsProgramacion',
 			oper: 'obtenerUltimaMatricula'
 		}, function(data) {
 			if (data[0].MatriculaNumero > 0 ) {
 				callback(parseInt(data[0].MatriculaNumero) + 1);
 			}else  {
 				alert("Error al obtener última matrícula");
 			}        
 		}, "json");
 	}

 	function formatearMatricula(ultimaMatricula, convocatoria) {
 		var matricula = formatearMatricula2(ultimaMatricula);
 		var codigoConvocatoria = convocatoria.split('-')[1];
 		return 'FL' + codigoConvocatoria + matricula;
 	}

 	function formatearMatricula2(ultimaMatricula) {
 		var aux = '';
 		for (var i = (ultimaMatricula + '').length; i < 5; i++) {
 			aux += '0';
 		}
 		return aux + '' + (ultimaMatricula + '');
 	}

 	$("#diasCursoSelect").on("change",function(){
 		encontrarDisponibilidad(false);
 	});
 	$("#horarioCursoSelect").on("change",function(){
 		encontrarDisponibilidad(false);
 	});
 	$("#preprogramar").click(function(){
 		if (hayCruce) {
 			sweetAlert("No se puede preprogramar...", "Hay cruces, por favor verifique", "error");
 		}else{
 			preprogramar(function(){
 				swal("¡Muy bien!", "Modulo Preprogramado Satisfactoriamente", "success");
 				$(".inferior").hide();
 				$(".medio").hide();
 			});
 		}
 	});

 	$("#preprogramarManualmente").click(function(){
		window.location.href = "preprogramacion.html";
	});
 });