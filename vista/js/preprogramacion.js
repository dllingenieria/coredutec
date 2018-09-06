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
    // CargarRutas();
    // CargarDocentes();
    CargarSedes();
    CargarModalidades();
    CargarEntregables();
    CargarDiasCurso();
    cargarHorarios();
    // CargarEstados();
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
    //SetParametroCursoPorDefecto("#cmbEntregables", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#estado2", '', 'Seleccione...');
    SetParametroCursoPorDefecto("#participantes2", '', 'Seleccione...');
    //SetParametroCursoPorDefecto("#cmbTipoDeCertificacion", '', 'Seleccione...');
    setTimeout( mostrarPopUpPregunta(),1000);
	
	cargarValorSelected('#cmbEntregables','177',1000);
	cargarValorSelected('#cmbTipoDeCertificacion','188',1000);

	//validacion campos numericos
	 
	 
	  $("#txtCanSesiones, #txtInteHoraria, #txtCapSalon").keydown(function (e) {
               if (e.shiftKey || e.ctrlKey || e.altKey) {  
                   e.preventDefault();
               } else {  
                   var key = e.keyCode;  
                   //alert(key)  
                   if (!((key == 8) || (key == 46) ||  (key == 9)  ||
					(key >= 35 && key <= 40)  
					|| (key >= 48 && key <= 57)  
					|| (key >= 96 && key <= 105))) {  
										   e.preventDefault();  
									   }  
								   }  
           }); 
});

 $(function(){
    $("#btnMatNue").click(function(){ 
		CargarEstados();
		setTimeout(function() { $("#cmbEstado").val(2); }, 900);
 });
    
    $("#btnMatExi").click(function(){
		matriculaExistente = true;
		 //se selecciona el estado inactivo para preprogramaciones nuevas
        cargarMatriculaExistente();
		CargarEstados();
			setTimeout(function() { $("#cmbEstado").val(2); }, 900); 
    });
})

function cargarMatriculaExistente(){
    var cod_mat_aux = prompt("Ingrese codigo matricula ", "");
    if (cod_mat_aux != null) {
        consultarMatricula(cod_mat_aux);
    }
}

//cuando se consulta matriculaExistente
function consultarMatricula(mat){  //alert("2"+matriculaExistente);
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
			$("#txtCodCurso").val(data[0].Curso);
			//cargarRutas
			setTimeout(function() {CargarRutas(data[0].Curso) 
				setTimeout(function() {obtenerRuta(data[0].Ruta);  }, 800);  
			}, 500); 
			$("#txtDuracionDelCurso").val(data[0].DiasCurso);
			//para llenar la duracion del curso
            setTimeout(function() {
                $('#cmbCurso option[value="'+data[0].Curso+'"]').attr('selected','selected');  
			     CargarDatosCursoPorCodigo(data[0].Curso)
            }, 1500);
		    $('#cmbDiasDelCurso option[value='+data[0].DiasCurso+']').attr('selected','selected');
			$('#cmbHoraInicio option[value='+data[0].HoraInicial+']').attr('selected','selected'); 
			$('#cmbHoraFinal option[value='+data[0].HoraFinal+']').attr('selected','selected'); 
			$('#cmbSede option[value='+data[0].Sede+']').attr('selected','selected');   
			$('#cmbEntregables option[value='+data[0].Entregables+']').attr('selected','selected'); 
			
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
			
			$('#cmbModalidadMatricula option[value='+data[0].Modalidad+']').attr('selected','selected');
			$('#cmbTipoDeCertificacion option[value='+data[0].Certificacion+']').attr('selected','selected');
			//se habilita solo el inactivo en estado
			$('#cmbEstado')
			.find('option')
			.remove()
			.end()
			.append('<option value="2">Inactivo</option>')
			.val('2');
			
			//se llenan los campos nuevos
			 $("#txtCodSalon").val(data[0].Salon);
			 $("#txtCanSesiones").val(data[0].CantidadSesiones);
			 $("#txtCapSalon").val(data[0].CapacidadSalon);
			 $("#txtInteHoraria").val(data[0].IntensidadHorariaDiaria);
			 $("#txtObservacion").val(data[0].Observaciones);
			 CargarCursosPorCodigo($("#txtCodCurso").val());
		}
		else{
			mostrarPopUpError("No se encontro la preprogramación o verifique el estado");
			matriculaExistente = false;
			jsRemoveWindowLoad();	
		}
		  jsRemoveWindowLoad();
    }, "json");
}

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
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);
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
				matriculaExistente: matriculaExistente,
				canSesiones : $("#txtCanSesiones").val(),
				capSalon : $("#txtCapSalon").val(),
				inteHoraria : $("#txtInteHoraria").val(),
				observacion : $("#txtObservacion").val(),
				
				//campos para el correo
				diasDelCurso : $("#cmbDiasDelCurso :selected").text(),
				horaInicio: $("#cmbHoraInicio :selected").text(),
                horaFinal: $("#cmbHoraFinal :selected").text(),
				sede: $("#cmbSede :selected").text()
				
            }, function(data) {
                if (data == 1) {
                    setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
					jsRemoveWindowLoad();
                    popUpConfirmacion("Preprogramación guardada de manera satisfactoria"); 
					$('#btnGuardar').attr("disabled", false);
                } else if (data == 0) {
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
                    jsRemoveWindowLoad();
                    mostrarPopUpError("Su registro no pudo guardarse, posiblemente esta repetido o verifique su conexión y vuelva a intentarlo");
                }
				else if (data == -1) {
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
                    jsRemoveWindowLoad();
                    mostrarPopUpError("No se envio el correo al docente");
                }
            }, "json");  
        }
    } else {
        jsRemoveWindowLoad();
        mostrarPopUpError('Faltan algun(os) campos obligatorios por llenar.');
    }
}

