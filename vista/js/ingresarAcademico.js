$(function() { 
	//para quitar posiciones repetidas
	Array.prototype.unique=function(a){
			 return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
		 });
	
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "academico.html";
    }
	//validacion si la modalidad es virtual no hay refrigerio
	// if (typeof(sessionStorage.Modalidad) === 73) {
        // mostrarPopUpError("El módulo es virtual, no posee refrigerio");
		// setTimeout(function() {	window.location.href = "academico.html";},2000);
		
    // }
	
	var ultimaSesion = 0;
    var horas = new Array();
	var horasTotales = new Array();
    var columnas = new Array(
        { title: "N°" },
        { title: "Id" },
        { title: "Estudiante" },
        { title: "Identificación" },
        { title: "Teléfono" });
	opcionesNoacademico = "";
	
	
	fechaA = new Array();
	sesionA = new Array();
	idTerceroHorasTotales = new Array();
	observaciones = new Array(); 
	motivos = new Array(); 
	academico = new Array(); 
	academicoGeneral = new Array(); 
	
	
	// CargarMotivosNoacademico();
    consultarUltimaSesionPorSalon(sessionStorage.IdPreprogramacion);
    //consultaracademicoPorSalon();
	//cargarHorasTotales();
    agregarFechasTabla();
	
	academicoDetalle =false;
	// academicoObservacion=true;
	// academicoMotivo=true;
	
	
	
	
    
    function recuperarDatos() { 
	
        $("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria );
        $("#fechaInicial").html(sessionStorage.FechaInicial);
        $("#lugar").html(sessionStorage.Sede + " - " + sessionStorage.Salon);
        $("#codigo").html(sessionStorage.IdCurso + " - " + sessionStorage.IdModulo);
        $("#fechaFinal").html(sessionStorage.FechaFinal);
        $("#duracion").html(sessionStorage.Duracion);
		$("#txtSalon").html(sessionStorage.Salon);
        $("#txtSede").html(sessionStorage.Sede); 
		$("#txtDocente").html(sessionStorage.Docente);
		$("#txtRuta").html(sessionStorage.Ruta);
		$("#txtNoSessiones").html(sessionStorage.cantidadSesiones);
		//alert(sessionStorage.IdPreprogramacion);
        $.post("../../controlador/fachada.php", {
            clase: 'clsParticipante',
            oper: 'consultarEstudiantesPorSalon',
            IdPreprogramacion: sessionStorage.IdPreprogramacion
        }, function(data) {
            if (data !== 0) {
                if(data !== null){
                    dataSet = [];
					
                    for (var i = 0; i < data.length; i++) {
                        //var sesionHoras = 0;
                        //var suma = 0;
                        var array = [];
                        array.push(i+1);
                        array.push(data[i].IdTercero);
                        array.push(capitalizar(data[i].Estudiante+""));
                        array.push(data[i].Identificacion);
                        array.push(data[i].Telefono);
						idTerceroHorasTotales[i]=(data[i].IdTercero); //se llena para poder calcular las horas totales 
                        
                        for (var j = 0; j < columnas.length-4; j++) {  //SI SE AGREGA UNA COLUMNA MAS SE RESTA UNO MAS A columnas.length
							
							// array.push('<input type="text" size="5" value="NA" class="academicoInput" data-sesion="'+data[i].IdTercero+'" data-academico="'+i+'" name="row-1-position" id="txtA_'+sesionA[j]+'_'+fechaA[j]+'_'+data[i].IdTercero+'" >');   
							array.push('<textarea class="obs" id="textArea_'+data[i].IdTercero+'"></textarea>');  
                            
                                
                        }
						//array.push('<input type="number" min="0" max="100"  readonly size="5" value="1212" class="academicoInput" data-sesion="'+data[i].IdTercero+'" data-academico="'+i+'" name="row-1-position" id="columna_'+j+'">');   
                        // array.push('<textarea class="obs" id="textArea_'+data[i].IdTercero+'"></textarea>');
						// array.push('<select id="selInacademico_'+data[i].IdTercero+'" class="motivo"></select>'); 
						// array.push('<input type="text" size="5" class="notas" id="textNotas_'+data[i].IdTercero+'" readonly>');
                        dataSet.push(array);
                    }
                    cargarInformacionEnTabla(dataSet);
					
					
									
					//codigo para poner el evento onfocus a las cajas de texto para que solo envia los datos que tuvieron foco
					$( ".academicoInput" ).focus(function() { 
						ponerFoco(this);
					});
					
									
					
					//llamar a llenar text area
					 llenarTextArea();
					
					jsRemoveWindowLoad();
					
                 }else{
                    alert("No existen estudiantes inscritos");
                    window.location.href = 'docente.html';
                }             
            }else {alert("error 2");}
        }, "json");
    }

    function cargarInformacionEnTabla(data){ //alert(data);
        var table = $('#tablaAcademico').DataTable({
            "data": data,
            columns: columnas,
            "paging":   false,
            "info":     false,
            "columnDefs": [{"className": "dt-left", "targets": "_all"}, //alinear texto a la izquierda
			{"targets": [ 1 ],"visible": false,"searchable": false},
			{ "width": "13%", "targets": 1 }//se le da ancho al td de estudiante
			//{ "width": "8%", "targets": 8 }, //se le da ancho al td de total horas
			//{ "width": "8%", "targets": 9 } //se le da ancho al td de observacion
			],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "language": {
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            }
        }); 
		
    }
	

	
	function ponerFoco(cajaTexto){ 
		var id = cajaTexto.id;  
		//se agrega atributo para saber si ese campo es para guardar o editar
		$("#"+id).attr("modificado",true);
		
	}
	

    function agregarFechasTabla(){ 
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		
        $.post("../../controlador/fachada.php", {
            clase: 'clsProgramacion',
            oper: 'consultarCalendarioPreprogramacion',
            idPreprogramacion: sessionStorage.IdPreprogramacion
        }, function(data) {
            if (data !== 0) {
                if(data !== null){
                    var diasClase=[];
					var nombreDia = data[0].Nombre;
					//eliminar espacios al principio y al final del nombre
					nombreDia = $.trim( nombreDia ); 
					
                    if (nombreDia === "Lunes a Viernes") {
                        diasClase = new Array("lunes","martes","miercoles","jueves","viernes");
                    }else if (nombreDia === "Lunes a Sábado") {
                        diasClase = new Array("lunes","martes","miercoles","jueves","viernes","sabado");
                    }else if (nombreDia === "Lunes a Miércoles") {
                        diasClase = new Array("lunes","martes","miercoles");
                    }else if (nombreDia === "Jueves a Sábados") {
                        diasClase = new Array("jueves","viernes","sabado");
                    }else if (nombreDia === "Martes y Miércoles") {//--
                        diasClase = new Array("martes","miercoles");
                    }else if (nombreDia === "Martes a Sábado") {
                        diasClase = new Array("martes","miercoles","jueves","viernes","sabado");
                    }else if (nombreDia === "Sábado") {
                        diasClase = new Array("sabado"); //agregado
                    }else if (nombreDia === "Jueves a Martes") {
                        diasClase = new Array("jueves","viernes","sabado","lunes","martes"); //agregado
                    }else if (nombreDia === "Lunes a Jueves") {
                        diasClase = new Array("lunes","martes","miercoles","jueves"); //agregado
                    }else if (nombreDia === "Lunes, Viernes y Sábado") {
                        diasClase = new Array("lunes","viernes","sabado"); //agregado
                    }else if (nombreDia === "Martes a Viernes") {
                        diasClase = new Array("martes","miercoles","jueves","viernes"); //agregado
                    }else if (nombreDia === "Martes y Jueves") {
                        diasClase = new Array("martes","miercoles","jueves"); //agregado
                    }else if (nombreDia === "Domingo") {
                        diasClase = new Array("domingo"); //agregado
                    }else if (nombreDia === "Jueves") {
                        diasClase = new Array("jueves"); //agregado
                    }else if (nombreDia === "Jueves y Viernes") {
                        diasClase = new Array("jueves","viernes"); //agregado
                    }else if (nombreDia === "Lunes y Martes") {
                        diasClase = new Array("lunes","martes"); //agregado
                    }else if (nombreDia === "Lunes, Martes, Jueves y Viernes") {
                        diasClase = new Array("lunes","martes","jueves","viernes"); //agregado
                    }else if (nombreDia === "Viernes y Sábado") {
                        diasClase = new Array("viernes","sabado"); //agregado
                    }else if (nombreDia === "Lunes, Miércoles y Viernes") {
                        diasClase = new Array("lunes","miercoles","viernes"); //agregado
                    }else if (nombreDia === "Lunes y miércoles") {
                        diasClase = new Array("lunes","miercoles"); //agregado
                    }else if (nombreDia === "Lunes y viernes") {
                        diasClase = new Array("lunes","viernes"); //agregado
                    }else if (nombreDia === "Lunes martes y jueves") {
                        diasClase = new Array("lunes","martes","jueves"); //agregado
                    }else if (nombreDia === "Lunes") { 
                        diasClase = new Array("lunes"); //agregado
                    }else if (nombreDia === "Martes") {
                        diasClase = new Array("martes"); //agregado
                    }else if (nombreDia === "Miércoles a sábado") {
                        diasClase = new Array("miercoles","jueves","viernes","sabado"); //agregado
                    }else if (nombreDia === "Miércoles a viernes") {
                        diasClase = new Array("miercoles","jueves","viernes"); //agregado
                    }else if (nombreDia === "Miércoles y jueves") {
                        diasClase = new Array("miercoles","jueves"); //agregado
                    }else if (nombreDia === "Miércoles y viernes") {
                        diasClase = new Array("miercoles","viernes"); //agregado
                    }else if (nombreDia === "Miércoles") {
                        diasClase = new Array("miercoles"); //agregado
                    }else if (nombreDia === "Viernes") {
                        diasClase = new Array("viernes"); //agregado
                    }
                    
                    var fi = data[0].FechaInicial;
                    fi = fi.split('-');
                    fi = new Date(fi[0],fi[1]-1,fi[2]);
                    
                    var ff = data[0].FechaFinal;
                    ff = ff.split('-');
                    ff = new Date(ff[0],ff[1]-1,ff[2]);
                    
                    var days = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"];
                  
					//alert("dias clase "+diasClase);
					var cont = 1;
					
					
					//while para fechas y sesion
					while(fi <= ff){
                        day = days[fi.getDay()]; 
						
                        if(diasClase.indexOf(day) != -1){ //alert(day);
							
                           //columna sesion
						columnas.push({"title":"Sesión "+cont});
						sesionA.push(cont); 
							
							//columnas.push({"title":fi.getUTCDate()+"/"+(fi.getMonth()+1)+"/"+fi.getFullYear()});
							fechaA.push(fi.getFullYear()+"-"+(fi.getMonth()+1)+"-"+fi.getUTCDate());	
							//alert(fechaA);
							cont++;
                        }
                        fi = new Date(fi.setTime((fi.getTime() + 86400000)));
							
                    }
					
					recuperarDatos();
					
					
                    
                }else{alert("error 1");}             
            }else {alert("error 2");}
        }, "json");
    }

    $("#guardarAcademico").click(function(){ 
        if (!validarInformacion()) {
			if (sessionStorage.IntensidadHorariaDiaria < 8 ){
				mostrarPopUpError("Por favor llene todos los campos con valores de RB");
			}
			else{
				mostrarPopUpError("Por favor llene todos los campos con valores de RR-RB");
			}
        }else{
            agregarAcademicoGeneral();
        }
    });
    // $("#reporteacademico").click(function(){
        // window.location.href = "filtroReporteacademico.html";
    // });

    function validarInformacion(){
        var valido=true;
        $(".obs").each(function(e){
			id=$( this ).attr( "id" ); 
			var res = id.split("_");
			var valor = $("#"+id).val();
			
			
			// if (res[1]!= "undefined"){
				// if( valor != "NA" ){
					// if (valor < 0 || valor > 8 ) {
					// valido=false;
					// }
				// }
			// }
			
			if (valor == ""){
				valido=false;
			}
        });
        return valido;
    }

    function agregarAcademicoGeneral(){ 
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	// $('#cargando').css("display","");
	// $('#cargando').html('<div><img src="../images/carga.gif"/></div>');
	
	// var academico = new Array(); 
	var cont=0;
	//se recorren las cajas de texto que no esten vacias para guardar los datos
	$("input[id^=txtA_]").each(function(){    
		
			var idCaja = $( this ).attr( "id" ); //alert(idCaja);
			var idCajasub = idCaja.substring(5, 14); //("#txtA_undefined_undefined_"+idTerceroHorasTotales[i])
			//alert(idCajasub);
			
			if ($( this ).val() !=  '' && idCajasub != "undefined" ){ //alert("no vacias");
			//if ($( this ).val() !=  ''){ 
				id = $(this).attr("id");
				
				var res = id.split("_");
				 
				var noEsta= true;
				//recorrer el array academico para saber si la sesion ya esta
				$.each( academico, function() {
					//alert(this['sesion']);
					if( this['sesion'] == res[1]){
						noEsta= false;
					}
				
				});
				//alert(noEsta);
				
				if (noEsta){ 
					//llenar un array con preprogramacion, sesion, fecha
					academico[cont] = {};
					academico[cont]['preprogramacion']=sessionStorage.IdPreprogramacion; 
					academico[cont]['sesion']=res[1]; 
					academico[cont]['fecha']=res[2];		
					academico[cont]['idTercero']=res[3];		
					academico[cont]['idCaja']=idCaja;
					
					academicoGeneral[cont] = {};
					academicoGeneral[cont]['preprogramacion']=sessionStorage.IdPreprogramacion; 
					academicoGeneral[cont]['sesion']=res[1]; 
					academicoGeneral[cont]['fecha']=res[2];
				cont++;
				}
			}
				
    }); 
	
	var serializedAcademico = JSON.stringify( academicoGeneral );
	
	
	//alert(serializedacademico);
	//$.each( academico, function() {
			//alert(this['sesion']);				
		
		// var idTerceroA=this['idTercero'];
		// var idCajaA=this['idCaja'];
		// var sesionA=this['sesion'];
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsAcademico',
			oper: 'agregarAcademicoGeneral',
			serializedAcademico: serializedAcademico
		},
		
		
	// $.ajax({
				// url: '../../controlador/fachada.php',
				// type: 'POST',
				// dataType: 'json)',
				// async : false,
				// data: {
					// clase: 'clsacademico',
					// oper: 'agregarAlimentacioGeneral',
					// serializedacademico: serializedacademico
					
					
				// } 
			// }),
		function(data) {//alert("volvio");
			
			if (data !== 0) {
				if(data !== null){ 
					//se devuelve array con todos los id insertados de academico general data
					//se tiene el array de academicos a este se la va agregar la posicion de el id academico general
					console.log(data);
					for (i=0;i<academico.length;i++){
						
						academico[i]['Idacademico']=data[i].IdAcademico;	
						
						
					}
					
					agregaracademicoDetalle(academico);
					
					
					
					//alert("Guardado Satisfactoriamente fin");
				}else{alert("error 1");}             
			}else {alert("error 2A");}
		}, "json");
	
	//});
	
	
	
 }



