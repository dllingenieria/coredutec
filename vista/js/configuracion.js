// JavaScript Document
$(function(){
	tipoconfiguracion="";
	var table;
	var proceso;
	var cam_vac;
	var msj1="";
	idUsuarioNom="";
  	inicializar();
	
	function inicializar(){
		$("#btn-view").hide();
		$("#btn-add").hide();
		$("#btn-view1").hide();
		$("#btn-search-tercero").hide();
		$("#view-all-tercero").hide();
		

		var sessionvalsel=sessionStorage.getItem("val_sel");
			if(sessionvalsel !== null){		
				tipoconfiguracion=sessionStorage.val_sel;
				$("#tablas").val(tipoconfiguracion);
					CargarDatos();
		}


		$("#tablas").change(function(){
			if($(this).val()!=0){
				tipoconfiguracion= $(this).val();
				sessionStorage.setItem("val_sel",tipoconfiguracion);
				window.location.href="configuracion.html";
		        CargarDatos();
		        $(this).removeClass('selected');
		     }
   		});
	}

	$("#btn-search-tercero").click(function(){
	$("#txt-Buscar").val("");
	  $("#textoBusqueda").text("Ingrese No Cedula Tercero");
	  $('#element_to_pop_up_buscar').bPopup({
	  	 	modalClose: true,
          	speed: 450,
        	transition: 'slideDown'
        })
	});  

	$("#btnSearch").click(function(){
		$("#view-all-tercero").show();
		tipoconfiguracion='7';
		CargarDatos();
	});  

	$("#view-all-tercero").click(function(){
		tipoconfiguracion='6';
		CargarDatos();
		$("#view-all-tercero").hide();
	});

	//Evento que carga el formulario que se necesita para agregar un registro//
	$("#btn-add").click(function(){
		var html="";
		var data = table.row($(this).parents('tr')).data();

			switch(tipoconfiguracion) {
			    case '1':
			    	sessionStorage.tip_conf=0;
				   	html="tipoParametro.html";
			    break;
			    case '2':
			    	sessionStorage.tip_conf=2;
				   	html="parametro.html";
			    break;
			    case '3':
			    	sessionStorage.tip_conf=4;
				   	html="convocatoria.html";
			    break;
			    case '4':
			    	sessionStorage.tip_conf=6;
			    	html="curso.html";
			    break;
			    case '5':
			    	sessionStorage.tip_conf=11;
			    	html="modulo.html";
			    break;
			    case '6':
			   		proceso=="Insertar";
			    	sessionStorage.tip_conf=8;
			    	html='usuario.html';
			    	$("#btn-search-tercero").hide();
					$("#view-all-tercero").hide();
			    break;
			}

		$(".content-loader").fadeOut('slow', function()
		{
			$(".content-loader").fadeIn('slow');	
			$(".content-loader").load(html);

		});
	});



	///Evento que guarda Registro//
	$(document).on('click', '#btn-save', function() {
		 ///Verifica que tipo de configuración es para cargar la información que se necesita///
	   proceso="Insertar";
       var mensajeConfirmacion="Datos guardados satisfactoriamente.";
       var mensajeError="No se pudo guardar Datos"; 
       var val_cam='';
       if(tipoconfiguracion==6){
       		val_cam+= ValidarUsuario();
       }    
       	
       val_cam+=validarCampos();

       var parametros={};
       //alert(val_cam);
    	//valida si lleno campos completos	
    	if (val_cam.length === 0) {	
    	//Abre switch	
	     switch(tipoconfiguracion){
	     	//Adiciona nuevos registros para tipo parametro
	     	
			case '1':

				parametros = {
								clase: 'clsConfiguracion',
								oper: 'AgregarTipoParametro',
								tpNombre:$("#txtNombreTipoParametro").val(),
							    tpEstado:$("#txtEstadoTipoParametro").val()
								};
			break;
			//Adiciona nuevos registros para parametro
			case '2':
					parametros = {
									clase: 'clsConfiguracion',
									oper: 'AgregarParametro',
									idTipoParametro: sessionStorage.id_tpar,
									tpNombre:$("#txtNombreParametro").val(),
							        tpEstado:$("#txtEstadoParametro").val()
								};
			break;	
			//Adiciona nuevos registros para convocatoria
			case '3':
					parametros = {
									clase: 'clsConfiguracion',
									oper: 'AgregarConvocatoria',
									conNombre:$("#txtNombreConvocatoria").val(),
									conNombreCorto:$("#txtNombreCortoConvocatoria").val(),
									conSerie:$("#txtSerieConvocatoria").val(),
							        conEstado:$("#txtEstadoConvocatoria").val()
								};
			break;	
			//Adiciona nuevos registros para curso
			case '4':
					parametros = {
									clase: 'clsConfiguracion',
									oper: 'AgregarCurso',
									curCodigo: $("#txtCodigoCurso").val(),
									curNombre:$("#txtNombreCurso").val(),
									curDuracion:$("#selectDuracionCurso").val(),
							        curRuta:$("#selectRutaCurso").val(),
							        curEstado:$("#txtEstadoCurso").val()
								};
			break;	
			//Adiciona nuevos registros para Modulos
			case '5':
					parametros = {
									clase: 'clsConfiguracion',
									oper: 'AgregarModulo',
									modCodigo: $("#txtCodigoModulo").val(),
									modNombre:$("#txtNombreModulo").val(),
									modDuracion:$("#txtDuracionModulo").val(),
							        modFormacion:$("#selectTipoFormacionModulo").val(),
							        modArea:$("#selectAreaOcupacionalModulo").val(),
							        modMaximo:$("#txtCupoMinimoModulo").val(),
							        modMinimo:$("#txtCupoMaximoModulo").val(),
							        modCapacitacion:$("#selectTipoCapacitacionModulo").val(),
							        modEstadoAsistencia:$("#selectEstadoAsistenciaModulo").val(),
							        modCertificacion:$("#selectCertificacionEmitidaModulo").val(),
							        modCurso:sessionStorage.id_cur
								};
			break;	
			//Adiciona nuevos registros para Usuario
			case '6':
					var rol= getCheckedCheckboxesFor();
					parametros = {
									clase: 'clsConfiguracion',
									oper:  'AgregarUsuario',
									tIdenUsu: $("#cmbTipoIdentificacion").val(),
									IdeUsu:$("#txtIdentificacion").val(),
									LExpUsu:$("#cmbLugarExpedicion").val(),
							        NomUsu:$("#txtNombres").val(),
							       	ApeUsu:$("#txtApellidos").val(),
							       	FNacUsu:$("#txtFechaNacimiento").val(),
							       	sexUsu:$("#cmbSexo").val(),
							       	ECivUsu:$("#cmbEstadoCivil").val(),
							       	gEscUsu:$("#cmbGradoEscolaridad").val(),
							       	te1Usu:$("#txtTelefono1").val(),
							       	te2Usu:$("#txtTelefono2").val(),
							       	te3Usu:$("#txtTelefono3").val(),
							       	dirUsu:$("#txtDireccion").val(),
							       	emaUsu:$("#txtEmail").val(),
							       	locUsu:$("#cmbLocalidad").val(),
							       	ciuUsu:$("#cmbCiudadResidencia").val(),
							       	estUsu:$("#txtEstadoUsuario").val(),
							       	usuUsu:$("#txtUsuario").val(),
							       	passUsu:$("#txtPassword").val(),
							       	rolUsu:rol[0],
							       	carUsu:rol[1]
								};
			break;	
		}
			//cierra switch	
				var mensaje="Guardando Registro";
				jsShowWindowLoad(mensaje);
				$.post("../../controlador/fachada.php", 
					parametros
					, function(data) {
						if(tipoconfiguracion=='6'){
								if(data=="0"){
									jsRemoveWindowLoad();
									mensajeConfirmacion="Ya existe un tercero con esta identificacion, ingrese a modificarlo";
								}
						}
						if (data !== 0) {
							if(data !== null){
								jsRemoveWindowLoad();
								 PopUpConfirmacion(mensajeConfirmacion);
							}else{ 
								jsRemoveWindowLoad();
								PopUpConfirmacion(mensajeConfirmacion);   
							}             	
						}else {
							jsRemoveWindowLoad();
							PopUpError(mensajeError);
						}
					}, "json");

			} else {
				//fin si lleno campos completos	
				jsRemoveWindowLoad();
	       		PopUpError('Faltan algun(os) campos obligatorios por llenar. ('+val_cam+')');
	    	}
	   });


	/*Evento que Edita Registro*/
	$(document).on('click', 'button').on('click', '#btn-edit', function() {
		proceso="Actualizar";
		var mensajeConfirmacion="Datos modificados satisfactoriamente.";
	    var mensajeError="No se pudo modificado los Datos";
	    var tipoParametro="";
	    var parametros={};	 
	    var val_cam='';
	    var camposValidados='';

	    if(tipoconfiguracion==6){
      		ValidarUsuario();
      		//alert(idUsuarioNom);
      	}

	 	setTimeout(function() {
	 	if(idUsuarioNom>0){
	 		val_cam+=" Ya existe un usuario: "+$("#txtUsuario").val()+" - ";
	 	}
       
       camposValidados+=validarCampos();  
       if(camposValidados!=''){
       		val_cam+=" Faltan algun(os) campos obligatorios por llenar "+camposValidados;
       }     	

 	    //Validar que los campos esten llenos
    	if (val_cam.length == 0) {
			 switch(tipoconfiguracion) {
			 		//Modifica datos de tipo parametro
				    case '1':
						if(($("#SelectEstadoTipoParametro").val())=="Activo"){
								estado=1;
							}else{
								estado=2;
						}

						parametros={
									clase: 'clsConfiguracion',
									oper: 'modificarTipoParametro',
									idTipoParametro: sessionStorage.id_tpar,
									tipoParametro:$("#txtNombreTipoParametro").val(),
							        estadoTipoParametro:estado
									};
				    	
				    break;
				    case '2':
				    	parametros={
									clase: 'clsConfiguracion',
									oper: 'modificarParametro',
									idParametro: sessionStorage.id_par,
									idTipoParametro: sessionStorage.id_tpar,
									parametro:$("#txtNombreParametro").val(),
							        estadoParametro:1
						};
					break;
					case '3':

				    	if(($("#SelectEstadoConvocatoria").val())=="Activo"){
								estado=1;
							}else{
								estado=2;
						}
						parametros={
									clase: 'clsConfiguracion',
									oper: 'modificarConvocatoria',
									idConvocatoria: sessionStorage.id_conv,
									conNombre:$("#txtNombreConvocatoria").val(),
									conNombreCorto:$("#txtNombreCortoConvocatoria").val(),
							        conEstado:estado,
							        conSerie: $("#txtSerieConvocatoria").val()
									};
					break;
					case '4':
				    	if(($("#SelectEstadoCurso").val())=="Activo"){
								estado=1;
							}else{
								estado=2;
						}

						parametros={
									clase: 'clsConfiguracion',
									oper: 'modificarCurso',
									idCurso: sessionStorage.id_cur,
							        txtCodigoCurso: $("#txtCodigoCurso").val(),
									txtNombreCurso:$("#txtNombreCurso").val(),
									selectDuracionCurso:$("#selectDuracionCurso").val(),
							        selectRutaCurso:$("#selectRutaCurso").val(),
							        txtEstadoCurso:estado
									};
						break;
					case '5':
					  	if(($("#SelectEstadoModulo").val())=="Activo"){
								estado=1;
							}else{
								estado=2;
						}
						//console.log(sessionStorage.id_mod);
						parametros={
									clase: 'clsConfiguracion',
									oper: 'modificarModulo',
									idModulo: sessionStorage.id_mod,
							        modCodigo: $("#txtCodigoModulo").val(),
									modNombre:$("#txtNombreModulo").val(),
									modDuracion:$("#txtDuracionModulo").val(),
							        modFormacion:$("#selectTipoFormacionModulo").val(),
							        modArea:$("#selectAreaOcupacionalModulo").val(),
							        modMaximo:$("#txtCupoMinimoModulo").val(),
							        modMinimo:$("#txtCupoMaximoModulo").val(),
							        modCapacitacion:$("#selectTipoCapacitacionModulo").val(),
							        modEstadoAsistencia:$("#selectEstadoAsistenciaModulo").val(),
							        modCertificacion:$("#selectCertificacionEmitidaModulo").val(),
							        modEstado:estado,
							        modCurso: sessionStorage.id_cur
									};
						break;
					case '6':
							parametros =CargarParametrosUsuario();
						break;
				}					
				var mensaje="Editando Registro";
				jsShowWindowLoad(mensaje);
				$.post("../../controlador/fachada.php", 
					parametros
				, function(data) {
						if (data !== 0) {
							if(data !== null){
								jsRemoveWindowLoad();
								 PopUpConfirmacion(mensajeConfirmacion);
							}else{ 
								jsRemoveWindowLoad();
								PopUpConfirmacion(mensajeConfirmacion);   
							}             	
						}else {
							jsRemoveWindowLoad();
							PopUpError(mensajeError);
						}
					}, "json");
			} else {
	       			jsRemoveWindowLoad();
	       		   PopUpError(val_cam);	       	
	    		}
	       },2000);

		});

	function CargarParametrosUsuario(){
			var rol= getCheckedCheckboxesFor();
			var estado=0;
			if(($("#selectEstadoUsuario").val())=="Activo"){
					estado=1;
				}else{
					estado=2;
			}
			////Envía el valor del rol que se necesita para guardar usuario////

			if((sessionStorage.idUsu=="") || (sessionStorage.idUsu=="null")){
					idUsu=rol[2];
			}else{
				idUsu=sessionStorage.idUsu;
			}

			////Envía el valor del rol que se necesita para guardar Docente////
			if((sessionStorage.idDocUsu=="") || (sessionStorage.idDocUsu=="null")){
					idDocUsu= rol[3];	
				}else{
					idDocUsu=sessionStorage.idDocUsu;
			}

			if($("#txtPassword").val()==""){
				passUsu="0";
			}else{
				passUsu=$("#txtPassword").val();
			}

			var parametros={        clase:'clsConfiguracion',oper: 'modificarUsuario',idTer: sessionStorage.ITeUsu,tIdenUsu: $("#cmbTipoIdentificacion").val(),IdeUsu:$("#txtIdentificacion").val(),
									LExpUsu:$("#cmbLugarExpedicion").val(),NomUsu:$("#txtNombres").val(),ApeUsu:$("#txtApellidos").val(),FNacUsu:$("#txtFechaNacimiento").val(),
							       	sexUsu:$("#cmbSexo").val(),	ECivUsu:$("#cmbEstadoCivil").val(),gEscUsu:$("#cmbGradoEscolaridad").val(),te1Usu:$("#txtTelefono1").val(),
							       	te2Usu:$("#txtTelefono2").val(),te3Usu:$("#txtTelefono3").val(),dirUsu:$("#txtDireccion").val(),emaUsu:$("#txtEmail").val(),
							       	locUsu:$("#cmbLocalidad").val(),ciuUsu:$("#cmbCiudadResidencia").val(),estUsu:estado,idUsu: idUsu,usuUsu:$("#txtUsuario").val(),passUsu:passUsu,rolUsu:rol[0],
							       	carUsu:rol[1],idDocUsu: idDocUsu};
			return parametros;
	}

	//Evento que va al inicio//
	$("#btn-view").click(function(){
		$("body").fadeOut('slow');
		window.location.href="configuracion.html";
		//$('#tablas').val(sessionStorage.val_sel); 
		//$('#tablas').change();
	});

	//Evento que va al inicio tipo parametro//
	$("#btn-view1").click(function(){
		if(tipoconfiguracion==2){
			valorConfiguracion=1;
		}
		if(tipoconfiguracion==5){
			valorConfiguracion=4;
		}
		$("body").fadeOut('slow');
		$('#tablas').val(valorConfiguracion); 
		$('#tablas').change();
		window.location.href="configuracion.html";
	});


	//Evento que va al inicio despues de salir un popup//
	$("#btnDireccion").click(function(){
		$("body").fadeOut('slow');
		window.location.href="configuracion.html";
	});
	

	//Función que llama a procedimiento consultar y carga los datos en datatable//
	function CargarDatos(){
		$("#btn-add").show();
		var parametros= {};
		var columnas = new Array();
		var mensaje="Procesando la informaci&oacute;n<br>Espere por favor";
		jsShowWindowLoad(mensaje);

        ///Verifica que tipo de configuración es para cargar la información que se necesita///
        switch(tipoconfiguracion) {
			    case '1':
			    	$("#btn-view1").hide();
			    	parametros = {	
			    					clase : "clsConfiguracion",
			    					oper : "consultarCargaTipoParametro"
			    				 };
			    break;
			    case '2':
			    	$("#btn-view1").show();
			    	parametros = {
    								clase : "clsConfiguracion",
						    		oper : "consultarCargaParametro",
						    		idTipoParametro : sessionStorage.id_tpar
								};
				break;
				case '3':
			    	$("#btn-view1").hide();
			    	parametros = {
    								clase : "clsConfiguracion",
			    					oper : "consultarConvocatoria"
								};
				break;
				case '4':
			    	$("#btn-view1").hide();
			    	parametros = {
    								clase : "clsConfiguracion",
			    					oper : "consultarCurso"
								};
				break;
				case '5':
			    	$("#btn-view1").show();
			    	parametros = {
    								clase : "clsConfiguracion",
						    		oper : "consultarModulo",
						    		idCurso : sessionStorage.id_cur
								};
				break;
				case '6':
			    	$("#btn-view1").hide();
			    	$("#btn-search-tercero").show();
			    	parametros = {
    								clase : "clsConfiguracion",
			    					oper : "consultarUsuarioGeneral"
								};
				break;
				case '7':
			    	$("#btn-view1").hide();
			    	$("#btn-search-tercero").show();
					$("#view-all-tercero").show();
			    	cedula= $("#txt-Buscar").val();
			    	parametros = {
    								clase :"clsConfiguracion",
			    					oper : "consultarTerceroCedula",
			    					DocumentoTercero: cedula
								};
					tipoconfiguracion='6';
				break;

			}

		$.post("../../controlador/fachada.php", 
			parametros
		  , function(data) {
				if (data !== 0) {
					if(data !== null){
						cargarDataTable(data);	        			
					}else{alert("error 1");}             
				}else {alert("error 2");}
				jsRemoveWindowLoad();	
		}, "json");

	}
	
	//Función que llena los datos en datatable//
	function cargarDataTable(data){
		var parametros= new Array();
		var dataIconos1="";	
		var dataIconos2="";	
		var columnDefs="";
        ///Verifica que tipo de configuración es para cargar la información que se necesita///
        switch(tipoconfiguracion) {
			    case '1':
			    		columnas = [
								{title: "Id"},
								{title: "Nombre"},
								{title: "Estado"},
							    {data: null, className: "center", defaultContent: '<a id="edit-link" class="edit-link" href="#" title="Edit"><img src="../images/edit.png" width="20px" /></a>'},
								{data: null, className: "center", defaultContent: '<a id="delete-link" class="delete-link" href="#" title="Delete"><img src="../images/delete.png" width="20px" /></a>'},
								{data: null, className: "center", defaultContent: '<a id="view-parametros" class="view-parametros" href="#" title="Ver parametros">Ver Parametros</a>'}
								];

			    break;
			    case '2':
			    	columnas = [
			    			{title: "Id"},
			    			{title: "Nombre"},
			    			{data: null, className: "center", defaultContent: '<a id="edit-link" class="edit-link" href="#" title="Edit"><img src="../images/edit.png" width="20px" /></a>'}
			    			];
			    break;
			    case '3':
			    	columnas = [
			    			{title: "Id"},
			    			{title: "Nombre"},
			    			{title: "Nombre Corto"},
			    			{title: "Serie"},
			    			{title: "Estado"},
			    			{data: null, className: "center", defaultContent: '<a id="edit-link" class="edit-link" href="#" title="Edit"><img src="../images/edit.png" width="20px" /></a>'},
			    			{data: null, className: "center", defaultContent: '<a id="delete-link" class="delete-link" href="#" title="Delete"><img src="../images/delete.png" width="20px" /></a>'}
			    	];
			    break;
			    case '4':
			    	columnas = [
			    			{title: "Id"},
			    			{title: "C&oacute;digo"},
			    			{title: "Nombre"},
			    			{title: "Duraci&oacute;n"},	
			    			{title: "IdDuracion"},			    			
			    			{title: "Ruta"},
			    			{title: "IdRuta"},
			    			{title: "Estado"},			    	    					    			
			    			{data: null, className: "center", defaultContent: '<a id="edit-link" class="edit-link" href="#" title="Edit"><img src="../images/edit.png" width="20px" /></a>'},
			    			{data: null, className: "center", defaultContent: '<a id="delete-link" class="delete-link" href="#" title="Delete"><img src="../images/delete.png" width="20px" /></a>'},
			    			{data: null, className: "center", defaultContent: '<a id="view-modulos" class="view-modulos" href="#" title="Ver modulos">Modulos</a>'}
			    	];	
			    	columnDefs =[
								{"targets": [ 4 ],"visible": false,"searchable": false},
								{"targets": [ 6 ],"visible": false,"searchable": false}
								];
			    break;
			    case '5':
			    	columnas = [
			    			{title: "Id"},
			    			{title: "C&oacute;digo"},
			    			{title: "Nombre"},
			    			{title: "Duraci&oacute;n"},
			    			{title: "Tipo Formaci&oacute;nId"},
			    			{title: "Tipo Formaci&oacute;n"},
			    			{title: "Area OcupacionalId"},
			    			{title: "Area Ocupacional"},
			    			{title: "Tipo Capacitaci&oacute;nId"},
			    			{title: "Tipo Capacitaci&oacute;n"},
			    			{title: "Estado AsistenciaId"},
			    			{title: "Estado Asistencia"},
			    			{title: "Certificacion EmitidaId"},
			    			{title: "Certificaci&oacute;n"},
			    			{title: "Cupo M&iacute;nimo"},
			    			{title: "Cupo M&aacute;ximo"},
			    			{title: "Estado"},
			    			{data: null, className: "center", defaultContent: '<a id="edit-link" class="edit-link" href="#" title="Edit"><img src="../images/edit.png" width="20px" /></a>'},
			    			{data: null, className: "center", defaultContent: '<a id="delete-link" class="delete-link" href="#" title="Delete"><img src="../images/delete.png" width="20px" /></a>'},	
			    	];	
			    	columnDefs =[
								{"targets": [ 4 ],"visible": false,"searchable": false},
								{"targets": [ 6 ],"visible": false,"searchable": false},
								{"targets": [ 8 ],"visible": false,"searchable": false},
								{"targets": [ 10 ],"visible": false,"searchable": false},
								{"targets": [ 12 ],"visible": false,"searchable": false}
								];
			    break;
			    case '6':
			    	columnas = [
			    			{title: "Id"},
			    			{title: "Identificaci&oacute;n"},
			    			{title: "Nombres"},
			    			{title: "Apellidos"},
			    			{title: "Usuario"},
			    			{title: "Estado"},
			    			{data: null, className: "center", defaultContent: '<a id="edit-link" class="edit-link" href="#" title="Edit"><img src="../images/edit.png" width="20px" /></a>'},
			    			{data: null, className: "center", defaultContent: '<a id="delete-link" class="delete-link" href="#" title="Delete"><img src="../images/delete.png" width="20px" /></a>'}
			    	];
			    	data2= [];	
			    	var value="";
			    	for (var i = 0; i < data.length; i++) {
                        var array = [];                        
   	                    array.push(data[i][0]);
                        array.push(data[i][1]);
                        array.push(data[i][2]);
                        array.push(data[i][3]);
                        array.push(data[i][4]);
                        if(data[i][5]==1){
                            value="Activo";
                            array.push(value);
                        }else{
                            value="Inactivo";
                            array.push(value);
                        }
                   
                        data2.push(array);
                     }
			    break;
		}

		if(typeof table !== "undefined"){
            table.destroy();
            $('#tableConfiguracion').empty();
        }
        if(tipoconfiguracion==6){
        	data=data2;
        };

        var mensaje="Cargando la informaci&oacute;n<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		table = $('#tableConfiguracion').DataTable({
			"data": data,
			columns: columnas,
			"paging":   true,
			"pageLength": 8,
			"bLengthChange": false,
			"bDestroy": true,
			"info":     false,
			"scrollY": "300px",
			"scrollX": true,
			"scrollCollapse": true,
			"columnDefs": columnDefs,
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }	

		 } );	

		jsRemoveWindowLoad();

		//Evento que elimina registro//
	$(document).on('click', '#delete-link', function() {
		var parametros= {};
		var mensajeConfirmacion="Registro Desactivado satisfactoriamente.";
		var mensajeError="No se pudo Desactivar registro";
		var data = table.row($(this).parents('tr')).data();
		var txt="";
		var r = confirm("Desea desactivar este Registro!");
		//Valida si fue confirmado desactivar registro
		if (r == true) {
			//Inicio switch
			switch(tipoconfiguracion) {
				//Desactiva registro Tipo Parametro
				case '1':
					parametros = {	
			    					clase : "clsConfiguracion",
			    					oper: 'modificarTipoParametro',
			    					idTipoParametro: data[0],
									tipoParametro:data[1],
								    estadoTipoParametro:2
			    				 };
				break;
				//Desactiva registro Convocatoria
				case '3':
					parametros = {	
			    					clase : "clsConfiguracion",
			    					oper: 'modificarConvocatoria',
									idConvocatoria: data[0],
									conNombre:data[1],
									conNombreCorto:data[2],
									conSerie:data[3],
								    conEstado:2
			    				 };
				break;
				case '4':
			   		parametros = {	
			    					clase : "clsConfiguracion",
			    					oper: 'modificarCurso',
									idCurso: data[0],
									txtCodigoCurso:data[1],
									txtNombreCurso:data[2],
									selectDuracionCurso:data[4],
									selectRutaCurso:data[6],
									selectDuracionCurso:data[4],
								    txtEstadoCurso:2
			    				 };
			    break;
			    case '5':
			   		parametros = {	
			    					clase : "clsConfiguracion",
			    					oper: 'modificarModulo',
									idModulo: data[0],
									modCodigo:data[1],
									modNombre:data[2],
									modDuracion:data[3],
									modFormacion:data[4],
									modArea:data[6],
									modCapacitacion:data[8],
									modEstadoAsistencia:data[10],
									modCertificacion:data[12],
									modMaximo:data[14],	
									modMinimo:data[15],
									modCurso: sessionStorage.id_cur,
								    modEstado:2
			    				 };
		
			    break;
				case '6':
							///Datos para mostrar
					var dataUsu=[];
					sessionStorage.IdeUsudel=""
			   		 $.post("../../controlador/fachada.php", {
				        clase: 'clsConfiguracion',
				        oper: 'consultarUsuarioEspecifico',
				       idTercero: data[0]
				    }, function(dataUsu) {			       
				   			sessionStorage.ITeUsu= data[0];
				   			sessionStorage.TIUsu= dataUsu[0]["TipoIdentificacion"];
				   			sessionStorage.IdeUsu= dataUsu[0]["NumeroIdentificacion"];
							sessionStorage.LExpUsu= dataUsu[0]["LugarExpedicion"];
					        sessionStorage.NomUsu= dataUsu[0]["Nombres"];
					       	sessionStorage.ApeUsu= dataUsu[0]["Apellidos"];
					       	sessionStorage.FNacUsu= dataUsu[0]["FechaNacimiento"];
					       	sessionStorage.sexUsu= dataUsu[0]["Sexo"];
					       	sessionStorage.ECivUsu= dataUsu[0]["EstadoCivil"];
					       	sessionStorage.gEscUsu= dataUsu[0]["GradoEscolaridad"];
					       	sessionStorage.te1Usu= dataUsu[0]["Telefono1"];
					       	sessionStorage.te2Usu= dataUsu[0]["Telefono2"];
					       	sessionStorage.te3Usu= dataUsu[0]["Telefono3"];
					       	sessionStorage.dirUsu= dataUsu[0]["Direccion"];
					       	sessionStorage.emaUsu= dataUsu[0]["CorreoElectronico"];
					       	sessionStorage.locUsu= dataUsu[0]["Localidad"];
					       	sessionStorage.ciuUsu= dataUsu[0]["CiudadResidencia"];
					       	sessionStorage.idUsu= dataUsu[0]["IdUsuario"];
					       	sessionStorage.usuUsu= dataUsu[0]["NombreUsuario"];
					       	sessionStorage.rolUsu= dataUsu[0]["Roles"];
					       	sessionStorage.idDocUsu= dataUsu[0]["IdDocente"];
					       	sessionStorage.carUsu= dataUsu[0]["Cargo"];							
				    }, 
				    "json");

			   		 	if(sessionStorage.idUsu==""){
			   		 		idUsu="-1";
			   		 	}else{
			   		 		idUsu=sessionStorage.usuUsu;
			   		 	}

			   		 	if(sessionStorage.idDocUsu==""){
			   		 		idDocUsu="-1";
			   		 	}else{
			   		 		idDocUsu=sessionStorage.idDocUsu;
			   		 	}

			   		 	parametros={
				        			clase: 'clsConfiguracion',
									oper: 'modificarUsuario',
									idTer: data[0],
									tIdenUsu: sessionStorage.TIUsu,
									IdeUsu:sessionStorage.IdeUsu,
									LExpUsu:sessionStorage.LExpUsu,
							        NomUsu:sessionStorage.NomUsu,
							       	ApeUsu:sessionStorage.ApeUsu,
							       	FNacUsu: sessionStorage.FNacUsu,
							       	sexUsu:sessionStorage.sexUsu,
							       	ECivUsu:sessionStorage.ECivUsu,
							       	gEscUsu:sessionStorage.gEscUsu,
							       	te1Usu:	sessionStorage.te1Usu,
							       	te2Usu: sessionStorage.te2Usu,
							       	te3Usu: sessionStorage.te3Usu,
							       	dirUsu: sessionStorage.dirUsu,
							       	emaUsu:sessionStorage.emaUsu,
							       	locUsu:sessionStorage.locUsu,
							       	ciuUsu:	sessionStorage.ciuUsu,
							       	estUsu:2,
							       	idUsu: idUsu,
							       	usuUsu:sessionStorage.usuUsu,
							       	passUsu:0,/// se envia 0 si esta vacio y no se desea cambiar contraseña
							       	rolUsu:sessionStorage.rolUsu,
							       	carUsu:sessionStorage.carUsu,
							       	idDocUsu: idDocUsu

				        	};	        	       
						
			   		 	//console.log(sessionStorage);
					
				break;

			}
		//Fin switch

				mensaje="Editando Registro";
				jsShowWindowLoad(mensaje);
				$.post("../../controlador/fachada.php",
					parametros
					, function(data){
						//console.log(data);
								if (data !== 0) {
									if(data !== null){
										jsRemoveWindowLoad();
										PopUpConfirmacion(mensajeConfirmacion);						
									}else{ 
										jsRemoveWindowLoad();
										PopUpConfirmacion(mensajeConfirmacion);   
									}             
								}else {
								    jsRemoveWindowLoad();
									PopUpError(mensajeError);
							}
							jsRemoveWindowLoad();	
				}, "json");
		}else {
			//Fin switch Valida si no fue confirmado desactivar registro
		    $("body").fadeOut('slow');
			window.location.href=location;
		}
	});
