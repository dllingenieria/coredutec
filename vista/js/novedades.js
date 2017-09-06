$(document).ready(function() {
    var pre_id = '';
    var arr = [];
    var hin_id, hfi_id = 999;
    var nombreSoporte = '';
    var tablaNovedades;
	var tablaCarga;
    var matriculaSeleccionada=false;
    $.cookie("ter_id",'');
    var IdTercero;
    var IdMatricula=0;
    var IdCurso;
    var IdModulo;
    var pIdPreprogramacionAnterior;
    var pIdPreprogramacionNueva;
    limpiarCampos();
    cargarTiposNovedades();
    consultarEstados();
	$('#btnConsultar').hide();
    $('#btnCancelar').hide();
    $('#btnGuardar').hide();
    $('#btnAnularMatricula').hide();
        
    //Declaración de funciones para los elementos del DOM
    
   $('input[id=txtCedula]').change(function() { 
        $("#txtNombreCompleto").val('');
            consultarTercero();
			//se oculta tablaCarga
			//$('#tablaCarga').hide();
			
            if($('#cmbTipoDeNovedad').val()==147){
                consultarCursos();
                $('#derecha').show();
            }
            else if($('#cmbTipoDeNovedad').val()==146){
                $('#divNuevoEstado').show();
            }    
            else if($('#cmbTipoDeNovedad').val()==205){
                consultarMatriculas();
                $('#derecha').show();
            } 
			 

    });


    $('#cmbTipoDeNovedad').change(function() {
        $('#lbTipoNovedad').hide();
        $('#div_est').show();
        $('#btnConsultar').show();
        $('#btnCancelar').show();
        deshabilitarTipoNovedadSoporte();
		
    });


    $('#cmbNuevoEstado').change(function() { 
        if($("#cmbNuevoEstado option:selected").text()!='Seleccione...'){
            $('#btnGuardar').show();
         }
        else
            $('#btnGuardar').hide();
    });

   $('#cmbMatriculadoEnNuevo').change(function() {
       if($("#cmbMatriculadoEnNuevo option:selected").text()!='Seleccione...'){
            $('#btnGuardar').show();
        }
        else
            $('#btnGuardar').hide();
    });
    
    $('#btnCargarDoc').change(function() {
        guardarArchivo();
     });
    
    $("#btnConsultar").click(function() {        
        consultarTercero();
        if($('#cmbTipoDeNovedad').val()==147){
            consultarCursos();
            $('#derecha').show();
        }    
        else if($('#cmbTipoDeNovedad').val()==146){
            $('#divNuevoEstado').show();
        }
        else if($('#cmbTipoDeNovedad').val()==205){
             consultarMatriculas();
            $('#derecha').show();
            } 
		// else if($('#cmbTipoDeNovedad').val()==216 && $('#txtCedula').val() !=""){
		else if($('#cmbTipoDeNovedad').val()==216){ 
			 consultarCargasPorTercero();
			 $('#derecha').hide();
			 $('#derecha1').show();
            } 
    });

    $("#btnCancelar").click(function() { 
        window.location.href = "novedades.html";
    });

    $("#btnGuardar").click(function() {
        if($("#cmbTipoDeNovedad option:selected").val()==146){
            cambiarEstado();
        }
        else if($("#cmbTipoDeNovedad option:selected").val()==147){
            if($("#cmbMatriculadoEnNuevo option:selected").val()!=''){
               IdPreprogramacionNueva=$("#cmbMatriculadoEnNuevo option:selected").val();
                cambiarCurso(IdMatricula,IdPreprogramacionNueva);
               modificarCantidadEstudiantesCurso(IdPreprogramacionNueva,pIdPreprogramacionAnterior);
               limpiarCampos();
             }
            else{
                PopUpError("Seleccione en donde desea matricular el estudiante");
            }
                
        }
    });  

    $("#btnAnularMatricula").click(function() { 
        anularMatricula();
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

function cargarTiposNovedades() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'consultarTiposNovedades'
        }, function(data) {
            if (data !== 0) { 
                setParametroPorDefecto("#cmbTipoDeNovedad", '', "Seleccione...");
                formarOptionValueTipoNovedades(data);
            }
        }, "json");
    }
 
function anularMatricula() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'anularMatricula',
            pIdMatricula: IdMatricula,
        }, function(data) {
            if (data == 1) {
                PopUpConfirmacion("Anulación de matricula exitosa");
                limpiarCampos();
            }
            else{
                PopUpError("No se puedo hacer la eliminación de matricula");
                window.location.href = "novedades.html";
            }
        }, "json");
}


