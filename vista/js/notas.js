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
        $("#horario").html(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria+" Horas" );
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
                        array.push(data[i].NumeroIdentificacion);
                        array.push(data[i].Tercero); 
						idTerceroNotasTotales[i]=(data[i].IdTercero); //se llena para poder calcular las notas totales 
                        for (var j = 0; j < 11; j++) {
                            if(j == 9){ //total
                                array.push('<input required type="text" disabled min="0" max="5" step=".1" value="" class="total'+i+j+'" data-estudiante="'+data[i].IdTercero+'" data-sesion="'+i+'" name="row-1-position" data-fila="'+i+'" id="txtTotal_'+data[i].IdTercero+'">');
                            }else{
                                array.push('<input required type="number" min="0" max="5" step=".1" value="'+notas[j]+'" class="notas'+i+' notas" data-estudiante="'+data[i].IdTercero+'" data-sesion="'+i+'" data-modified="false" name="row-1-position" data-fila="'+i+'" id="txtNota_'+j+'_'+data[i].IdTercero+'">');
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
						if ($(this).val()!=""){ 
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
					
					var p4 =(parseFloat($(a[3]).val() != ''?$(a[3]).val():""));
					var p5 =(parseFloat($(a[4]).val()!= ''?$(a[4]).val():""));
					var p6 =(parseFloat($(a[5]).val()!= ''?$(a[5]).val():""));
					var divHacer = 0;
					var sumaHacer =0;
					if (!isNaN(p4)){divHacer = divHacer+1;} else {p4 = 0;}
					if (!isNaN(p5)){divHacer = divHacer+1;} else {p5 = 0;}
					if (!isNaN(p6)){divHacer = divHacer+1;} else {p6 = 0;}
					if(divHacer != 0){ sumaHacer = (parseFloat(p4+p5+p6)/divHacer).toFixed(2); }
					
					var p7 =(parseFloat($(a[6]).val() != ''?$(a[6]).val():""));
					var p8 =(parseFloat($(a[7]).val()!= ''?$(a[7]).val():""));
					var p9 =(parseFloat($(a[8]).val()!= ''?$(a[8]).val():""));
					var divSer = 0;
					var sumaSer =0;
					if (!isNaN(p7)){divSer = divSer+1;} else {p7 = 0;}
					if (!isNaN(p8)){divSer = divSer+1;} else {p8 = 0;}
					if (!isNaN(p9)){divSer = divSer+1;} else {p9 = 0;} 
					if(divSer != 0){ sumaSer = (parseFloat(p7+p8+p9)/divSer).toFixed(2); }
					var divNotas = 0;
					if (sumaSaber != ""){divNotas = divNotas+1; }
					if (sumaHacer != ""){divNotas = divNotas+1;}
					if (sumaSer != ""){divNotas = divNotas+1;}
					$('.total'+x+9).val(otrosDatos[x]['total']);
                }
                $('.notas').on('change',function(){ 
                    $(this).attr('data-modified','true');
                    if($(this).val() > 5){
                        $(this).val(5);
                        $(this).focus();
                    }
                    if($(this).val() < 0){
                        $(this).val(0);
                        $(this).focus();
                    }
					var id = $(this).val();
                    var fila = $(this).attr('data-fila');
                    var a =  new Array();
                    a = $('.notas'+fila);
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
					
					var p4 =(parseFloat($(a[3]).val() != ''?$(a[3]).val():""));
					var p5 =(parseFloat($(a[4]).val()!= ''?$(a[4]).val():""));
					var p6 =(parseFloat($(a[5]).val()!= ''?$(a[5]).val():""));
					var divHacer = 0;
					var sumaHacer =0;
					if (!isNaN(p4)){divHacer = divHacer+1;} else {p4 = 0;}
					if (!isNaN(p5)){divHacer = divHacer+1;} else {p5 = 0;}
					if (!isNaN(p6)){divHacer = divHacer+1;} else {p6 = 0;}
					if(divHacer != 0){ sumaHacer = (parseFloat(p4+p5+p6)/divHacer).toFixed(2); }
					
					var p7 =(parseFloat($(a[6]).val() != ''?$(a[6]).val():""));
					var p8 =(parseFloat($(a[7]).val()!= ''?$(a[7]).val():""));
					var p9 =(parseFloat($(a[8]).val()!= ''?$(a[8]).val():""));
					var divSer = 0;
					var sumaSer =0;
					if (!isNaN(p7)){divSer = divSer+1;} else {p7 = 0;}
					if (!isNaN(p8)){divSer = divSer+1;} else {p8 = 0;}
					if (!isNaN(p9)){divSer = divSer+1;} else {p9 = 0;}
					if(divSer != 0){ sumaSer = (parseFloat(p7+p8+p9)/divSer).toFixed(2); }
					var divNotas = 0;
					if (sumaSaber != ""){divNotas = divNotas+1; }
					if (sumaHacer != ""){divNotas = divNotas+1;}
					if (sumaSer != ""){divNotas = divNotas+1;}	
					if(divNotas != 0){
						$('.total'+fila+9).val((((parseFloat(sumaSaber)+parseFloat(sumaHacer)+parseFloat(sumaSer)))/divNotas).toFixed(2));
					}
                    
                });
            }
        });
   }

   $('#cerrarCurso').click(function(){
        tmp = new Array();
        noCumple = 0;
        for( var x = 0 ; x < numEstudiantes ; x++){
           $('.notas'+x).each(function(){
                tmp.push($(this).val());
            });
        if( (tmp[0] != '' ||  tmp[1] != '' || tmp[2] != '') && 
            (tmp[3] != '' ||  tmp[4] != '' || tmp[5] != '') &&
            (tmp[6] != '' ||  tmp[7] != '' || tmp[8] != '')){
            
        }else{
            noCumple++;
        }
        tmp = [];

        }
        if (noCumple == 0){
			popUpConfirmacion1("Realmente desea cerrar el curso?", cerrarCursoPrimeraParte );
            // var cerrar =confirm("Realmente desea cerrar el curso ?");
            // if(cerrar){ 	
			
            }
        else{
            mostrarPopUpError("Cada estudiante debe tener al menos una nota por componente");
        }
   });

   $("#guardarNotas").click(function(){
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
			setTimeout(function(){
			var notas = new Array();
			var nSaber;
			var nHacer;
			var nSer;
			var idEstudiante;
			var cont=-1;
			var guardar = false;
			// var cont=0;
				//var idNota = 46;
				for(var x = 0; x < numEstudiantes ; x++){

					
					$('.notas'+x).each(function(){
						// notas[0] = "";
						// notas[1] = "";
						// notas[2] = "";
						// notas[3] = "";
						// notas[4] = "";
						// notas[5] = "";
						// notas[6] = "";
						// notas[7] = "";
						// notas[8] = "";
						
						if(cont==8)
						{
							cont=-1;
							// notas = [];
						}
						cont++;
						if($(this).attr('data-modified') == 'true'){
							totalNotas[x] = {};
							guardar = true;
							
							
							// notas.push($(this).val());
							notas[cont]=$(this).val();
							
							
							idEstudiante = $(this).attr('data-estudiante');
							
							totalNotas[x]['idEstudiante'] =idEstudiante;
							totalNotas[x]['idNota']= idNota;
							// nSaber = notas[0]+','+notas[1]+','+notas[2];
							// nHacer = notas[3]+','+notas[4]+','+notas[5];
							// nSer   = notas[6]+','+notas[7]+','+notas[8];
							
						if(notas[0] ==undefined){notas[0] = "";}
						if(notas[1] ==undefined){notas[1] = "";}
						if(notas[2] ==undefined){notas[2] = "";}
						if(notas[3] ==undefined){notas[3] = "";}
						if(notas[4] ==undefined){notas[4] = "";}
						if(notas[5] ==undefined){notas[5] = "";}
						if(notas[6] ==undefined){notas[6] = "";}
						if(notas[7] ==undefined){notas[7] = "";}
						if(notas[8] ==undefined){notas[8] = "";}

							totalNotas[x]['nSaber']= notas[0]+','+notas[1]+','+notas[2];
							// totalNotas[x]['nSaber2']= notas[1];
							// totalNotas[x]['nSaber3']= notas[2];
							
							totalNotas[x]['nHacer']= notas[3]+','+notas[4]+','+notas[5];
							// totalNotas[x]['nHacer2']= notas[4];
							// totalNotas[x]['nHacer3']= notas[5];
							
							totalNotas[x]['nSer']= notas[6]+','+notas[7]+','+notas[8];
							// totalNotas[x]['nSer2']= notas[7];
							// totalNotas[x]['nSer3']= notas[8];
						}
						
						// cont++;
					
					});
					
					
							// $('.notas'+x).each(function(){ 
								// $(this).attr('data-modified','false');
							// });
							notas = [];
					
							
				} //for
				 // console.log(totalNotas);
				//borrar posiciones null
				myArrClean = totalNotas.filter(Boolean);
				 
				 
				if (guardar == true){
						 var serializedtotalNotas = JSON.stringify( myArrClean );
						 console.log(serializedtotalNotas);
						// //llamado a guardar
						$.ajax({
									url: '../../controlador/fachada.php',
									type: 'POST',
									async : false,
									dataType: 'json',
									data: {
										clase: 'clsParticipante',
										oper: 'guardarNotas',
										serializedtotalNotas: serializedtotalNotas
									   
									},
								}).done(function(data) { 
									if (data == ""){	
										console.log("success");
										jsRemoveWindowLoad();	
										popUpConfirmacion("Guardado Satisfactoriamente");
									}
									else{
										console.log("fail");
										jsRemoveWindowLoad();	
										popUpConfirmacion("No se guardo la información");
									}
								});
				}
				totalNotas = [];
				
				
		},1000);	//set time out
	});//cerrar funcion
		
	// } 
           

    /*$("#reporteAsistencia").click(function(){
        window.location.href = "filtroReporteAsistencia.html";
    });*/
