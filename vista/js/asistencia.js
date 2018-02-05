$(function() {
	//para quitar posiciones repetidas
	Array.prototype.unique=function(a){
			 return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
		 });
	
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "docente.html";
    }
	
	var ultimaSesion = 0;
    var horas = new Array();
	var horasTotales = new Array();
    var columnas = new Array(
        { title: "N°" },
        { title: "Id" },
        { title: "Estudiante" },
        { title: "Identificación" },
        { title: "Teléfono" });
	opcionesNoAsistencia = "";
	
	
	fechaA = new Array();
	sesionA = new Array();
	idTerceroHorasTotales = new Array();
	// observaciones = new Array(); 
	// motivos = new Array(); 
	asistencia = new Array(); 
	asistenciaGeneral = new Array(); 
	
	
	CargarMotivosNoAsistencia();
    consultarUltimaSesionPorSalon(sessionStorage.IdPreprogramacion);
    //consultarAsistenciaPorSalon();
	//cargarHorasTotales();
    agregarFechasTabla();
	
	asistenciaDetalle =true;
	asistenciaObservacion=true;
	asistenciaMotivo=true;
	
	    
    function recuperarDatos() { 
	
        $("#nombreServicio").html(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
		$("#txtModulo").html(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#inscritos").html(sessionStorage.Inscritos);
        $("#horario").html(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria+" Horas" );
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
                        
                        for (var j = 0; j < columnas.length-8; j++) {  //SI SE AGREGA UNA COLUMNA MAS SE RESTA UNO MAS A columnas.length
							
							array.push('<input type="text" size="5" maxlength="1" value="NA" class="asistenciaInput" data-sesion="'+data[i].IdTercero+'" data-asistencia="'+i+'" name="row-1-position" id="txtA_'+sesionA[j]+'_'+fechaA[j]+'_'+data[i].IdTercero+'" >');   
                            // if(j < ultimaSesion){
                                // if(data[i] !== null){ //alert([data[i].IdTercero]);
                                    // sesionHoras = horas[j][data[i].IdTercero]; 
                                    // suma = suma + parseInt(horas[j][data[i].IdTercero]);    
                                // }else{
                                    // suma = 0;
                                    // sesionHoras = 0;
                                // }
                                
                                // array.push('<input required type="number" min="0" max="8"  size="5" value="'+horas[j][data[i].IdTercero]+'" class="asistenciaInput" data-estudiante="'+data[i].IdTercero+'" data-sesion="'+i+'" name="row-1-position" id="columna_'+j+'">' );       
                            // }else if (j==ultimaSesion) { 
                                // array.push('<input required type="number" min="0" max="8"  size="5" value="" class="asistenciaInput enabled" data-estudiante="'+data[i].IdTercero+'" data-sesion="'+i+'" name="row-1-position" id="columna_'+j+'">');
                            // }else if(j > ultimaSesion && j < columnas.length -7 ){ 
                                // array.push('<input type="number" min="0" max="8"  value="" size="5" class="asistenciaInput" data-sesion="'+data[i].IdTercero+'" data-asistencia="'+i+'" name="row-1-position" id="columna_'+j+'">');
                            // }else{ 
                                // array.push('<input type="number" min="0" max="100"  readonly size="5" value="1212" class="asistenciaInput" data-sesion="'+data[i].IdTercero+'" data-asistencia="'+i+'" name="row-1-position" id="columna_'+j+'">');       
                                
                            // }
                        }
						//array.push('<input type="number" min="0" max="100"  readonly size="5" value="1212" class="asistenciaInput" data-sesion="'+data[i].IdTercero+'" data-asistencia="'+i+'" name="row-1-position" id="columna_'+j+'">');   
                        array.push('<textarea class="obs" id="textArea_'+data[i].IdTercero+'"></textarea>');
						array.push('<select id="selInasistencia_'+data[i].IdTercero+'" class="motivo"></select>'); 
						array.push('<input type="text" size="5" class="notas" id="textNotas_'+data[i].IdTercero+'" readonly>');
                        dataSet.push(array);
                    }
                    cargarInformacionEnTabla(dataSet);
					
					
					//codigo para poner el evento onchage a las cajas de texto para calcular horas totales
					$( ".asistenciaInput" ).change(function() {
						cargarHorasTotales(this);
					});
					
					//codigo para poner el evento onfocus a las cajas de texto para que solo envia los datos que tuvieron foco
					$( ".asistenciaInput" ).focus(function() { 
						ponerFoco(this);
					});
					
					//codigo para poner el evento onfocus a las cajas de texto para que solo envia los datos que tuvieron foco
					$( ".obs" ).change(function() { 
						ponerFocoTextArea(this);
					});
					
					//codigo para poner el evento onchange a los select para que solo envia los datos que tuvieron change
					$( ".motivo" ).change(function() { 
						ponerFocoSelect(this);
					});
					
					
					
					//llamar a llenar cajas de texto
					llenarCajasTexto();
					llenarTextArea();
					formarOptionValue(opcionesNoAsistencia, "motivo");
					llenarSelects();
					llenarNotas();
					jsRemoveWindowLoad();
					
                 }else{
                    alert("No existen estudiantes inscritos");
                    window.location.href = 'docente.html';
                }             
            }else {alert("error 2");}
        }, "json");
    }

    function cargarInformacionEnTabla(data){ //alert(data);
        var table = $('#tablaAsistencias').DataTable({
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
	
	//se crea esta funcion para cargar las horas totales de asistencias
	function cargarHorasTotales(cajaDeTexto){ 
		 
		var idCaja = cajaDeTexto.id;
		var res = idCaja.split("_");
		res= res[3];
		/*se recorre el array que tiene todos los id de estudiantes y se recorren cada
		caja de texto que termine en ese id para garantizar que sea esa fila y se captura el valor
		y se va sumando a lo que ya se traia y se pone el la caja de texto de horas totales
		*/
		
		
		// for (var i = 0; i < idTerceroHorasTotales.length; i++) { 
		 var totalHoras=0; 
			$("input[id$="+res+"]").each(function(){  
				if ($( this ).val() > 0 && $( this ).val() <= (sessionStorage.IntensidadHorariaDiaria*1) ) { 
				// if ($( this ).val() > 0 && $( this ).val() <= 8 ) { 
					if ($( this ).val() !=  '' && this.id != "txtA_undefined_undefined_"+res && $( this ).val() !=  'NA' && this.id != "textNotas_"+res){ 
						totalHoras=(totalHoras*1)+($(this).val()*1);   
					}
					
				 } 
			
			});
			
			// if ($("input[id=txtA_undefined_undefined_"+res+"]")){ 
				$("#txtA_undefined_undefined_"+res).val(totalHoras);
				totalHoras=0;
				//se aumenta el valor maximo de la caja de texto
				$("#txtA_undefined_undefined_"+res).prop('max', 500);
				
			
			// }
		// }
		
	}
	
	function ponerFoco(cajaTexto){ 
		var id = cajaTexto.id;  
		//se agrega atributo para saber si ese campo es para guardar o editar
		$("#"+id).attr("modificado",true);
		
	}
	
	
	function ponerFocoTextArea(cajaObs){ 
		var id = cajaObs.id;  
		//se agrega atributo para saber si ese campo es para guardar o editar
		$("#"+id).attr("modificado",true);
		
	}
	
	function ponerFocoSelect(selectNoAsistencia){ 
		var id = selectNoAsistencia.id;  
		//se agrega atributo para saber si ese campo es para guardar o editar
		$("#"+id).attr("modificado",true);
		
	}

    function agregarFechasTabla(){ 
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
					var cont = 1;
				
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
							while( cont <= sessionStorage.cantidadSesiones){						
		                           //columna sesion
								columnas.push({"title":"Sesión "+cont});
								sesionA.push(cont);
								cont++;

		                     }
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

		        

						}else{
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
                   }



                  
	                    	columnas.push({'title':'Total Horas'});
		                    columnas.push({'title':'Observaciones'});
							columnas.push({'title':'Motivo no asistencia'});
							columnas.push({'title':'Nota'});
					
					recuperarDatos();
					
					
                    
                }else{alert("error 1");}             
            }else {alert("error 2");}
        }, "json");
					

    }

    $("#guardarAsistencia").click(function(){ 
        if (!validarInformacion()) {
            mostrarPopUpError("Por favor llene todos los campos con valores de 0 a "+sessionStorage.IntensidadHorariaDiaria);
        }else{
            agregarAsistenciaGeneral();
        }
    });
    $("#reporteAsistencia").click(function(){
        window.location.href = "filtroReporteAsistencia.html";
    });

    function validarInformacion(){
        var valido=true;
        $(".asistenciaInput").each(function(e){
			id =$(this).attr("id"); 
			var res = id.split("_");
			var valor = parseInt($("#"+id).val());
			
			
			// if (res[1]!= "undefined" && res[2]!= "undefined"){
			if (res[1]!= "undefined"){
				if( valor != "NA" ){
					 	var IntensidadHorariaDiaria=parseInt(sessionStorage.IntensidadHorariaDiaria);
					if ((valor<0) || (valor>IntensidadHorariaDiaria)) {
						valido=false;
					}
				}
			}

			if (isNaN(valor)){
				valido=false;
			}
        });
        return valido;
    }

    function agregarAsistenciaGeneral(){ 
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	// $('#cargando').css("display","");
	// $('#cargando').html('<div><img src="../images/carga.gif"/></div>');
	
	// var asistencia = new Array(); 
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
				//recorrer el array asistencia para saber si la sesion ya esta
				$.each( asistencia, function() {
					//alert(this['sesion']);
					if( this['sesion'] == res[1]){
						noEsta= false;
					}
				
				});
				//alert(noEsta);
				
				if (noEsta){ 
					//llenar un array con preprogramacion, sesion, fecha
					asistencia[cont] = {};
					asistencia[cont]['preprogramacion']=sessionStorage.IdPreprogramacion; 
					asistencia[cont]['sesion']=res[1]; 
					asistencia[cont]['fecha']=res[2];		
					asistencia[cont]['idTercero']=res[3];		
					asistencia[cont]['idCaja']=idCaja;

					asistenciaGeneral[cont] = {};
					asistenciaGeneral[cont]['preprogramacion']=sessionStorage.IdPreprogramacion; 
					asistenciaGeneral[cont]['sesion']=res[1]; 
					asistenciaGeneral[cont]['fecha']=res[2];
				cont++;
				}
			}
				
    }); 
	
	var serializedAsistencia = JSON.stringify( asistenciaGeneral );
	
	
	//console.log(serializedAsistencia);
	//$.each( asistencia, function() {
			//alert(this['sesion']);				
		
		// var idTerceroA=this['idTercero'];
		// var idCajaA=this['idCaja'];
		// var sesionA=this['sesion'];
		
		$.post("../../controlador/fachada.php", {
			clase: 'clsAsistencia',
			oper: 'agregarAsistenciaGeneral',
			serializedAsistencia: serializedAsistencia
		},
		
		
	// $.ajax({
				// url: '../../controlador/fachada.php',
				// type: 'POST',
				// dataType: 'json)',
				// async : false,
				// data: {
					// clase: 'clsAsistencia',
					// oper: 'agregarAsistenciaGeneral',
					// serializedAsistencia: serializedAsistencia
					
					
				// } 
			// }),
		function(data) {//alert("volvio");
			
			if (data !== 0) {
				if(data !== null){ 
					//se devuelve array con todos los id insertados de asistencia general data
					//se tiene el array de asistencias a este se la va agregar la posicion de el id asistencia general
					//alert(data[0]['IdAsistencia']);
					for (i=0;i<asistencia.length;i++){
						
						asistencia[i]['IdAsistencia']=data[i].IdAsistencia;	
						
					}
					
					agregarAsistenciaDetalle(asistencia);
					agregarAsistenciaObservacion(asistencia);
					agregarMotivoNoAsistencia(asistencia);   
					// if(asistenciaDetalle == true || asistenciaObservacion== true || asistenciaMotivo==true){
						
				           
						jsRemoveWindowLoad();
						popUpConfirmacion("Guardado Satisfactoriamente");
						//setTimeout(function() {	location.reload();},1000);
					// }
					// else{
						// jsRemoveWindowLoad();
						// popUpConfirmacion("Se ha presentado un inconveniente, intentelo nuevamente");
					// }
					
					
					//alert("Guardado Satisfactoriamente fin");
				}else{alert("error 1");}             
			}else {alert("error 2A");}
		}, "json");
	
	//});
	// $('#cargando').css("display","none");
	 
	 // // var mensaje="Procesando la información<br>Espere por favor";
		// // jsShowWindowLoad(mensaje);
	 // // setTimeout(function() {
        // // //$(".cargando").fadeOut(1500);
		// // // $('#cargando').css("display","none");
		// // jsRemoveWindowLoad();
		
			// // setTimeout(function() {
		   
			// // popUpConfirmacion("Guardado Satisfactoriamente");
			// // setTimeout(function() {	location.reload();},1000);
			
		// // },1000);
    // // },5000);
	
	
	
 }

 // function agregarAsistenciaDetalle(asistencia){ 
    // var asistenciaD = new Array(); 
    // var conta=0;
    // $("input[id^=txtA_]").each(function(e){
		
		// var idCaja = $( this ).attr( "id" ); //alert(idCaja);
		// var idCajasub = idCaja.substring(5, 14); 
		// var res = idCaja.split("_");
		// var valorSesion = res[1];
		// var atributoIdAsistencia = "";
		// var idAsistenciaDetalle = 0;
		// var valor = $( this ).val();
		
		
		// //preguntar si esa caja de texto tiene el atributo IdAsistencia
		// if ($( this ).attr("IdAsistencia") != undefined){  
			// atributoIdAsistencia =$(this).attr("IdAsistencia");
			// var res1 = atributoIdAsistencia.split("_");
			// idAsistenciaDetalle = res1[1];
			
		// }
		
		// //preguntar si esa caja de texto tiene el atributo modificado
		// if ($( this ).attr("modificado") != undefined){
			// modificado =true;
		// }
		// else{
			// modificado =false;
		// }
		
		
		// //if ($( this ).val() !=  '' && idCajasub != "undefined" && res[1]==sesionA && modificado == true){
		// // if (idCajasub != "undefined" && res[1]==sesionA && modificado == true && valor != "NA"){ alert("lll");
		// if (idCajasub != "undefined" && modificado == true && valor != "NA"){ 
		
			
			// asistenciaD[conta] = {};
			// asistenciaD[conta]['IdAsistencia']=asistencia[conta]['IdAsistencia']; 
			// asistenciaD[conta]['idTercero']=$(this).attr("data-sesion");	
			// asistenciaD[conta]['valorAsistencia']=$(this).val(); 
			// asistenciaD[conta]['idAsistenciaDetalle']=idAsistenciaDetalle;		
					
		// conta++;
			
			
			
		// }  
    // });
	// var serializedAsistenciaD = JSON.stringify( asistenciaD );alert(serializedAsistenciaD);
	// $.ajax({
				// url: '../../controlador/fachada.php',
				// type: 'POST',
				// dataType: 'json)',
				// async : true,
				// data: {
					// clase: 'clsAsistencia',
					// oper: 'agregarAsistenciaDetalle',
					// serializedAsistenciaD: serializedAsistenciaD,
					
					
				// }
			// }).done(function() {
				// console.log("success");
			// });
	
    
