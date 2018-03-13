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
	cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
	cargarValorSelected('#cmbTipoIdentificacion',3,500);

	function inicializar(){
		$("#buscar").click(function(){ 
			var pTipoIdentificacion = "";
	        var pNumeroIdentificacion = "";
	        pTipoIdentificacion = $("#cmbTipoIdentificacion option:selected").val();
	        pNumeroIdentificacion = $("#identificacion").val();
			if (pNumeroIdentificacion == ""){
				mostrarPopUpError("Por favor ingrese un número de identificación");
			}
			else{
	            consultarCargasTercero();
			}
		});
		$('#matricular').click(matricularModulo);
	}

	//Captura el control para aplicar validacion al presionar una tecla
	window.addEventListener("load", function() {
		document.getElementById("identificacion").addEventListener("keypress", soloNumeros, false);
		});

	//Solo permite introducir numeros y la tecla enter.
	function soloNumeros(e){
		var key = window.event ? e.which : e.keyCode;
		if (key != 13){
			if (key < 48 || key > 57) {
				e.preventDefault();
			}
		}else{
			var pTipoIdentificacion = "";
	        var pNumeroIdentificacion = "";
	        pTipoIdentificacion = $("#cmbTipoIdentificacion option:selected").val();
	        pNumeroIdentificacion = $("#identificacion").val();
			if (pNumeroIdentificacion == ""){
				mostrarPopUpError("Por favor ingrese un número de identificación");
			}
			else{
	            consultarCargasTercero();
			}
		}
	}

	$("#btnAsignacion").click(function(){ 
		var pTipoIdentificacion = "";
        var pNumeroIdentificacion = "";
        pTipoIdentificacion = $("#cmbTipoIdentificacion option:selected").val();
        pNumeroIdentificacion = $("#identificacion").val();
		if (pNumeroIdentificacion == ""){
			mostrarPopUpError("Por favor ingrese un número de identificación");
		}
		else{
            window.location.href = "../html/asignacion.html?tipoidentificacion="+pTipoIdentificacion+"&&identificacion="+pNumeroIdentificacion;
		}
	});

	$("#btnOferente").click(function(){
            window.location.href = "../html/oferente.html";
	});

	function consultarCargasTercero(){
		var cookies = $.cookie();
		for(var cookie in cookies) {
		   $.removeCookie(cookie);
		}
		cursosInscritos=[];
		$('#modulosCursados').text('');
		var identificacion = $("#identificacion").val();
		var tipoidentificacion = $("#cmbTipoIdentificacion").val();
		$.post("../../controlador/fachada.php", {
					clase: 'clsParticipante',
					oper: 'verificarParticipante',
					pNumeroIdentificacion: identificacion,
					pTipoIdentificacion: tipoidentificacion
				}, function(data){
					if(data == 0){
						swal({title: "No se encontró el Oferente",
								text: "",
								showConfirmButton: true,
								showCancelButton: true,
								confirmButtonClass: "btn-danger",
	  							confirmButtonText: "Agregar Oferente",
	  							cancelButtonText: "Cancelar",
								type: "error"
							},
							function(isConfirm) {
							  if (isConfirm) {
							   	window.location.href = "../html/oferente.html";
							  } 
							});
							$('#modulosCursados').text('');
							$("#nombreApellido").val('')
							$("#telefono").val('');
							$("#estado").val('');
							$('#tablaDinamica').empty();
					}else{
						$.post("../../controlador/fachada.php", { 
							clase: 'clsParticipante',
							oper: 'ConsultarParticipante',
							pNumeroIdentificacion: identificacion,
							pTipoIdentificacion: tipoidentificacion
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
										$.cookie("rutasoporte", carga[13]);
										
										cursosInscritos.push({"rutaId": $.cookie("rutaId"),
											"cursoId":$.cookie("cursoId"),
											"curso":$.cookie("curso"),
											"convocatoria":$.cookie("convocatoria"),
											"cargaId":$.cookie("cargaId")
										});

									});
									consultarModulosVistos();
								}else{
									swal({title: "El estudiante existe, pero no tiene cursos inscritos",
									text: "",
									showConfirmButton: true,
									showCancelButton: true,
									confirmButtonClass: "btn-danger",
	  								confirmButtonText: "Agregar Asignación",
	  								cancelButtonText: "Cancelar",
									type: "error"
									},
									function(isConfirm) {
									  if (isConfirm) {
									   	window.location.href = "../html/asignacion.html?tipoidentificacion="+tipoidentificacion+"&&identificacion="+identificacion;
									  } 
									});
									$('#modulosCursados').text('');
									$("#nombreApellido").val('')
									$("#telefono").val('');
									$("#estado").val('');
									$('#tablaDinamica').empty();
								}
							}else{
								swal({title: "El estudiante existe, pero no tiene cursos inscritos",
								text: "",
								showConfirmButton: true,
								showCancelButton: true,
								confirmButtonClass: "btn-danger",
  								confirmButtonText: "Agregar Asignación",
  								cancelButtonText: "Cancelar",
								type: "error"
								},
								function(isConfirm) {
								  if (isConfirm) {
								   	window.location.href = "../html/asignacion.html?tipoidentificacion="+tipoidentificacion+"&&identificacion="+identificacion;
								  } 
								});
								$('#modulosCursados').text('');
								$("#nombreApellido").val('')
								$("#telefono").val('');
								$("#estado").val('');
								$('#tablaDinamica').empty();
							}
			},"json");
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
						$("#modulosCursados").append(data[i].Nombre + ", " + data[i].NombreCurso + ", " + data[i].Salon+ ", " + data[i].Estado + "\n-------------------\n") ; 
					}
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
			var curso = cursosInscritos[indice]; 
			$.post("../../controlador/fachada.php", {
				clase: 'clsModulo',
				oper: 'ConsultarModulosPorRutaCurso',
				rutaId: curso.rutaId,
				cursoId: curso.cursoId
			}, function(data) { 
				if(data !== null){
					if (data !== 0) {
						for (var i = 0; i < data.length; i++) { 
							var modulo = data[i];
							if(!isInArray(modulo.IdModulo, modulosAgregadosId)) {
								modulo.idCarga = curso.cargaId;
								if (modulo.rutaId === "1" || modulo.rutaId === "10") {
									modulo.Curso = modulo.Modulo;
								}else{
									modulo.Curso = curso.curso;
								}
								modulo.Convocatoria = curso.convocatoria;
								modulo.rutasoporte = '<a href="'+"../"+$.cookie("rutasoporte")+'" target="_blank">Soporte</a>';
								modulosAgregados.push(modulo.Modulo);
								informacionTabla.push(modulo);
								modulosAgregadosId.push(modulo.IdModulo);
							}
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
		var nombresColumnas = {0:"Módulo", 1:"Ruta", 2:"idModulo", 3:"idCarga", 4:"Ruta Id", 5:"Curso", 6:"Convocatoria", 7:"Soporte"};
		informacion = reemplazarColumnas(nombresColumnas, informacion);
		var definicionColumnas = [{"className": "dt-center", "targets": "_all"}];
		definicionColumnas.unshift({"visible": false, "searchable": false,"targets": [2,3,4]});
		tabla = $('#tablaDinamica').DataTable({
			"data": informacion.datos,
			"columns": informacion.columnas,
			"columnDefs": definicionColumnas,
			colReorder: true
		});
		tabla.colReorder.order( [ 1, 0, 2, 3, 4, 5, 6,7] );
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

	function cargarListas(objeto,procedimiento) {
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsUtilidades',
	        oper: 'cargarListas',
	        objeto: objeto,
	        procedimiento: procedimiento
	    }, function(data) {
	        if (data !== 0) {
	            formarOptionValueLista(data,objeto);
	        }
	        else {
	            alert('error');
	        }
	    }, "json");
	} 

	function formarOptionValueLista(data,objeto) {
	    $('#'+objeto).find('option').remove();
	    for (i = 0; i < data.length; i++) {
	        $('#'+objeto).append($('<option>', {
	            value: data[i].Id,
	            text: data[i].Nombre
	        }));
	    }
	} 

	//----- Establece los valores por defecto de las listas -----//
	function cargarValorSelected(objeto,value,tiempo){
        setTimeout(function() {
            $(objeto+' option[value="'+value+'"]').attr('selected','selected');    
        }, tiempo);       
    }

	function mostrarPopUpError(err_men) {
	    $("#textoError").text(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}

});