//Fin eliminar

	//Ver Parametros//
	$(document).on('click', '#view-parametros', function() {
		var data = table.row($(this).parents('tr')).data();
		sessionStorage.id_tpar=data[0];
		sessionStorage.val_sel='2';
		tipoconfiguracion='2';
		CargarDatos();		
	});

	//Ver Modulos//
	$(document).on('click', '#view-modulos', function() {
		var data = table.row($(this).parents('tr')).data();
		sessionStorage.id_cur=data[0];
		sessionStorage.val_sel='5';
		tipoconfiguracion='5';
		CargarDatos();		
	});

	//Evento que edita registro//
	$(document).off('click', '#edit-link').on('click', '#edit-link', function() {
			var html="";
			var data = table.row($(this).parents('tr')).data();

			switch(tipoconfiguracion) {
			    case '1':
			    	///Datos para mostrar
					sessionStorage.id_tpar= data[0];
			        sessionStorage.nom_tpar= data[1];
			        sessionStorage.est_tpar= data[2];
			        sessionStorage.tip_conf= 1;
			       	$("#SelectEstadoTipoParametro").show();
			       	$("#txtNombreTipoParametro").hide();
			       	html='tipoParametro.html';
			    break;
			    case '2':
			    	///Datos para mostrar
					sessionStorage.id_par= data[0];
			        sessionStorage.nom_par= data[1];
			        sessionStorage.tip_conf= 3;
			       	html='parametro.html';
			    break;
			    case '3':
			   		///Datos para mostrar
			    	sessionStorage.id_conv= data[0];
			        sessionStorage.nom_conv= data[1];
			        sessionStorage.nom_convC= data[2];
			       	sessionStorage.ser_conv= data[3];
			        sessionStorage.est_conv= data[4];
			        sessionStorage.tip_conf= 5;
			       	$("#SelectEstadoConvocatoria").show();
			       	html='convocatoria.html';
			    break;
  				case '4':
			   		///Datos para mostrar
			    	sessionStorage.id_cur= data[0];
			        sessionStorage.cod_cur= data[1];
			        sessionStorage.nom_cur= data[2];
			        sessionStorage.dur_cur= data[4];
			        sessionStorage.rut_cur= data[6];
			        sessionStorage.est_cur= data[7];
			        sessionStorage.tip_conf= 10;
			       	$("#SelectEstadoCurso").show();
			       	html='curso.html';
			    break;
			    case '5':
			   		///Datos para mostrar
			    	sessionStorage.id_mod= data[0];
			        sessionStorage.cod_mod= data[1];
			        sessionStorage.nom_mod= data[2];
			        sessionStorage.dur_mod= data[3];
			        sessionStorage.for_mod= data[4];
			        sessionStorage.are_mod= data[6];			      
			        sessionStorage.cap_mod= data[8];
			        sessionStorage.esa_mod= data[10];
			        sessionStorage.cer_mod= data[12];
			        sessionStorage.max_mod= data[14];
			        sessionStorage.min_mod= data[15];
			        sessionStorage.est_mod= data[16];
			        sessionStorage.tip_conf= 12;
			       	$("#SelectEstadoModulo").show();
			       	html='modulo.html';
			    break;
			    case '6':
			   		///Datos para mostrar
			   		 $.post("../../controlador/fachada.php", {
				        clase: 'clsConfiguracion',
				        oper: 'consultarUsuarioEspecifico',
				       idTercero: data[0]
				    }, function(dataUsu) {
				        if (dataUsu !== 0) {
				   			sessionStorage.ITeUsu= data[0];
				   			sessionStorage.tIdenUsu= dataUsu[0]["TipoIdentificacion"];
				   			sessionStorage.IdeUsu= dataUsu[0]["NumeroIdentificacion"];
							sessionStorage.LExpUsu= dataUsu[0]["LugarExpedicion"];
					        sessionStorage.NomUsu= dataUsu[0]["Nombres"];
					       	sessionStorage.ApeUsu= dataUsu[0]["Apellidos"];
					       	sessionStorage.FNacUsu= dataUsu[0]["FechaNacimiento"];
					       	sessionStorage.sexUsu= dataUsu[0]["Sexo"];
					       	sessionStorage.ECivUsu= dataUsu[0]["EstadoCivil"];
					       	sessionStorage.gEscUsu= dataUsu[0]["GradoEscolaridad"];
					       	sessionStorage.te1Usu= dataUsu[0]["Telefono1"];
					       	sessionStorage.te2Usu= dataUsu[0]["Telefono2"];
					       	sessionStorage.te3Usu= dataUsu[0]["Telefono3"];
					       	sessionStorage.dirUsu= dataUsu[0]["Direccion"];
					       	sessionStorage.emaUsu= dataUsu[0]["CorreoElectronico"];
					       	sessionStorage.locUsu= dataUsu[0]["Localidad"];
					       	sessionStorage.ciuUsu= dataUsu[0]["CiudadResidencia"];
					       	sessionStorage.idUsu= dataUsu[0]["IdUsuario"];
					       	sessionStorage.usuUsu= dataUsu[0]["NombreUsuario"];
					       	sessionStorage.rolUsu= dataUsu[0]["Roles"];
					       	sessionStorage.idDocUsu= dataUsu[0]["IdDocente"];
					       	sessionStorage.carUsu= dataUsu[0]["Cargo"];
				        }
				        else {
				            alert('error');
				        }
				    }, "json");
			      	sessionStorage.estUsu= data[5];
			       	sessionStorage.tip_conf= 9;
			       	html='usuario.html';
			    break;

			}

			if(data[0]!=""){
				$(".content-loader").fadeOut('slow', function(){  
					$(".content-loader").fadeIn('slow');
					$(".content-loader").load(html);
					$("#btn-add").hide();
					$("#btn-view").show();
					$("#btn-save").hide();
					$("#btn-edit").show();
					$("#btn-search-tercero").hide();
					$("#view-all-tercero").hide();
				});
			}
			return false;
			//e.stopPropagation();
		});


	}
	
	//Evento que elimina pantalla de popup//
	 function jsRemoveWindowLoad() {
	    // eliminamos el div que bloquea pantalla
	    $("#WindowLoad").remove();
 
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

	function PopUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    	$('#element_to_pop_upCon').bPopup({
        	speed: 450,
        	transition: 'slideDown'
    	});
	}

	function PopUpError(err_men) {
	    $("#textoError").text(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	   	});
	   
	}
	

	function validarCampos(){
		cam_vac = '';
		switch(tipoconfiguracion) {
			    case '1':
			    	if ($("#txtNombreTipoParametro").val() == "") {
	       					 cam_vac += 'Nombre';
	   				 }
			    break;
			    case '3':
			    	if ($("#txtNombreConvocatoria").val() == "") {
	       					 cam_vac += 'Nombre* ';
	   				 }
	   				if ($("#txtNombreCortoConvocatoria").val() == "") {
	       					 cam_vac += 'Nombre Corto* ';
	   				 }

	   				if ($("#txtSerieConvocatoria").val() == "") {
	       					 cam_vac += 'Serie* ';
	   				 }
			    break;
			    case '4':
			    	if ($("#txtCodigoCurso").val() == "") {
	       					 cam_vac += 'Codigo* ';
	   				 }
	   				if ($("#txtNombreCurso").val() == "") {
	       					 cam_vac += 'Nombre* ';
	   				 }

	   				if ($("#selectDuracionCurso").val() == 0) {
	       					 cam_vac += 'Duracion* ';
	   				 }

	   				if ($("#selectRutaCurso").val() == 0) {
	       					 cam_vac += 'Ruta* ';
	   				 }

			    case '6':

			    	if ($("#cmbTipoIdentificacion").val() == 0) {
	       					 cam_vac += 'Tipo Identificacion* ';
	   				 }
	   				if ($("#txtIdentificacion").val() == "") {
	       					 cam_vac += 'Identificacion* ';
	   				 }
	   				if ($("#cmbLugarExpedicion").val() == 0) {
	       					 cam_vac += 'Lugar Expedicion* ';
	   				}
	   				if ($("#txtNombres").val() == "") {
	       					 cam_vac += 'Nombres* ';
	   				 }
	   				if ($("#txtApellidos").val() == "") {
	       					 cam_vac += 'Apellidos* ';
	   				}
	   				if ($("#txtFechaNacimiento").val() == "") {
	       					 cam_vac += 'Fecha de Nacimiento* ';
	   				 }
	   				if ($("#cmbEstadoCivil").val() == 0) {
	       					 cam_vac += 'Estado Civil* ';
	   				}
	   				if ($("#cmbSexo").val() == 0) {
	       					 cam_vac += 'Sexo* ';
	   				 }
	   				if ($("#cmbGradoEscolaridad").val() == 0) {
	       					 cam_vac += 'Grado Escolaridad* ';
	   				}
	   				if ($("#txtTelefono1").val() == "") {
	       					 cam_vac += 'Telefono1* ';
	   				 }
	   				if ($("#txtTelefono2").val() == "") {
	       					 cam_vac += 'Telefono2* ';
	   				}
	   				if ($("#txtTelefono3").val() == "") {
	       					 cam_vac += 'Telefono3* ';
	   				}
	   				if ($("#txtDireccion").val() == "") {
	       					 cam_vac += 'Direccion* ';
	   				}
	   				if ($("#txtEmail").val() == "") {
	       					 cam_vac += 'Email* ';
	   				}
	   				if ($("#cmbLocalidad").val() == 0) {
	       					 cam_vac += 'Localidad* ';
	   				}
	   				if ($("#cmbCiudadResidencia").val() == 0) {
	       					 cam_vac += 'Ciudad Residencia* ';
	   				}
	   				//alert($("#rEstudiante1").checked);
	   				if($('input[id=rEstudiante1]').is(':checked')){
		   				if ($("#txtUsuario").val() == "") {
		       					 cam_vac += 'Usuario* ';
		   				}
		   			
		   				var rol=getCheckedCheckboxesFor();
		   				if(rol[0]=="0,0,0,0"){
		   					cam_vac += 'Rol* ';  				
		   				}	


		   				if(proceso=="Insertar"){
		   					if ($("#txtPassword").val() == ""){
		       		 			cam_vac += 'Password* ';
		   					}
		   				}
		   			}

		   			  


			    break;
		}
	    
	    return cam_vac;
	}


      function ValidarUsuario(){
      	cam_vac = '';
      	var idUsuario="";
      	  	if(proceso=="Insertar"){	   					
				   	$.post("../../controlador/fachada.php", {
		                clase: 'clsConfiguracion',
		                oper: 'validarNombreUsuario',
		                nomUsu: $("#txtUsuario").val()
		            }, function(data) {
		            	  console.log("data"+data);
		            	  //alert(data[0]['IdUsuario']);
		                if (data!==null) {
		                   idUsuario=data[0]['IdUsuario'];
		                    //alert(idUsuario);
		                    if(idUsuario>0){
		                        cam_vac=" Ya existe un usuario: "+$("#txtUsuario").val()+"("+idUsuario+")";
		                        PopUpError(" Ya existe un usuario: "+$("#txtUsuario").val());
		                    }else{
		                    	 cam_vac='';
		                    }
		                }
		                else {
		                      cam_vac="Hay varios usuarios con este nombre de usuario";
		                }
		            },"json");    
		   		
		   	}else{		 
			   			if((sessionStorage.usuUsu)!=($("#txtUsuario").val())){
			   				$.post("../../controlador/fachada.php", {
				                clase: 'clsConfiguracion',
				                oper: 'validarNombreUsuario',
				                nomUsu: $("#txtUsuario").val()
				            }, function(data) {
				            	  console.log("data"+data);
				                if (data!==null) {
				                   idUsuarioNom=data[0]['IdUsuario'];
				                    if(idUsuarioNom>0){
				                        cam_vac=" Ya existe un usuario: "+$("#txtUsuario").val()+"("+idUsuario+")";
				                        //PopUpError(" Ya existe un usuario: "+$("#txtUsuario").val());
				                    }else{
				                    	 cam_vac='';
				                    }
				                }
				                else {
				                      cam_vac="Hay varios usuarios con este nombre de usuario";
				                }
				            },"json");    		
			   			}

		   			}	
    	    return cam_vac;
    }


 
	function getCheckedCheckboxesFor() {
		var rol="";
		var cargo="No Docente";
		var estUsuMod="";
		var estDocMod="";
		$("[name^=rolUsu]").each(function(e){
			if(this.value=="administrador"){
				if(this.checked==true){
					rol+="1,";
					estUsuMod="0";
				}
				else{
					rol+="0,";
					//estUsuMod="-1";
				}
			}

			if(this.value=="docente"){
				if(this.checked==true){
					rol+="1,";
					cargo="Docente";
					estDocMod="0";
					//estUsuMod="0";
				}
				else{
					rol+="0,";
					estDocMod="-1";
					//estUsuMod="-1";
				}
			}

			if(this.value=="matriculador"){
				if(this.checked==true){
					rol+="1,";
					//estUsuMod="0";
				}
				else{
					rol+="0,";
					//estUsuMod="-1";
				}
			}
	
		});
		
			rol=rol+"0";

			if(rol!="0,0,0,0"){
				estUsuMod="0";
			}else{
				estUsuMod="-1";
			}

			return [rol, cargo, estUsuMod, estDocMod];
	}


});