function modificarPreprogramacion() {
	var mensaje="Procesando la información<br>Espere por favor";
	jsShowWindowLoad(mensaje);	
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
                tip_cer: $("#cmbTipoDeCertificacion").val(),
                pre_est : $("#cmbEstado").val(),
				codSalon : $("#txtCodSalon").val(),
				canSesiones : $("#txtCanSesiones").val(),
				capSalon : $("#txtCapSalon").val(),
				inteHoraria : $("#txtInteHoraria").val(),
				observacion : $("#txtObservacion").val(),
				
				//campos para el correo
				diasDelCurso : $("#cmbDiasDelCurso :selected").text(),
				horaInicio: $("#cmbHoraInicio :selected").text(),
                horaFinal: $("#cmbHoraFinal :selected").text(),
				sede: $("#cmbSede :selected").text(),
				cod_mat: $("#txtCodigoMatricula").val(),
                cod_sal: $("#txtCodigoMatricula").val()+'.'+cod_mod_aux
				
            }, function(data) {
                if (data == 0) {
                	jsRemoveWindowLoad();
                	mostrarPopUpError("Error al modificar la preprogramacion.");                    
                } else if (data[0]['pRespuesta'] == 1) {
					jsRemoveWindowLoad();
                    popUpConfirmacion("Preprogramacion modificada de manera correcta");
                    setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
                }else if (data[0]['pRespuesta'] == 2) {
					jsRemoveWindowLoad();
					popUpConfirmacion("Modificación no permitida, el salón tiene alumnos matriculados<br>");
					setTimeout(function() {
                        location.reload(true);
                    }, 4000); 
                }
            }, "json");
        }
    } else {
        mostrarPopUpError('Faltan algun(os) campos obligatorios por llenar');
        
    }
}

function popUpConfirmacion(msj){
    $("#textoConfirmacion1").html(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown'
    });
}