// console.log($("table.tablaNotas thead tr[role=row] th").val());
//console.log($("th[aria-label='N°: activate to sort column descending']").val());
    // .prepend('<tr><th rowspan="2">Name</th><th colspan="2">HR Information</th><th colspan="3">Contact</th></tr>');
    // $("#tablaNotas thead")

    function validarInformacion(){
        var valido=true;
        $(".notas").each(function(e){
            if (!$(this)[0].checkValidity()) {
                valido=false;
            }
        });
        return valido;
    }


$("#volverNotas").click(function(){
    window.location.href = "docente.html";
});

function popUpConfirmacion(msj){
    $("#textoConfirmacion1").html(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function popUpConfirmacionCerrarCurso(msj){
    $("#textoConfirmacion1").html(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown',
		onClose: function() { 
			window.location.href = "docente.html";
		}
    });
}


function mostrarPopUpError(err_men) {
    $("#textoError").html(err_men);
    $('#element_to_pop_upMen').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}
//para el confirm
function popUpConfirmacion1(msj, fn){
	//contenedor vacio
	 var contenedor = $( "#contenedor" );
	 //se le envia a contenedor el contenido de element_to_pop_upCon1
	contenedor.html( $( "#element_to_pop_upCon1" ).html() );
	/*como el id textoConfirmacion2 esta dos veces (en contenedor y en element_to_pop_upCon1)
    * se esta poniendo el texto en el de contenedor
	*/
	$("#textoConfirmacion2", contenedor ).html(msj);
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

function cerrarModal(dato){ 
	window.location.href = "docente.html";
}


function cerrarCursoSinSiguienteModulo(){
		$('#bgmodal').remove();
		$('#bgtransparent').remove();
		
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		
		$.post("../../controlador/fachada.php",{
              clase : 'clsCurso',
              oper: 'cerrarCursoMatriculaTercero',
              idPreprogramacion : sessionStorage.IdPreprogramacion					
         },function (data) {
			if(data.error == ""){
						jsRemoveWindowLoad();
						popUpConfirmacionCerrarCurso("Curso cerrado correctamente");
				}
				else{
					mostrarPopUpError(data.error);
				}	
		},"json");
}


function matricularSiguienteModulo(parametros){	
						
    var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
    
	var moduloSel = $("#SelModulo").val();
	
	if (moduloSel == ''){
		jsRemoveWindowLoad();
		mostrarPopUpError("Debe seleccionar un módulo");
	}
	else{
			
		console.log("modulosel"+moduloSel);
		//se separan los datos del value
		var res = moduloSel.split("-");
		
		var id = res[0];
		var codigo = res[1];
		var nombre = res[2];
		//se extrae la secuencia de T (T1, T2, T3, etc)
        
        var res1 = codigo.split(".");
        total_array= (res1.length)-1;
        t = res1[total_array];

		$.post("../../controlador/fachada.php",{
			clase : 'clsCurso',
			oper: 'matricularSiguienteModulo',
			idPreprogramacion : sessionStorage.IdPreprogramacion,
			id: id,
			t:t,
			codigo:codigo,
			nombre:nombre,
			parametros:parametros	
		},function (data) {
			if(data.error == ""){	
				$.post("../../controlador/fachada.php",{
		              clase : 'clsCurso',
		              oper: 'cerrarCursoMatriculaTercero',
		              idPreprogramacion : sessionStorage.IdPreprogramacion					
		        },
		        function (data) {						
					if(data.error == ""){//Si cerro el curso sin problemas	
						$('#bgmodal').remove();
						$('#bgtransparent').remove();
						jsRemoveWindowLoad();
						popUpConfirmacionCerrarCurso("Curso cerrado correctamente");
					}else{// Si no cerro el curso
						$('#bgmodal').remove();
						$('#bgtransparent').remove();
						mostrarPopUpError(data.error);
					}	
				},"json");
			}else{
				$('#bgmodal').remove();
				$('#bgtransparent').remove();
				mostrarPopUpError(data.error); // Si no paso al siguiente modulo
			}
		},"json");
	}	
}

//boton aceptar 
function cerrarCursoPrimeraParte(){ 
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	cerrarCurso=true;
	if (cerrarCurso == true){
                $.post("../../controlador/fachada.php",{
                            clase : 'clsCurso',
                            oper: 'cerrarCurso',
                            idPreprogramacion : sessionStorage.IdPreprogramacion
                        },
                function (data) { 
					jsRemoveWindowLoad();
                                if(data.error === ""){ //console.log(data);
									// popUpConfirmacion("Curso cerrado correctamente");
									// window.location.href = "docente.html";
									if (data.html != "" && data.parametros != ""){
											//codigo para mostrar el div donde seleccionara los módulos disponibles
											// creamos un div nuevo, con un atributo
											 var divSeleccionModulo = $('<div>').attr({
											 
											 id: 'divSeleccionModulo'
											 });
											 
											// agregamos nuevo div a la pagina
											$('body').append(divSeleccionModulo);
											
											
											var ancho = 600; 
											var alto = 250;
											
											// fondo transparente
											 // creamos un div nuevo, con un atributo
											 var bgdiv = $('<div>').attr({
											 
											 id: 'bgtransparent'
											 });
											 
											// agregamos nuevo div a la pagina
											$('body').append(bgdiv);
											
											// obtenemos ancho y alto de la ventana del explorer
											 var wscr = $(window).width();
											 var hscr = $(window).height();
					 
											//establecemos el css para el div bgtransparent
											$('#bgtransparent').css({'position':'fixed',
																	'left':'0',
																	'top':'0',
																	'background-color':'#000',
																	'opacity':'0.6',
																	'filter':'alpha(opacity=60)',
																	'z-index':' 10'																	
																	});
																	
											
											
											//establecemos las dimensiones del fondo						
											$('#bgtransparent').css("width", wscr);
											$('#bgtransparent').css("height", hscr);
											
											
											 // ventana modal
											 // creamos otro div para la ventana modal y dos atributos
											 var moddiv = $('<div>').attr({
											 
											 id: 'bgmodal'
											 }); 
											
											// agregamos div a la pagina
											$('body').append(moddiv);
											
											$('#bgmodal').css({
												'position':'fixed', 
												'background-image':'url("../images/popupblanco.png")',
												'font-family': "Roboto-Bold",
												'font-size': '16px',
												'border-radius':'15px',
												'overflow':'auto',
												'color':'#000',
												'padding':'20px',
												'width':'354px',
												'height':' 96px',
												'padding': '10px 40px',
												'text-align':'center',
												'z-index':' 20'
												});
											
											// $( "#bgmodal" ).addClass( "element_to_pop_upMensaje" );					
											// agregamos contenido HTML a la ventana modal
											// $('#bgmodal').append(contenidoHTML);
											$('#bgmodal').html("");
											$('#bgmodal').append(data.html);
											
											//response.html
											// redimensionamos para que se ajuste al centro y mas
											$(window).resize();
											 $("button[id^=btnMatricularSiguienteModulo]").click(function(){ matricularSiguienteModulo(data.parametros); });
											 $("button[id^=btnCerrarCursoSinModulos]").click(function(){ cerrarCursoSinSiguienteModulo(); });
											 $("button[id^=btnCerrarModal]").click(function(){ cerrarModal(1); });
											 
											 $('.seleccionar').css({
												 'width': '90px',
												 'height': '27px',
												 'background':'#003265', 
												 'color': '#ffffff',
												 'font-family': 'Roboto-Light', 
												 'font-size': '16px', 
												 'border-radius': '6px 6px 6px 6px'
											 });
											 
											
									}
								}
								else{ 
									mostrarPopUpError(data.error);
									if(data.noModulos != ""){
										//setTimeout(function(){
									//se llama otra vez a la lista de planeacion
									//window.location.href = "docente.html";},4000);
									}
								}
								
                        },"json");
                    }

}

});