function agregaracademicoDetalle(academico){
  
   
   seguimiento = new Array(); 
   var academicoD = new Array(); 
   var contaO=0;
   var noEsta= true; 
   
		$("[id^=textArea_]").each(function(e){ 
    
				var idObs = $( this ).attr( "id" ); //alert(idCaja);
								
				var res = idObs.split("_");
				var IdTerceroSeguimiento = res[1];
				
				var IdAcademicoDetalle = 0;
				var atributoIdAcademico = "";
				
				//preguntar si esa caja de texto tiene el atributo IdAcademicoDetalle
			   if ($( this ).attr("IdAcademicoDetalle") != undefined){  
				   atributoIdAcademico =$(this).attr("IdAcademicoDetalle");
				   var res1 = atributoIdAcademico.split("_");
				   IdAcademicoDetalle = res1[1];            
			   }
				
				//preguntar si esa caja de texto tiene el atributo modificado
				if ($( this ).attr("modificado") != undefined){
					modificado =true;
				}
				else{
					modificado =false;
				}
				
						//recorrer el array de seguimiento para saber si ese tercero ya esta
							var a = seguimiento.indexOf(IdTerceroSeguimiento); //alert("a"+a);
								if (a > -1){
									noEsta= false;
								}
							
				if (noEsta){ 
							//llenar un array con el tercero
							seguimiento.push(IdTerceroSeguimiento);   
							
							//se hace todo el proceso de guardado de la observacion
							var observacion= $(this).val();
								//modificado == true
								
								// if (observacion !=  ''){ 
								if (modificado ==  true){ 
									
									academicoD[contaO] = {};
									// asistenciaO[contaO]['IdAsistencia']=asistencia[conta]['IdAsistencia']; 
									academicoD[contaO]['IdSeguimientoAcademico']=academico[0]['Idacademico']; 
									academicoD[contaO]['IdTercero']=IdTerceroSeguimiento; 
									academicoD[contaO]['Seguimiento']=observacion;			
									academicoD[contaO]['IdAcademicoDetalle']=IdAcademicoDetalle;		
										
									
									contaO++;
									
								}
									
							
						} //console.log(seguimiento);	
			}); 
   
   //
   var serializedacademicoD = JSON.stringify( academicoD );console.log(serializedacademicoD);
   
   $.post("../../controlador/fachada.php", {
			clase: 'clsAcademico',
			oper: 'agregarAcademicoDetalle',
			serializedacademicoD: serializedacademicoD
						
		}, function(data) {
				if (data !== 0) { 
					academicoDetalle =true;
					if(academicoDetalle == true ){
						
				           
						jsRemoveWindowLoad();
						popUpConfirmacion("Guardado Satisfactoriamente");
						// setTimeout(function() {	location.reload();},1000);
					}
					
					
				}else {
					academicoDetalle =false;
					
						jsRemoveWindowLoad();
						popUpConfirmacion("Se ha presentado un inconveniente, intentelo nuevamente");
					
				}
			}, "json");
 
}





