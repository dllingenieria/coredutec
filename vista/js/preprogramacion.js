/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

 var pre_id,cod_mod_aux = '';
 var arr = [];
 var hin_id, hfi_id = 999;
 var modo_modificar = false;
 $(document).ready(function() {
	matriculaExistente = false;
	
	 Array.prototype.unique=function(a){
			 return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
		 });
		 
    ObtSesion();
    $("#txtCodigoMatricula").val("");
    $.cookie("pre_id", 1);
    calendarioEspanol();
    CargarConvocatoria();
    CargarRutas();
    // CargarDocentes();
    CargarSedes();
    CargarModalidades();
    CargarEntregables();
    CargarDiasCurso();
    cargarHorarios();
    CargarEstados();
    CargarTipoCertificacion();
    SetParametroCursoPorDefecto("#tiposdeservicio2", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbRutaDeFormacion", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbCurso", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbDiasDelCurso", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbHoraInicio", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbHoraFinal", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbModulo", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbSede", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#docente2", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbEntregables", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#estado2", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#participantes2", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#cmbTipoDeCertificacion", '', 'Seleccione...');
    setTimeout( mostrarPopUpPregunta(),1000);
});

 $(function(){
    $("#btnMatNue").click(function(){
     //cargarUltimaMatricula();
 });
    $("#btnMatExi").click(function(){
		matriculaExistente = true;
        cargarMatriculaExistente();
    });
})

// $('#cmbModulo').change(function() { alert("ddd");
			   // });

 function cargarMatriculaExistente(){
    var cod_mat_aux = prompt("Ingrese codigo matricula ", "");
    if (cod_mat_aux != null) {
        consultarMatricula(cod_mat_aux);
    }
}


function consultarMatricula(mat){  
    var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
	modo_modificar === false;
	$.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'consultarMatriculaPorCodigo',
        mat_cod : mat
    }, function(data) { //alert("entro1");
	
		if (data != null){
			$("#cmbConvocatorias").val(data[0].TipoConvocatoria);
			$("#txtCodigoMatricula").val(data[0].Matricula);
			//$('#tiposdeservicio2 option[value='+data[0].tip_ser+']').attr('selected','selected');
			$('#cmbRutaDeFormacion option[value='+data[0].Ruta+']').attr('selected','selected');  
			// console.log("consultarMatricula");   
			// console.log(consultarMatricula);   
			// console.log("$(#cmbRutaDeFormacion).val()");   
			// console.log($("#cmbRutaDeFormacion").val());   
			CargarCursosPorRuta($("#cmbRutaDeFormacion").val());
			$("#txtDuracionDelCurso").val(data[0].DiasCurso);
          
			
            //setTimeout(function() {
			 
				//CargarDatosCursoPorCodigoB(data[0].Curso,data);
			//}, 1500);
			//para llenar la duracion del curso
            setTimeout(function() {
                $('#cmbCurso option[value="'+data[0].Curso+'"]').attr('selected','selected');  
			     CargarDatosCursoPorCodigo(data[0].Curso)
            }, 1500);
		    $('#cmbDiasDelCurso option[value='+data[0].DiasCurso+']').attr('selected','selected');   


			//$('#cmbDiasDelCurso option[value='+data[0].DiasCurso+']').attr('selected','selected'); 
			$('#cmbHoraInicio option[value='+data[0].HoraInicial+']').attr('selected','selected'); 
			$('#cmbHoraFinal option[value='+data[0].HoraFinal+']').attr('selected','selected'); 
			//$('#txtFechaInicio').val(data[0].FechaInicial); 
			//$('#txtFechaFinal').val(data[0].FechaFinal); 
			$('#cmbSede option[value='+data[0].Sede+']').attr('selected','selected'); 
			$('#cmbDocente option[value='+data[0].Docente+']').attr('selected','selected');   
			$('#cmbEntregables option[value='+data[0].Entregables+']').attr('selected','selected'); 
			
			/*setTimeout(function() { //no se usa
				setModuloCurso(data[0].Modulo); //recorre las opciones del modulo y selecciona la del id modulo
			}, 2000);*/
			//para llenar el select de modulos
			//alert(data.length);
			var modulo = [];
			for (i=0;i<=(data.length-1);i++){
				//alert(i);
				modulo[i] = data[i].Modulo;
			}
			
			modulo.unique();
			
			//se muestran todas las opciones de los modulos
			if (data[0].Modulo !== '') { 
				setTimeout(function() {
					obtenerModulo(data[0].Modulo); //recorre opciones del modulo y selecciona la del id modulo
				}, 4000); //llena txtDuracionModulo
			}
			
			//------------ //ocultar opciones de los modulos que ya tienen preprogramacion en esa matricula
			
           /* setTimeout(function() {
				   var opciones = [];
				   var cont=0;
				   var aux_nom = ''; 
					$("#cmbModulo option").each(function() { 
					
						//se quita la opcion selected
						this.selected = false;
						aux_nom = $(this).attr('value').split('$$'); //value del modulo 
						
						var a = modulo.indexOf(aux_nom[0]); //alert(aux_nom[0]);
						if (a >= 0) { 
				
							//$("#cmbModulo option option[value^=" + aux_nom[0] + "]").hide();  //$("[title^='Tom']")  
							$("#cmbModulo option[value^='" + aux_nom[0] + "'']").hide();  //$("[title^='Tom']")  
							//se oculta la opcion que esta en el array modulo porque ya tiene preprogramacion en esa matricula
							$( this ).hide();
							 
						} 
						//se llena un array con los valores de las opciones para saber si es solo una y el value es vacio solo con elementos visibles
							if( $(this).is(":visible") ){  //alert(cont+"cont");
							//if( $(this).css('display') == '' ){  alert(cont);
								opciones[cont] = $(this).attr('value'); 
								cont++;	
							}
						
					});
						//alert(opciones.length+"posiciones"); //alert(opciones+"total");
						if(opciones.length == 1 && opciones[0] == "" ){ 
							mostrarPopUpError("No existen mas módulos para asignar");
							//se recarga la pagina
							setTimeout(function() {
								location.reload(true);
							}, 3000);
						}
					
						
				}, 4000);*/
			
			//------------
			
           
			
		
			
			$('#cmbModalidadMatricula option[value='+data[0].Modalidad+']').attr('selected','selected');
			$('#cmbTipoDeCertificacion option[value='+data[0].Certificacion+']').attr('selected','selected');
			//$('#cmbEstado option[value='+data[0].Estado+']').attr('selected','selected');
			//$('#cmbEstado option[value=1]').attr('selected','selected');
		}
		else{
			mostrarPopUpError("No se encontro la preprogramación o verifique el estado");
			jsRemoveWindowLoad();	
		}
        
		
		  jsRemoveWindowLoad();
		
    }, "json");
}

	
  