// }

function agregarAsistenciaDetalle(asistencia){
   var asistenciaD = new Array();
   var conta=0;    $("input[id^=txtA_]").each(function(e){
       
       var idCaja = $( this ).attr( "id" ); //alert(idCaja);
       var idCajasub = idCaja.substring(5, 14);
       var res = idCaja.split("_");
       var valorSesion = res[1];
       var atributoIdAsistencia = "";
       var idAsistenciaDetalle = 0;
       var valor = $( this ).val();
       var sesionAsistencia=0;
       
       //preguntar si esa caja de texto tiene el atributo IdAsistencia
       if ($( this ).attr("IdAsistencia") != undefined){  
           atributoIdAsistencia =$(this).attr("IdAsistencia");
           var res1 = atributoIdAsistencia.split("_");
           idAsistenciaDetalle = res1[1];            
       }
       
       //preguntar si esa caja de texto tiene el atributo modificado
       if ($( this ).attr("modificado") != undefined){
           modificado =true;
       }
       else{
           modificado =false;
       }
       
       
       //if ($( this ).val() !=  '' && idCajasub != "undefined" && res[1]==sesionA && modificado == true){
       // if (idCajasub != "undefined" && res[1]==sesionA && modificado == true && valor != "NA"){ alert("lll");
     
     
           if (idCajasub != "undefined" && modificado == true && valor != "NA"){    
       
             
               
               sesionAsistencia=valorSesion-1;
               valor=$(this).val();  
               sesion= $(this).attr("data-sesion");
               sesionAsistenciass=asistencia[sesionAsistencia]['IdAsistencia'];      
			   asistenciaD.push({"IdAsistencia":sesionAsistenciass,"idTercero":sesion,"valorAsistencia":valor,"idAsistenciaDetalle":idAsistenciaDetalle});
               //alert(sesionAsistencia);
               conta++;
                       
           }  
     
     
  });
   var serializedAsistenciaD = JSON.stringify( asistenciaD );//alert(serializedAsistenciaD);
   $.ajax({
               url: '../../controlador/fachada.php',
               type: 'POST',
               dataType: 'json)',
               async : true,
               data: {
                   clase: 'clsAsistencia',
                   oper: 'agregarAsistenciaDetalle',
                   serializedAsistenciaD: serializedAsistenciaD,
                   
                   
               }
           }).done(function(data) { //alert(data);
				if (data.array =1){asistenciaDetalle =true;}
				else {asistenciaDetalle =false;}
               
				
           })
		    .fail(function() {
			asistenciaDetalle =false;
	
		  });
   
 
}