function consultarUltimaSesionPorSalon(idSalon){
    $.ajax({
        url: '../../controlador/fachada.php',
        type: 'POST',
        dataType: 'json',
        async :false,
        data: {
            clase: 'clsAcademico',
            oper: 'consultarUltimaSesionPorSalon',
            idSalon: idSalon,
            }
    }).done(function(data) {
        if(data[0].ultimaSesion === null){
            ultimaSesion = 0;
        }else{
            ultimaSesion = data[0].ultimaSesion;
        }
        
    });
}

function consultaracademicoPorSalon(){
    var error = false; //alert("entro99");
    for(var i = 0;i < ultimaSesion; i++){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAcademico',
                oper : 'consultarAcademicoPorSalon',
                idSalon: sessionStorage.IdPreprogramacion,
                sesion : i+1
            }
        }).done(function(data) {
            if(data !== null){
                horas.push(data);    
            }else{
                error = true;
            }
        //alert(horas);
        });    
    }
    if(error == true){
        alert("No existen estudiantes inscritos");
        window.location.href ='academico.html';
    }
}

$("#volverAcademico").click(function(){
    window.location.href = "academico.html";
});

});


function llenarTextArea(){ 
	console.log(idTerceroHorasTotales);
	$.each( idTerceroHorasTotales, function() {
	$.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAcademico',
                oper : 'consultarSeguimientoPorPreprogramacion',
                idPreprogramacion: sessionStorage.IdPreprogramacion,
                idTerceroHorasTotales: this
            }
        }).done(function(data) { //console.log(data);
            if(data !== null){
				
				//se recorre data con todos los valores
				 for (var i = 0; i < data.length; i++) {
					 
					//recorre los todos los textarea
					$("[id^=textArea_]").each(function(e){
						idTextA= $( this ).attr( "id" );
						
						var res = idTextA.split("_");
						var idTerceroTextA = res[1];
						
						//se valida que ese textarea tenga ese tercero para poner el valor
						if(idTerceroTextA == data[i].IdTercero){
							$( this ).val( data[i].Observacion );
							//se agrega atributo para saber si ese campo es para editar
							$( this ).attr("IdAcademicoDetalle",data[i].IdAcademico+"_"+data[i].IdAcademicoDetalle);
						}
					});
				 }
            }
			// else{
                // alert("No se encontraron datos para mostrar");
            // }
        
        });  
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







