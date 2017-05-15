/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(function() {

//$(document).ready(function() {
//    cargarArchivoPlano();
//});
    var nom_arc = '';
    var idJornada='';
	archivo="";
	
	CargarListaCargasMasivas();
	obtenerFechaActual();

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

    function GuardarArchivo(archivo) { 
		var valorSeleccionado = $("#selCarga").val(); 
		var ubicacion = $("#txtDireccion"+archivo).val(); 
		
        var archivos = document.getElementById("txtexaminararchivos"+archivo);
        // var archivos = $("[id^='txtexaminararchivos']").val();
        var archivo = archivos.files;
        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].size < 1048576) {
                var data = new FormData();
                data.append('vid', archivo[0]);
                $.ajax({
                    type: 'POST',
                    url: "../../controlador/fachada.php?clase=clsArchivo&oper=GuardarArchivoPlano&valorSeleccionado="+valorSeleccionado+"&ubicacion="+ubicacion,
                    data: data, //Le pasamos el objeto que creamos con los archivos
                    contentType: false, //Debe estar en false para que pase el objeto sin procesar
                    processData: false, //Debe estar en false para que JQuery no procese los datos a enviar
                    cache: false //Para que el formulario no guarde cache
                }).done(function(data) { 
					popUpConfirmacion("Archivo cargado correctamente");
					
						nom_arc = data;
					
                     
                }).success(function() { 
                    if (valorSeleccionado=="1"){EvaluarArchivo();}
					
					jsRemoveWindowLoad();
                });
            } else
            {
                mostrarPopUpError('EL TAMAÑO DEl  DOCUMENTO ES MAYOR A 1MB,\nPARA SUBIR EL DOCUMENTO ASEGURESE QUE SU TAMAÑO SEA MENOR.');
            }
        }
    }

	/*
	* Se agrega validacion del checkbox para saber
	*si se actualizan los terceros
	*/
    function EvaluarArchivo() { 
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
			actualizarTercero:actualizarTercero
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
//            $(".fondoerrores").append(data);
        }
        );
   }

    $("[id^='txtexaminararchivos']").change(function() { 
        
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		var valorSeleccionado = $("#selCarga").val(); 
			switch (valorSeleccionado) {
				case "1":
					if($("[id^='txtDescripciona']").val()!='' && $("[id^='txtFechaa']").val()!='' && $("[id^='txtDirecciona']").val()!=''){ 
						archivo ="a"; 
						insertarConvocatoria();
						GuardarArchivo(archivo); 
					}
					else{
						mostrarPopUpError("Falta diligenciar campos")
					}
					break;
				case "2":
					if($("[id^='txtDescripcionm']").val()!='' && $("[id^='txtFecham']").val()!='' && $("[id^='txtDireccionm']").val()!=''){ 
						archivo ="m";
						GuardarArchivo(archivo); 
					}
					else{
						mostrarPopUpError("Falta diligenciar campos")
					}
					
					break;
				case "3":
					if($("[id^='txtDescripcionf']").val()!='' && $("[id^='txtFechaf']").val()!='' && $("[id^='txtDireccionf']").val()!=''){ 
						archivo ="f";
						GuardarArchivo(archivo); 
					}
					else{
						mostrarPopUpError("Falta diligenciar campos")
					}
					
					break;
				case "4":
					if($("[id^='txtDescripcione']").val()!='' && $("[id^='txtFechae']").val()!='' && $("[id^='txtDireccione']").val()!=''){ 
						archivo ="e";
						GuardarArchivo(archivo); 
					}
					else{
						mostrarPopUpError("Falta diligenciar campos")
					}
					
					break;
				case "5":
					if($("[id^='txtDescripcionr']").val()!='' && $("[id^='txtFechar']").val()!='' && $("[id^='txtDireccionr']").val()!=''){ 
						archivo ="r";
						GuardarArchivo(archivo); 
					}
					else{
						mostrarPopUpError("Falta diligenciar campos")
					}
					
					break;
				case "6":
					if($("[id^='txtDescripcionag']").val()!='' && $("[id^='txtFechaag']").val()!='' && $("[id^='txtDireccionag']").val()!=''){ 
						archivo ="ag";
						GuardarArchivo(archivo);  
					}
					else{
						mostrarPopUpError("Falta diligenciar campos")
					}
					
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
			var valorSeleccionado = $("#selCarga").val(); 
			$("#fondoerrores").html("");
			// $( "input", $(".form") ).val("");
			
			// $( "input[id!=txtFecha]", $(".form") ).val("");
			$( "input[id^='txtDescripcionf']", $(".form") ).val("");
			switch (valorSeleccionado) {
				case "00":
					$(".form").hide();
					mostrarPopUpError("Debe seleccionar una opción");
					break;
				case "1":
					$(".form").hide();
				     $("#cargaAsignacion").show();
					 
					break;
				case "2":
					$(".form").hide();
					$("#soporteMatriculas").show();
					
					
					break;
				case "3":
					$(".form").hide();
					$("#soporteFirmas").show();
					
					
					break;
				case "4":
					$(".form").hide();
					$("#cambioEstados").show();
					
					break;
				case "5":
					$(".form").hide();
					$("#soporteRefrigerios").show();
					
					break;
				case "6":
					$(".form").hide();
					$("#informeAgencia").show();
					
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
	
	function CargarListaCargasMasivas() {  
    $.post("../../controlador/fachada.php", {
         clase: 'clsGestorBDPlanas',
         oper: 'CargarListaCargasMasivas',
    }, function(data) { 
        if (data !== 0) {
            FormarOptionValueLista(data);
        }
        else {
            mostrarPopUpError('No se pudo cargar la lista de cargas, intentelo nuevamente');
        }
    }, "json");
}

function FormarOptionValueLista(data) {
    $('#selCarga').find('option').remove();
    SetParametroCursoPorDefecto("#selCarga", '00', 'Seleccione...');
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
	


});