function cambiarCurso(IdMatricula,IdPreprogramacionNueva) {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'cambiarCurso',
            pIdMatricula: IdMatricula,
            pIdPreprogramacion:IdPreprogramacionNueva
        }, function(data) {
            if (data == 1) {
                PopUpConfirmacion("Cambio de curso exitoso");
                consultarCursos();
            }
            else{
                PopUpError("No se puedo hacer el cambio de curso");
                window.location.href = "novedades.html";
            }
        }, "json");
    }

function modificarCantidadEstudiantesCurso(IdPreprogramacionNueva,IdPreprogramacionAnterior) {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'modificarCantidadEstudiantesCurso',
            pIdPreprogramacionNueva: IdPreprogramacionNueva,
            pIdPreprogramacionAnterior:IdPreprogramacionAnterior
        });
    }

function consultarMatriculas(){
        $.post("../../controlador/fachada.php", {
                clase: 'clsNovedades',
                oper: 'consultarMatriculasOferente',
                pIdTercero: IdTercero,
            }, function(data) {
                inicializarTablaMatriculas(data);       
            }, "json");
    }


function inicializarTablaMatriculas(dataS){
        if(typeof tablaNovedades !== "undefined"){
            tablaNovedades.destroy();
            $('#tablaNovedades').empty();
        }
        tablaNovedades = $('#tablaNovedades').DataTable({
            "data" : dataS,
            "columns": [
            { title: "IdMatricula" },
            { title: "Oferente" },
            { title: "Curso" },
            { title: "Modulo" },
            { title: "Salón" }
            ],
            "paging":   false,
            "info":     false,
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "columnDefs": [
                            //{"targets": [ 0 ],"visible": false,"searchable": false}
                            ],
            "language": {
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            }}); 
            $('#tablaNovedades tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected')) {
                $(this).removeClass('selected');
                 $('#btnAnularMatricula').hide();
            }else{
                tablaNovedades.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                IdMatricula=tablaNovedades.row(this).data()[0];
                 $('#btnAnularMatricula').show();
            }

        } );

    }     

function consultarCursos(){
        $.post("../../controlador/fachada.php", {
                clase: 'clsNovedades',
                oper: 'consultarCursosPorTercero',
                pIdTercero: IdTercero,
            }, function(data) {
                inicializarTablaNovedades(data);       
            }, "json");
    }

function inicializarTablaNovedades(dataS){
        if(typeof tablaNovedades !== "undefined"){
 			tablaNovedades.destroy();
 			$('#tablaNovedades').empty();
 		}
        tablaNovedades = $('#tablaNovedades').DataTable({
            "data" : dataS,
            "columns": [
            { title: "Id Matricula" },
            { title: "Salón" },
            { title: "Curso" },
            { title: "Nombre Curso" },
            { title: "Modulo" },
            { title: "Nombre Modulo" },
            { title: "Id Curso" },
            { title: "Id Modulo" },
            { title: "Id Preprogramacion" }
            ],
            "paging":   false,
            "info":     false,
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "columnDefs": [
                            {"targets": [ 0 ],"visible": false,"searchable": false},
                            {"targets": [ 6 ],"visible": false,"searchable": false},
                            {"targets": [ 2 ],"visible": false,"searchable": false},
                            {"targets": [ 7 ],"visible": false,"searchable": false},
                            {"targets": [ 8 ],"visible": false,"searchable": false}
                            ],
            "language": {
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            }}); 
            $('#tablaNovedades tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected')) {
                $(this).removeClass('selected');
                deshabilitarNovedades();
                 $('#btnGuardar').hide();
            }else{
                tablaNovedades.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                IdMatricula=tablaNovedades.row(this).data()[0];
                IdCurso=tablaNovedades.row(this).data()[6];
                IdModulo= tablaNovedades.row(this).data()[7];
                pIdPreprogramacionAnterior=tablaNovedades.row(this).data()[8];
                 cargarNuevosCursos();
                 $('#div_cc').show();
            }

        } );

    }
    
