/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(function() {

    var nom_arc = '';
    var idJornada='';
	archivo="";
	valorSeleccionado="";
	var d = new Date();
	
	$("#txtFecha").val(d);
	CargarListaCargasMasivas("#selCarga");
	obtenerFechaActual();
	// cargarOpcionesarchivos();

    function CargarArchivoPlano() {
        console.log("cargarArchivoPlano()");
        $.post("../../controlador/fachada.php", {
            clase: 'clsPersona',
            oper: 'AgregarDesdeArchivoPlano'
        }, function(data) {
//        alert('Server: '+data);
            $('body').html(data);
        });
    }

	/// Realiza todo el proceso 
	/// 1 - Guarda documento.
	/// Valida si ya tiene un idTablageneral si no lo crea.
	/// Cambia de ruta los archivos.
	/// lee archivo inserta en tabla.
	function almacenarArchivos(archivo){
		if(archivo=="Escaneado"){
			GuardarArchivoFuenteEscaneado();
		}else if(archivo=="Autorizacion"){
			GuardarArchivoFuenteAutorizacion();
		}
	}



	function GuardarArchivoCarpeta(archivo){
		var ubicacion = "tmp/";  
		var valorSeleccionado = archivo; 		
        var archivos = document.getElementById("txtexaminararchivos"+archivo);
        var archivo = archivos.files;

        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].size < 10000485760) {
                var data = new FormData();
                data.append('vid', archivo[0]);
                $.ajax({
                    type: 'POST',
                    url: "../../controlador/fachada.php?clase=clsArchivo&oper=GuardarArchivoPlano&valorSeleccionado="+valorSeleccionado+"&ubicacion="+ubicacion+"&archivo"+archivos,
                    data: data, //Le pasamos el objeto que creamos con los archivos
                    contentType: false, //Debe estar en false para que pase el objeto sin procesar
                    processData: false, //debe estar en false para que JQuery no procese los datos a enviar
                    cache: false //Para que el formulario no guarde cache
                }).done(function(data) { 

                	if(data!=""){
                		if(valorSeleccionado=="Escaneado"){
                			sessionStorage.nameArchivoEscaneado=data;
                		}else if(valorSeleccionado =="Fuente"){
	                		sessionStorage.nameArchivoFuente=data;
	                	}else if(valorSeleccionado=="Autorizacion"){
	                		sessionStorage.nameArchivoAutorizacion=data;
	                	}
	                }else{
	                	jsRemoveWindowLoad();
                		mostrarPopUpError("Error al guardar archivo en carpeta temporal");
	                }
                });
             } else {
            	jsRemoveWindowLoad();
                mostrarPopUpError('EL TAMAÑO DEl  DOCUMENTO ES MAYOR A 1MB,\nPARA SUBIR EL DOCUMENTO ASEGURESE QUE SU TAMAÑO SEA MENOR.');
            }
           }

	}

	function GuardarArchivoFuenteEscaneado(){
		var archivo="Fuente";
		var ubicacionOriginalFuente = $("#ruta").val()+"/Fuente/";
		
			GuardarArchivoCarpeta(archivo); // se guarda archivo fuente en carpeta tmp

			setTimeout(function(){
			nameArchivoFuente= sessionStorage.nameArchivoFuente;
			var observaciones=$("#txtDescripcion").val();
			var tipoCarga= $("#selCarga").val();
			var nombreCorto= $("#nombreCorto").val();
	                	//Guarda en la tabla TCARGAGENERAL
	                	$.post("../../controlador/fachada.php", {
					    	clase: 'clsCarga',
					        oper: 'AgregarCargaGeneral',
					        tipoCarga: tipoCarga,
					        Observaciones: observaciones
						     }, function(data) {
						     	console.log("AgregarCargaGeneral "+data);
						     	if(data!=""){
							        var idTablaGeneral="";
							        idTablaGeneral= data[0]["IdTabla"];
							        var archivoEscaneado="Escaneado";
							        
							        setTimeout(function(){
							        	ubicacionOriginalEscaneado = $("#ruta").val()+"/Escaneado/";
							        	GuardarArchivoCarpeta(archivoEscaneado); //guardar archivo escaneado en carpeta tmp
							        	nameArchivotmpEscaneado= sessionStorage.nameArchivoEscaneado;
										GuardarDocumentoRutaOriginal(idTablaGeneral, nameArchivoFuente, nameArchivotmpEscaneado, ubicacionOriginalFuente, ubicacionOriginalEscaneado, nombreCorto, archivo);
							        },2000);
							    }else{
							    	jsRemoveWindowLoad();
                					mostrarPopUpError("Error al guardar en tabla general");
							    }
						     
						     }, "json");

	               },2000);
	}



	function GuardarArchivoFuenteAutorizacion(){
		var archivoF="Fuente";
		var ubicacionOriginalFuente = $("#ruta").val()+"/Fuente/";
			GuardarArchivoCarpeta(archivoF); // Guarda archivo fuente en Carpeta temporal

			setTimeout(function(){
			nameArchivoFuente= sessionStorage.nameArchivoFuente;
			var observaciones=$("#txtDescripcion").val();
			var tipoCarga= $("#selCarga").val();
			var nombreCorto= $("#nombreCorto").val();
	                	//Guarda en la tabla TCARGAGENERAL
	                	$.post("../../controlador/fachada.php", {
					    	clase: 'clsCarga',
					        oper: 'AgregarCargaGeneral',
					        tipoCarga: tipoCarga,
					        Observaciones: observaciones
						     }, function(data) {

						     	if(data!=""){
							        var idTablaGeneral="";
							        idTablaGeneral= data[0]["IdTabla"];
							        var archivoA="Autorizacion";

						       		 setTimeout(function(){
									        ubicacionOriginalAutorizacion = $("#ruta").val()+"/Autorizacion/";
									         GuardarArchivoCarpeta(archivoA); //Guardar archivo autorizacion en carpeta
						        			nameArchivotmpAutorizacion= sessionStorage.nameArchivoAutorizacion;
											GuardarDocumentoRutaOriginalAutorizacion(idTablaGeneral, nameArchivoFuente, nameArchivotmpAutorizacion, ubicacionOriginalFuente, ubicacionOriginalAutorizacion, nombreCorto, archivoA);
						        	},3000);

						       }else{
						       		 jsRemoveWindowLoad();
						       		 mostrarPopUpError("Error al guardar en tabla general");
						       }  
						       
						     }, "json");

	               },2000);
	}





	function GuardarDocumentoRutaOriginalAutorizacion(idTablaGeneral,archivoFuente,ArchivoAutorizacion,ubicacionFuente,ubicacionAutorizacion, nombreCorto,tipoArchivo){
			//Guarda archivo en carpeta original Fuente
			tipoarchivoF="Fuente";
			$.post("../../controlador/fachada.php", {
				    	clase: 'clsArchivo',
				        oper: 'GuardarArchivoOriginal',
				        idTablaGeneral: idTablaGeneral,
				        archivo: archivoFuente,
				        ubicacion: ubicacionFuente,
				       	nombreCorto: nombreCorto,
				        tipoArchivo: tipoarchivoF
					     }, function(data) {
					        if(data!=2){
					         	archivoFuente= data;
					         	tipoarchivoA="Autorizacion";
					         //Guarda archivo en carpeta original autorizacion
					         	$.post("../../controlador/fachada.php", {
							    	clase: 'clsArchivo',
							        oper: 'GuardarArchivoOriginal',
							        idTablaGeneral: idTablaGeneral,
							        archivo: ArchivoAutorizacion,
							        ubicacion: ubicacionAutorizacion,
							       	nombreCorto: nombreCorto,
							        tipoArchivo: tipoarchivoA
								     }, function(data) {
								        if(data!=2){
								         	archivoAutorizacion= data;
								         	setTimeout(function(){
								        		EvaluarArchivosFuenteAutorizacion(idTablaGeneral,archivoFuente, ubicacionFuente,archivoAutorizacion,ubicacionAutorizacion, nombreCorto, tipoArchivo);
								       		},2000);
								       }else{
								       	 	jsRemoveWindowLoad();
								        	 mostrarPopUpError('Se produjo un error al subir el archivo fuente, favor intentarlo mas tarde');
								        }

									}, "json");

					       }else{
					       		  jsRemoveWindowLoad();
					        	 mostrarPopUpError('Se produjo un error al subir el archivo fuente, favor intentarlo mas tarde');
					        }

			}, "json");

	}


	function GuardarDocumentoRutaOriginal(idTablaGeneral,archivoFuente,archivoEscaneado,ubicacionFuente,ubicacionEscaneado, nombreCorto,tipoArchivo){
			$.post("../../controlador/fachada.php", {
				    	clase: 'clsArchivo',
				        oper: 'GuardarArchivoOriginal',
				        idTablaGeneral: idTablaGeneral,
				        archivo: archivoFuente,
				        ubicacion: ubicacionFuente,
				       nombreCorto: nombreCorto,
				        tipoArchivo: tipoArchivo
					     }, function(data) {
					        if(data!=2){
					         	archivo= data;
					         	setTimeout(function(){
					        		EvaluarArchivosFuente(idTablaGeneral,archivo, ubicacionFuente,archivoEscaneado,ubicacionEscaneado, nombreCorto, tipoArchivo);
					       		},2000);
					       }else{
					       		jsRemoveWindowLoad();
					        	 mostrarPopUpError('Se produjo un error al subir el archivo fuente, favor intentarlo mas tarde');
					        }

			}, "json");

	}
	
	
    function GuardarArchivo() { 	

    	if(($("#hiddenexaminararchivosFuente").val()) && ($("#hiddenexaminararchivosEscaneado").val())){
			if(($("#txtexaminararchivosFuente").val()) && ($("#txtexaminararchivosEscaneado").val())){
				var archivo="Escaneado";
				almacenarArchivos(archivo);	
			}else{
				jsRemoveWindowLoad();
				mostrarPopUpError("El campo Fuente y Escaneado debe contener datos");
			}
    	}else if(($("#hiddenexaminararchivosFuente").val()) && ($("#hiddenexaminararchivosAutorizacion").val())){

    		if(($("#txtexaminararchivosAutorizacion").val()) && ($("#txtexaminararchivosFuente").val())){
    			var archivo="Autorizacion";
				almacenarArchivos(archivo);	
    		}else{
    			jsRemoveWindowLoad();
				mostrarPopUpError("El campo Fuente y Escaneado debe contener datos");
    		}

    	}
   
	
    }


    function EvaluarArchivosFuente(idTablaGeneral,archivo,ubicacionFuente,archivoEscaneado,ubicacionEscaneado,nombreCorto,tipoArchivo) { 
    	console.log("ubicacionFuente"+ubicacionFuente);
    	console.log("archivo"+archivo);
    	//se valida que tipo de carga se selecciono para subirlo
    	var selCarga=$("#selCarga").val();
		if (valorSeleccionado==1)
        {
         	EvaluarArchivo(idTablaGeneral,archivo, ubicacionFuente,archivoAutorizacion,ubicacionAutorizacion, nombreCorto, tipoArchivo);
        }else{ 
	        $.post("../../controlador/fachada.php", {
	            clase: 'clsGestorBDPlanas',
	            oper: 'CargarArchivoPlanoFuenteEscaneado',
	            archivo: archivo,
	            idTablaGeneral: idTablaGeneral,
	            ubicacionFuente: ubicacionFuente,
	            archivoEscaneado: archivoEscaneado,
	            ubicacionEscaneado: ubicacionEscaneado,
	            nombreCorto: nombreCorto,
	            selCarga: selCarga
	        }, function(data) {
	            $("#circulo").hide();
	            $("#xerror").hide();
	            $("#fondoerrores").show();
	            $("#fondoerrores").empty();
	            if (data.indexOf("<ul>") !== -1) {
	                $("#circulo").show();
	                $("#xerror").show();
	            }
	            $("#fondoerrores").append(data);
	            jsRemoveWindowLoad();
	        }
	        );

    }
   }



    function EvaluarArchivosFuenteAutorizacion(idTablaGeneral,archivo,ubicacionFuente,archivoAutorizacion,ubicacionAutorizacion,nombreCorto,tipoArchivo) { 
    	//se valida que tipo de carga se selecciono para subirlo
    	
    	console.log("ubicacionFuente"+ubicacionFuente);
    	console.log("archivo"+archivo);
    	var selCarga=$("#selCarga").val();
		if (valorSeleccionado==1)
        {
        	// valida si es asignacion
         	EvaluarArchivo(idTablaGeneral,archivo,ubicacionFuente,archivoAutorizacion,ubicacionAutorizacion, nombreCorto, selCarga);
        }else{ 
	        $.post("../../controlador/fachada.php", {
	            clase: 'clsGestorBDPlanas',
	            oper: 'CargarArchivoPlanoFuenteAutorizacion',
	            archivo: archivo,
	            idTablaGeneral: idTablaGeneral,
	            ubicacionFuente: ubicacionFuente,
	            archivoAutorizacion: archivoAutorizacion,
	            ubicacionAutorizacion: ubicacionAutorizacion,
	            nombreCorto: nombreCorto,
	            selCarga: selCarga
	        }, function(data) {
	            $("#circulo").hide();
	            $("#xerror").hide();
	            $("#fondoerrores").show();
	            $("#fondoerrores").empty();
	            if (data.indexOf("<ul>") !== -1) {
	                $("#circulo").show();
	                $("#xerror").show();
	            }
	            $("#fondoerrores").append(data);
	            jsRemoveWindowLoad();
	        }
	        );

    }
   }

	/*
	* Se agrega validacion del checkbox para saber
	*si se actualizan los terceros
	*/
    function EvaluarArchivo(idTablaGeneral,archivo,ubicacionFuente,archivoAutorizacion,ubicacionAutorizacion, nombreCorto, selCarga) { 
		if( $('#txtCheck').prop('checked') ) {
			actualizarTercero=true;
		}
		else{
			actualizarTercero=false;
		}
		
	
        $.post("../../controlador/fachada.php", {
            clase: 'clsGestorBDPlanas',
            oper: 'CargarArchivoPlano',
            nom_arc: nom_arc.replace('"',"").replace('"',""),
            pIdJornada:idJornada,
			actualizarTercero:actualizarTercero,
			ubicacionFuente: ubicacionFuente,
			selCarga: selCarga,
			archivo: archivo,
	        idTablaGeneral: idTablaGeneral,
	        archivoAutorizacion: archivoAutorizacion,
	        ubicacionAutorizacion: ubicacionAutorizacion,
	        nombreCorto: nombreCorto

        }, 
        	function(data) {
            $("#circulo").hide();
            $("#xerror").hide();
            $("#fondoerrores").show();
            $("#fondoerrores").empty();
            if (data.indexOf("<ul>") !== -1) {
                $("#circulo").show();
                $("#xerror").show();
            }
            $("#fondoerrores").append(data);
				jsRemoveWindowLoad();

	        }
        );
   }

   $("#consultarArchivos").click(function() { 
   		window.location='consultarArchivos.html';
   	});
	
	$("#btnCarga").click(function() { 
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		var valorSeleccionado = $("#selCarga").val();
		
		if($("[id^='txtDescripcion']").val()!='' && $("[id^='txtFecha']").val()!=''){ 
			GuardarArchivo(); 
		}else{
			jsRemoveWindowLoad();
			mostrarPopUpError("Falta diligenciar campos");
		}
	});
	

    function insertarConvocatoria() { 
        $.post("../../controlador/fachada.php", {
            clase: 'clsConvocatoria',
            oper: 'insertarJornadaConvocatoria',
            pJornada:$("#txtDescripciona").val(),
            pDireccion:$("#txtDirecciona").val(),
            pFecha:$("#txtFechaa").val()
			
        }, function(data) {
            idJornada=data[0].IdTabla;
        }, "json"
        );
   }
   
   function jsRemoveWindowLoad() {
    // eliminamos el div que bloquea pantalla
    $("#WindowLoad").remove();
 
}
 
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

	$( "#selCarga" ).change(function() { 
			valorSeleccionado = $("#selCarga").val(); 
			$("#fondoerrores").html("");
			
			$( "input[id^='txtDescripcionf']", $(".form") ).val("");
			switch (valorSeleccionado) {
				case "00":
					$(".form").hide();
					mostrarPopUpError("Debe seleccionar una opción");
					break;
				case "1":
					$(".form").hide();
					$("#ActualizarTercero").show();
					cargarOpcionesArchivos(valorSeleccionado);			    
					 
					break;
				case "2":
					$(".form").hide();
					cargarOpcionesArchivos(valorSeleccionado);
					// $("#soporteMatriculas").show();				
					
					break;
				case "3":
					$(".form").hide();
					cargarOpcionesArchivos(valorSeleccionado);
					// $("#soporteFirmas").show();
					
					
					break;
				case "4":
					$(".form").hide();
					cargarOpcionesArchivos(valorSeleccionado);
					// $("#cambioEstados").show();
					
					break;
				case "5":
					$(".form").hide();
					cargarOpcionesArchivos(valorSeleccionado);
					// $("#soporteRefrigerios").show();
					
					break;
				case "6":
					$(".form").hide();
					cargarOpcionesArchivos(valorSeleccionado);
					// $("#informeAgencia").show();
					
			}
	});
	
	function popUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

	function mostrarPopUpError(err_men) {
		$("#textoError").text(err_men);
		$('#element_to_pop_upMen').bPopup({
			speed: 450,
			transition: 'slideDown'
		});
}

	function obtenerFechaActual(){
		var hoy = new Date();
		var dd = hoy.getDate();
		var mm = hoy.getMonth()+1; //hoy es 0!
		var yyyy = hoy.getFullYear();

		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 

		// hoy = mm+'/'+dd+'/'+yyyy;
		hoy = dd+'/'+mm+'/'+yyyy;
		
		$(".fecha").val(hoy);
		//$('.fecha').prop('readonly', true);
	}
	
	function CargarListaCargasMasivas(SelectCarga) {  
    $.post("../../controlador/fachada.php", {
         clase: 'clsGestorBDPlanas',
         oper: 'CargarListaCargasMasivas',
    }, function(data) { 
        if (data !== 0) {
            FormarOptionValueLista(data, SelectCarga);
        }
        else {
            mostrarPopUpError('No se pudo cargar la lista de cargas, intentelo nuevamente');
        }
    }, "json");
}