function agregarAsistenciaObservacion(asistencia){ 
   observaciones = new Array(); 
   var asistenciaO = new Array(); 
   var contaO=0;
   var noEsta= true; 
   
		$("[id^=textArea_]").each(function(e){ 
    
				var idObs = $( this ).attr( "id" ); //alert(idCaja);
								
				var res = idObs.split("_");
				var IdTerceroObservacion = res[1];
				
				// var atributoIdAsistencia = "";
				// var idAsistenciaObservacion = "";
				
				//preguntar si esa caja de texto tiene el atributo modificado
				if ($( this ).attr("modificado") != undefined){
					modificado =true;
				}
				else{
					modificado =false;
				}
				
						//recorrer el array de observaciones para saber si ese tercero ya esta
							var a = observaciones.indexOf(IdTerceroObservacion); //alert("a"+a);
								if (a > -1){
									noEsta= false;
								}
							
				if (noEsta){ 
							//llenar un array con el tercero
							observaciones.push(IdTerceroObservacion);   
							
							//se hace todo el proceso de guardado de la observacion
							var observacion= $(this).val();
								//modificado == true
								
								// if (observacion !=  ''){ 
								if (modificado ==  true){ 
									
									asistenciaO[contaO] = {};
									// asistenciaO[contaO]['IdAsistencia']=asistencia[conta]['IdAsistencia']; 
									asistenciaO[contaO]['IdAsistencia']=asistencia[0]['IdAsistencia']; 
									asistenciaO[contaO]['idTercero']=IdTerceroObservacion; 
									asistenciaO[contaO]['observacion']=observacion;		
									asistenciaO[contaO]['idPreprogramacion']=sessionStorage.IdPreprogramacion;		
										
									
									contaO++;
									
								}
									
							
						} //console.log(observaciones);	
			}); 
			var serializedAsistenciaO = JSON.stringify( asistenciaO ); console.log(serializedAsistenciaO);
				if (asistenciaO.length != 0){
					$.ajax({
							url: '../../controlador/fachada.php',
							type: 'POST',
							dataType: 'json)',
							async : true,
							data: {
								clase: 'clsAsistencia',
								oper: 'agregarAsistenciaObservacion',
								serializedAsistenciaO: serializedAsistenciaO
								
								
							}
						}).done(function() {
							asistenciaObservacion=true;
							
						})
						.fail(function() {
							asistenciaObservacion =false;
						});
				}
   //alert("Guardado Satisfactoriamente observacion");
    //window.location.href = 'asistencia.html';
}

