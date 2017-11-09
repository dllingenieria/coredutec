$(document).ready(function() {

tipoSoporte="";
fechaInicial="";
fechaFinal="";
			
archivosUrl= new Array();
    limpiarCampos();
    cargarTiposSoportes();
	cargarConvocatorias();
    //configuracion del calendario
	 $.datepicker.regional['es'] = {
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
		
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
	
	
	
	$("#txtFechaI").datepicker();
	$("#txtFechaF").datepicker();

	$('#cmbTipoDeSoporte').change(function() { 
	 tipoSoporte="";
        	
            //estudiante
			if($('#cmbTipoDeSoporte').val()==294)
			{
                accion=294;
                tipoSoporte=$('#cmbTipoDeSoporte').val();
				$('#divBusquedaCedula').show();
				$( "#Example3" ).attr( "src", "../../SubirArchivo/index2.php?accion="+accion);
				$( "#Example2" ).attr( "src", "../../SubirArchivo/index.php?accion=1&tipoSoporte="+tipoSoporte );
				
				$("#derecha1").hide();
				$('#divfecha').hide();
				$('#derecha').hide();
				$('#divBusquedaConvocatoria').hide();
				
				
            }
			//caso especial
            else if($('#cmbTipoDeSoporte').val()==295)
			{
                accion=295;
				tipoSoporte=$('#cmbTipoDeSoporte').val()
				$("#derecha1").hide();
				$('#divBusquedaCedula').hide();
				$('#divfecha').show();
				$('#derecha').hide();
				$('#divBusquedaConvocatoria').hide();
				$( "#Example2" ).attr( "src", "../../SubirArchivo/index2.php?accion=295");
				
				// $("#derecha1").show();
            }
			//convocatoria
			else if($('#cmbTipoDeSoporte').val()==299)
			{
                accion=299;
				tipoSoporte=$('#cmbTipoDeSoporte').val()
				$("#derecha1").hide();
				$('#divBusquedaCedula').hide();
				$('#divBusquedaConvocatoria').show();
				$('#derecha').hide();
				$('#divfecha').hide();
				$( "#Example2" ).attr( "src", "../../SubirArchivo/index2.php?accion=299");
				
				// $("#derecha1").show();
            }
			else if($('#cmbTipoDeSoporte').val()==0){
				$('#divBusquedaCedula').hide();
				$("#derecha1").hide();
				$('#divfecha').hide();
				$('#derecha').hide();
                PopUpError("Debe seleccionar un tipo de soporte");
            }
            
    });
	
	//validacion campos numericos
	 
	 
	 
	  $("#txtCedula").keydown(function (e) {  
               if (e.shiftKey || e.ctrlKey || e.altKey) {  
                   
               }
			   else 
			   {  
                   var key = e.keyCode;  
                   if (!((key == 8) || (key == 46) ||  (key == 9)  ||
					(key >= 35 && key <= 40)  
					|| (key >= 48 && key <= 57)  
					|| (key >= 96 && key <= 105))) 
					{  
					   e.preventDefault();  
					 }  
				}  
           }); 
		$('#tablaSoportes').on( 'click', 'tr', function () 
		{
			$(this).toggleClass('selected');
		
		});
	
	
	$("#btnDescargarSeleccionados").click(function() {  
		
			archivosUrl=[];				
		$('#tablaSoportes > tbody  > tr.selected').each(function(i,row)
		{  
			archivosUrl.push(table.row(this).data()[3])
		});
		
		if (archivosUrl.length>0){
			$cedula="";
			if ($("#cmbConvocatoria:visible").val()!= undefined)
			{
				cedula =$("#cmbConvocatoria:visible").val();
			}
			
			if ($("#txtCedula:visible").val()!= undefined)
			{
				cedula = $("#txtCedula:visible").val();	
			}
			
			if ($("#txtCedula1:visible").val()!= undefined)
			{
				cedula = $("#txtCedula:visible").val();	
			}
			

			$.post("../../controlador/fachada.php", {
			clase: 'clsSoportes',
			oper: 'descargaMultiple',
			arrayUrl:archivosUrl,
			cedula: $("#txtCedula").val(),
			}, 
			function(data) 
			{
				if (data !== 0) 
				{
						$("#descarMultiple").attr("href","../"+data);
						setTimeout(function(){$("#descarMultiple")[0].click();},500);
				}
			}, "json");
		
		}
		else{
			PopUpError("Por favor seleccione un archivo");
		}
			
		
			
	});
		archivosUrl=[];
	
	$("#btnConsultarSoporteCedula").click(function() {  
		
		if($("#txtCedula").val() != ""){
			$("#derecha").show();
			$("#derecha1").hide();
			
			$.post("../../controlador/fachada.php", {
				clase: 'clsSoportes',
				oper: 'consultarSoportesPorCedula',
				cedula:$("#txtCedula").val(),
				tipoSoporte:$('#cmbTipoDeSoporte').val()
			}, function(data) {
				if (data !== 0) { 
					
					cargarInformacionEnTabla(data);
				}
			}, "json");
		}
		else{
			PopUpError("Debe ingresar un número de cédula para consultar");
		}
		
	});
	
	$("#btnConsultarSoporteCedula1").click(function() {  
		
		if($("#txtCedula1").val() != ""){
			$("#derecha").show();
			$("#derecha1").hide();
			
			$.post("../../controlador/fachada.php", {
				clase: 'clsSoportes',
				oper: 'consultarSoportesPorCedula',
				cedula:$("#txtCedula1").val(),
				tipoSoporte:$('#cmbTipoDeSoporte').val()
			}, function(data) {
				if (data !== 0) { 
					
					cargarInformacionEnTabla(data);
				}
			}, "json");
		}
		else{
			PopUpError("Debe ingresar un número de cédula para consultar");
		}
	});
	
	$("#btnConsultarSoporteConvocatoria").click(function() {  
		
		if($("#cmbConvocatoria").val() != ""){
			$("#derecha").show();
			$("#derecha1").hide();
			
			$.post("../../controlador/fachada.php", {
				clase: 'clsSoportes',
				oper: 'consultarSoportesPorConvocatoria',
				convocatoria:$("#cmbConvocatoria").val(),
				tipoSoporte:$('#cmbTipoDeSoporte').val()
			}, function(data) {
				if (data !== 0) { 
					
					cargarInformacionEnTabla(data);
				}
			}, "json");
		}
		else{
			PopUpError("Debe ingresar la convocatoria para consultar");
		}
		
	});
	
	function cargarInformacionEnTabla(data){
		
		
		//se destruye el datatable al inicio
	if(typeof table !== "undefined"){
            table.destroy(); 
            $('#tablaSoportes').empty();
        }
		
		 table = $('#tablaSoportes').DataTable({
			"data": data,
			columns: [
			{ title: "Id" },
			{ title: "Nombres" },
			{ title: "Novedad" },
			{ title: "Ruta" },	
			{data: null, className: "center", render: function(data,type,row,meta) 
			{	
				var arr = row[3].split('/');
				
				nombre_archivo= arr[4];
				var a = '<a href="../'+row[3]+'" download="'+nombre_archivo+'"><img src="../images/descargar.png" width="20px" /></a>'
				   return a;
            }},
			{data: null, className: "center", defaultContent: '<a id="delete-link" class="delete-link" href="#" title="Eliminar"><img src="../images/delete.png" width="20px" /></a>'}
			],
			"paging":   true,
			"info":     false,
			"order": [[ 3, "desc" ]],
			"scrollY": "300px",
			"scrollX": true,
			"bDestroy": true,
			"scrollCollapse": true,
			"columnDefs": [
			{"targets": [ 0 ],"visible": true,"searchable": true},
			{"targets": [ 2 ],"visible": false,"searchable": true}
			
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
		
		//codigo para seleccionar la filas del datatable $('#tablaSoportes')
	
		$('#btnDescargarSeleccionados').show();
		$('#btnEliminarSeleccionados').show();
			
	}
	

		
	//Evento que elimina registro//
	$(document).on('click', '#delete-link, #btnEliminarSeleccionados', function() { 
			IdSoporte =new Array();	
			// var data = table.row($(this).parents('tr')).data();
			// url = data[3];
			// idSoporte = data[0];
			// alert();
			
		var cont=0;						
				
		$('#tablaSoportes > tbody  > tr.selected').each(function(i,row)
		{  
			IdSoporte[cont]={};
			IdSoporte[cont]['IdSoporte']=table.row(this).data()[0];//alert(IdSoporte[cont]['IdSoporte']);
			// IdSoporte.push(table.row(this).data()[0]); 
			cont++;
		});
			
			if(IdSoporte.length > 0){
				IdSoporte = JSON.stringify( IdSoporte );console.log(IdSoporte);
				
				$.post("../../controlador/fachada.php", {
					clase: 'clsSoportes',
					oper: 'eliminarArchivo',
					IdSoporte:IdSoporte,
					accion:accion
				}, function(data) {
					if (data !== 0) 
					{ 
						
						PopUpError("Archivo eliminado correctamente");
						//simular clic en consultar estudiante para que recargue el datatable
						if($('#cmbTipoDeSoporte').val()==294){$("#btnConsultarSoporteCedula").trigger('click');}
						if($('#cmbTipoDeSoporte').val()==295){$("#btnConsultarSoporteCedula1").trigger('click');}
						if($('#cmbTipoDeSoporte').val()==299){$("#btnConsultarSoporteConvocatoria").trigger('click');}
					}
					else{
						PopUpError("El archivo no se elimino, intente nuevamente");
					}
				}, "json");
			}
			else{
				PopUpError("Por favor seleccione un archivo");
			}
			
	});
	
	$("#btnAgregarSoporteCedula").click(function() {	
		// $.ajax({
			// type: "POST",
			// url: "../../SubirArchivo/index.html",
			// success: function(datos) {
				// $("#derecha1").html(datos);
			// }
		// });
		
		$("#derecha1").show();
		$("#derecha").hide();
	});
	
	
	$("#btnAgregarSoporteCaso").click(function() {	
		
		if($('#txtFechaI').val() == "" || $('#cmbTipoDeSoporte').val() == "" ){
			PopUpError("Debe ingresar la fecha inicial y la fecha final");
		}
		else{
			fechaInicial = $('#txtFechaI').val();
			fechaFinal	 = $('#txtFechaF').val();
			$( "#Example2" ).attr( "src", "../../SubirArchivo/index.php?accion=2&tipoSoporte="+tipoSoporte+"&fechaInicial="+fechaInicial+"&fechaFinal="+fechaFinal );
			$("#derecha1").show();
			$("#derecha").hide();
		}
		
		
	});
	
	$("#btnAgregarSoporteConvocatoria").click(function() {	
		
		//borrar cookie
		// document.cookie = "nombreCortoConvocatoria=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		convocatoria = $('#cmbConvocatoria').val();
		var nombreConvocatoria = $("#cmbConvocatoria option:selected").text();
		var nombreCortoConvocatoria = nombreConvocatoria.split("-");
		nombreCortoConvocatoria = nombreCortoConvocatoria[1];
		// crear la cookie
		// document.cookie = "nombreCortoConvocatoria="+nombreCortoConvocatoria; 
		

		if(convocatoria != "" ){
			$( "#Example2" ).attr( "src", "../../SubirArchivo/index.php?accion=3&tipoSoporte="+tipoSoporte+"&convocatoria="+convocatoria+"&nombreCortoConvocatoria="+nombreCortoConvocatoria );
			$("#derecha1").show();
			$("#derecha").hide();
		}
		else{
			PopUpError("Debe seleccionar la convocatoria");
		}
		
	});

		$("#cmbConvocatoria").change(function() {
		
			//borrar cookie
			document.cookie = "nombreCortoConvocatoria=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			var nombreConvocatoria = $("#cmbConvocatoria option:selected").text();
			var nombreCortoConvocatoria = nombreConvocatoria.split("-");
			nombreCortoConvocatoria = nombreCortoConvocatoria[1];
			//crear la cookie
			// document.cookie = "nombreCortoConvocatoria="+nombreCortoConvocatoria; 			
			$( "#Example2" ).attr( "src", "../../SubirArchivo/index2.php?nombreCortoConvocatoria="+nombreCortoConvocatoria+"&accion="+accion);
		
	});
	
	
	
});    
    



function cargarTiposSoportes() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsSoportes',
            oper: 'consultarTiposSoportes'
        }, function(data) {
            if (data !== 0) { 
                setParametroPorDefecto("#cmbTipoDeSoporte", '', "Seleccione...");
                formarOptionValueTipoSoportes(data);
            }
        }, "json");
    }
 

function cargarConvocatorias() {  
		
		// if($("#cmbConvocatoria").val() != ""){
			// $("#derecha").show();
			// $("#derecha1").hide();
			
			$.post("../../controlador/fachada.php", {
				clase: 'clsConvocatoria',
				oper: 'ConsultarConvocatorias'
			}, function(data) {
				if (data !== 0) {
					FormarOptionValueConvocatorias(data);
				}
				else {
					mostrarPopUpError('No se cargaron las convocatorias');
				}
			}, "json");
		// }
		// else{
			// PopUpError("Debe seleccionar la convocatoria");
		// }
		
	}
	
	
	
function FormarOptionValueConvocatorias(pConvocatorias) {
    $('#cmbConvocatoria').find('option').remove();
    SetParametroCursoPorDefecto("#cmbConvocatoria", '', 'Seleccione...');
    for (i = 0; i < pConvocatorias.length; i++) {
        $('#cmbConvocatoria').append($('<option>', {
            value: pConvocatorias[i].Id,
            text: pConvocatorias[i].Nombre
        }));
    }
}

function SetParametroCursoPorDefecto(atributo, valor, texto) {
    $(atributo).append($('<option>', {
        value: valor,
        text: texto
    }));
}
 
       
function limpiarCampos(){
         $("#txtCedula").val('');
        
    }

    
function formarOptionValueTipoSoportes(tiposSoportes) { 
        for (i = 0; i < tiposSoportes.length; i++) { 
            $('#cmbTipoDeSoporte').append($('<option>', {
				value: tiposSoportes[i][0],
                text: tiposSoportes[i][1]
            }));
        }
    }



    
function setParametroPorDefecto(atributo, valor, texto) {
        $(atributo).append($('<option>', {
            value: valor,
            text: texto
        }));
    }



function PopUpError(msj){
        $("#textoError").text(msj);
        $('#element_to_pop_upMen').bPopup({
            speed: 450,
            transition: 'slideDown'
        });
}

function PopUpConfirmacion(msj){
        $("#textoConfirmacion1").text(msj);
        $('#element_to_pop_upCon').bPopup({
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