/*
function consultarMatricula(mat){
    $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'consultarMatriculaPorCodigo',
        mat_cod : mat
    }, function(data) {
        $("#txtCodigoMatricula").val(data[0].cod_mat);
        $('#tiposdeservicio2 option[value='+data[0].tip_ser+']').attr('selected','selected');
        $('#cmbRutaDeFormacion option[value='+data[0].id_rut+']').attr('selected','selected');  
        // console.log("consultarMatricula");   
        // console.log(consultarMatricula);   
        // console.log("$(#cmbRutaDeFormacion).val()");   
        // console.log($("#cmbRutaDeFormacion").val());   
        CargarCursosPorRuta($("#cmbRutaDeFormacion").val());
        setTimeout(function() {
            $('#cmbCurso option[value="'+data[0].cod_cur+'"]').attr('selected','selected');    
            cargarDatosCursoPorCodigoB(data[0].cod_cur,data);
        }, 1500);
        $('#cmbDiasDelCurso option[value='+data[0].dia_cur+']').attr('selected','selected'); 
        $('#cmbHoraInicio option[value='+data[0].hra_ini+']').attr('selected','selected'); 
        $('#cmbHoraFinal option[value='+data[0].hra_fin+']').attr('selected','selected'); 
        $('#txtFechaInicio').val(data[0].fec_ini); 
        $('#txtFechaFinal').val(data[0].fec_fin); 
        $('#cmbSede option[value='+data[0].id_sed+']').attr('selected','selected'); 
        $('#docente2 option[value='+data[0].id_doc+']').attr('selected','selected');   $('#estado2 option[value='+data[0].pre_est+']').attr('selected','selected'); 
        $('#cmbEntregables option[value='+data[0].ent_pro+']').attr('selected','selected'); 
        setTimeout(function() {
            setModuloCurso(data[0].cod_mod);
        }, 2000);
    }, "json");
}

*/

 
 function setModuloCurso(cod_mod){ 
    $("#cmbModulo option").each(function(){
     var aux_cod = $(this).attr('value').split("$$");
     if(aux_cod[0] === cod_mod){
         $('#cmbModulo option[value='+$(this).attr('value')+']').attr('selected','selected'); 
     }
 });
}

function removerModulosMatriculados(data){
    setInterval(function(){
        for (i = 0; i < data.length; i++) {
            if(data[i].cod_mod !== null){
                removerModulo(data[i].cod_mod);
            }
        }
    }
    ,200);
}

function removerModulo(cod){
    $("#cmbModulo option").each(function(){
     var aux_cod = $(this).attr('value').split("$$");
     if(aux_cod[0] === cod && aux_cod[0] !== ''){
         $("#cmbModulo option[value='"+$(this).attr('value')+"'").remove();
     }
 });
}