function agregarMotivoNoAsistencia(asistencia){ 
   motivos = new Array(); 
   var asistenciaM = new Array(); 
   var contaM=0;
   var noEsta= true; 
   
		$("[id^=selInasistencia_]").each(function(e){ 
    
				var idSel = $( this ).attr( "id" ); //alert(idCaja);
								
				var res = idSel.split("_");
				var IdTerceroNoAsistencia = res[1];
				
				// var atributoIdAsistencia = "";
				// var idAsistenciaObservacion = "";
				
				//preguntar si ese select tiene el atributo modificado
				if ($( this ).attr("modificado") != undefined){
					modificado =true;
				}
				else{
					modificado =false;
				}
				
						//recorrer el array de motivos para saber si ese tercero ya esta
							var a = motivos.indexOf(IdTerceroNoAsistencia); //alert("a"+a);
								if (a > -1){
									noEsta= false;
								}
								
				if (noEsta){  
							//llenar un array con el tercero
							motivos.push(IdTerceroNoAsistencia);   
							
							//se hace todo el proceso de guardado del motivo
							var motivo= $(this).val();
								//modificado == true
								
								// if (observacion !=  ''){ 
								 
								if (modificado ==  true){ 
									
									asistenciaM[contaM] = {};
									asistenciaM[contaM]['IdAsistencia']=asistencia[0]['IdAsistencia']; 
									asistenciaM[contaM]['idTercero']=IdTerceroNoAsistencia; 
									asistenciaM[contaM]['motivo']=motivo;		
									asistenciaM[contaM]['idPreprogramacion']=sessionStorage.IdPreprogramacion;		
										
									
									contaM++;
									
								}
									
							
						} //console.log(motivos);	
			}); 
			var serializedAsistenciaM = JSON.stringify( asistenciaM ); //alert(serializedAsistenciaM);
				if (asistenciaM.length != 0){
					$.ajax({
						url: '../../controlador/fachada.php',
						type: 'POST',
						dataType: 'json)',
						async : false,
						data: {
							clase: 'clsAsistencia',
							oper: 'agregarMotivoNoAsistencia',
							serializedAsistenciaM: serializedAsistenciaM
							
							
						}
					}).done(function() {
						asistenciaMotivo=true;
					})
					.fail(function() {
						asistenciaMotivo =false;
					});
				}
	
}

