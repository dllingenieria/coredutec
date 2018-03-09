$(function() {
    $('#tablaNotas').DataTable();
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "docente.html";
    }
	

	idTerceroNotasTotales = new Array();
    recuperarDatos();
    var table= '';
    var numEstudiantes;
    var idNota;
	cerrarCurso="";
	totalNotas = new Array();
    consultarSeguimientoGeneral();


    function consultarSeguimientoGeneral(){ 
        var mensaje="Procesando la información<br>Espere por favor";
        jsShowWindowLoad(mensaje);
         $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async :false,
            data: {
                clase: 'clsAcademico',
                oper: 'consultarSeguimiento',
                IdPreprogramacion: sessionStorage.IdPreprogramacion,
                tipo:2,
                }
        }).done(function(data) {
            if(data!=""){
                $("#txtaSeguimiento").val(data[0].SNotas);
            }

        });

     } 
    
    function recuperarDatos() {
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
        var saber =  new Array();
        var hacer =  new Array();
        var ser =  new Array();
        var notas =  new Array();
		$("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+" - "+sessionStorage.Horario+" - "+sessionStorage.IntensidadHorariaDiaria+" Horas" );
        $("#fechaInicial").html(sessionStorage.FechaInicial);
        $("#lugar").html(sessionStorage.Sede + " - " + sessionStorage.Salon);
        $("#codigo").html(sessionStorage.IdCurso + " - " + sessionStorage.IdModulo);
        $("#fechaFinal").html(sessionStorage.FechaFinal);
        $("#txtDuracion").html(sessionStorage.Duracion+" Horas");
		$("#txtSalon").html(sessionStorage.Salon);
        $("#txtSede").html(sessionStorage.Sede); 
		$("#txtDocente").html(sessionStorage.Docente);
		$("#txtRuta").html(sessionStorage.Ruta);
		$("#txtNoSessiones").html(sessionStorage.cantidadSesiones);
		
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async :false,
            data: {
                clase: 'clsUtilidades',
                oper: 'consultarCantidadAsistentesPorSalon',
                IdPreprogramacion: sessionStorage.IdPreprogramacion,
                }
        }).done(function(data) {
            if(data[0].cantidadAsistentes !== null){
                $("#asistentes").html(data[0].cantidadAsistentes);
            }
            
        });
        
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async :false,
            data: {
                clase: 'clsUtilidades',
                oper: 'consultarNotaParcialPorSalon',
                IdPreprogramacion: sessionStorage.IdPreprogramacion,
                }
        }).done(function(data) {
            if(data[0].pEstudiantesGanando !== null){
                $("#aprobados").html(data[0].pEstudiantesGanando);
            }
            
        });

        $.post("../../controlador/fachada.php", {
            clase: 'clsParticipante',
            oper: 'consultarNotasPorSalon',
            IdPreprogramacion: sessionStorage.IdPreprogramacion
        }, function(data) { 
				
            if (data !== 0) {
				
                if(data !== null){ jsRemoveWindowLoad();
			
                    idNota = data['idNota'];
                    //alert(idNota);
                    dataSet = new Array();
                    data = data['datos'];
					
					if(data.length) {
                    numEstudiantes = data.length;
                    for (var i = 0; i < data.length; i++) {
                        saber = (data[i].NotaSaber).split(',');
                        hacer = (data[i].NotaHacer).split(',');
                        ser = (data[i].NotaSer).split(',');
                        pSaber = (saber[0]+saber[1]+saber[2])/3;
                        pHacer = (hacer[0]+hacer[1]+hacer[2])/3;
                        pSer = (ser[0]+ser[1]+ser[2])/3;

                        notas.push(saber[0],saber[1],saber[2],
                            hacer[0],hacer[1],hacer[2],
                            ser[0],ser[1],ser[2],'');
                        
                        var array = new Array();
                        // array.push(data[i].IdTercero);
                        array.push(i+1);
                        array.push(data[i].Tercero); 
						idTerceroNotasTotales[i]=(data[i].IdTercero); //se llena para poder calcular las notas totales 
                        for (var j = 0; j < 11; j++) {
                            if(j == 9){ //total
                                array.push('<span required type="text" disabled min="0" max="5" step=".1" value="" class="total'+i+j+'" data-estudiante="'+data[i].IdTercero+'" data-sesion="'+i+'" name="row-1-position" data-fila="'+i+'" id="txtTotal_'+data[i].IdTercero+'"></span>');
                            }else{
                                array.push('<span required type="number" min="0" max="5" step=".1" value="'+notas[j]+'" class="notas'+i+' notas" data-estudiante="'+data[i].IdTercero+'" data-sesion="'+i+'" data-modified="false" name="row-1-position" data-fila="'+i+'" id="txtNota_'+j+'_'+data[i].IdTercero+'">'+notas[j]+'</span>');
                            }
                        }
                        notas = [];
                        dataSet.push(array);
						
                    }
					}
                    $('#tablaNotas').dataTable().fnDestroy();
                    cargarInformacionEnTabla(dataSet,data);
					
                }else{alert("error 1");}             
            }else {alert("error 2");}
        }, "json");
    }
	
	// columns: [
			// { title: "N°" }, 
            // { title: "Estudiante" }],

    function cargarInformacionEnTabla(data,otrosDatos){
       table = $('#tablaNotas').DataTable({
        "data": data,
		 
        "paging":   false,
        "info":     false,
            //"columnDefs": [{"targets": [ ],"visible": false,"searchable": false}],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "language": {
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            },
            "initComplete": function(settiings, json){

                for(var x = 0; x < numEstudiantes ; x++){
                    
					$('.notas'+x).each(function(){	
						if ($(this).text()!=""){ 
							$(this).attr('data-modified','true');
						}
					});
					
					var a =  new Array();
                    a = $('.notas'+x); 
					/*Se recorre el array a verificando cada valor, si esta vacio se pone un 0 y sobre ese se hacen los calculos
					* de cada una de los tipos de notas y sobre estos se calcula la nota final
					*/
					
					
					var p1 =(parseFloat($(a[0]).val() != ''?$(a[0]).val():""));
					var p2 =(parseFloat($(a[1]).val()!= ''?$(a[1]).val():"")); 
					var p3 =(parseFloat($(a[2]).val()!= ''?$(a[2]).val():""));
					var divSaber = 0;
					var sumaSaber =0;  
					
					
					if (!isNaN(p1)){divSaber = divSaber+1;} else {p1 = 0;}
					if (!isNaN(p2)){divSaber = divSaber+1;} else {p2 = 0;}
					if (!isNaN(p3)){divSaber = divSaber+1;} else {p3 = 0;}
					if(divSaber != 0){ 
					
					sumaSaber = (parseFloat(p1+p2+p3)/divSaber).toFixed(2); }
					// alert("sumaSaber"+sumaSaber);
					// alert("divSaber"+divSaber);
					
					var p4 =(parseFloat($(a[3]).val() != ''?$(a[3]).val():""));
					var p5 =(parseFloat($(a[4]).val()!= ''?$(a[4]).val():""));
					var p6 =(parseFloat($(a[5]).val()!= ''?$(a[5]).val():""));
					var divHacer = 0;
					var sumaHacer =0;
					if (!isNaN(p4)){divHacer = divHacer+1;} else {p4 = 0;}
					if (!isNaN(p5)){divHacer = divHacer+1;} else {p5 = 0;}
					if (!isNaN(p6)){divHacer = divHacer+1;} else {p6 = 0;}
					if(divHacer != 0){ sumaHacer = (parseFloat(p4+p5+p6)/divHacer).toFixed(2); }
					 // alert("sumaHacer"+sumaHacer);
					 // alert("divHacer"+divHacer);
					
					var p7 =(parseFloat($(a[6]).val() != ''?$(a[6]).val():""));
					var p8 =(parseFloat($(a[7]).val()!= ''?$(a[7]).val():""));
					var p9 =(parseFloat($(a[8]).val()!= ''?$(a[8]).val():""));
					var divSer = 0;
					var sumaSer =0;
					if (!isNaN(p7)){divSer = divSer+1;} else {p7 = 0;}
					if (!isNaN(p8)){divSer = divSer+1;} else {p8 = 0;}
					if (!isNaN(p9)){divSer = divSer+1;} else {p9 = 0;} 
					if(divSer != 0){ sumaSer = (parseFloat(p7+p8+p9)/divSer).toFixed(2); }
					 // alert("sumaSer"+sumaSer);
					 // alert("divSer"+divSer);

                    //$('.parcial'+x+3).val(p1); 
                    //$('.parcial'+x+7).val(p2);
                    //$('.parcial'+x+11).val(p3);
					var divNotas = 0;
					if (sumaSaber != ""){divNotas = divNotas+1; }
					if (sumaHacer != ""){divNotas = divNotas+1;}
					if (sumaSer != ""){divNotas = divNotas+1;}	
					 // alert(sumaSaber+"-"+sumaHacer+"-"+sumaSer);
					 // alert(divNotas);
					// if(divNotas != 0){
						// $('.total'+x+9).val((((parseFloat(sumaSaber)+parseFloat(sumaHacer)+parseFloat(sumaSer)))/divNotas).toFixed(2));
						
						
						
						// $('.total'+x+9).val(Number(otrosDatos[x]['total']).toFixed(2));
						$('.total'+x+9).text(otrosDatos[x]['total']);
						// $('.total'+x+9).val("3.10");
					// }
					//para total notas
					// $('.total'+x+9).each(function(){	
						// $(this).val(otrosDatos[x]['total']);
						
					// });
					
                }
            }
        });
   }

   

  function agregarSeguimientoNotas(){ 
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsAcademico',
			oper: 'agregarSeguimiento',
			IdPreprogramacion: sessionStorage.IdPreprogramacion,
			seguimiento: $("#txtaSeguimiento").val(),
			tipo:2
		},
		
		function(data) {
			
			if (data !== 0) {
				
					 
				jsRemoveWindowLoad();
				popUpConfirmacion("Guardado Satisfactoriamente");
						
				            
			}else {mostrarPopUpError("No se guardo el seguimiento");}
		}, "json");
	
	
 }//cerrar funcion
		
	$("#guardarSeguimientoNotas").click(function(){ 
        if (!validarInformacion()) {
            mostrarPopUpError("Por favor ingrese la información de seguimiento");
        }else{
            agregarSeguimientoNotas();
        }
    });
	
     function validarInformacion(){
        var valido=true;
        
			
			if ($("#txtaSeguimiento").val() == ""){
				valido=false;
			}
        
        
        return valido;
    }