function cargarUltimaMatricula() {
	//$('#cmbEstado option[value=1]').attr('selected','selected');
   
   $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'obtenerUltimaMatricula'
    }, function(data) {
        if (data[0].MatriculaNumero > 0 ) {
            pre_id = parseInt(data[0].MatriculaNumero) + 1;
            $.cookie("pre_id", pre_id);            
        }
        else  {
         pre_id = 1;
         $.cookie("pre_id", pre_id);
     }        
 }, "json");
}
function guardarPreprogramacion() {
    var val_cam = validarCamposFormulario();
    if (val_cam.length === 0) {
        if (validarFechas()) {
			$('#btnGuardar').attr("disabled", true);
            $.post("../../controlador/fachada.php", {
                clase: 'clsProgramacion',
                oper: 'AgregarPreprogramacion',
                cod_mat: $("#txtCodigoMatricula").val(),
                cod_sal: $("#txtCodigoMatricula").val()+'.'+cod_mod_aux,
                tip_ser: $("#cmbConvocatorias").val(),
                rut_for: $("#cmbRutaDeFormacion").val(),
                cur_cod: $("#cmbCurso").val(),
                cur_dia: $("#cmbDiasDelCurso").val(),
                hra_ini: $("#cmbHoraInicio").val(),
                hra_fin: $("#cmbHoraFinal").val(),
                cod_mod: obtenerCodigoModulo($("#cmbModulo").val()),
                mod_pre : $("#cmbModalidadMatricula").val(),
                dur_mod: $("#txtDuracionModulo").val(),
                id_sed: $("#cmbSede").val(),
                fec_ini: $("#txtFechaInicio").val(),
                fec_fin: $("#txtFechaFinal").val(),
                pro_ent: $("#cmbEntregables").val(),
                id_doc: $("#cmbDocente").val(),
                tip_cer: $("#cmbTipoDeCertificacion").val(),
                pre_est : $("#cmbEstado").val(),
                //mat_num : $.cookie("pre_id"),
				matriculaExistente: matriculaExistente
            }, function(data) {
                if (data === 1) {
                    //alert($("#txtCodigoMatricula").val() + " guardado satisfactoriamente.");
                    setTimeout(function() {
                        location.reload(true);
                    }, 2000); 
                    popUpConfirmacion("Guardado"); 
					$('#btnGuardar').attr("disabled", false);
                } else {
					setTimeout(function() {
                        location.reload(true);
                    }, 3000); 
                    mostrarPopUpError("Su registro no pudo guardarse, posiblemente esta repetido o verifique su conexión y vuelva a intentarlo");
                }
            }, "json");  
        }
    } else {
        mostrarPopUpError('Faltan algun(os) campos obligatorios por llenar.');
    }
}



function modificarPreprogramacion() {           
    var val_cam = validarCamposFormulario();
    if (val_cam.length === 0) {
        if (validarFechas()) {
            console.log("DEBUGING");
            $.post("../../controlador/fachada.php", {
                clase: 'clsProgramacion',
                oper: 'ActualizarPreprogramacion',
                pre_id: $("#pre_id").val(),
                tip_ser: $("#cmbConvocatorias").val(),
                rut_for: $("#cmbRutaDeFormacion").val(),
                cur_cod: $("#cmbCurso").val(),
                cur_dia: $("#cmbDiasDelCurso").val(),
                hra_ini: $("#cmbHoraInicio").val(),
                hra_fin: $("#cmbHoraFinal").val(),
                cod_mod: obtenerCodigoModulo($("#cmbModulo").val()),
                mod_pre : $("#cmbModalidadMatricula").val(),
                id_sed: $("#cmbSede").val(),
                id_doc: $("#cmbDocente").val(),
                fec_ini: $("#txtFechaInicio").val(),
                fec_fin: $("#txtFechaFinal").val(),
                pro_ent: $("#cmbEntregables").val(),
                ///pro_par: $("#participantes2").val(),
                tip_cer: $("#cmbTipoDeCertificacion").val(),
                pre_est : $("#cmbEstado").val()
            }, function(data) {
                console.log("DEBUGING DATA");
                console.log(data);
                if (data === 1) {
                    popUpConfirmacion("Modificado");
                    setTimeout(function() {
                        location.reload(true);
                    }, 1500); 
                } else {
                    alert("Error modificarPreprogramacion.");
                }
            }, "json");
        }
    } else {
        mostrarPopUpError('Faltan algun(os) campos obligatorios por llenar.');
        
    }
}
function popUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function validarFechas() {
    var flag = true;
    var fec_ini = Date.parse($("#txtFechaInicio").val());
    var fec_fin = Date.parse($("#txtFechaFinal").val());
    if(!isNaN(fec_ini) && !isNaN(fec_fin)){
        if (fec_ini <= fec_fin) {
            flag = true;
        } else {
            flag = false;
            mostrarPopUpError("Fecha inicial mayor a fecha final ");
        }   
    }
    return flag;
}

