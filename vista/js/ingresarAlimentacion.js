$(function() { 
	//para quitar posiciones repetidas
	Array.prototype.unique=function(a){
			 return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
		 });
	
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "alimentacion.html";
    }
	//validacion si la modalidad es virtual no hay refrigerio
	if (typeof(sessionStorage.Modalidad) === 73) {
        mostrarPopUpError("El módulo es virtual, no posee refrigerio");
		setTimeout(function() {	window.location.href = "alimentacion.html";},2000);
		
    }
	
   	cargarTipoAlimentacion();

	var ultimaSesion = 0;
    var horas = new Array();
	var horasTotales = new Array();
    var columnas = new Array(
        { title: "N°" },
        { title: "Id" },
        { title: "Estudiante" },
        { title: "Identificación" },
        { title: "Teléfono" });
	opcionesNoalimentacion = "";
	
	
	fechaA = new Array();
	sesionA = new Array();
	idTerceroHorasTotales = new Array();
	observaciones = new Array(); 
	motivos = new Array(); 
	alimentacion = new Array(); 
	alimentacionGeneral = new Array(); 
	
	
    consultarUltimaSesionPorSalon(sessionStorage.IdPreprogramacion);
    agregarFechasTabla();
	
	alimentacionDetalle =false;
		
	
	function cargarTipoAlimentacion() {  
	    $.post("../../controlador/fachada.php", {
	        clase: 'clsAlimentacion',
	        oper: 'cargarTipoAlimentacion'
	    }, function(data) {
	        if (data !== 0) {
	            opcionesAlimentacion=data;
	        }
	        else {
	            alert('error Cargar los tipos de alimentacion');
	        }
	    }, "json");
	}
	
    
    function recuperarDatos() { 
	
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
                        
                        for (var j = 0; j < columnas.length; j++) {  //SI SE AGREGA UNA COLUMNA MAS SE RESTA UNO MAS A columnas.length
							array.push('<select data-sesion="'+data[i].IdTercero+'" data-refrigerio="'+i+'" id="selInalimentacion_'+sesionA[j]+'_'+fechaA[j]+'_'+data[i].IdTercero+'" class="alimentacion"></select>');
                        }

                        dataSet.push(array);
                    }
                    cargarInformacionEnTabla(dataSet);
					//llenarSelects();
									
					//codigo para poner el evento onfocus a las cajas de texto para que solo envia los datos que tuvieron foco
					$( ".alimentacion" ).focus(function() { 
						ponerFoco(this);
					});
					//llamar a llenar cajas de texto
					formarOptionValue(opcionesAlimentacion, "alimentacion");
					llenarCajasTexto();
					jsRemoveWindowLoad();
                 }else{
                    alert("No existen estudiantes inscritos");
                    window.location.href = 'docente.html';
                }             
            }else {alert("error 2");}
        }, "json");
    }

    function cargarInformacionEnTabla(data){ //alert(data);
        var table = $('#tablaAlimentacion').DataTable({
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
	
    function llenarSelects(){ 

		$.each(idTerceroHorasTotales, function() {
		$.ajax({
	            url: '../../controlador/fachada.php',
	            type: 'POST',
	            dataType: 'json',
	            async : false,
	            data: {
	                clase: 'clsAsistencia',
	                oper : 'consultarMotivosNoAsistenciaPorTercero',//validar alimentación por tercero
	                idPreprogramacion: sessionStorage.IdPreprogramacion,
	                idTerceroHorasTotales: this
	            }
	        }).done(function(data) { //console.log(data);
	            if(data !== null){
					
					//se recorre data con todos los valores
					 for (var i = 0; i < data.length; i++) {
						 
						//recorre los todos los textarea
						$("[id^=selInasistencia_]").each(function(e){
							idSelM= $(this).attr( "id" );
							
							var res = idSelM.split("_");
							var idTerceroSelM = res[1];
							
							//se valida que ese select tenga ese tercero para poner el valor
							if(idTerceroSelM == data[i].IdTercero){  
								// $( this ).val( data[i].Motivo );
								
								$("#"+idSelM+" option[value="+ data[i].Motivo +"]").attr("selected",true);
								//$(  this ).val( data[i].Motivo ) tambien funciona
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

	function ponerFoco(cajaTexto){ 
		var id = cajaTexto.id;  
		//se agrega atributo para saber si ese campo es para guardar o editar
		$("#"+id).attr("modificado",true);
		
	}
	

    function agregarFechasTabla(){ 
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
					var cont = 1;


					//console.log(sessionStorage.cantidadSesiones+"sesione");
					//while para  sesion
					/*while( cont <= sessionStorage.cantidadSesiones){						
                           //columna sesion
						columnas.push({"title":"Sesión "+cont});
						sesionA.push(cont);
						cont++;
                    }*/

					//Devuelve las fechas para la asistencia general
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
	                    }else if (nombreDia === "Lunes, Jueves, Sábados y Lunes") {
	                        diasClase = new Array("lunes","jueves","sabado"); //agregado
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



								//while por cantidad de sesion preprogramción
						if(sessionStorage.cantidadSesiones>0){
							// while( cont <= sessionStorage.cantidadSesiones){						
		     //                       //columna sesion
							// 	columnas.push({"title":"Sesión "+cont+" - "});
							// 	sesionA.push(cont);
							// 	cont++;

		     //                 }
						while(fi <= ff){
	                        day = days[fi.getDay()]; 
							
	                        if(diasClase.indexOf(day) != -1){ //alert(day);
								
	                        //columna sesion
							//columnas.push({"title":"Sesión "+cont});
							//sesionA.push(cont); 
								
							//columnas.push({"title":fi.getUTCDate()+"/"+(fi.getMonth()+1)+"/"+fi.getFullYear()});
							fechaA.push(fi.getFullYear()+"-"+(fi.getMonth()+1)+"-"+fi.getUTCDate());	
							//alert(fechaA);
							//cont++;
	                        }
	                     fi = new Date(fi.setTime((fi.getTime() + 86400000)));
								
	                    }
	                    while( cont <= sessionStorage.cantidadSesiones){						
	                        //columna sesion
							columnas.push({"title":"Sesión "+cont+" - "+fechaA[cont-1]});
							sesionA.push(cont);
							cont++;

	                    }
		        

						}else{
						//while para fechas y sesion
						while(fi <= ff){
	                        day = days[fi.getDay()]; 
							
	                        if(diasClase.indexOf(day) != -1){ //alert(day);
								
	                        //columna sesion
							//columnas.push({"title":"Sesión "+cont});
							sesionA.push(cont); 
								
							//columnas.push({"title":fi.getUTCDate()+"/"+(fi.getMonth()+1)+"/"+fi.getFullYear()});
							fechaA.push(fi.getFullYear()+"-"+(fi.getMonth()+1)+"-"+fi.getUTCDate());
							columnas.push({"title":"Sesión "+cont+" - "+fechaA[cont-1]});
							//alert(fechaA);
							cont++;
	                        }
	                     fi = new Date(fi.setTime((fi.getTime() + 86400000)));
								
	                    }
                   }
					recuperarDatos();  
                }else{alert("error 1");}             
            }else {alert("error 2");}
        }, "json");
					

    }

    $("#guardarAlimentacion").click(function(){ 
    	agregarAlimentacioGeneral();
   //      if (!validarInformacion()) {
			// if (sessionStorage.IntensidadHorariaDiaria < 7 ){
			// 	mostrarPopUpError("Por favor llene todos los campos con valores de RB");
			// }
			// else{
			// 	mostrarPopUpError("Por favor llene todos los campos con valores de RR-RB");
			// }
   //      }else{
   //          agregarAlimentacioGeneral();
   //      }
    });
    // $("#reportealimentacion").click(function(){
        // window.location.href = "filtroReportealimentacion.html";
    // });

 
 function validarInformacion(){
        var valido=true;
        $(".alimentacion").each(function(e){
			id=$( this ).attr( "id" ); 
			var res = id.split("_");
			var valor = $("#"+id).val();
			if (res[1]!= "undefined"){
				if(valor != 0 && sessionStorage.IntensidadHorariaDiaria < 7 && valor != 328 && valor != 357){
					valido=false;
				}
				else if (valor != 0 && sessionStorage.IntensidadHorariaDiaria > 7 &&  valor != 330 && valor != 357) {
					valido=false;
				}
			}
			else if (valor == ""){
				valido=false;
			}
        });
        return valido;
    }

    function agregarAlimentacioGeneral(){ 
			var mensaje="Procesando la información<br>Espere por favor";
			jsShowWindowLoad(mensaje);
			var cont=0;
			//se recorren las cajas de texto que no esten vacias para guardar los datos
			$(".alimentacion").each(function(){    
				
					var idCaja = $( this ).attr( "id" ); //alert(idCaja);
					var idCajasub = idCaja.substring(18, 29); //("#txtA_undefined_undefined_"+idTerceroHorasTotales[i])
					
					
					if ($( this ).val() !=  0 && idCajasub != "undefined" ){ //alert("no vacias");
					//if ($( this ).val() !=  ''){ 
						id = $(this).attr("id");
						
						var res = id.split("_");
						
						var noEsta= true;
						//recorrer el array alimentacion para saber si la sesion ya esta
						$.each( alimentacion, function() {
							//console.log("La sesion: "+this['sesion']);
							if( this['sesion'] == res[1]){
								noEsta= false;
							}
						});
						if (noEsta){ 
							//llenar un array con preprogramacion, sesion, fecha
							alimentacion[cont] = {};
							alimentacion[cont]['preprogramacion']=sessionStorage.IdPreprogramacion; 
							alimentacion[cont]['sesion']=res[1]; 
							alimentacion[cont]['fecha']=res[2];		
							alimentacion[cont]['idTercero']=res[3];		
							alimentacion[cont]['idCaja']=idCaja;
							
							alimentacionGeneral[cont] = {};
							alimentacionGeneral[cont]['preprogramacion']=sessionStorage.IdPreprogramacion; 
							alimentacionGeneral[cont]['sesion']=res[1]; 
							alimentacionGeneral[cont]['fecha']=res[2];
						cont++;
						}
					}
				
    }); 
	var serializedAlimentacion = JSON.stringify( alimentacionGeneral );
		$.post("../../controlador/fachada.php", {
			clase: 'clsAlimentacion',
			oper: 'agregarAlimentacioGeneral',
			serializedAlimentacion: serializedAlimentacion
		},
		function(data) {//alert("volvio");
			if (data !== 0) {
				if(data !== null){ 
					//se devuelve array con todos los id insertados de alimentacion general data
					//se tiene el array de alimentacions a este se la va agregar la posicion de el id alimentacion general
					console.log(data);
					for (i=0;i<alimentacion.length;i++){
						
						alimentacion[i]['Idalimentacion']=data[i].IdAlimentacion;	
					}
					agregaralimentacionDetalle(alimentacion);
				}else{alert("error 1");}             
			}else {alert("error 2A");}
		}, "json");
 }

function agregaralimentacionDetalle(alimentacion){
   var alimentacionD = new Array();
   var conta=0;    
   $(".alimentacion").each(function(e){    
       var idCaja = $( this ).attr( "id" ); 
       console.log("Nombre del la lista: "+idCaja);
       var idCajasub = idCaja.substring(18, 29);
       console.log("Sesion + fecha: "+idCajasub);
       var res = idCaja.split("_");
       var valorSesion = res[1];
       var atributoIdalimentacion = "";
       var idalimentacionDetalle = 0;
       var valor = $( this ).val();
       console.log("Refrigerio seleccionado: "+valor);
       var sesionalimentacion=0;
       
       //preguntar si esa caja de texto tiene el atributo Idalimentacion
       if ($( this ).attr("Idalimentacion") != undefined){  
           atributoIdalimentacion =$(this).attr("Idalimentacion");
           var res1 = atributoIdalimentacion.split("_");
           idalimentacionDetalle = res1[1];            
       }
       
       //preguntar si esa caja de texto tiene el atributo modificado
       if ($( this ).attr("modificado") != undefined){
           modificado =true;
       }
       else{
           modificado =false;
       }
           if (idCajasub != "undefined" && modificado == true && valor != 0){  
               sesionalimentacion=valorSesion-1;
               valor=$(this).val();  
               sesion= $(this).attr("data-sesion");
               sesionalimentacions=alimentacion[sesionalimentacion]['Idalimentacion'];      
			   alimentacionD.push({"IdAlimentacion":sesionalimentacions,"IdTercero":sesion,"ValorAlimentacion":valor,"IdAlimentacionDetalle":idalimentacionDetalle});
               conta++;
           } 
  });
   var serializedalimentacionD = JSON.stringify( alimentacionD );
   console.log(serializedalimentacionD);
   $.post("../../controlador/fachada.php", {
			clase: 'clsAlimentacion',
			oper: 'agregaralimentacionDetalle',
			serializedalimentacionD: serializedalimentacionD
		}, function(data) {
				if (data !== 0) { 
					alimentacionDetalle =true;
					if(alimentacionDetalle == true ){
						jsRemoveWindowLoad();
						popUpConfirmacion("Guardado Satisfactoriamente");
						// setTimeout(function() {	location.reload();},1000);
					}
				}else {
					alimentacionDetalle =false;
					
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
            clase: 'clsAlimentacion',
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

function consultaralimentacionPorSalon(){
    var error = false; //alert("entro99");
    for(var i = 0;i < ultimaSesion; i++){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAlimentacion',
                oper : 'consultaralimentacionPorSalon',
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
        window.location.href ='docente.html';
    }
}

$("#volverAlimentacion").click(function(){
    window.location.href = "docente.html";
});

});

function llenarCajasTexto(){ 
	
	$.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAlimentacion',
                oper : 'consultaralimentacionPorPreprogramacion',
                idPreprogramacion: sessionStorage.IdPreprogramacion
                
            }
        }).done(function(data) { //console.log(data);
            if(data !== null){
				
				//se recorre data con todos los valores
				 for (var i = 0; i < data.length; i++) {
					 //se recorren todas las cajas de texto
					$(".alimentacion").each(function(e){ 
						id= $( this ).attr( "id" ); 
						var res = id.split("_");
						var idTercero = res[3];
						var sesion = res[1];  
						//se valida que esa caja de texto tenga ese tercero y esa sesion para poner el valor
						 if(idTercero == data[i].IdTercero && sesion == data[i].SesionNumero){
						 	console.log("Ingresa a llenar el select: "+id+"<br>");
							$("#"+id+" option[value="+ data[i].Refrigerio +"]").attr("selected",true);
							//se agrega atributo para saber si ese campo es para editar
							$( this ).attr("Idalimentacion",data[i].IdAlimentacion+"_"+data[i].IdAlimentacionDetalle);
						 }
					});
				 } 
            }
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

function formarOptionValue(lista, clase) { //selInasistencia_
   $('.'+clase).find('option').remove();
   // SetParametroCursoPorDefecto("."+clase, '0', 'Seleccione...');
   $('.'+clase).append($("<option value='0'>NA</option>"));
   for (i = 0; i < lista.length; i++) { 
    $('.'+clase).append($('<option>', {
        value: lista[i].Id,
        text: lista[i].Nombre
    }));
}
}
