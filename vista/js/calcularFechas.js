	var columnas = new Array(
        { title: "N°" },
        { title: "Id" },
        { title: "Estudiante" },
        { title: "Identificación" },
        { title: "Teléfono" });
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
					$.getScript("../js/asistencia.js", function(){
						//agregarFechasTabla();
						recuperarDatos();
					});
                }else{alert("error 1");}             
            }else {alert("error 2");}
        }, "json");
    }