function habilitarTipoNovedadSoporte(){
        $("#lblTipoDeNovedad").show();
        $("#cmbTipoDeNovedad").show();

    }

function deshabilitarTipoNovedadSoporte(){
        $("#lblTipoDeNovedad").hide();
        $("#cmbTipoDeNovedad").hide();
    }

function deshabilitarNovedades(){
        $('#div_ces').hide();
        $('#div_cc').hide();
        $('#div_rea').hide();
        $('#div_as').hide();
    }  

function cargarNuevosCursos() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'consultarNuevosCursos',
            IdCurso:IdCurso,
            IdModulo:IdModulo
        }, function(data) {
            if (data !== 0) {
                formarOptionValueMatriculasPre(data);
            }
        }, "json");
    }

       
function limpiarCampos(){
         $("#txtCedula").val('');
         $("#txtNombreCompleto").val('');
         $('#derecha').hide();
         $('#div_cc').hide();
         $('#btnGuardar').hide();
         $('#divNuevoEstado').hide();
         $('#btnAnularMatricula').hide();
		 $('#derecha1').hide();
    }
    
   

  

function formarOptionValueMatriculasPre(matriculas) {
        $('#cmbMatriculadoEnNuevo').find('option').remove();
        setTimeout(function() {
            setParametroPorDefecto("#cmbMatriculadoEnNuevo", '', 'Seleccione...');
            for (i = 0; i < matriculas.length; i++) {
                $('#cmbMatriculadoEnNuevo').append($('<option>', {
                    value: matriculas[i].Id,
                    text: matriculas[i].Salon+" - "+matriculas[i].Curso+" - "+matriculas[i].Modulo
                }));           
            }
        }, 800);

    }
    
function formarOptionValueTipoNovedades(tiposNovedades) { 
        for (i = 0; i < tiposNovedades.length; i++) { 
            $('#cmbTipoDeNovedad').append($('<option>', {
				value: tiposNovedades[i][0],
                text: tiposNovedades[i][1]
            }));
        }
    }



    
function setParametroPorDefecto(atributo, valor, texto) {
        $(atributo).append($('<option>', {
            value: valor,
            text: texto
        }));
    }


function consultarEstados() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'consultarEstados'
        }, function(data) {
            if (data !== 0) {
                
                formarOptionValueNuevoEstado(data);
            }
        },"json");
    }

function formarOptionValueNuevoEstado(nuevoEstado) {
        $('#cmbNuevoEstado').find('option').remove();
        setParametroPorDefecto("#cmbNuevoEstado", '', 'Seleccione...');
        for (i = 0; i < nuevoEstado.length; i++) {
            $('#cmbNuevoEstado').append($('<option>', {
                value: nuevoEstado[i].Id,
                text: nuevoEstado[i].Nombre
            }));
        }
 }


function cambiarEstado() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'cambiarEstado',
            pIdTercero: IdTercero,
            pEstado: $("#cmbNuevoEstado option:selected").val()
        }, function(data) {
            if (data == 1) {
                PopUpConfirmacion("Cambio de estado exitoso");
                limpiarCampos();
            }
            else{
                PopUpError("No se pudo hacer el cambio de estado");
                setTimeout(function() {
				window.location.href = "novedades.html";
				}, 2000);	
            }
        }, "json");
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