$("#volverAcademico").click(function(){
    window.location.href = "academico.html";
});

function popUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function popUpConfirmacionCerrarCurso(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown',
		onClose: function() { 
			window.location.href = "docente.html";
		}
    });
}


function mostrarPopUpError(err_men) {
    $("#textoError").text(err_men);
    $('#element_to_pop_upMen').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}
//para el confirm
function popUpConfirmacion1(msj, fn){
	//contenedor vacion
	 var contenedor = $( "#contenedor" );
	 //se le envia a contenedor el contenido de element_to_pop_upCon1
	contenedor.html( $( "#element_to_pop_upCon1" ).html() );
	/*como el id textoConfirmacion2 esta dos veces (en contenedor y en element_to_pop_upCon1)
    * se esta poniendo el texto en el de contenedor
	*/
	$("#textoConfirmacion2", contenedor ).text(msj);
	// $('#divAceptar').html("");
	// $('.botonAceptar').attr("id","btnAceptar");
	$("[id=btnAceptar]:button", contenedor ).click(function(){ 
		if( fn ) fn();
	} )
	
	$("[id=btnCerrar]:button", contenedor ).val("Cancelar");
	//se muestra el conetenedor 
    $('#contenedor').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
	
	// $('#divAceptar').
        // append($('<button>').
            // attr("name", "element_to_pop_upConf").
            // attr("type", "button").
            // attr("class", "b-close").
            // attr("Id", "btnAceptar").
            // text("Aceptar")
        // );
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

$(window).resize(function(){
	var ancho = 420; 
    var alto = 150;
 // dimensiones de la ventana del explorer 
 var wscr = $(window).width();
 var hscr = $(window).height();

 // estableciendo dimensiones de fondo
 $('#bgtransparent').css("width", wscr);
 $('#bgtransparent').css("height", hscr);
 
 // estableciendo tamaño de la ventana modal
 $('#bgmodal').css("width", ancho+'px');
 $('#bgmodal').css("height", alto+'px');
 
 // obtiendo tamaño de la ventana modal
 var wcnt = $('#bgmodal').width();
 var hcnt = $('#bgmodal').height();
 
 // obtener posicion central
 var mleft = ( wscr - wcnt ) / 2;
 var mtop = ( hscr - hcnt ) / 2;
 
 // estableciendo ventana modal en el centro
 $('#bgmodal').css("left", mleft+'px');
 $('#bgmodal').css("top", mtop+'px');
 });





});