function FormarOptionValueLista(data, SelectCarga) {
    $('#selCarga').find('option').remove();
    SetParametroCursoPorDefecto(SelectCarga, '00', 'Seleccione...');
    for (i = 0; i < data.length; i++) {
        $('#selCarga').append($('<option>', {
            value: data[i].Id,
            text: data[i].Nombre
        }))
    }
}

function SetParametroCursoPorDefecto(atributo, valor, texto) {
    $(atributo).append($('<option>', {
        value: valor,
        text: texto
    }));
}

	
	function cargarOpcionesArchivos(valor) { 

	//se muestra el formulario basico
	$("#formBasico").show();
	$("#botones_carga").show();
	
    $.post("../../controlador/fachada.php", {
         clase: 'clsGestorBDPlanas',
         oper: 'cargarOpcionesArchivos',
		 valor:valor
    }, function(data) { 
		console.log(data);
        if (data !== 0) {
        	  $("#ruta").val(data[0].Ruta);
			  $("#tabla").val(data[0].NombreTabla);
			  $("#nombreCorto").val(data[0].NombreCorto);
           if ( data[0].ArchivoAutorizacion == "S"){
			   $("#Autorizacion").show();
			   $("#hiddenexaminararchivosAutorizacion").val("Autorizacion");
		   }
		   if ( data[0].ArchivoFuente == "S"){
			   $("#Fuente").show();
			    $("#hiddenexaminararchivosFuente").val("Fuente");
		   }
		   if ( data[0].ArchivoEscaneado == "S"){
			   $("#Escaneo").show();
			   $("#hiddenexaminararchivosEscaneado").val("Escaneado");
		   }
        }
        else {
            mostrarPopUpError('No se pudo cargar la lista de opciones archivos');
        }
    }, "json");
}
	





});