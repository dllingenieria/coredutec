$(function(){
    var tabla;
    var clase, oper="";
    var identificacion;
    var ciudades;
    var estadocivil;
    var grado;
    var localidades;
    var eliminar = [];
    obtenerIdentificacion();
    obtenerCiudades();
    obtenerEstadoCivil();
    obtenerGradoEscolaridad();
    obtenerLocalidades();

    function crearSelect(clase,row,col,dataSet,value=false){
        var select = '<select data-type="'+clase+'" class="data data'+row+'" id="select'+row+col+'" data-modified="false">';
        var selected = '';
        for (i = 0; i < dataSet.length; i++) {
            selected = '';
            if(value){
                if(dataSet[i][0] == value){
                    selected = 'selected';
                }
            }
            select+='<option '+selected+' value="'+dataSet[i][0]+'">'+dataSet[i][1]+'</option>';
        }
        select+='</select>';
        return select;
    }

    function obtenerIdentificacion(){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            data: {
                clase: 'clsTercero',
                oper: 'obtenerTipoIdentificacion'
            },
            async:false,
        }).done(function(data) {
            //console.log(JSON.stringify(data));
            identificacion = data;
        });
        
    }

    function obtenerCiudades(){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            data: {
                clase: 'clsTercero',
                oper: 'obtenerCiudades'
            },
            async:false,
        }).done(function(data) {
          for(var x = 0 ; x < data.length; x++){
            ciudades = data;
        }
    });
        
    }

    function obtenerEstadoCivil(){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            data: {
                clase: 'clsTercero',
                oper: 'obtenerEstadoCivil'
            },
            async:false,
        }).done(function(data) {
          for(var x = 0 ; x < data.length; x++){
            estadocivil = data;
        }
    });
        
    }

    function obtenerGradoEscolaridad(){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            data: {
                clase: 'clsTercero',
                oper: 'obtenerGradoEscolaridad'
            },
            async:false,
        }).done(function(data) {
          for(var x = 0 ; x < data.length; x++){
            grado = data;
        }
    });
    }

    function obtenerLocalidades(){
        $.ajax({
            url: '../../controlador/fachada.php',
            type: 'POST',
            dataType: 'json',
            data: {
                clase: 'clsTercero',
                oper: 'obtenerLocalidades'
            },
            async:false,
        }).done(function(data) {
          for(var x = 0 ; x < data.length; x++){
            localidades = data;
        }
    });
    }

    function mostrarCRUD(tabla){
        if (tabla === "0") {
            alert("Seleccione una tabla");
            return;
        }else if (tabla === "1") {
            clase = "clsDocente";
            oper = "CargarInformacionCompletaDocente";
        }else if (tabla === "2") {
            clase = "clsProgramacion";
            oper = "CargarPreprogramaciones";
        }else if (tabla === "3") {
            clase = "clsNovedades";
            oper = "consultarNovedades2";
        }else if (tabla === "4") {
            clase = "clsMatricula";
            oper = "consultarMatriculas2";
        }else if (tabla === "5") {
            clase = "clsCurso";
            oper = "CargarInformacionCompletaCurso";
        }else if (tabla === "6") {
            clase = "clsModulo";
            oper = "CargarInformacionCompletaModulo";
        }else if (tabla === "7") {
            window.location.href = "docentedicta.html"; 
        }
        swal({title: "Consultando Información",   
            text: "Espere un momento...",   
            timer : 2000,
            showConfirmButton: false});
        consultarTabla(clase, oper, function(informacionTabla){
            var columnas = obtenerColumnas(informacionTabla);
            var dataSet = obtenerDataSet(informacionTabla,clase);
            inicializarDataTable(dataSet, columnas);
        });
    }

    function consultarTabla(clase, oper, callback){
        $.post("../../controlador/fachada.php", {
            clase: clase,
            oper: oper
        }, function(data) {
            if (data !== 0) {
                callback(data);
            }else {
                alert('error al enviar Evaluación');
            }
        }, "json");
    }

    function obtenerColumnas(informacion){
        var columnas = [];
        for (var clave in informacion[0]){
            columnas.push({"title":clave});
        }
        return columnas;
    }

    /*function obtenerDataSet(informacion,clase){
        //alert(JSON.stringify(informacion));
        var dataSet = [];
        var x = 0;
        informacion.forEach(function(registro){
            var fila = [];
            //console.log(registro);
            for(var key in registro) {
                var value = registro[key]!=''?registro[key]:86;
                
                    fila.push('<input type="text"  data-type="'+clase+'" class="data data'+x+'" id="row-1-age" name="row-1-age" value="'+value+'" data-modified="false">');                    
                
            }
            dataSet.push(fila);            
            x = x+1;

        });
        return dataSet;
    }*/

    function obtenerDataSet(informacion,clase){
        var dataSet = [];
        var f = 0;
        informacion.forEach(function(registro){
           // console.log(JSON.stringify(registro));
           var fila = [];
           var c = 0;
           for(var key in registro) {
                //console.log(key);
                //console.log(f);
                //console.log(c);
                var value = registro[key];
                //console.log(value);
                switch (c) {
                    case 0:
                    fila.push('<input type="text" disabled data-type="'+clase+'" class="data data'+f+'" value="'+value+'" data-modified="false">');
                    break;
                    case 4:
                    fila.push(crearSelect(clase,f,c,identificacion,value));
                    break;
                    case 6:
                    fila.push(crearSelect(clase,f,c,ciudades,value));
                    break;
                    case 9:
                    fila.push('<input type="date"  data-type="'+clase+'" class="data data'+f+'" value="'+value+'" data-modified="false">');
                    break;
                    case 10:
                    var sexo = [];
                    sexo.push(new Array(9,'Masculino'));
                    sexo.push(new Array(10,'Femenino'));
                    fila.push(crearSelect(clase,f,c,sexo,value));
                    break;
                    case 11:
                    fila.push(crearSelect(clase,f,c,estadocivil,value));
                    break;
                    case 12:
                    fila.push(crearSelect(clase,f,c,grado,value));
                    break;
                    case 18:
                    fila.push(crearSelect(clase,f,c,localidades,value));
                    break;
                    case 19:
                    fila.push(crearSelect(clase,f,c,ciudades,value));
                    break;
                    default:
                    fila.push('<input type="text"  data-type="'+clase+'" class="data data'+f+'" value="'+value+'" data-modified="false">');
                    break;
                }
                c = c + 1;
            }
            f = f + 1; 
            dataSet.push(fila);            
            

        });
        return dataSet;
    }

    function inicializarDataTable(dataSet,columnas){
        if(typeof tabla !== "undefined"){
            tabla.destroy();
            $('#tablaCRUD').empty();
        }
        tabla = $("#tablaCRUD").DataTable( {
            "data": dataSet,
            "columns" : columnas,
            "order": [[ 0, "desc" ]],
            "paging":   false,
            "info":     false,
            "scrollY": "303px",
            "scrollX": true,
            "columnDefs": [{ className: "hide_column", "targets": [ 0,2,3 ] }],
            "scrollCollapse": true,
            "language": {
             "sSearch": "Filtrar:",
             "zeroRecords": "Ningún resultado encontrado",
             "infoEmpty": "No hay registros disponibles",
             "Search:": "Filtrar"
         },
         "initComplete": function(settiings, json){
            dataChange();
        }
    });



        $('#tablaCRUD tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
                
            }else {
                tabla.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        } );

        $('#eliminar').click( function () {
            var row = tabla.row('.selected').data();
            var string = '<div>'+row[0]+'</div>';
            var object = $('<div/>').html(string).contents();
            eliminar.push(object.find('input').val());
            console.log(eliminar);
            console.log(eliminar.length);
            tabla.row('.selected').remove().draw( false );
            
            
        } );

        $('#actualizar').click( function () {
            var numRegistros = parseInt($("#tablaCRUD > tbody").children().length);
            var oper;
            var clase;
            var datos = [];
            var tmp = [];
            for(var x = 0; x < numRegistros ; x++){
                guardar = false;
                $('.data'+x).each(function(){
                    if($(this).attr('data-modified') == 'true'){
                        guardar = true;
                    }
                    tmp.push($(this).val());
                });
                if (guardar == true){
                    datos.push(tmp);
                    clase = $(".data"+x).attr("data-type");
                }
                tmp = [];
                $('.data'+x).each(function(){
                    $(this).attr('data-modified','false');
                });
            }
            if(datos.length != 0 || eliminar.length != 0){
                /*switch (clase) {
                    case 'clsDocente':
                        oper = 'ActualizarDocentes';
                        break;

                    case 'clsProgramacion':
                        oper = 'ActualizarProgramaciones';
                        break;

                    case 'clsNovedad':
                        oper = 'ActualizarNovedades';
                        break;

                    case 'clsMatricula':
                        oper = 'ActualizarMatriculas';
                        break;

                    case 'clsCurso':
                        oper = 'ActualizarCursos';
                        break;

                    case 'clsModulo':
                        oper = 'ActualizarModulos';
                        break;

                    default:
                        break;
                    }*/

                    $.ajax({
                        url: '../../controlador/fachada.php',
                        type: 'POST',
                        async : true,
                        dataType: 'json',
                        data: {
                            clase: 'clsTercero',
                            oper : 'guardarTercero',
                            clasesw : 'clsDocente',
                            datos: datos,
                            eliminar : eliminar
                        },
                    }).done(function(data) {
                    //alert(data);
                    swal({title: "Actualizado Correctamente",   
                        timer : 1500,
                        showConfirmButton: false
                    });
                });
                    eliminar = [];
                }

        }); //Fin actualizar


        $('#agregar').on( 'click', function () {
            var fila=[];
            var f = parseInt($("#tablaCRUD > tbody").children().length);
            for (var c = 0; c < columnas.length; c++) {
                switch (c) {
                    case 0:
                    fila.push('<input type="text" disabled data-type="'+clase+'" class="hide_column data data'+f+'" value="" data-modified="false">');
                    break;
                    case 4:
                    fila.push(crearSelect(clase,f,c,identificacion));
                    break;
                    case 6:
                    fila.push(crearSelect(clase,f,c,ciudades));
                    break;
                    case 9:
                    fila.push('<input type="date"  data-type="'+clase+'" class="data data'+f+'" value="2000-01-01" data-modified="false">');
                    break;
                    case 10:
                    var sexo = [];
                    sexo.push(new Array(9,'Masculino'));
                    sexo.push(new Array(10,'Femenino'));
                    fila.push(crearSelect(clase,f,c,sexo));
                    break;
                    case 11:
                    fila.push(crearSelect(clase,f,c,estadocivil));
                    break;
                    case 12:
                    fila.push(crearSelect(clase,f,c,grado));
                    break;
                    case 18:
                    fila.push(crearSelect(clase,f,c,localidades));
                    break;
                    case 19:
                    fila.push(crearSelect(clase,f,c,ciudades));
                    break;
                    default:
                    fila.push('<input type="text"  data-type="'+clase+'" class="data data'+f+'" value="" data-modified="false">');
                    break;
                }
            }
            tabla.row.add(fila).draw(false);
            var $scrollBody = $(tabla.table().node()).parent();
            $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);
            dataChange();
        });

        function dataChange(){
            $('.data').on('change',function(){
                $(this).attr('data-modified','true');
            });    
        }
    }
    
    $("#tablas").change(function(){
        var tabla = $(this).val();
        mostrarCRUD(tabla);
    });



});