$(function() {
    $("#txtFechaInicio").datepicker();
    $("#txtFechaFinal").datepicker();
    $("#btncapturar").click(function() {
        window.location = "../html/captura.html";
    });
    $("#btnConsultar").click(function() {
        cargarGridMatriculas();
		//se oculta el boton de guardar porque se va a mostrar el datatable
		$("#btnGuardar").css('display','none');
    });
    $("#btncancelarM").click(function() {
//        if (modo_modificar === true) {
//            eliminarPreprogramacion();
//        } else {
//        }
location.reload(true);
});
    $("#btnimprimir").click(function() {
//        window.location = "../html/busqueda.html";
});
    $("#btnGuardar").click(function() { 
        if (modo_modificar === false) {
            guardarPreprogramacion();
        } else {
            modificarPreprogramacion();
        }
    });

       $('#cmbEstado').change(function() {
            var valorNuevo=$("#cmbEstado").val();
            $("#cmbEstado option[value="+ valorNuevo +"]").attr("selected",true);
        });
		  

    $('#cmbRutaDeFormacion').change(function() {
        $('#cmbCurso').find('option').remove();
        $('#txtDuracionModulo').val("");
        $('#cmbCurso').find('option').remove();
        CargarCursosPorRuta($("#cmbRutaDeFormacion").val());
        SetParametroCursoPorDefecto("#cmbCurso", '', 'Seleccione...');
        $('#codigocmbModulo').val("");
        $('#duraciondelcurso2').val("");
        $('#estado2').val("");
    });
    $('#cmbCurso').change(function() {
        $('#txtDuracionModulo').val("");
        $('#cmbModulo').find('option').remove();
        CargarDatosCursoPorCodigo($(this).val());
    });
    $('#cmbHoraInicio').change(function() {
        hin_id = $(this).val();
        validarHoras(hin_id, hfi_id);
    });
    $('#cmbHoraFinal').change(function() {
        hfi_id = $(this).val();
        validarHoras(hin_id, hfi_id);
    });
    $('#txtFechaInicio').change(function() {
     validarFechas();
 });
    $('#txtFechaFinal').change(function() {
     validarFechas();
 });
    $('#cmbConvocatorias').change(function() { //arma el codigo de la matricula
	formarCodigoMatricula($("#cmbConvocatorias option:selected").val(),$("#cmbConvocatorias option:selected").text());
    });

    $('#cmbModulo').change(function() { 
		$('#cmbDocente').html('');
        var aux_dur = $(this).val().split("$$");
        $('#txtDuracionModulo').val(aux_dur[1]);
        guardarAuxCodigo(aux_dur[0]);
		if ($('#cmbModulo').val() == ""){ 
			$('#cmbDocente').html('');
		}
		else{ 
			CargarDocentes(); 
		}
		
    });
});

function guardarAuxCodigo(aux){
    var aux_cod = aux.split(".");
    total_array= (aux_cod.length)-1;
    cod_mod_aux = aux_cod[total_array];
    //console.log("cod_mod_aux"+cod_mod_aux);
}

function CargarCursosPorRuta(pIdRuta) {
    // console.log("pIdRuta");
    // console.log(pIdRuta);
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarCursosPorRuta',
        pIdRuta: pIdRuta
    }, function(data) {
        // console.log("pasa");
        // console.log(data);
        if (data !== 0) {
            FormarOptionValueCursos(data);
        }
        else {
            alert('error CargarCursosPorRuta');
        }
    }, "json");
}

function FormarOptionValueCursos(pCursos) {
    $('#cmbCurso').find('option').remove();
    SetParametroCursoPorDefecto("#cmbCurso", '', 'Seleccione...');
    for (i = 0; i < pCursos.length; i++) {
        $('#cmbCurso').append($('<option>', {
            value: pCursos[i].Codigo,
            text: pCursos[i].Nombre
        }))
    }
}

function CargarConvocatoria() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsConvocatoria',
        oper: 'ConsultarConvocatorias'
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueConvocatorias(data);
        }
        else {
            alert('error CargarConvocatoria');
        }
    }, "json");
}

function CargarEstados() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsMatricula',
        oper: 'CargarEstados'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueEstados(data);
        }
        else {
            alert('error CargarEstados');
        }
    }, "json");
}

function CargarSedes() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarSedes'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueSedes(data);
        }
        else {
            alert('error CargarSedes');
        }
    }, "json");
}



function CargarDiasCurso() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'consultarDiasCurso'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueDiasCurso(data);
        }
        else {
            alert('error CargarDiasCurso');
        }
    }, "json");
}

function formarOptionValueDocentes(docentes) {
    for (i = 0; i < docentes.length; i++) {
        $('#docente2').append($('<option>', {
            value: docentes[i].id,
            text: docentes[i].nombres_completos
        }));
    }
}

function formarOptionValueEstados(estados) {
   $('#cmbEstado').find('option').remove();
   SetParametroCursoPorDefecto("#cmbEstado", '', 'Seleccione...');
   for (i = 0; i < estados.length; i++) {
    $('#cmbEstado').append($('<option>', {
        value: estados[i].Id,
        text: estados[i].Nombre
    }));
}
}

function formarOptionValueSedes(sedes) {
    for (i = 0; i < sedes.length; i++) {
        $('#cmbSede').append($('<option>', {
            value: sedes[i].Id,
            text: sedes[i].Nombre
        }));
    }
}

function formarOptionValueDiasCurso(horarios) {
    for (i = 0; i < horarios.length; i++) {
        $('#cmbDiasDelCurso').append($('<option>', {
            value: horarios[i].Id,
            text: horarios[i].Nombre
        }));
    }
}

function CargarRutas() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarRutas'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueRutas(data);
        }
        else {
            alert('error CargarRutas');
        }
    }, "json");
}

