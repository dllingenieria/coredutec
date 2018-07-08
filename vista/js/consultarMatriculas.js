$(function(){
	var table;
	inicializar();
	cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
	cargarValorSelected('#cmbTipoIdentificacion',3,500);

	$("#buscar").click(function() {
		var pTipoIdentificacion = $("#cmbTipoIdentificacion").val();
		var identificacion = $("#identificacion").val();
		if (identificacion == ""){
			mostrarPopUpError("Por favor ingrese un número de identificación");
		}
		else{
            var mensaje="Procesando la información<br>Espere por favor";
	        jsShowWindowLoad(mensaje);
			$.post("../../controlador/fachada.php", {
			clase: 'clsMatricula',
			oper: 'consultarMatriculas',
			identificacion : identificacion,
			TipoIdentificacion : pTipoIdentificacion
			}, function(data) {
				if (data !== 0) {
					if(data !== null){
						cargarInformacionEnTabla(data, identificacion);
						jsRemoveWindowLoad();
						$('#imprimir').hide();
					}else{alert("error 1");}             
				}else {alert("error 2");}
			}, "json");
		}
 	});


	function inicializar(){
		var matriculaSeleccionada=false;
		$('#imprimir').hide();
		//$('#verDetalle').hide();
	}

	function cargarInformacionEnTabla(data, identificacion){
	if(typeof table !== "undefined"){
            table.destroy();
            $('#tablaMatriculas').empty();
        }

	table = $('#tablaMatriculas').DataTable({
			"data": data,
			columns: [
			{ title: "Nombre"},
			{ title: "Apellido"},
			{ title: "Telefono 1"},
			{ title: "Telefono 2"},
			{ title: "Telefono 3"},
			{ title: "Email"},
			{ title: "Fecha Nacimiento"},
			{ title: "Fecha Asignación"},
			{ title: "Convocatoria"},
			{ title: "Codigo Curso"},
			{ title: "Curso"},
			{ title: "Nombre Docente"},
			{ title: "Apellido Docente"},
			{ title: "Módulo"},
			{ title: "Duración Módulo"},
			{ title: "Lugar de Expedición"},
			{ title: "Días"},
			{ title: "Hora Inicial"},
			{ title: "Hora Final"},
			{ title: "Duración Curso"}, 
			{ title: "Sede"},
			{ title: "Escolaridad"},
			{ title: "Localidad"},
			{ title: "Estado Civil"},
			{ title: "Modalidad"},
			{ title: "Estado"},
			{ title: "Fecha Inicial"},
			{ title: "Salón"},
			{ title: "Ruta"},
			{ title: "IdMatricula"}],
			"paging":   true,
			"pageLength": 5,
			"bLengthChange": false,
			"info":     false,
			"scrollY": "300px",
			"scrollX": true,
			"scrollCollapse": true,
			"columnDefs": [
			{"targets": [ 2 ],"visible": false,"searchable": false},
			{"targets": [ 3 ],"visible": false,"searchable": false},
			{"targets": [ 4 ],"visible": false,"searchable": false},
			{"targets": [ 5 ],"visible": false,"searchable": false},	
			{"targets": [ 6 ],"visible": false,"searchable": false},	
			{"targets": [ 9 ],"visible": false,"searchable": false},	
			{"targets": [ 11 ],"visible": false,"searchable": false},	
			{"targets": [ 12 ],"visible": false,"searchable": false},	
			{"targets": [ 14 ],"visible": false,"searchable": false},	
			{"targets": [ 15 ],"visible": false,"searchable": false},
			{"targets": [ 16 ],"visible": false,"searchable": false},	
			{"targets": [ 17 ],"visible": false,"searchable": false},	
			{"targets": [ 18 ],"visible": false,"searchable": false},	
			{"targets": [ 19 ],"visible": false,"searchable": false},	
			{"targets": [ 20 ],"visible": false,"searchable": false},	
			{"targets": [ 21 ],"visible": false,"searchable": false},	
			{"targets": [ 22 ],"visible": false,"searchable": false},
			{"targets": [ 23 ],"visible": false,"searchable": false},
			{"targets": [ 24 ],"visible": false,"searchable": false},
			{"targets": [ 25 ],"visible": false,"searchable": false},
			{"targets": [ 26 ],"visible": false,"searchable": false},
			{"targets": [ 28 ],"visible": false,"searchable": false},
			{"targets": [ 29 ],"visible": false,"searchable": false}],
			"language": {
				"url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sProcessing":     "Procesando...",
				"sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar",
				"sLoadingRecords": "Cargando..."	
            }
		});


		$('#tablaMatriculas tbody').on('click', 'tr', function () {
					var mensaje="Procesando la información<br>Espere por favor";
       				 jsShowWindowLoad(mensaje);

					$('#imprimir').hide();
					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					}else{
						table.$('tr.selected').removeClass('selected');
						$(this).addClass('selected');
					}
		
					$.cookie("nom_usu", table.row(this).data()[0] + " " + table.row(this).data()[1]);
					$.cookie("est_civ", table.row(this).data()[23]);
					$.cookie("tel_fij", table.row(this).data()[2]);
					$.cookie("tel_cel", table.row(this).data()[3]);
					$.cookie("tel_alt", table.row(this).data()[4]);
					$.cookie("cor_ele", table.row(this).data()[5]);
					$.cookie("gra_esc", table.row(this).data()[21]);
					$.cookie("lug_exp", table.row(this).data()[15]);
					$.cookie("loc_usu", table.row(this).data()[22]);
					$.cookie("ide_usu", table.row(this).data()[30] + " - " + identificacion);
					$.cookie("tip_ser", table.row(this).data()[8]);
					$.cookie("FechaInicialCurso", table.row(this).data()[26]);
					$.cookie("rut_num", table.row(this).data()[28]);
					$.cookie("cod_cur", table.row(this).data()[9]);
					$.cookie("nom_cur", table.row(this).data()[10]);
					$.cookie("dur_cur", table.row(this).data()[19]);
					$.cookie("mod_cur", table.row(this).data()[24]);
					$.cookie("sed_cur", table.row(this).data()[20]);
					$.cookie("doc", table.row(this).data()[11] + " " + table.row(this).data()[12]);
					$.cookie("mat", table.row(this).data()[27]);
					$.cookie("est_cur", table.row(this).data()[25]);
					$.cookie("hor_cur", table.row(this).data()[16] + " "+table.row(this).data()[17] +" a "+table.row(this).data()[18]);
					$.cookie("mod", table.row(this).data()[13]);
					$.cookie("dur_mod", table.row(this).data()[14]);
					$.cookie("id_mat", table.row(this).data()[29]);
					$.cookie("mes_asi", table.row(this).data()[7]);
					$.cookie("eda_usu", table.row(this).data()[6]);
					matriculaSeleccionada=true;

					var idMatricula= table.row(this).data()[29];				

					$.post("../../controlador/fachada.php", {
						clase: 'clsMatricula',
						oper: 'consultarFechaMatricula',
						idMatricula : idMatricula
					}, function(data1) {
						if (data1 !== 0) {
							if(data1 !== null){
								$.cookie("fec_matr", data1);
								jsRemoveWindowLoad();
								$('#imprimir').show();								
							}else{alert("error 1");}             
						}else {alert("error 2");}
					}, "json");					
					
			
				} );			
	}
        
   function dateDiff(dateold, datenew){
		  var ynew = datenew.getFullYear();
		  var mnew = datenew.getMonth();
		  var dnew = datenew.getDate();
		  var yold = dateold.getFullYear();
		  var mold = dateold.getMonth();
		  var dold = dateold.getDate();
		  var diff = ynew - yold;
		  if(mold > mnew) diff--;
		  else
		  {
		    if(mold == mnew)
		    {
		      if(dold > dnew) diff--;
		    }
		  }
		  return diff;
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

	$("#imprimir").click(function(){
		if (matriculaSeleccionada) {
			window.location.href = "formato.html";
		}else{
			alert("Por favor seleccione una matrícula");
		}
	});

	//----- Consulta la base de datos los valores para la lista -----//
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

	//----- Llena la lista Tipo de documento -----//
	function formarOptionValueLista(data,objeto) {
	    $('#'+objeto).find('option').remove();
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

    //----- Muestra los mensajes de error -----//
    function mostrarPopUpError(err_men) {
	    $("#textoError").text(err_men);
	    $('#element_to_pop_upMen').bPopup({
	        speed: 450,
	        transition: 'slideDown'
	    });
	}
});