function popUpConfirmacionPreprogramacion(msj){
    $("#textoConfirmacion1").html(msj);
    $('#element_to_pop_upCon').bPopup({
        speed: 450,
        transition: 'slideDown',
		onClose: function() { 
			window.location.href = "preprogramacion.html";
		}
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
		cargarListas('cmbAnios','SPCARGARANIOSPREPROGRAMACION');
		$("#ins_dat").hide();
		$("#botones").hide();
		$("#Anios").show();
	});

	$("#btnCancelar1").click(function() {
		location.reload(true);
	});

	$("#btnCancelar1").click(function() {
		location.reload(true);
	});

	$("#btnConsultar1").click(function() {
	    cargarGridMatriculas();
		//se oculta el boton de guardar porque se va a mostrar el datatable
		$("#btnGuardar").css('display','none');
		$("#botones").hide();
		$("#botones1").show();
	});

	$("#btnConsultar2").click(function() {
		$("#Anios").hide();
	    cargarGridMatriculas();
		//se oculta el boton de guardar porque se va a mostrar el datatable
		$("#btnGuardar").css('display','none');
		$("#botones").hide();
		$("#botones1").show();
	});

	$("#btnimprimir").click(function() {
		//window.location = "../html/busqueda.html";
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

	$('#txtCodCurso').change(function() {
		CargarCursosPorCodigo($("#txtCodCurso").val());
		CargarRutas($("#txtCodCurso").val());	
	});	  

	$('#cmbRutaDeFormacion').change(function() {
	    $('#txtDuracionModulo').val("");
	});

	$('#cmbCurso').change(function() {
	    $('#txtDuracionModulo').val("");
	    $('#cmbModulo').find('option').remove();
	    CargarDatosCursoPorCodigo($(this).val());		
	});

	$('#cmbHoraInicio').change(function() {
	    hin_text = $("#cmbHoraInicio option:selected").text();
	    hfi_text = $("#cmbHoraFinal option:selected").text();
	    validarHoras(hin_text, hfi_text);
	});

	$('#cmbHoraFinal').change(function() {
		hin_text = $("#cmbHoraInicio option:selected").text();
	    hfi_text = $("#cmbHoraFinal option:selected").text();
	    validarHoras(hin_text, hfi_text);
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
	    $("#cmbModalidadMatricula").val(aux_dur[2]).prop('selected', true);
        $("#cmbModalidadMatricula").selected = true;
	    guardarAuxCodigo(aux_dur[0]);
		if ($('#cmbModulo').val() == ""){ 
			$('#cmbDocente').html('');
		}
		else{ 
			CargarDocentes();
			$("#txtCodSalon").val($("#txtCodigoMatricula").val()+'.'+cod_mod_aux);
		}
		
	});
});

function guardarAuxCodigo(aux){
    var aux_cod = aux.split(".");
    total_array= (aux_cod.length)-1;
    cod_mod_aux = aux_cod[total_array];
}

function CargarCursosPorCodigo(codCurso) {    
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarCursosPorCodigo',
        codCurso: codCurso
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueCursos(data);
        }
        else {
             mostrarPopUpError('No se cargaron los cursos por código');
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
    // $("#cmbRutaDeFormacion").val(pCursos[0].Ruta).prop('selected', true);
    // $("#cmbRutaDeFormacion").selected = true;
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
            mostrarPopUpError('error CargarConvocatoria');
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
            mostrarPopUpError('error CargarEstados');
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
            mostrarPopUpError('error CargarSedes');
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
            mostrarPopUpError('error CargarDiasCurso');
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

function CargarRutas(codCurso) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarRutas',
		codCurso:codCurso
    }, function(data) {
        if (data !== 0) {
            formarOptionValueRutas(data);
        }
        else {
            mostrarPopUpError('No se cargaron las rutas');
        }
    }, "json");
}

function formarOptionValueRutas(pRutas) {
    $('#cmbRutaDeFormacion').find('option').remove();
    //SetParametroCursoPorDefecto("#cmbRutaDeFormacion", '', 'Seleccione...');
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
            mostrarPopUpError('error CargarDatosCursoPorCodigoB');
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
            mostrarPopUpError('error CargarModulosCurso');
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
            mostrarPopUpError('error CargarTipoCertificacion');
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
                    value: modulos[i].Codigo + "$$" + modulos[i].Duracion + "$$" + modulos[i].Modalidad,
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
            mostrarPopUpError('error cargarHorarios');
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

function validarHoras(hin_text, hfi_text) {
    var flag = true;
    console.log("Hora inicial "+hin_text);
    console.log("Hora inicial "+hfi_text);
    if (parseInt(hin_text) >= parseInt(hfi_text)) {
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
	if ($("#txtCodCurso").val() === '') {
        cam_vac += 'Código curso ';
    }
	if ($("#txtCanSesiones").val() === '') {
        cam_vac += 'Cantidad sesiones ';
    }
	if ($("#txtCapSalon").val() === '') {
        cam_vac += 'Capacidad salón ';
    }
	if ($("#txtInteHoraria").val() === '') {
        cam_vac += 'Intensidad horaria ';
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
function cargarGridMatriculas() { 
	$("#ins_dat").hide();
    //boton consultar datos
    $("#lblConsultaDatos").show();
    var mensaje="Procesando la información<br>Espere por favor";
    jsShowWindowLoad(mensaje);
    $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'CargarPreprogramaciones',
        Anio: $("#cmbAnios option:selected").text()
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
             }else{mostrarPopUpError("error 1");}             
         }else {mostrarPopUpError("error 2");}
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
        { title: "Estado" },
		{ title: "IntensidadHorariaDiaria" },
		{ title: "CapacidadSalon" },
		{ title: "CantidadSesiones" },
		{ title: "Observaciones" }],
        "paging":   true,
        "info":     false,
        "order": [[ 3, "desc" ]],
        "scrollY": "300px",
        "scrollX": true,
        "scrollCollapse": true,
		"pageLength": 9,
        "lengthMenu": [[10, 25, 50, 100, 500], [10, 25, 50, 100, 500]],
        "columnDefs": [
        {"targets": [ 0 ],"visible": false,"searchable": false},
		{"targets": [ 17 ],"visible": false,"searchable": false}],
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
        	$("#botones").show();
			$("#botones1").hide();
            cargarDatosPreprogramacion(data);
        }
        else {
            mostrarPopUpError('error');
        }
    }, "json");
}