function consultarUltimaSesionPorSalon(idSalon){
    $.ajax({
        url: '../../controlador/fachada.php',
        type: 'POST',
        dataType: 'json',
        async :false,
        data: {
            clase: 'clsAsistencia',
            oper: 'consultarUltimaSesionPorSalon',
            idSalon: idSalon,
            }
    }).done(function(data) {
        if(data[0].ultimaSesion === null){
            ultimaSesion = 0;
        }else{
        	//console.log(data[0].ultimaSesion);
            ultimaSesion = data[0].ultimaSesion;
        }
        
    });
}

function consultarAsistenciaPorSalon(){
    var error = false; //alert("entro99");
    for(var i = 0;i < ultimaSesion; i++){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAsistencia',
                oper : 'consultarAsistenciaPorSalon',
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

$("#volverAsistencia").click(function(){
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
                clase: 'clsAsistencia',
                oper : 'consultarAsistenciaPorPreprogramacion',
                idPreprogramacion: sessionStorage.IdPreprogramacion
                
            }
        }).done(function(data) { //console.log(data);
            if(data !== null){
				
				//se recorre data con todos los valores
				 for (var i = 0; i < data.length; i++) {
					 //se recorren todas las cajas de texto
					$("input[id^=txtA_]").each(function(e){ 
						id= $( this ).attr( "id" ); 
						
						var res = id.split("_");
						var idTercero = res[3];
						var sesion = res[1];  
						//se valida que esa caja de texto tenga ese tercero y esa sesion para poner el valor
						 if(idTercero == data[i].IdTercero && sesion == data[i].SesionNumero){
							$( this ).val( data[i].HorasAsistidas );
							//se agrega atributo para saber si ese campo es para editar
							$( this ).attr("IdAsistencia",data[i].IdAsistencia+"_"+data[i].IdAsistenciaDetalle);
							
							//se simula el evento change de cada caja de texto para el calculo de horas totales
							$(this).trigger('change');
						 }
					});
					
					
				 } 
				 
				 //llenarTextArea();
            }
			// else{
                // alert("No se encontraron datos para mostrar");
            // }
        
        });   
}

