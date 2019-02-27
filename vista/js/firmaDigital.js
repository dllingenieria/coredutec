$(function() {
	//----- Aplica cuando se es Administrador -----//
	if(sessionStorage.esAdministrador == 1){
		//----- Carga todas las listas desplegables -----//
		cargarListas('cmbFirmas','SPCARGARFIRMA');
		$("#cmbFirmas").show();
	}else{
		$.post("../../controlador/fachada.php", {
		clase: 'clsCertificados',
		oper: 'consultarTercero',
		pIdUsuario: sessionStorage.idUsuario
		}, function(data) {
			if (data !== 0) {
				$("#txtTercero").val(data[0].Tercero);
				consultarDatosFirmaDigital2();
			}else {
				mostrarPopUpError("No existen Terceros con ese idUsuario");
			}
		}, "json");
	}

	//----- Muestra los datos de la firma seleccionada -----//
	$("#cmbFirmas").change(function(){ 
		if($("#cmbFirmas option:selected").val() == 0){
			mostrarPopUpError("Por favor seleccione un Secretario de la lista");
			$("#tablaCertificados").hide();
		}else{
			consultarDatosFirmaDigital1();
		}
	});

	//----- Inicia el proceso para guardar la firma -----//
	$("#btnGuardar").click(function(){ 
		GuardarFirma();
	});

	//----- Recarga la página -----//
	$("#btnAcePop").click(function(){ 
		window.location.href = "../html/firmaDigital.html";
	});
	
	//----- Recarga la página -----//
	$("#btnRegresar").click(function(){ 
		window.location.href = "../html/firmaDigital.html";
	});
	
	//----- Valida que solo se ingrese en las cajas de texto los valores apropiados -----//
	$('#txtNombreSecretario').validCampoFranz('ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ ');

	//----- Consulta los datos de la firma digital por Id de Firma-----//
	function consultarDatosFirmaDigital1(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'consultarFirmaDigital1',
			pIdFirma: $("#cmbFirmas option:selected").val()
		}, function(data) {
			if (data !== 0) {
				$("#tablaCertificados").show();
				$("#txtNombreSecretario").val(data[0].Secretario);
				$("#imgFirma").attr('src',data[0].RutaFirma);
				$("#txtTercero").val(data[0].Tercero);
				jsRemoveWindowLoad();
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("No existen firmas con los datos suministrados");
			}
		}, "json");
	};

	//----- Consulta los datos de la firma digital por Id de Firma-----//
	function consultarDatosFirmaDigital2(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'consultarFirmaDigital2',
			pIdTercero: $("#txtTercero").val()
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					$("#tablaCertificados").show();
					$("#txtNombreSecretario").val(data[0].Secretario);
					$("#imgFirma").attr('src',data[0].RutaFirma);
					jsRemoveWindowLoad();
				}else {
					jsRemoveWindowLoad();
					mostrarPopUpConfirmacion("Aún no ha registrado su firma");
					$("#tablaCertificados").show();
					$("#txtNombreSecretario").val(sessionStorage.nombreUsuario);
				}
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("Existe un error, consulte con el administrador");
			}
		}, "json");
	};

	//----- Guarda los datos de la firma en base de datos-----//
	function GuardarFirma(){
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		var tercero = $("#txtTercero").val();
        var archivos = document.getElementById("txtexaminararchivosFirma");
        var archivo = archivos.files;
        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].type == "image/png") {
                $.post("../../controlador/fachada.php", {
				clase: 'clsCertificados',
				oper: 'guardarFirma',
				pIdTercero: tercero
				}, function(data) {
					if (data !== 0) {
						if (data !== -1) {
							GuardarArchivoFirma(data[0].pNombreFirma);
						}else {
							jsRemoveWindowLoad();
							mostrarPopUpConfirmacion("No fue posible adicionar la firma digital");
						}
					}else {
						jsRemoveWindowLoad();
						mostrarPopUpError("Existe un error, consulte con el administrador");
					}
				}, "json");
             } else {
            	jsRemoveWindowLoad();
                mostrarPopUpConfirmacion('El formato de la imagen es incorrecto, debe ser PNG');
            }
        }else{
        	jsRemoveWindowLoad();
            mostrarPopUpConfirmacion('Debe seleccionar un archivo para subir');
        }
	}

	//----- Guarda el archivo de firma -----//
	function GuardarArchivoFirma(firma){
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		var ubicacion = "anexos/firmas/";  
		var firma = firma;	
		//var tercero = $("#txtTercero").val();	
        var archivos = document.getElementById("txtexaminararchivosFirma");
        var archivo = archivos.files;
        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].type == "image/png") {
                var data = new FormData();
                data.append('vid', archivo[0]);
                $.ajax({
                    type: 'POST',
                    url: "../../controlador/fachada.php?clase=clsArchivo&oper=GuardarFirma&ubicacion="+ubicacion+"&firma="+firma,
                    data: data, //Le pasamos el objeto que creamos con los archivos
                    contentType: false, //Debe estar en false para que pase el objeto sin procesar
                    processData: false, //debe estar en false para que JQuery no procese los datos a enviar
                    cache: false //Para que el formulario no guarde cache
                }).done(function(data) { 
                	if(data == "A"){
	                	jsRemoveWindowLoad();
                		mostrarPopUpError("Archivo guardado satisfactoriamente");
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

	//----- Muestra el PopUp -----//
    function mostrarPopUpConfirmacion1(err_men) {
	    $("#textoConfirmacion").html(err_men);
	    $('#element_to_pop_upPregunta').bPopup({
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