function formarOptionValueRutas(pRutas) {
    $('#cmbRutaDeFormacion').find('option').remove();
    SetParametroCursoPorDefecto("#cmbRutaDeFormacion", '', 'Seleccione...');
    for (i = 0; i < pRutas.length; i++) {
        $('#cmbRutaDeFormacion').append($('<option>', {
            value: parseInt(pRutas[i].Id),
            text: pRutas[i].Nombre
        }));
    }
}

function formarOptionValueEntregables(entregables) {
    $('#cmbEntregables').find('option').remove();
    SetParametroCursoPorDefecto("#cmbEntregables", '', 'Seleccione...');
    for (i = 0; i < entregables.length; i++) {
        $('#cmbEntregables').append($('<option>', {
            value: entregables[i].Id,
            text: entregables[i].Nombre
        }));
    }
}

function FormarOptionValueConvocatorias(pConvocatorias) {
    $('#cmbConvocatorias').find('option').remove();
    SetParametroCursoPorDefecto("#cmbConvocatorias", '', 'Seleccione...');
    for (i = 0; i < pConvocatorias.length; i++) {
        $('#cmbConvocatorias').append($('<option>', {
            value: pConvocatorias[i].Id,
            text: pConvocatorias[i].Nombre
        }));
    }
}



function SetParametroCursoPorDefecto(atributo, valor, texto) {
    $(atributo).append($('<option>', {
        value: valor,
        text: texto
    }));
}


function CargarDatosCursoPorCodigo(pCodigoCurso) {
    $.getJSON("../../controlador/fachada.php", {
        format: 'json',
        clase: 'clsCurso',
        oper: 'CargarCursoPorCodigo',
        rut_cod: pCodigoCurso
    }).done(function(data){
        if (data !== 0) {
            $("#txtDuracionDelCurso").val(data[0].Duracion);
            if(matriculaExistente===true){
                    CargarModulosCursoModificar(pCodigoCurso);
            }else{
                    CargarModulosCurso(data[0].Id);   
            }
        }else{
             SetParametroCursoPorDefecto("#cmbModulo", '', 'No hay modulos disponibles...');
        }
    }).fail(function() {
        SetParametroCursoPorDefecto("#cmbModulo", '', 'No hay modulos disponibles...');
  });
}

function CargarDatosCursoPorCodigoB(cod_cur,data) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarCursoPorCodigo',
        rut_cod: cod_cur
    }, function(data) {
        if (data !== 0) {
             if(matriculaExistente===true){
                $("#duraciondelcurso2").val(data[0].Duracion);
                setTimeout(
                    CargarModulosCursoModificar(cod_cur)
                ,1000);
                SetParametroCursoPorDefecto("#cmbModulo", '', 'Seleccione...');
            }else{
                 $("#duraciondelcurso2").val(data[0].Duracion);
                 setTimeout(
                        CargarModulosCurso(data[0].Id)
                ,1000);  
                SetParametroCursoPorDefecto("#cmbModulo", '', 'Seleccione...');              
            }

          }
        else {
            alert('error CargarDatosCursoPorCodigoB');
        }
    }, "json");
    setTimeout(
        removerModulosMatriculados(data)
        ,1000);
}

function CargarModulosCurso(cur_id) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'ConsultarModulos',
        pIdCurso: cur_id
    }, function(data) {
        if (data !== 0) {
            formarOptionValueModulos(data);
        }
        else {
            alert('error CargarModulosCurso');
        }
    }, "json");
}

function CargarModulosCursoModificar(cur_id) {
    pIdMatricula = $("#txtCodigoMatricula").val();
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'ConsultarModulosSinPreprogramacion',
        pIdMatricula: pIdMatricula,
        pIdCurso: cur_id
    }, function(data) {
        if (data !== 0) {
            formarOptionValueModulos(data);
        }
        else {
                  mostrarPopUpError("No existen mas módulos para asignar");
                        //se recarga la pagina
                        setTimeout(function() {
                            location.reload(true);
                  }, 3000);

        }
    }, "json");
}

function CargarTipoCertificacion() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarTipoCertificacion'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueTipoCertificacion(data);
        }
        else {
            alert('error CargarTipoCertificacion');
        }
    }, "json");
}

function formarOptionValueModulos(modulos) {
    $('#txtDuracionModulo').val("");
    $('#cmbModulo').find('option').remove();
    SetParametroCursoPorDefecto("#cmbModulo", '', 'Seleccione...');
    if (modulos !== null) {
        for (i = 0; i < modulos.length; i++) {
            if (modulos[i].Codigo.length > 0) {            
                $('#cmbModulo').append($('<option>', {
                    value: modulos[i].Codigo + "$$" + modulos[i].Duracion,
                    text: modulos[i].Nombre
                }));
            }
        }
    } 
    flag_car_mod = true;
}

function formarOptionValueTipoCertificacion(tipos) {
   $('#cmbTipoDeCertificacion').find('option').remove();
   SetParametroCursoPorDefecto("#cmbTipoDeCertificacion", '', 'Seleccione...');
   for (i = 0; i < tipos.length; i++) {
       $('#cmbTipoDeCertificacion').append($('<option>', {
        value: tipos[i].Id,
        text: tipos[i].Nombre
    }));

   }
}

