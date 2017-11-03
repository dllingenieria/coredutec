$(function(){

	CargarListaCargasMasivas("#selCargaConsulta");

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
	        $(SelectCarga).append($('<option>', {
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


	$( "#selCargaConsulta" ).change(function() { 
			valorSeleccionado = $("#selCargaConsulta").val(); 
			
			switch (valorSeleccionado) {
				case "00":
					$(".form").hide();
					mostrarPopUpError("Debe seleccionar una opción");
					break;
				case "1":
					$("#form-tercero").show();	
					$("#form-preprogramacion").hide();				 
					break;
				case "2":		
					$("#form-tercero").show();
					$("#form-preprogramacion").hide();
					break;
				case "3":
					$("#form-preprogramacion").show();
					$("#form-tercero").hide();
					break;
				case "4":
					$("#form-tercero").show();
					$("#form-preprogramacion").hide();
					break;
				case "5":
					$("#form-preprogramacion").show();
					$("#form-tercero").hide();
					break;
				case "6":
					$("#form-preprogramacion").show();
					$("#form-tercero").hide();
			}
	});


		$("#buscar").click(function() {
		var selCargaConsulta = $("#selCargaConsulta").val();
		var mensaje="Procesando la información<br>Espere por favor";
		var busqueda="";
        jsShowWindowLoad(mensaje);

       	
        if(selCargaConsulta==1 || selCargaConsulta==4 || selCargaConsulta==2){
        	busqueda=$("#identificacion").val(); // los que buscan por tercero
        }else if(selCargaConsulta==3 || selCargaConsulta==5 || selCargaConsulta==6){
        	busqueda=$("#Preprogramacion").val(); // los que buscan por preprogramacion
        }

		/*$.post("../../controlador/fachada.php", {
		clase: 'clsMatricula',
		oper: 'consultarMatriculas',
		busqueda : busqueda,
		selCargaConsulta: selCargaConsulta
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					//console.log(JSON.stringify(data[0]));
					cargarInformacionEnTabla(data, identificacion);
					jsRemoveWindowLoad();
					$('#imprimir').hide();
				}else{alert("error 1");}             
			}else {alert("error 2");}
		}, "json");*/
		

 	});



	$("#buscarPreprogramacion").click(function() {
		var selCargaConsulta = $("#selCargaConsulta").val();
		var mensaje="Procesando la información<br>Espere por favor";
        jsShowWindowLoad(mensaje);
		$.post("../../controlador/fachada.php", {
		clase: 'clsMatricula',
		oper: 'consultarMatriculas',
		identificacion : identificacion
		}, function(data) {
			if (data !== 0) {
				if(data !== null){
					//console.log(JSON.stringify(data[0]));
					cargarInformacionEnTabla(data, identificacion);
					jsRemoveWindowLoad();
					$('#imprimir').hide();
				}else{alert("error 1");}             
			}else {alert("error 2");}
		}, "json");
		
		//alert('hola');
 	});



	function mostrarPopUpError(err_men) {
		$("#textoError").text(err_men);
		$('#element_to_pop_upMen').bPopup({
			speed: 450,
			transition: 'slideDown'
		});
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


});