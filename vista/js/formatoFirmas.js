$(function() {
    if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
        window.location.href = "docente.html";
    }
    
    recuperarDatos();
    
    function recuperarDatos() {

        $("#txtNombreServicioEducativo").val(sessionStorage.IdCurso + "   " + sessionStorage.Curso);
        $("#txtHorario").val(sessionStorage.DiasCurso+"  "+sessionStorage.Horario+" "+sessionStorage.IntensidadHorariaDiaria+" Horas" );
        $("#txtFechaInicial").val(sessionStorage.FechaInicial);
        $("#txtFechaFinal").val(sessionStorage.FechaFinal);
        $("#txtSalon").val(sessionStorage.Salon);
        $("#txtModulo").val(sessionStorage.IdModulo + "   " + sessionStorage.Modulo);
        $("#txtSede").val(sessionStorage.Sede);        
        $("#txtDocente").val(sessionStorage.Docente);
        $("#txtDuracion").val(sessionStorage.Duracion);
        $("#txtInscritos").val(sessionStorage.Inscritos);
        $("#txtRuta").val(sessionStorage.Ruta);
        $("#txtNoSessiones").val(sessionStorage.cantidadSesiones);


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
                $("#txtAsistentes").val(data[0].cantidadAsistentes);
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
                $("#txtAprobados").val(data[0].pEstudiantesGanando);
            }
            
        });



        $.post("../../controlador/fachada.php", {
            clase: 'clsParticipante',
            oper: 'consultarEstudiantesPorSalonFormatoFirmas',
            IdPreprogramacion: sessionStorage.IdPreprogramacion
        }, function(data) {
             if (data.length!==0) {
                var cloneCount=1;
                var html="";
                var x=1;
                var i=0;

                    //Copia todo lo que contiene el id #formatoFirmas y lo copia con otro id
                    copia=$("#formatoFirmas"+cloneCount).clone().attr('id', 'formatoFirmas'+""+(cloneCount+1));
                    data.forEach(function(info){
                        //Revisa que la cantidad que se esta insertando sea menor o igual a 20
                        if(x<=20){
                            //alert(info.Apellidos);
                            html = '<tr class="formato-estudiantes">';
                            html += '<td class="No">'+x+'</td>';
                            html += '<td class="Apellido">'+info.Apellidos+'</td>';
                            html += '<td class="Nombre">'+info.Nombres+'</td>';
                            html += '<td class="Identificacion">'+info.Identificacion+'</td>';
                            html += '<td class="Telefono1">'+info.Telefono1+'</td>';
                            html += '<td class="Telefono2">'+info.Telefono2+'</td>';
                            html += '<td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td></tr>';
                            x++;

                            //Va insertando campo por campo 
                           $("#tablaAsistencia1").append(html);    

                        }else{//Cuando pasa al dato 21 ingresa aquí
                            x=1;
                            //Cambia el id inicial
                            $("#tablaAsistencia1").attr('id',cloneCount);
                            //Realiza copia de todo el contenido de #formatoFirmas sin copiar el cambio realizado anteriormente
                            $("#Terminado1").after(copia);
                            cloneCount=(cloneCount+1);
                            //Realiza una nueva copia del que se acabo de copiar                           
                            copia=$("#formatoFirmas"+cloneCount).clone().attr('id', 'formatoFirmas'+""+(cloneCount+1));
                            //Se cambia id de terminado para seguir copiando hacia abajo las hojas
                            $("#Terminado1").attr('id',"Terminado1"+""+cloneCount);
        
                            //Se ingresa el registro 21 y vuelve e inicia el conteo
                            html = '<tr class="formato-estudiantes">';
                            html += '<td class="No">'+x+'</td>';
                            html += '<td class="Apellido">'+info.Apellidos+'</td>';
                            html += '<td class="Nombre">'+info.Nombres+'</td>';
                            html += '<td class="Identificacion">'+info.Identificacion+'</td>';
                            html += '<td class="Telefono1">'+info.Telefono1+'</td>';
                            html += '<td class="Telefono2">'+info.Telefono2+'</td>';
                            html += '<td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td></tr>';
                            x++;

                            //Se inserta los datos anteriormente registrados
                            $("#tablaAsistencia1").append(html);    
                        }

                       
                       
                    });
                
                CargarFilasVacias(data,cloneCount);
        }else { CargarFilasTodasVacias(0, 1);}
    }, "json");
}

    
    function CargarFilasTodasVacias(data, cloneCount) {
                  inicio=data;
                  var tdNuevos=20;
                  $("#tablaAsistencia"+cloneCount).addClass("tablaAsistencia"+cloneCount);
                  for (i=0;i<tdNuevos;i++){ 
                        inicio++;
                        html = '<tr class="celdas-vacias2">';
                        html += '<td class="No">'+inicio+'</td>';
                        html += '<td class="Apellido"></td>';
                        html += '<td class="Nombre"></td>';
                        html += '<td class="Identificacion"></td>';
                        html += '<td class="Telefono1"></td>';
                        html += '<td class="Telefono2"></td>';
                        html += '<td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td><td class="Firmas"></td></tr>';
                        $("#tablaAsistencia1").append(html); 
                    }
                    
    }

    function CargarFilasVacias(data, cloneCount) {
              
              //Me devuelve la cantidad faltante para completar los 20 y adicionar registros vacios
                ent=(data.length%20);             
                var tdNuevos=20-ent;
               
                if(ent!=0){   
                  inicio=ent;
                  $("#tablaAsistencia"+cloneCount).addClass("tablaAsistencia"+cloneCount);
                  for (i=0;i<tdNuevos;i++){ 
                        inicio++;
                        html = '<tr class="celdas-vacias2">';
                        html += "<td>"+inicio+"</td>";
                        html += "<td></td>";
                        html += "<td></td>";
                        html += "<td></td>";
                        html += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                        $("#tablaAsistencia1").append(html); 
                    }
                    
                }
    }



});