function cargarHorarios() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'cargarHoras'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueHorario(data);
        }
        else {
            alert('error cargarHorarios');
        }
    }, "json");
}

function formarOptionValueHorario(horarios) {
    for (i = 0; i < horarios.length; i++) {
        $('#cmbHoraInicio').append($('<option>', {
            value: horarios[i][0],
            text: horarios[i][1]
        }));
        $('#cmbHoraFinal').append($('<option>', {
            value: horarios[i][0],
            text: horarios[i][1]
        }));
    }
}

function formarCodigoMatricula(con_id, mat_nom) {
    var con_tmp = false;
    $.ajax({
        async:false,
        url : '../../controlador/fachada.php',
        type : 'POST',
        dataType : 'json',
        data : {
           clase : 'clsConvocatoria',
           oper : 'consultarSerialPorId',
           conId : con_id
        }
    }).done(function(data){
       con_tmp = data;
    });
    var mat_id = completarCodigoMatricula(con_tmp);
    var mat_com = 'FL' + obtenerNomMatricula(mat_nom) + mat_id;
    $("#txtCodigoMatricula").val(mat_com);
}

function completarCodigoMatricula(preid) {
    var aux = '';
    for (var i = (preid + '').length; i < 5; i++) {
        aux += '0';
    }
    return aux + '' + (preid + '');
}

function obtenerNomMatricula(nom_com) {
    var aux = nom_com.split('-');
    return aux[1];
}

function cambiarFormatoFecha(date) {
    var aux = date.split('/');
    var nue_fec = aux[2] + '-' + aux[0] + '-' + aux[1];
    return nue_fec;
}

function obtenerCodigoModulo(mod) {
    var aux = mod.split('$$');
    return aux[0];
}

function validarHoras(hin_id, hfi_id) {
    var flag = true;
    if (parseInt(hin_id) >= parseInt(hfi_id)) {
        flag = false;
        mostrarPopUpError("La hora inicial debe ser mayor \n a la hora final");
    }
    return flag;
}

function validarCamposFormulario() {
    var cam_vac = '';
    if ($("#cmbConvocatorias").val() === '') {
        cam_vac += 'Tipo de servicio ';
    }
    if ($("#cmbRutaDeFormacion").val() === '') {
        cam_vac += 'Ruta de formaciÃ³n ';
    }
    if ($("#cmbCurso").val() === '') {
        cam_vac += 'Curso ';
    }
    if ($("#cmbDiasDelCurso").val() === '') {
        cam_vac += 'Horario ';
    }
    if ($("#cmbHoraInicio").val() === '') {
        cam_vac += 'Hora inicio ';
    }
    if ($("#cmbHoraFinal").val() === '') {
        cam_vac += 'Hora fin ';
    }
    if ($("#cmbModulo").val() === '') {
        cam_vac += 'Modulo ';
    }
    if ($("#cmbModalidadMatricula").val() === '') {
        cam_vac += 'Matricula ';
    }
    if ($("#cmbSede").val() === '') {
        cam_vac += 'Sede ';
    }
    if ($("#txtFechaInicio").val() === '') {
        cam_vac += 'Fecha inicio ';
    }
    if ($("#txtFechaFinal").val() === '') {
        cam_vac += 'Fecha final ';
    }
    if ($("#cmbDocente").val() === '') {
        cam_vac += 'Docente ';
    }
    if ($("#cmbEntregables").val() === null) {
        cam_vac += 'Entregables ';
    }
    if ($("#cmbTipoDeCertificacion").val() === null) {
        cam_vac += 'Certificacion ';
    }
    if ($("#cmbEstado").val() === '') {
        cam_vac += 'Estado ';
    }
    
    return cam_vac;
}


function limpiarCampos() {
    $("#cmbConvocatorias").val('');
    $("#cmbRutaDeFormacion").val('');
    $("#cmbCurso").val('');
    $("#duraciondelcurso2").val('');
    $("#cmbDiasDelCurso").val('');
    $("#cmbHoraInicio").val('');
    $("#cmbHoraFinal").val('');
    $("#cmbSede").val('');
    $("#txtFechaInicio").val('');
    $("#txtFechaFinal").val('');
    $("#docente2").val('');
}

function eliminarPreprogramacion() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'eliminarPreprogramacion',
        cod_mat: $("#txtCodigoMatricula").val()
    }, function(data) {
        alert(data);
        setTimeout(function() {
            location.reload(true);
            ;
        }, 500);
    }, "json");
}


// ------ MODIFICAR ------



function modoModificarOn() {
    modo_modificar = true;
    $("#btncancelar").click(function(){
        modo_modificar = false;
        location.reload(true);
    });
}

function obtenerEntregable(ent) {
    $("#cmbEntregables option").each(function() {
        if ($(this).attr('value') === ent) {
            $("#cmbEntregables").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
        }
    });
}

function obtenerDocente(doc) {
    $("#docente2 option").each(function() {
        if ($(this).attr('value') === doc) {
            $("#docente2").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
        }
    });
}