var flag_car_mod = false;
//FUNCION ECARGADA DE RECIBIR EL RESPONSE CON INFORMACIÃ’N DE LA 
//viene de la lista del data table
function cargarDatosPreprogramacion(res) { //alert("1"+matriculaExistente);
    //para que cargue todos los modulos a editar
	matriculaExistente=false;
	//alert('res[0].id_rut: '+res[0].id_rut);
    flag_car_mod = false;
    $("#txtCodigoMatricula").val(res[0].Matricula);
    $("#cmbConvocatorias").val(res[0].Convocatoria);
    //cmbHoraFinal
	$("#txtCodCurso").val(res[0].IdCurso);
	//cargarRuras
	setTimeout(function() {CargarRutas(res[0].IdCurso); 
		setTimeout(function() {obtenerRuta(res[0].Ruta);  }, 900);  
	}, 500); 
	//cargar cursos
    CargarCursosPorCodigo(res[0].IdCurso);
    setTimeout(function() {
        obtenerCurso(res[0].Curso);
        if (res[0].Modulo !== '') {
            setTimeout(function() {
                obtenerModulo(res[0].Modulo);
				CargarDocentes();
				setTimeout(function() {
				$("#cmbDocente").val(res[0].Docente);
				}, 1000);
            }, 2300);
        }
    }, 1500); 
    obtenerHora('cmbHoraInicio', res[0].HoraInicial);
    obtenerHora('cmbHoraFinal', res[0].HoraFinal);
    $("#txtFechaInicio").val(res[0].FechaInicial);
    $("#txtFechaFinal").val(res[0].FechaFinal);
    $("#cmbDiasDelCurso").val(res[0].DiasCurso);
    $("#cmbModalidadMatricula").val(res[0].Modalidad);
    $("#cmbTipoDeCertificacion").val(res[0].Certificacion);
    $("#cmbEntregables").val(res[0].Entregables);
    obtenerSede(res[0].Sede);

	//se agregan campos nuevos de preprogramación
	 $("#txtCodSalon").val(res[0].Salon);
	 $("#txtCanSesiones").val(res[0].CantidadSesiones);
	 $("#txtCapSalon").val(res[0].CapacidadSalon);
	 $("#txtInteHoraria").val(res[0].IntensidadHorariaDiaria);
	 $("#txtObservacion").val(res[0].Observaciones);
   //cargar los estados
	setTimeout(function() {CargarEstados(); 
		setTimeout(function() { $("#cmbEstado").val(res[0].Estado); }, 1500);  
	}, 1000);
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
            mostrarPopUpError('error');
        }
    }, "json");
}

function CargarDocentes() { 
    
	var moduloSel = $("#cmbModulo").val();
	var codModuSel = moduloSel.split('$$');
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
            mostrarPopUpError('error');
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

//----- Consulta en la base de datos los valores de las listas -----//
function cargarListas(objeto,procedimiento) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsUtilidades',
        oper: 'cargarListas',
        objeto: objeto,
        procedimiento: procedimiento
    }, function(data) {
        if (data !== 0) {
            formarOptionValueLista(data,objeto);
        }
        else {
            alert('error');
        }
    }, "json");
}

//----- Llena las listas -----//
function formarOptionValueLista(data,objeto) {
    $('#'+objeto).find('option').remove();
    for (i = 0; i < data.length; i++) {
        $('#'+objeto).append($('<option>', {
            value: data[i].Id,
            text: data[i].Nombre
        }));
    }
} 

//----- Establece los valores por defecto de las listas -----//
function cargarValorSelected(objeto,value,tiempo){
    setTimeout(function() {
        $(objeto+' option[value="'+value+'"]').attr('selected','selected');    
    }, tiempo);       
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