function consultarCargasPorTercero(){
	
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	$.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'consultarCargasPorTercero',
            IdTercero: IdTercero
        }, function(data) {
            if (data != 0) {
				
                cargarInformacionEnTabla(data);
				//PopUpConfirmacion("Cambio de estado exitoso");
            }
            else{
                //PopUpError("No se encontraron cargas para los datos ingresados");
                cargarInformacionEnTabla(data);
				jsRemoveWindowLoad();
				//window.location.href = "novedades.html";
            }
        }, "json");
}
 

function cargarInformacionEnTabla(data){ 
      if(typeof tablaCarga !== "undefined"){
            tablaCarga.destroy();
            $('#tablaCarga').empty();
        }
	  
	  jsRemoveWindowLoad();
	  
        tablaCarga = $('#tablaCarga').DataTable({
            "data": data,
            columns: [
			{ title: "Id" }, 
			{ title: "Fecha Asignación" }, 
            { title: "Agencia" },
            { title: "Convocatoria" },
            { title: "Ruta" }, 
			{ title: "Curso" }, 
			{ title: "Módulo" }, 
            { title: "Estado Participante" }],
            "paging":   true,
            "info":     false,
            "order": [[ 3, "desc" ]],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
            "columnDefs": [
            {"targets": [ 0 ],"visible": false,"searchable": false} ],
            "language": {
				 "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
                "sSearch": "Filtrar:",
                "zeroRecords": "Ningún resultado encontrado",
                "infoEmpty": "No hay registros disponibles",
                "Search:": "Filtrar"
            }
        });
        $('#tablaCarga tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { 
                $(this).removeClass('selected');
				 
            }else{ 
                tablaCarga.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
					
            }
			nombreCurso=tablaCarga.row(this).data()[5];
			eliminarCargaPorId(tablaCarga.row(this).data()[0])
			 
        } );
    }


function eliminarCargaPorId(IdCarga){
	
	
	var cerrar =confirm("Realmente desea eliminar la carga "+nombreCurso+" de la base de datos ?");
	if(cerrar){
		$.post("../../controlador/fachada.php", {
            clase: 'clsNovedades',
            oper: 'eliminarCargaPorId',
            IdCarga: IdCarga
        }, function(data) {
            if (data != 0) {
				PopUpConfirmacion("Se ha eliminado la carga exitosamente");
				//volver a mostrar el datatable
				consultarCargasPorTercero();
            }
            else{
                PopUpError("No se pudo eliminar la carga");
                window.location.href = "novedades.html";
            }
        }, "json");
	}
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

function utf8_encode (argString) { // eslint-disable-line camelcase
  //  discuss at: http://locutus.io/php/utf8_encode/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Kevin van Zonneveld (http://kvz.io)
  // improved by: sowberry
  // improved by: Jack
  // improved by: Yves Sucaet
  // improved by: kirilloid
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
  // bugfixed by: Ulrich
  // bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: kirilloid
  //   example 1: utf8_encode('Kevin van Zonneveld')
  //   returns 1: 'Kevin van Zonneveld'

  if (argString === null || typeof argString === 'undefined') {
    return ''
  }

  // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var string = (argString + '')
  var utftext = ''
  var start
  var end
  var stringl = 0

  start = end = 0
  stringl = string.length
  for (var n = 0; n < stringl; n++) {
    var c1 = string.charCodeAt(n)
    var enc = null

    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode(
        (c1 >> 6) | 192, (c1 & 63) | 128
      )
    } else if ((c1 & 0xF800) !== 0xD800) {
      enc = String.fromCharCode(
        (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    } else {
      // surrogate pairs
      if ((c1 & 0xFC00) !== 0xD800) {
        throw new RangeError('Unmatched trail surrogate at ' + n)
      }
      var c2 = string.charCodeAt(++n)
      if ((c2 & 0xFC00) !== 0xDC00) {
        throw new RangeError('Unmatched lead surrogate at ' + (n - 1))
      }
      c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000
      enc = String.fromCharCode(
        (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.slice(start, stringl)
  }

  return utftext
}
});










