function obtenerSede(sed) {
    $("#cmbSede option").each(function() {
        if ($(this).attr('value') === sed) {
            $("#cmbSede").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
        }
    });
}

function obtenerHora(nom_cam, val) {
    // alert('hora nom_cam: , val ' +nom_cam+','+val);
    $("#" + nom_cam + " option").each(function() {
        if ($(this).attr('value') === val) {
            $("#" + nom_cam + "").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
        }
    });
}

function obtenerModulo(cod_mod) {
    var aux_nom = ''; 
    $("#cmbModulo option").each(function() { 
        aux_nom = $(this).attr('value').split('$$');  
        if (aux_nom[0] === cod_mod) { 
            $("#cmbModulo").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
            var aux_dur = $(this).val().split("$$");
            $('#txtDuracionModulo').val(aux_dur[1]);
        } 
    }); 
}

function obtenerTipoServicio(tip_ser) {
    $("#cmbConvocatorias option").each(function() {
        if ($(this).attr('value') === tip_ser) {
            $("#cmbConvocatorias").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
        }
    });
}


function obtenerRuta(rut) {
    var aux_rut = '';
    $("#cmbRutaDeFormacion option").each(function() {
        if ($(this).val() === rut) {
            $("#cmbRutaDeFormacion").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
            aux_rut = $(this).text();
        }
    });
    // console.log("obtenerRuta");
    // console.log($("#cmbRutaDeFormacion").val());
    CargarCursosPorRuta($("#cmbRutaDeFormacion").val());
}

function obtenerCurso(cur) {
    $("#cmbCurso option").each(function() {
        if ($(this).text() === cur) {
            $("#cmbCurso").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
            CargarDatosCursoPorCodigo($(this).attr('value'));
        }
    });
}