function llenarTextArea(){ 
	console.log(idTerceroHorasTotales);
	$.each( idTerceroHorasTotales, function() {
	$.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAsistencia',
                oper : 'consultarObservacionesPorTercero',
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
							// //se agrega atributo para saber si ese campo es para editar YA NO SE NECESITA
							// $( this ).attr("IdAsistencia",data[i][IdAsistencia]+"_"+data[i][IdAsistenciaObservacion]);
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

function llenarSelects(){ 
	console.log(idTerceroHorasTotales);
	$.each( idTerceroHorasTotales, function() {
	$.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                clase: 'clsAsistencia',
                oper : 'consultarMotivosNoAsistenciaPorTercero',
                idPreprogramacion: sessionStorage.IdPreprogramacion,
                idTerceroHorasTotales: this
            }
        }).done(function(data) { //console.log(data);
            if(data !== null){
				
				//se recorre data con todos los valores
				 for (var i = 0; i < data.length; i++) {
					 
					//recorre los todos los textarea
					$("[id^=selInasistencia_]").each(function(e){
						idSelM= $( this ).attr( "id" );
						
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

function CargarMotivosNoAsistencia() {  
    $.post("../../controlador/fachada.php", {
        clase: 'clsAsistencia',
        oper: 'CargarMotivosNoAsistencia'
    }, function(data) {
        if (data !== 0) {
            opcionesNoAsistencia=data;
			//console.log(opcionesNoAsistencia);
        }
        else {
            alert('error Cargar los motivos de no asistencia');
        }
    }, "json");
}

function SetParametroCursoPorDefecto(atributo, valor, texto) {
    $(atributo).append($('<option>', { 
        value: valor,
        text: texto
    }));
}

function formarOptionValue(lista, clase) { //selInasistencia_
   $('.'+clase).find('option').remove();
   console.log(lista);
   // SetParametroCursoPorDefecto("."+clase, '0', 'Seleccione...');
   $('.'+clase).append($("<option value='0'>Seleccione..</option>"));
   for (i = 0; i < lista.length; i++) { 
    $('.'+clase).append($('<option>', {
        value: lista[i].Id,
        text: lista[i].Nombre
    }));
}
}

function llenarNotas(){ 
	// console.log(idTerceroHorasTotales);
	var total=idTerceroHorasTotales.length;
	if (total > 0){
	// $.each( idTerceroHorasTotales, function() {
		$.ajax({
				url: '../../controlador/fachada.php',
				type: 'POST',
				dataType: 'json',
				async : false,
				data: {
					clase: 'clsAsistencia',
					oper : 'consultarNotasPorTercero',
					idPreprogramacion: sessionStorage.IdPreprogramacion,
					idTerceroHorasTotales: idTerceroHorasTotales
				}
			}).done(function(data) { //console.log(data);
				if(data !== null){ console.log(data);
					
					//se recorre data con todos los valores
					 for (var i = 0; i < data.length; i++) {
						 
						//recorre los todos los textarea
						$("[id^=textNotas_]").each(function(e){
							idTextNota= $( this ).attr( "id" );
							
							var res = idTextNota.split("_");
							var idTerceroTextA = res[1];
							
							//se valida que ese textarea tenga ese tercero para poner el valor
							if(idTerceroTextA == data[i].IdTercero){
								$( this ).val( data[i].Nota );
								// //se agrega atributo para saber si ese campo es para editar YA NO SE NECESITA
								// $( this ).attr("IdAsistencia",data[i][IdAsistencia]+"_"+data[i][IdAsistenciaObservacion]);
							}
						});
					 }
				}
				// else{
					// alert("No se encontraron datos para mostrar");
				// }
			
			});  
	} //if
	// });
}