$(function() {
	//----- Carga todas las listas desplegables -----//
	cargarListas('cmbModulo','SPCARGARMODULOS');
	cargarListas('cmbEstado','SPCARGARESTADOS');
	cargarListas('cmbConvenio','SPCARGARCONVENIOS');

	//----- Establece los valores por defecto de las listas desplegables -----//
	cargarValorSelected('#cmbEstado','1',1000);

	//----- Dispara el proceso para guardar un nuevo convenio -----//
	$("#btnGuardar").click(function(){ 
		//----- Verifica que ningún campo esté vacío -----//
		if($("#txtConvenio").val() == ""){
			mostrarPopUpError("Por favor diligencie el campo convenio");
		}else{
			if($("#cmbModulo option:selected").val() == 0){
				mostrarPopUpError("Por favor seleccione un módulo");
			}else{
				var archivos = document.getElementById("txtexaminararchivosLogo");
        		var archivo = archivos.files;
				if (typeof archivo[0] == "undefined") {
					mostrarPopUpError("Por favor seleccione un Logo del convenio");
				}else{
					if (archivo[0].type == "image/png") {
						if ($("#cmbEstado option:selected").val() == 0) {
							mostrarPopUpError("Por favor seleccione un estado");
						}else{
							guardarConvenio();
						}
					}else{
						mostrarPopUpError('El formato de la imagen es incorrecto, debe ser PNG');
					}
				}
			}
		}
	});

	//----- Recarga la página -----//
	$("#btnAcePop1").click(function(){ 
		window.location.href = "../html/convenio.html";
	});

	//----- Muestra los datos del Convenio seleccionado -----//
	$("#cmbConvenio").change(function(){ 
		if($("#cmbConvenio option:selected").val() == 0){
			mostrarPopUpError("Por favor seleccione un Secretario de la lista");
		}else{
			consultarDatosConvenio();
		}
	});

	//----- Habilita para una busqueda -----//
	$("#btnConsultar").click(function(){
		$("#nuevoConvenio").hide();
		$("#modificarConvenio").show();
		$("#campos").hide();
		$("#listaConvenio").show();
		$("#tablaConvenios").show();
		$("#txtConvenio").val('');
		cargarListas('cmbModulo','SPCARGARMODULOS');
		cargarListas('cmbEstado','SPCARGARESTADOS');
		cargarListas('cmbConvenio','SPCARGARCONVENIOS');
		cargarValorSelected('#cmbEstado','1',500);
	});

	//----- Cancela la accion -----//
	$("#btnCancelar").click(function(){ 
		$("#nuevoConvenio").show();
		$("#modificarConvenio").hide();
		$("#campos").show();
		$("#listaConvenio").hide();
		$("#tablaConvenios").hide();
		$("#txtConvenio").val('');
		cargarListas('cmbModulo','SPCARGARMODULOS');
		cargarListas('cmbEstado','SPCARGARESTADOS');
		cargarListas('cmbConvenio','SPCARGARCONVENIOS');
		cargarValorSelected('#cmbEstado','1',1000);
	});

	//----- Consulta los datos del Convenio por Id-----//
	function consultarDatosConvenio(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsProgramacion',
			oper: 'consultarConvenio',
			pIdConvenio: $("#cmbConvenio option:selected").val()
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					$("#campos").show();
					$("#txtIdConvenio").val($("#cmbConvenio option:selected").val());
					$("#txtConvenio").val(data[0].Nombre);
					$("#imgLogo").attr('src',data[0].RutaLogo);
					cargarValorSelected('#cmbModulo',data[0].Modulo,500);
					cargarValorSelected('#cmbEstado',data[0].Estado,500);
					jsRemoveWindowLoad();
				}else{
					jsRemoveWindowLoad();
					mostrarPopUpError("No existen Convenios con los datos suministrados");
				}
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("Existe un error, consulte con el administrador");
			}
		}, "json");
	};

	//----- Guarda la informacion del convenio -----//
	function guardarConvenio() {
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsProgramacion',
	        oper: 'guardarConvenio',
	        IdConvenio: $("#txtIdConvenio").val(),
        	pNombre: $("#txtConvenio").val(),
        	pModulo: $("#cmbModulo option:selected").val(),
	        pEstado: $("#cmbEstado option:selected").val()
	    }, function(data) {
	        if (data == 0) {
	        	jsRemoveWindowLoad();
	            mostrarPopUpError('Existe un error, consulte con el administrador');
	        }else {
	        	if (data !== -1) {
	        		GuardarArchivoLogo(data[0].IdConvenio);
	        	}else{
	        		jsRemoveWindowLoad();
		        	mostrarPopUpError("No fue posible adicionar el convenio");
		            }
	        }
	    }, "json");
	}
	
	//----- Guarda el archivo de firma -----//
	function GuardarArchivoLogo(pIdConvenio){
		var ubicacion = "anexos/convenios/";  
		var convenio = pIdConvenio;	
        var archivos = document.getElementById("txtexaminararchivosLogo");
        var archivo = archivos.files;
        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].type == "image/png") {
                var data = new FormData();
                data.append('vid', archivo[0]);
                $.ajax({
                    type: 'POST',
                    url: "../../controlador/fachada.php?clase=clsArchivo&oper=GuardarLogo&ubicacion="+ubicacion+"&convenio="+convenio,
                    data: data, //Le pasamos el objeto que creamos con los archivos
                    contentType: false, //Debe estar en false para que pase el objeto sin procesar
                    processData: false, //debe estar en false para que JQuery no procese los datos a enviar
                    cache: false //Para que el formulario no guarde cache
                }).done(function(data) { 
                	if(data !== "B"){
	                	$.post("../../controlador/fachada.php", {
					        clase: 'clsProgramacion',
					        oper: 'guardarRutaLogoConvenio',
					        IdConvenio: pIdConvenio,
				        	pRuta: "../"+data
					    }, function(data) {
					        if (data == 0) {
					        	jsRemoveWindowLoad();
					            mostrarPopUpError('Existe un error, consulte con el administrador');
					        }else {
					        	if (data !== -1) {
					        		jsRemoveWindowLoad();
					            	mostrarPopUpConfirmacion('Convenio creado satisfactoriamente');
					        	}else{
					        		jsRemoveWindowLoad();
						        	mostrarPopUpError("No fue posible adicionar el convenio");
						            }
					        }
					    }, "json");
	                }else{
	                	jsRemoveWindowLoad();
                		mostrarPopUpConfirmacion("Error al guardar archivo");
	                }
                });
             } else {
            	jsRemoveWindowLoad();
                mostrarPopUpConfirmacion('El formato de la imagen es incorrecto, debe ser PNG');
            }
        }else{
        	jsRemoveWindowLoad();
            mostrarPopUpConfirmacion('Debe seleccionar un archivo para subir');
        }
	}

	//----- Consulta en la base de datos los valores de las listas -----//
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

	//----- Llena las listas -----//
	function formarOptionValueLista(data,objeto) {
	    $('#'+objeto).find('option').remove();
	    SetParametroPorDefecto("#"+objeto, '0', 'Seleccione...');
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

    //----- Establece los valores por defecto de las listas a Seleccione...-----//
    function SetParametroPorDefecto(atributo, valor, texto) {
	    $(atributo).append($('<option>', {
	        value: valor,
	        text: texto
	    }));
	}

    //----- Muestra el PopUp -----//
    function mostrarPopUpError(err_men) {
	    $("#textoError").html(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}

	//----- Muestra el PopUp -----//
    function mostrarPopUpConfirmacion(err_men) {
	    $("#textoConfirmacion1").html(err_men);
	    $('#element_to_pop_upCon').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}

	//----- Quita la Cortina -----//
	function jsRemoveWindowLoad() {
	    // eliminamos el div que bloquea pantalla
	    $("#WindowLoad").remove();
	 
	}
	
	//----- Configuracion general de la cortina -----// 
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
	    imgCentro = "<div style='text-align:center;height:" + alto + "px;'><div  style='color:#000;margin-top:" + heightdivsito + "px; font-size:20px;font-weight:bold'>" + mensaje + "</div><img src='../images/loading.gif' width='107' height='106'></div>";
	 
	        //creamos el div que bloquea grande------------------------------------------
	        div = document.createElement("div");
	        div.id = "WindowLoad"
	        div.style.width = ancho + "px";
	        div.style.height = alto + "px";
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