//consulta todas las preprogramaciones
function cargarGridMatriculas() { //alert("entro");
    //var grid;
    //div con el formulario de inscripcion
	$("#ins_dat").hide();
    //boton consultar datos
    $("#lblConsultaDatos").show();
	
	//$('#divTablaPreprogramaciones').fadeIn(1000).html('<div><img src="../images/carga.gif"/></div>');
	// setTimeout(function() {
        // $('#divTablaPreprogramaciones').fadeOut(1500).html('<div><img src="../images/carga.gif"/></div>');;
    // },3000);
	
    var clase = 'clsProgramacion';
    var fun = 'CargarPreprogramaciones';
            var mensaje="Procesando la información<br>Espere por favor";
            jsShowWindowLoad(mensaje);
            $.post("../../controlador/fachada.php", {
                clase: clase,
                oper: fun   
            }, function(data) {
			console.log(data);
                 if (data !== 0) {
                     if(data !== null){ 
						//si existe o ya se cargo la tabla 
                        if ( $.fn.dataTable.isDataTable('#tablaPreprogramacion') ) {
							//alert("Existe");
							$('#tablaPreprogramacion tr').removeClass("selected");
							//muestra la tabla de lista de preprogramaciones
							$("#divTablaPreprogramaciones").show(); //como estaba ocualta se muestra
                            jsRemoveWindowLoad();
						}
						else{
							cargarInformacionEnTabla(data); //si es la primera vez se carga la tabla
                            jsRemoveWindowLoad();
						}
                     }else{alert("error 1");}             
                 }else {alert("error 2");}
            }, "json");
			
			
			            
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


//muestra las preprogramaciones en un datagrid
function cargarInformacionEnTabla(data){ 				 
	  //modulo = nombre curso
        tablaPreprogramacion = $('#tablaPreprogramacion').DataTable({
            "data": data,
            columns: [
			{ title: "Id" }, 
            { title: "Salón" },
            { title: "Matrícula" },
            { title: "Convocatoria" },
			{ title: "Curso" }, 
			{ title: "Módulo" }, 
			{ title: "DiasCurso" }, 
			{ title: "HoraInicial" }, 
			{ title: "HoraFinal" }, 
			{ title: "Sede" }, 
			{ title: "Docente" }, 
			{ title: "FechaInicial" }, 
			{ title: "Fechafinal" }, 
            { title: "Estado" }],
            "paging":   true,
            "info":     false,
            "order": [[ 3, "desc" ]],
            "scrollY": "300px",
            "scrollX": true,
            "scrollCollapse": true,
			"pageLength": 9,
            "lengthMenu": [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
            "columnDefs": [
            {"targets": [ 0 ],"visible": false,"searchable": false} ],
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
        $('#tablaPreprogramacion tbody').on( 'click', 'tr', function () { 
		
			if ( $(this).hasClass('selected')) { //alert("hi");
                $(this).removeClass('selected');
				
            }else{ //alert("ho");
                tablaPreprogramacion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
             mostrarMatricula(tablaPreprogramacion.row(this).data()[0]);
            $("#btnGuardar").css('display','');
        } );
		
    }
	
function printObject(o) {
  var out = '';
  for (var p in o) {
	  for (var i in o[p]) { 
			out += p + ': ' + o[p][i] + '\n';
	  }
  }
  alert(out);
}


function mostrarMatricula(pIdPreprogramacion) {
    //alert (pIdPreprogramacion);
	//oculta la tabla de lista de preprogramaciones
	$("#divTablaPreprogramaciones").hide();
	
	$("#pre_id").val(pIdPreprogramacion);
    $("#ins_dat").show();
    $("#lblConsultaDatos").hide();
    $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'CargarPreprogramacionPorId',
        pIdPreprogramacion: parseInt(pIdPreprogramacion)
    }, function(data) {
        if (data !== 0) {
            cargarDatosPreprogramacion(data);
        }
        else {
            alert('error');
        }
    }, "json");
    //$("#ins_dat").show();
    //$("#consultadatos").hide();
}

var flag_car_mod = false;
//{"Matricula":"FLFR00011","Convocatoria":"14","Ruta":"1","Curso":"C.B. - INTELIGENCIA INTRAPERSONAL"
//,"IdCurso":"1.01","Docente":"22","DiasCurso":"96","Sede":"116","FechaInicial":"2016-05-10","FechaFinal"
//:"2016-05-26","HoraInicial":"134","HoraFinal":"138","Modulo":"1.01.T1","Entregables":"86","Estado":"1"
//,"Certificacion":"86"}]
//FUNCION ECARGADA DE RECIBIR EL RESPONSE CON INFORMACIÃ’N DE LA 
function cargarDatosPreprogramacion(res) {
    //alert('res[0].id_rut: '+res[0].id_rut);
    flag_car_mod = false;
    $("#txtCodigoMatricula").val(res[0].Matricula);
    $("#cmbConvocatorias").val(res[0].Convocatoria);
    //cmbHoraFinal
    obtenerRuta(res[0].Ruta); //alert(res[0].Modulo);
    setTimeout(function() {
        obtenerCurso(res[0].Curso);
        if (res[0].Modulo !== '') {
            setTimeout(function() {
                obtenerModulo(res[0].Modulo);
            }, 2000);
        }
    }, 1500);    
    obtenerHora('cmbHoraInicio', res[0].HoraInicial);
    obtenerHora('cmbHoraFinal', res[0].HoraFinal);
    $("#txtFechaInicio").val(res[0].FechaInicial);
    $("#txtFechaFinal").val(res[0].FechaFinal);
    $("#cmbDiasDelCurso").val(res[0].DiasCurso);
    $("#cmbEstado").val(res[0].Estado);
    $("#cmbModalidadMatricula").val(res[0].Modalidad);
    $("#cmbDocente").val(res[0].Docente);
    $("#cmbTipoDeCertificacion").val(res[0].Certificacion);
    $("#cmbEntregables").val(res[0].Entregables);
    obtenerSede(res[0].Sede);


    //obtenerDocente(res[0].Docente);
   // obtenerEntregable(res[0].Entregables);
   modoModificarOn();
}




//----------UTILIDADES---------


function calendarioEspanol() {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'MiÃ©rcoles', 'Jueves', 'Viernes', 'SÃ¡bado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'MiÃ©', 'Juv', 'Vie', 'SÃ¡b'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'SÃ¡'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
    $(function() {
        $("#fecha").datepicker();
    });
}

function mostrarPopUpError(err_men) {
    $("#textoError").text(err_men);
    $('#element_to_pop_upMen').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function mostrarPopUpPregunta() {
    $("#textoPregunta1").text('Seleccione modo matricula');
    $('#element_to_pop_upPregunta').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

//Carga parÃ¡metros 

function CargarEntregables() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'cargarEntregables'
    }, function(data) {
        if (data !== 0) {
            formarOptionValueEntregables(data);
        }
        else {
            alert('error');
        }
    }, "json");
}

function CargarDocentes() { 
    
	var moduloSel = $("#cmbModulo").val();
	var codModuSel = moduloSel.split('$$');
	// alert(codModuSel[0]);
	$.post("../../controlador/fachada.php", {
        clase: 'clsDocente',
        oper: 'ConsultarDocentes',
		codModuSel:codModuSel[0]
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueDocentes(data);
        }
        else {
            alert('error');
        }
    }, "json");
}

function FormarOptionValueDocentes(docentes) {
    $('#cmbDocente').find('option').remove();
    SetParametroCursoPorDefecto("#cmbDocente", '', 'Seleccione...');
    for (i = 0; i < docentes.length; i++) {
        $('#cmbDocente').append($('<option>', {
            value: docentes[i].Id,
            text: docentes[i].Nombre
        }));
    }
}
function CargarModalidades() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarModalidades'
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueModalidades(data);
        }
        else {
            alert('error');
        }
    }, "json");
}

function FormarOptionValueModalidades(pModalidades) {
    $('#cmbModalidadMatricula').find('option').remove();
    SetParametroCursoPorDefecto("#cmbModalidadMatricula", '', 'Seleccione...');
    for (i = 0; i < pModalidades.length; i++) {
        if (pModalidades[i].id !== null) {
            $('#cmbModalidadMatricula').append($('<option>', {
                value: pModalidades[i].Id,
                text: pModalidades[i].Nombre
            }))
        }
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


