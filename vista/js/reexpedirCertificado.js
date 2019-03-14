$(function() {
	//----- Carga la lista de tipos de documentos -----//
	cargarListas('cmbTipoDocumento','SPCARGARTIPOIDENTIFICACION');
	cargarValorSelected('#cmbTipoDocumento','3',500);

	//----- Coloca el foco en campo de documento -----//
	var table;
	document.getElementById("txtNDocumento").focus(); 
	
	//----- Inicia el proceso para reexpedir un certificado -----//
	$("#btnConsultar").click(function(){ 
		if($("#txtNDocumento").val() == ''){
			mostrarPopUpError("Por favor ingrese un número de documento<br>para la búsqueda");
		}else{
			consultarCertificadoAnuladoPorDocumento();
		}
	});

	//----- Recarga la página -----//
	$("#btnCancelar").click(function(){
		window.location.href = "../html/certificado.html";
	});

	//----- Recarga la página -----//
	$("#btnAcePop1").click(function(){ 
		$.post("../../controlador/fachada.php", {
		clase: 'clsCertificados',
		oper: 'consultarTercero',
		pIdUsuario: sessionStorage.idUsuario
		}, function(data) {
			if (data !== 0) {
				consultarDatosFirmaDigital(data[0].Tercero);
			}else {
				mostrarPopUpError("No ha registrado su firma");
			}
		}, "json");
	});
	
	//----- Da inicio al proceso de generar los certificados y enviar los correos -----//
	$("#btnAcePop2").click(function(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'reexpedirCertificado',
			pIdCertificado: sessionStorage.IdCertificado
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					var resultado = data[0].pIdCertificado;
					var pIdCertificado = resultado.split('-');
					if((pIdCertificado[1]) = 405){
						enviarCorreoPorModulo(pIdCertificado[0]);
					}else{
						enviarCorreoPorCurso(pIdCertificado[0]);
					}
				}else {
					jsRemoveWindowLoad();
					mostrarPopUpError("No fue posible reexpedir el certificado");
				}
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("Existe un error, consulte con el administrador");
			}
		}, "json");
	});

	//----- Valida que solo se ingrese en las cajas de texto los valores apropiados -----//
	$('#txtNDocumento').validCampoFranz('0123456789');

	//----- Consulta en la base de datos los certificados disponibles por # de documento -----//
	function consultarCertificadoAnuladoPorDocumento(){
		/*mensaje de procesando*/
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'consultarCertificadoAnuladoPorDocumento',
			pTipoDocumento: $("#cmbTipoDocumento option:selected").val(),
			pDocumento: $("#txtNDocumento").val()
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					cargarInformacionEnTabla(data);
					jsRemoveWindowLoad();
				}else{
					jsRemoveWindowLoad();
					document.getElementById("txtNDocumento").focus();
					mostrarPopUpError("No existen certificados con los datos suministrados");
				}             
			}else {
				jsRemoveWindowLoad();
				document.getElementById("txtNDocumento").focus();
				mostrarPopUpError("No existen certificados con los datos suministrados");
			}
		}, "json");
	};

	//----- Crea la tabla y carga la información -----//
	function cargarInformacionEnTabla(data){
		//se destruye el datatable al inicio
		if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaCertificados').empty();
        }
		table = $('#tablaCertificados').DataTable({
			"data": data,
			columns: [
			{ title: "Id" },
			{ title: "Reexpedir", data: null, className: "center", defaultContent: '<a id="reexpedir-link" class="reexpedir-link" href="#" title="Edit">Reexpedir</a>'},
			{ title: "Código" },
			{ title: "Programa" },
			{ title: "Curso" },
			{ title: "Fecha" },
			{ title: "Certificado por" },
			{ title: "TipoIdentificacion" },
			{ title: "NumeroIdentificacion" },
			{ title: "Estudiante" }
			],
			"paging":   false,
			"info":     false,
			"order": [[ 3, "desc" ]],
			"scrollY": "300px",
			"scrollX": true,
			"bDestroy": true,
			"scrollCollapse": true,
			"columnDefs": [
			{"targets": [ 0 ],"visible": false,"searchable": false},
			{"targets": [ 7 ],"visible": false,"searchable": false},
			{"targets": [ 8 ],"visible": false,"searchable": false},
			{"targets": [ 9 ],"visible": false,"searchable": false}
			],
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}
		});
		$('#tablaCertificados tbody').on('click', 'tr', function () {
			if ( $(this).hasClass('selected')) {
				$(this).removeClass('selected');
				seleccionado = false;
			}else{
				table.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				seleccionado = true;
			}
			if(typeof(Storage) !== "undefined") {
				sessionStorage.IdCertificado = table.row(this).data()[0];
				sessionStorage.CodigoCertificado = table.row(this).data()[2];
				sessionStorage.Curso = table.row(this).data()[4];
				sessionStorage.TipoIdentificacion = table.row(this).data()[7];
				sessionStorage.NumeroIdentificacion = table.row(this).data()[8];
				sessionStorage.Nombre = table.row(this).data()[9];			
			} else {
				mostrarPopUpError("Por favor actualice su navegador o utilice otro: SessionStorage");
			}
		} );
	}

	//----- Consulta los datos para el certificado y lo muestra en pantalla -----//
	$(document).on('click', '#reexpedir-link', function() {
		mostrarPopUpConfirmacion("Está seguro de reexpedir el certificado No. "+sessionStorage.CodigoCertificado+"<br>de la capacitación "+sessionStorage.Curso+"<br>perteneciente a "+sessionStorage.Nombre+"<br>identificado(a) con "+sessionStorage.TipoIdentificacion+" No. "+sessionStorage.NumeroIdentificacion);
	});	

	//----- Consulta los datos de la firma digital por Id de Firma-----//
	function consultarDatosFirmaDigital(tercero){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'consultarFirmaDigital2',
			pIdTercero: tercero
		}, function(data) {
			if (data !== 0) {
				if (data !== -1) {
					popUpConfirmacion1("¿Desea certificar usando la firma de abajo?");
					$("#imgFirma").attr('src',data[0].RutaFirma);
				}else {
					mostrarPopUpError("Aún no ha registrado su firma");
				}
			}else {
				mostrarPopUpError("Existe un error, consulte con el administrador");
			}
		}, "json");
	};

	//----- Envía correos a todos los estudiantes que aprobaron el modulo cuando se genera el certificado -----//
	function enviarCorreoPorCurso(IdCertificado){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'enviarCorreoPorCurso',
			pIdCertificado: IdCertificado
		}, function(data) {
			if (data !== 0) {
				if (data == -1) {
					jsRemoveWindowLoad();
					mostrarPopUpError("Certificados generados de manera satisfactoria");
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
	        		jsRemoveWindowLoad();
				}else {
					jsRemoveWindowLoad();
					mostrarPopUpError("No fue posible enviar el correo");
				}
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("No fue posible enviar el correo");
			}
		}, "json");
	};

	//----- Envía correos al estudiante luego de reexpedir el certificado -----//
	function enviarCorreoPorModulo(IdCertificado){
		$.post("../../controlador/fachada.php", {
			clase: 'clsCertificados',
			oper: 'enviarCorreoPorModulo',
			pIdCertificado: IdCertificado
		}, function(data) {
			if (data !== 0) {
				if (data == -1) {
					jsRemoveWindowLoad();
					mostrarPopUpError("Certificados generados de manera satisfactoria");
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
	        		jsRemoveWindowLoad();
				}else {
					jsRemoveWindowLoad();
					mostrarPopUpError("No fue posible enviar el correo");
				}
			}else {
				jsRemoveWindowLoad();
				mostrarPopUpError("No fue posible enviar el correo");
			}
		}, "json");
	};

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

	function popUpConfirmacion1(msj){
		    $("#textoError1").html(msj);
		    $('#element_to_pop_firma').bPopup({
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