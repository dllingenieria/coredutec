$(function () {  
	//se declaran estas variables como globales
	var servicioEducativo, fechaEvaluacion, docente, 
	lugarServicio, satisfaccion, descripcionSatisfaccion, 
	descripcionServicio, aspectosPositivos, aspectosParaMejorar, 
	claridad, metodologia, contenidos, material, instalaciones, 
	objetivos, tiempos;
	 var columnas = new Array(
        { title: "Código" },
        { title: "Módulo" },
        { title: "Curso" },
		{ title: "Duración" },
		{ title: "Preprogramacion" },
		{ title: "Salon" }
        );
	var columnasCurso = new Array(
        { title: "Id" },
        { title: "Código" },
        { title: "Curso" },
        { title: "Duración" }
        );
	
	codigo = "";
	nombreModulo="";
	nombreCurso="";
	evaluacion="";
	var tablaModulos;
	//sessionStorage.tip_conf=0
	
	// $.datepicker.regional['es'] = {
        // currentText: 'Hoy',
        // monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        // monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        // dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        // dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        // dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        // weekHeader: 'Sm',
        // dateFormat: 'yy-mm-dd',
        // firstDay: 1,
        // isRTL: false,
        // showMonthAfterYear: false,
        // yearSuffix: '',
		// changeMonth: true,
		// changeYear: true
		
    // };
	// $.datepicker.setDefaults($.datepicker.regional['es']);
	// $('#txtFechaNacimiento').datepicker({
    // //comment the beforeShow handler if you want to see the ugly overlay
    // beforeShow: function() {
        // setTimeout(function(){
            // $('.ui-datepicker').css('z-index', 99999999999999);
        // }, 0);
    // }
// });
	//$("#txtFechaNacimiento").datepicker();
	cargarDatosGeneralesEvaluacion();
	//cargarDocentes();
	cargarModulosVistosAevaluar(); //para evaluacion
	cargarCursos();
	
	//para que cargue los datos
	//$("#txtIdMatricula").val(sessionStorage.IdMatricula); 
	//$("#txtIdentificacion").val(sessionStorage.Identificacion);
	
	
	//llenarDatos();
	$("#guardarGestion").click(function(){
		if(validarCampos()){
			agregarEvaluacion();
		}
		else{
			PopUpError("Debe ingresar datos para la evaluación");
		}
	});

	function validarCampos(){
		
		var valido=true;   
		
		docente = $("#hidddocentes").val();
		satisfaccion = $("#satisfaccion :selected").val();
		descripcionSatisfaccion = $("#descripcionSatisfaccion").val(); //es obligatorio si calificacion es 3 o menor
		descripcionServicio = $("#descripcionServicio").val(); //es obligatorio si calificacion es 3 o menor
		
		aspectosPositivos = $("#aspectosPositivos").val(); //no es obligatorio
		aspectosParaMejorar = $("#aspectosParaMejorar").val(); //no es obligatorio
	
		
		//Se verifica si alguno de los radios esta seleccionado claridad
		if ($('input[name="claridad"]').is(':checked')) {
			valido=true;
		} else {
			valido=false;  console.log(1);
		}
		
		//Se verifica si alguno de los radios esta seleccionado metodologia
		if ($('input[name="metodologia"]').is(':checked')) {
			valido=true;
		} else {
			valido=false; console.log(2);
		}
		
		//Se verifica si alguno de los radios esta seleccionado metodologia contenidos
		if ($('input[name="contenidos"]').is(':checked')) {
			valido=true;
		} else {
			valido=false; console.log(3);
		}
		
		//Se verifica si alguno de los radios esta seleccionado metodologia material
		if ($('input[name="material"]').is(':checked')) {
			valido=true;
		} else {
			valido=false;  console.log(4);
		}
		
		//Se verifica si alguno de los radios esta seleccionado metodologia instalaciones
		if ($('input[name="instalaciones"]').is(':checked')) {
			valido=true;
		} else {
			valido=false;  console.log(5);
		}
		
		//Se verifica si alguno de los radios esta seleccionado metodologia objetivos
		if ($('input[name="objetivos"]').is(':checked')) {
			valido=true;
		} else {
			valido=false;  console.log(6);
		}
		
		//Se verifica si alguno de los radios esta seleccionado metodologia tiempos
		if ($('input[name="tiempos"]').is(':checked')) {
			valido=true;
		} else {
			valido=false;  console.log(7);
		}
		
		claridad = $("input[type='radio'][name='claridad']:checked").val(); 
		metodologia = $("input[type='radio'][name='metodologia']:checked").val();
		contenidos = $("input[type='radio'][name='contenidos']:checked").val();
		material = $("input[type='radio'][name='material']:checked").val();
		instalaciones = $("input[type='radio'][name='instalaciones']:checked").val();
		objetivos = $("input[type='radio'][name='objetivos']:checked").val();
		tiempos = $("input[type='radio'][name='tiempos']:checked").val();
		
		if (docente === "" || satisfaccion === ""){
			valido=false; console.log(8);
		}
		//alert(docente+"-"+satisfaccion+"-"+claridad+"-"+metodologia+"-"+contenidos+"-"+material+"-"+instalaciones+"-"+objetivos+"-"+tiempos+"---"+descripcionSatisfaccion+"-"+descripcionServicio+"-"+aspectosPositivos+"-"+aspectosParaMejorar);
		
		if((satisfaccion ==1 || satisfaccion ==2 || satisfaccion ==3) && descripcionSatisfaccion ==""){
			valido=false; console.log(9);
		}
		
		if((claridad == 1 || claridad ==2 || claridad==3 )&& descripcionServicio==""){
			valido=false; console.log(10); 
		}
		
		if((metodologia == 1 || metodologia ==2 || metodologia==3) && descripcionServicio==""){
			valido=false; console.log(11);
		}
		
		if((contenidos == 1 || contenidos ==2 || contenidos==3) && descripcionServicio==""){
			valido=false; console.log(12);
		}
		
		if((material == 1 || material ==2 || material==3) && descripcionServicio==""){
			valido=false;  console.log(13);
		}
		
		if((instalaciones == 1 || instalaciones ==2 || instalaciones==3) && descripcionServicio==""){
			valido=false; console.log(14);
		}
		
		if((objetivos == 1 || objetivos ==2 || objetivos==3) && descripcionServicio==""){
			valido=false; console.log(15);
		}
		
		if((tiempos == 1 || tiempos ==2 || tiempos==3) && descripcionServicio==""){
			valido=false; console.log(16);
		}
		
		 return valido;
	}

	function agregarEvaluacion(){
		//console.log("Entra");
		$.post("../../controlador/fachada.php", {
			clase: 'clsDocente',
			oper: 'agregarEvaluacion',
			docente:docente,
			satisfaccion:satisfaccion,
			descripcionSatisfaccion: descripcionSatisfaccion,
			descripcionServicio: descripcionServicio,
			aspectosPositivos: aspectosPositivos,
			aspectosParaMejorar: aspectosParaMejorar,
			claridad: claridad,
			metodologia: metodologia,
			contenidos: contenidos,
			material: material,
			instalaciones: instalaciones,
			objetivos: objetivos,
			tiempos: tiempos,
			codigo:codigo,
			idTercero:sessionStorage.idTercero
			
		}, function(data) {
			if (data !== 0) {
				popUpConfirmacion('Evaluación guardada exitosamente');
				setTimeout(function() {
					location.reload(true);
					sessionStorage.servicio="";
					sessionStorage.docente="";
					sessionStorage.lugar=""; 
					sessionStorage.nombreDocente=""; 
				}, 3000);
				
				// $("divListaModulos").show();
				// $("divEvaluacion").hide();
				
			}else {
				PopUpError('No se pudo guardar la Evaluación');
			}}, "json");
	}

	function cargarDocentes(){ 
		$.post("../../controlador/fachada.php", {
			clase: 'clsDocente',
			oper: 'consultarDocentes'
		}, function(data) {
			if (data !== 0) {
				cargarSelect(data, "#docentes");
			}else {
				alert('error cargarSedes');
			}}, "json");
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
	
	$("#btnIngresar").click(function(){
		ingresarAEvaluacion();
		
	});
	
	function ingresarAEvaluacion(){ 		
		IdMatricula=$("#txtIdMatricula").val(); 
		sessionStorage.IdMatricula=IdMatricula;
		identificacion=$("#txtIdentificacion").val();
		sessionStorage.Identificacion=identificacion;
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsVerificarIngresoEvaluacion',
			oper: 'verificarIngreso',
			code:$("#code").val(),
			IdMatricula:IdMatricula,
			identificacion:identificacion
			
		}, function(data) {
			if (data.error !== "") {
				PopUpError(data.mensaje);
				 //setTimeout(function() {
					//location.reload(true);
					
					// d = new Date();
					// $("#imagen-captcha").attr("src", "../../modelo/captcha.php?"+d.getTime());
					// $("#code").val("");
					// $("#code").focus();
					
					//$("#captcha").load(location.href + " #captcha");
				//}, 4000);				
			}else {
				//PopUpError(data.mensaje); 
				console.log(data);
				sessionStorage.nombres=data['nombres']; 
				sessionStorage.idTercero=data['Id']; 
				sessionStorage.numeroIdentificacion=data['NumeroIdentificacion'];
				sessionStorage.lugarExpedicion=data['LugarExpedicion'];
				//sacar popup para seleccionar si desea evaluar
					var divSeleccionModulo = $('<div>').attr({
											 
											 id: 'divSeleccionModulo'
											 });
											 
											// agregamos nuevo div a la pagina
											$('body').append(divSeleccionModulo);
											
											
											var ancho = 600; 
											var alto = 250;
											
											// fondo transparente
											 // creamos un div nuevo, con un atributo
											 var bgdiv = $('<div>').attr({
											 
											 id: 'bgtransparent'
											 });
											 
											// agregamos nuevo div a la pagina
											$('body').append(bgdiv);
											
											// obtenemos ancho y alto de la ventana del explorer
											 var wscr = $(window).width();
											 var hscr = $(window).height();
					 
											//establecemos el css para el div bgtransparent
											$('#bgtransparent').css({'position':'fixed',
																	'left':'0',
																	'top':'0',
																	'background-color':'#000',
																	'opacity':'0.6',
																	'filter':'alpha(opacity=60)',
																	'z-index':' 10'																	
																	});
																	
											
											
											//establecemos las dimensiones del fondo						
											$('#bgtransparent').css("width", wscr);
											$('#bgtransparent').css("height", hscr);
											
											
											 // ventana modal
											 // creamos otro div para la ventana modal y dos atributos
											 var moddiv = $('<div>').attr({
											 
											 id: 'bgmodal'
											 }); 
											
											// agregamos div a la pagina
											$('body').append(moddiv);
											
											$('#bgmodal').css({
												'position':'fixed', 
												'background-image':'url("../images/popupblanco.png")',
												'font-family': "Roboto-Bold",
												'font-size': '16px',
												'border-radius':'15px',
												'overflow':'auto',
												'color':'#000',
												'padding':'20px',
												'width':'380px',
												'height':' 96px',
												'padding': '10px 40px',
												'text-align':'center',
												'z-index':' 20'
												});
											
											// $( "#bgmodal" ).addClass( "element_to_pop_upMensaje" );					
											// agregamos contenido HTML a la ventana modal
											// $('#bgmodal').append(contenidoHTML);
											$('#bgmodal').html("");
											
											//se agrega los botones al div
											
											
											// $('#bgmodal').append(data.html);
											$('#bgmodal').append('<div><label class="popup"><br><br>Que acción desea realizar?</label><br><br><button id="btnEvaluacion" class="seleccionar">Evaluación</button><button id="btnCertificado" class="seleccionar">Certificados</button></div>');
											// $('#bgmodal').append('<div><label class="popup"><br><br>Que acción desea realizar?</label><br><br><button id="btnEvaluacion" class="seleccionar">Evaluación Módulos</button></div>');
											
											//response.html
											// redimensionamos para que se ajuste al centro y mas
											$(window).resize();
											 $("button[id^=btnEvaluacion]").click(function(){ window.location.href = "evaluacion.html"; });
											$("button[id^=btnCertificado]").click(function(){ window.location.href = "certificado.html"; });
											 
											 $('.seleccionar').css({
												 'width': '180px',
												 'height': '27px',
												 'background':'#003265', 
												 'color': '#ffffff',
												 'font-family': 'Roboto-Light', 
												 'font-size': '16px', 
												 'border-radius': '6px 6px 6px 6px'
											 });
											 
				
				//window.location.href = "evaluacion.html";
				
			}}, "json");
	}
	
	function PopUpError(msj){
    $("#textoError").text(msj);
    $('#element_to_pop_upMen').bPopup({
       speed: 450,
       transition: 'slideDown'
   });
}

	function popUpConfirmacion(msj){
		$("#textoConfirmacion1").text(msj);
		$('#element_to_pop_upCon').bPopup({
		   speed: 450,
		   transition: 'slideDown'
	   });
}

function cargarDatosGeneralesEvaluacion(){ //alert("entro");
		//alert("sisi"+sessionStorage.IdMatricula);
		
		var sessionvalsel=sessionStorage.getItem("IdMatricula");
		if(sessionvalsel !== null){//alert("entroooo");

			$.post("../../controlador/fachada.php", {
				clase: 'clsVerificarIngresoEvaluacion',
				oper: 'cargarDatosGeneralesEvaluacion',
				IdMatricula:sessionStorage.IdMatricula
			}, function(data) {
				if (data == "") {
					PopUpError("No se pudieron consultar los datos generales de la evaluación");
					 setTimeout(function() {
					window.location.href = "ingresoEvaluacion.html";
					}, 4000);
					
				}else {
					
					//console.log(data); //alert(data[0]['Nombre']);
					sessionStorage.servicio=data[0]['Nombre'];
					sessionStorage.docente=data[0]['IdDocente'];
					sessionStorage.lugar=data[0]['Sede']; 
					sessionStorage.nombreDocente=data[0]['Docente']; 
					var f = new Date();
					var mes = f.getMonth();
					var mes1=(mes*1)+1;
					if (mes1 >= 1 && mes1 <= 9){ 
						mes1="0"+mes1;
					}
					var dia = f.getDate();
					if (dia >= 1 && dia <= 9){ 
						dia="0"+dia;
					}
					var fechaActual = f.getFullYear()+ "-" + mes1 + "-" +dia;
					sessionStorage.fechaActual=fechaActual;
										
					//Se llena los datos de la información general
					$("#hidddocentes").val(sessionStorage.docente); 
					$("#fechaEvaluacion").val(sessionStorage.fechaActual);
					$("#docentes").val(sessionStorage.nombreDocente);
					$("#lugarServicio").val(sessionStorage.lugar);
					$("#servicioEducativo").val(sessionStorage.servicio);
					$("#divNombre").html("<b>Bienvenido (a): "+sessionStorage.nombres+"</b>");
					
				}}, "json");
		}
		// else{
			// alert("vacia");
		// }
	}
	
	function llenarDatos(){ //alert("hh"+sessionStorage.lugar+"-"+sessionStorage.servicio+"-"+sessionStorage.docente+"-"+sessionStorage.fechaActual); alert("llenar datos"); 
		$("#txtFechaEvaluacion").val(sessionStorage.fechaActual);
		$("#docentes").val(sessionStorage.docente);
		$("#lugarServicio").val(sessionStorage.lugar);
		$("#servicioEducativo").val(sessionStorage.servicio);
		// $("#servicioEducativo").val("mi servicio");
		
	}
	
	$("#btnEvaluar").click(function(){ 
        if (codigo != "") {
            $("#divEvaluacion").show();
			$("#divListaModulos").hide(); //o destruir el data table
         }
		 else{
			 PopUpError("Debe seleccionar un módulo");
		 }
    });
	
	$("#volverListaModulosaEvaluar").click(function(){ 
   
		tablaModulos.$('tr.selected').removeClass('selected');
		codigo = "";
		$("#divEvaluacion").hide();
		$("#divListaModulos").show(); //o destruir el data table
         
		 
    });
	
	$("#btnVolver").click(function(){ 
        window.location.href = "ingresoEvaluacion.html";
    });
	
	function cargarModulosVistosAevaluar(){ //para evalucion
		
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsVerificarIngresoEvaluacion',
			oper: 'cargarModulosVistosAevaluar',
			identificacion:sessionStorage.Identificacion,
			IdMatricula:sessionStorage.IdMatricula
			
			
		}, function(data) { //console.log(data);
			if (data !== "") {
				// if (data.error == ""){
					cargarDatosEnTabla(data);
					$("#hiddNombEstu").val(sessionStorage.nombres);
					$("#hiddIdenEstu").val(sessionStorage.numeroIdentificacion);
					$("#hiddLugarExp").val(sessionStorage.lugarExpedicion);
					
					//$("#divListaModulos").hide();
					
					
				// }
			}else {
				PopUpError(data.mensaje);
				
			}}, "json");
	}
	
	function cargarModulosVistosParaCertificados(){ //para certificados 
		
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsVerificarIngresoEvaluacion',
			oper: 'cargarModulosVistosAcertificar',
			identificacion:sessionStorage.Identificacion,
			IdMatricula:sessionStorage.IdMatricula
			
			
		}, function(data) { console.log(data);
			if (data !== "") {
				// if (data.error == ""){
					cargarDatosEnTablaCertificados(data);
					$("#hiddNombEstu").val(sessionStorage.nombres);
					$("#hiddIdenEstu").val(sessionStorage.numeroIdentificacion);
					$("#hiddLugarExp").val(sessionStorage.lugarExpedicion);
					
				// }
			}else {
				PopUpError(data.mensaje);
				
			}}, "json");
	}
	
	function cargarCursos(){ //alert("otro");
		
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsVerificarIngresoEvaluacion',
			oper: 'cargarCursos',
			identificacion:sessionStorage.Identificacion,
			IdMatricula:sessionStorage.IdMatricula
			
			
		}, function(data) { //console.log(data);
			if (data !== "") {
				// if (data.error == ""){
					cargarDatosEnTablaCurso(data);
					$("#hiddNombEstu1").val(sessionStorage.nombres);
					$("#hiddIdenEstu1").val(sessionStorage.numeroIdentificacion);
					$("#hiddLugarExp1").val(sessionStorage.lugarExpedicion);
					
					
				// }
			}else {
				PopUpError(data.mensaje);
				
			}}, "json");
	}
	
	function cargarDatosEnTablaCurso(data){ 
	//se destruye el datatable al inicio
	if(typeof tablaCursos !== "undefined"){
            tablaCursos.destroy();
            $('#tablaCursos').empty();
        }
	
        var tablaCursos = $('#tablaCursos').DataTable({
            "data": data,
            columns: columnasCurso,
            "paging":   false,
            "info":     false,
			"columnDefs": [
			{"className": "dt-center", "targets": "_all"},
			{"targets": [ 0 ],"visible": false,"searchable": false},
			{"targets": [ 3 ],"visible": false,"searchable": false}
			],
			"bDestroy": true,
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
		
		 $('#tablaCursos tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { //alert("hi");
                $(this).removeClass('selected');
				codigo ="";
				
				nombreCurso="";
				duracion="";
				$("#hiddcodigo1").val(codigo);
				$("#hiddNombreCur1").val(nombreCurso);
				$("#hiddModulo1").val("");
				$("#hiddDuracion1").val(duracion);
				
            }else{ //alert("ho");
                tablaCursos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
				codigo = tablaCursos.row(this).data()[1]; //alert(codigo);
				nombreCurso = tablaCursos.row(this).data()[2]; //alert(codigo);
				duracion = tablaCursos.row(this).data()[3]; //alert(nombreCurso);
				$("#hiddcodigo1").val(codigo); 
				$("#hiddNombreCur1").val(nombreCurso);
				$("#hiddModulo1").val("curso");
				$("#hiddDuracion1").val(duracion);
				
            }
             
            
        } );
		
    }
	
	function cargarDatosEnTabla(data){  //para evaluacion
	//se destruye el datatable al inicio
	if(typeof tablaModulos !== "undefined"){
            tablaModulos.destroy();
            $('#tablaModulos').empty();
        }
	
        tablaModulos = $('#tablaModulos').DataTable({
            "data": data,
            columns: columnas,
            "paging":   false,
            "info":     false,
			"columnDefs": [
			{"targets": [ 3 ],"visible": false,"searchable": false},
			{"targets": [ 4 ],"visible": false,"searchable": false}
			],
			"bDestroy": true,
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
		
		 $('#tablaModulos tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { //alert("hi");
                $(this).removeClass('selected');
				codigo ="";
				$("#hiddcodigo").val(codigo);
				
            }else{ //alert("ho");
                tablaModulos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
				codigo = tablaModulos.row(this).data()[4]; //alert(codigo); codigo de la preprogramacion
				$("#hiddcodigo").val(codigo);
            }
             
            
        } );
		
    }
	
	function cargarDatosEnTablaCertificados(data){   
	//se destruye el datatable al inicio
	if(typeof tablaModulosCertificados !== "undefined"){
            tablaModulosCertificados.destroy();
            $('#tablaModulosCertificados').empty();
        }
	
        var tablaModulosCertificados = $('#tablaModulosCertificados').DataTable({
            "data": data,
            columns: columnas,
            "paging":   false,
            "info":     false,
			"columnDefs": [
			{"targets": [ 3 ],"visible": false,"searchable": false},
			{"targets": [ 4 ],"visible": false,"searchable": false}
			],
			"bDestroy": true,
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
		
		 $('#tablaModulosCertificados tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { //alert("hi");
                $(this).removeClass('selected');
				codigo ="";
				nombreModulo="";
				nombreCurso="";
				duracion="";
				$("#hiddcodigo").val(codigo);
				$("#hiddNombreMod").val(nombreModulo);
				$("#hiddNombreCur").val(nombreCurso);
				$("#hiddModulo").val("");
				$("#hiddDuracion").val(duracion);
				
            }else{ //alert("ho");
                tablaModulosCertificados.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
				codigo = tablaModulosCertificados.row(this).data()[4]; //alert(codigo);
				nombreModulo = tablaModulosCertificados.row(this).data()[1]; //alert(nombreModulo);
				nombreCurso = tablaModulosCertificados.row(this).data()[2]; //alert(nombreCurso);
				duracion = tablaModulosCertificados.row(this).data()[3]; //alert(nombreCurso);
				$("#hiddcodigo").val(codigo);
				$("#hiddNombreMod").val(nombreModulo); 
				$("#hiddNombreCur").val(nombreCurso);
				$("#hiddModulo").val("modulo");
				$("#hiddDuracion").val(duracion);
            }
             
            
        } );
		
    }
	
	$("#btnModulos").click(function(){ 
		$("#divListaModulosCertificados").show();
		cargarModulosVistosParaCertificados();
		//$("#divOpcionBtn").hide();
		$("#divListaCursos").hide();
		
	});
	
	
	$("#btnVolverAcursos").click(function(){ 
		$("#divListaModulosCertificados").hide();
		//$("#divOpcionBtn").hide();
		$("#divListaCursos").show();
		
	});
	
	
	$("#btnGenerarCertiM").click(function(){ 
        if (codigo != "") { //alert("Debe seleccionar un módulo");
           
		   $('#frmCertiM').attr('action', '../../modelo/certificado.php?hiddNombEstu=hiddNombEstu&hiddIdenEstu=hiddIdenEstu&hiddcodigo=hiddcodigo&hiddLugarExp=hiddLugarExp&hiddModulo=hiddModulo&hiddNombreMod=hiddNombreMod&hiddNombreCur=hiddNombreCur&hiddDuracion=hiddDuracion');
			codigo == "";
		   
				
			$('#frmCertiM').submit();
				
			
         }
		 else{
			PopUpError("Debe seleccionar un módulo");
		 }
    });
	
	$("#btnGenerarCertiC").click(function(){  //alert("codigo entro"+codigo);
        if (codigo != "") { //alert("Debe seleccionar un módulo");
           
		   // $('#frmCertiC').attr('action', '../../modelo/certificado.php?hiddNombEstu=hiddNombEstu1&hiddIdenEstu=hiddIdenEstu&hiddcodigo=hiddcodigo&hiddLugarExp=hiddLugarExp&hiddModulo=hiddModulo&hiddNombreCur=hiddNombreCur&hiddDuracion=hiddDuracion');
		   $('#frmCertiC').attr('action', '../../modelo/certificado.php');
			codigo == "";
		   
				
			$('#frmCertiC').submit();
				
			
         }
		 else{
			PopUpError("Debe seleccionar un Curso");
		 }
    });
	
	$(window).resize(function(){
	var ancho = 420; 
    var alto = 150;
 // dimensiones de la ventana del explorer 
 var wscr = $(window).width();
 var hscr = $(window).height();

 // estableciendo dimensiones de fondo
 $('#bgtransparent').css("width", wscr);
 // $('#bgtransparent').css("height", hscr);
 $('#bgtransparent').css("height", 2500);
 
 // estableciendo tamaño de la ventana modal
 $('#bgmodal').css("width", ancho+'px');
 $('#bgmodal').css("height", alto+'px');
 
 // obtiendo tamaño de la ventana modal
 var wcnt = $('#bgmodal').width();
 var hcnt = $('#bgmodal').height();
 
 // obtener posicion central
 var mleft = ( wscr - wcnt ) / 2;
 var mtop = ( hscr - hcnt ) / 2;
 
 // estableciendo ventana modal en el centro
 $('#bgmodal').css("left", mleft+'px');
 $('#bgmodal').css("top", mtop+'px');
 });
 
 $( "#satisfaccion" ).change(function() { 
		validarSatisfaccion();
	});
	
	function validarSatisfaccion(){
		
		var satisfaccion= $("#satisfaccion").val();
		if(satisfaccion ==1 || satisfaccion ==2 || satisfaccion ==3){
			PopUpError("Debe indicar el porque de su calificación");
		}
		
		
	}
	
	// $( ".tablaE" ).change(function() { 
		// validarTablaE();
	// });
	
	// function validarTablaE(){
		// var satisfaccion="";
		// $(".tablaE").each(function(e){
			// satisfaccion=$( this ).val();
			// if(satisfaccion ==1 || satisfaccion ==2 || satisfaccion ==3){
				// PopUpError("Debe indicar el porque de su calificación");
			// }
		// });
		
	// }
	
});