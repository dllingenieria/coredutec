$(document).ready(function() {
tipoSoporte="";
fechaInicial="";
fechaFinal="";
    limpiarCampos();
    cargarTiposSoportes();
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
                
                tipoSoporte=$('#cmbTipoDeSoporte').val();
				$('#divBusquedaCedula').show();
				$( "#Example2" ).attr( "src", "../../SubirArchivo/index.php?accion=1&tipoSoporte="+tipoSoporte );
				$("#derecha1").hide();
				$('#divfecha').hide();
				
            }
			//caso especial
            else if($('#cmbTipoDeSoporte').val()==295)
			{
                
				tipoSoporte=$('#cmbTipoDeSoporte').val()
				$("#derecha1").hide();
				$('#divBusquedaCedula').hide();
				$('#divfecha').show();
				
				// $("#derecha1").show();
            }
			else if($('#cmbTipoDeSoporte').val()==0){
				$('#divBusquedaCedula').hide();
				$("#derecha1").hide();
				$('#divfecha').hide();
                PopUpError("Debe seleccionar un tipo de soporte");
            }
            
    });
	
	//validacion campos numericos
	 
	  // $("#txtCedula").keydown(function (e) {  
               // if (e.shiftKey || e.ctrlKey || e.altKey) {  
                   // e.preventDefault();  
               // } else {  
                   // var key = e.keyCode;  
                   // alert(key)  
                   // if (!((key == 8) || (key == 46) ||  (key == 9)  ||
					// (key >= 35 && key <= 40)  
					// || (key >= 48 && key <= 57)  
					// || (key >= 96 && key <= 105))) {  
										   // e.preventDefault();  
									   // }  
								   // }  
           // }); 
	
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
						
			{data: null, className: "center", defaultContent: '<a id="download-link" class="edit-link" href="#" title="Descargar"><img src="../images/descargar.png" width="20px" /></a>'},
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
			{"targets": [ 0 ],"visible": false,"searchable": true},
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
		// $('#tablaSoportes tbody').on('click', 'tr', function () {
			// if ( $(this).hasClass('selected')) {
				// $(this).removeClass('selected');
				// seleccionado = false;
			// }else{
				// table.$('tr.selected').removeClass('selected');
				// $(this).addClass('selected');
				// seleccionado = true;
			// }
			// if(typeof(Storage) !== "undefined") {
				// sessionStorage.Docente = table.row(this).data()[0];
				// sessionStorage.IdPreprogramacion = table.row(this).data()[1];
				// sessionStorage.Salon = table.row(this).data()[2];
				 
				
			// } else {
				// PopUpError("Por favor actualice su navegador o utilice otro: SessionStorage");
			// }
		// } );
	}
	
	//Evento que descarga registro//
	$(document).on('click', '#download-link', function() {  
			var data = table.row($(this).parents('tr')).data();
			fila= data[3];
			$.post('../../modelo/descargarArchivos.php',   // url
			{
				myData: 'This is my data.' 
			}, // data to be submit
			function(data) {// success callback
               
        });
			// if(data[0]!="")
			// {				
				alert(fila);
			// }			   
	});
	
	//Evento que elimina registro//
	$(document).on('click', '#delete-link', function() { 
			var data = table.row($(this).parents('tr')).data();
			fila= data[0];
			if(data[0]!=""){
			
			
				alert(fila+"algohhhhhhh");
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
			PopUpError("Debe ingresaar la fecha inicial y la fecha final");
		}
		else{
			fechaInicial = $('#txtFechaI').val();
			fechaFinal	 = $('#txtFechaF').val();
			$( "#Example2" ).attr( "src", "../../SubirArchivo/index.php?accion=2&tipoSoporte="+tipoSoporte+"&fechaInicial="+fechaInicial+"&fechaFinal="+fechaFinal );
			$("#derecha1").show();
			$("#derecha").hide();
		}
		
		
	});

	
});    
    

    



          
    
function consultarTercero(){
        $.ajax({
                   url: '../../controlador/fachada.php',
                   type: 'POST',
                   async : false,
                   dataType: 'json',
                   data: {
                        clase: 'clsPersona',
                        oper: 'consultarNombresTercero',
                        pIndentificacion : $("#txtCedula").val()
                   },
               }).done(function(data) {
                   if(data === null || data === 0){
                    $("#textoError").text("Ningun resultado encontrado");
                    $('#element_to_pop_upMen').bPopup({
                         speed: 450,
                         transition: 'slideDown'
                    });               
                    limpiarCampos();
                } else {                    
                    IdTercero=data[0].Id;         
                    $("#txtNombreCompleto").val(data[0].Nombres +"  "+data[0].Apellidos );
                }  
               });
    }

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








