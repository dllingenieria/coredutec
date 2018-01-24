/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var idRuta = '';
var estadocivil;
var grado;
var ciudades;
var localidades;
var estadoParticipante="";

$(function() {
	//alert($.cookie("pIdTercero"));
	//se oculta el boton de actualizar temporalmente
    //	$("#btnActualizar").hide();
	$.datepicker.regional['es'] = {
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        weekHeader: 'Sm',
        dateFormat: 'yy-mm-dd',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: '',
		changeMonth: true,
		changeYear: true
		
    };
	cuposSalones="";
	$.datepicker.setDefaults($.datepicker.regional['es']);
	$("#txtfechaNacimiento").datepicker();
    obtenerEstadoCivil();
    obtenerGradoEscolaridad();
    obtenerCiudades();
    obtenerLocalidades();
    
    LimpiarCampos();
	consultarCupos();
    if($.cookie("pEstadoMatricula") === 'SinMatricular'){
            CargarDatosMatricula();
            CargartipoServicio();
            CargarDocentes();
            CargarHorarios();
            CargarSedes();
            CargarModalidades();
            SetParametroCursoPorDefecto("#cmbModuloMatricula", '', 'Seleccione...');
        }else{
            LimpiarCamposTercero();
            window.location = "busqueda.html";
        }

        $("#btnGuardar").click(function() {
            GuardarMatricula();        
        });
        $("#btnAceCon").click(function() {
            AgregarObservacion();
            GuardarInfo();
            window.location = "../html/formato.html";
        });
        $('#rutanumero2').change(function() {
            $('#nombrecurso2').find('option').remove();
            $('#codigomodulo2').val("");
            $('#duracioncurso2').val("");
            $('#estado2').val("");
        });
        $('#cmbNombreCursoMatricula').change(function() {
            $("#txtCodigoCursoMatricula").val($(this).val());
            LimpiarCampos();
            CargarDatosCursoPorCodigo($(this).val());
        });
        $('#cmbModuloMatricula').change(function() {
            var aux_dur = $(this).val().split("$$");
            $('#txtCodigoModuloMatricula').val(aux_dur[0]);
            $('#txtDuracionModuloMatricula').val(aux_dur[1]);
            CargarDatosModulo(aux_dur[0]);

          
                if(sessionStorage.rolSeleccionado==3){
                    CargarMatriculasPre();
                }
                else if(sessionStorage.rolSeleccionado==1){
                    CargarMatriculasPre2();
                }
        

        });
        $('#cmbMatriculadoEnMatricula').change(function() {
			
			cargarCupos($(this).val());
            CargarInfoMatricula($(this).val());
        });

        $('#btnnovedades').click(function() {
            window.location = "novedades.html";
        });   
        $("#btnActualizar").click(function() {
            ActualizarTercero();        
        });
		
		$( "#txtfechaNacimiento" ).change(function() { 
			var today = new Date();
			var olday = new Date($("#txtfechaNacimiento").val());
			$("#txtEdad").val(dateDiff(olday,today));
		});
    });

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

    function formarOptionValue(idObjeto,dataSet, identifier){
        for (i = 0; i < dataSet.length; i++) {
            var selected = '';
            if(identifier==dataSet[i][0]){
                selected = 'selected';
            }
            $(idObjeto).append($('<option '+selected+'></option>').val(dataSet[i][0]).html(dataSet[i][1])); 
        }
    }

 function GuardarMatricula(){	 
	pdIdModalidad=$("#cmbModalidadMatricula").val();
	pCodigoModulo= $("#cmbModuloMatricula").val();
	pIdMatricula = $("#cmbMatriculadoEnMatricula").val();
	
	if((pdIdModalidad!="") && (pCodigoModulo!="") && (pIdMatricula!="")){ 
	 
    $.post("../../controlador/fachada.php", {
        clase: 'clsMatricula',
        oper: 'AgregarMatricula',
        pTerceroNit: $.cookie("pIdTercero"),
        pIdConvocatoria:$("#txtTipoDeConvocatoriaMatriculaOculta").val(), 
        pIdRuta: $("#txtRutaNumeroMatriculaOculta").val(),
        pCodigoCurso:$("#cmbNombreCursoMatricula").val(),
        pIdModalidad:$("#cmbModalidadMatricula").val(),
        pCodigoModulo:ObtenerCodigoModulo($("#cmbModuloMatricula").val()),
        pIdMatricula:$("#cmbMatriculadoEnMatricula").val(),
        pIdCarga : $.cookie("pIdCarga")
    }, function(data) {

        if (data != 0) {
            $.cookie("id_mat", data);
            $.cookie("pEstadoMatricula",'Guardada');
            PopUpConfirmacion("Matrícula guardada satisfactoriamente.");
        }else{
            if(data=='-1'){
                PopUpError("No se pudo guardar la matrícula");
            }else{
             PopUpError("Este tercero ya se encuentra matriculado");
            } 
        }   
    }, "json");
	
	}else{
		PopUpError("Faltan algun(os) campos obligatorios por llenar.");
	}
}

function CargarDatosModulo(pCodigo){
   $.post("../../controlador/fachada.php", {
        clase: 'clsModulo',
        oper: 'ConsultarModuloPorCodigo',
        pCodigoModulo: pCodigo
    }, function(data) {
        if (data !== "" && data !== 0) {
            $("#txtTipoFormacionMatricula").val(data[0].NombreTipoFormacion);
            $("#txtAreaOcupacionalMatricula").val(data[0].NombreAreaOcupacional);
            }
        }, "json");
} 

function CargarInfoMatricula(pId) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'CargarDatosPreProgramacion',
        pId: pId
    }, function(data) {
        if (data !== 0) {
            console.log(JSON.stringify(data));
            $("#txtSedeMatricula").val(data[0].Sede);
            $("#txtDocenteMatricula").val(data[0].Docente);
            $("#txtHorarioMatricula").val(data[0].DiasCurso);
            $("#txtHoraInicio").val(data[0].Horario);
            $("#txtFechaInicial").val(data[0].FechaInicial);
            $("#txtFechaFinal").val(data[0].FechaFinal);
            $.cookie("FechaInicialCurso",data[0].FechaInicial);
                //(data);
            }
        }, "json");
}


function CargarHoras() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarHoras'
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueHoras(data);
        }
        else {
            alert('error horas');
        }
    }, "json");
}

function VerificarEstadoProceso() { //se cambio la validacion a la caja de texto de estado que se trae de la carga
    
	if (estadoParticipante === 'No cumple' || estadoParticipante === 'Beneficio Finalizado' || estadoParticipante === 'No inscrito') {
        $("#container_pro_cap").hide();
       var msj = 'El señor (a) '+ $("#txtNombre").val() +' '+ $("#txtApellido").val() +' con c.c. '+ $("#txtIdentificacion").val() + '' +
        ' no se puede matricular porque su estado actual es '+estadoParticipante;
        PopUpError(msj);       
    }
}

function ActivarParticipante(){
    $.post("../../controlador/fachada.php", {
        clase: 'clsParticipante',
        oper: 'ActivarParticipante',
        par_id: $.cookie("id_par")
    }, function(data) {
        if (data !== 0) {
         console.log("Se cambió el estado del participante");
     }
     else {
        console.log("error activando participante");
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
    $("#textoConfirmatextoErrorcion1").text(msj);
    $('#element_to_pop_upConfirmacion').bPopup({
       speed: 450,
       transition: 'slideDown'
   });
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
            alert('error modalidad');
        }
    }, "json");
}

function CargarMatriculasPre() { 
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'ConsultarMatriculasPre',
        pCodigoCurso: $('#cmbNombreCursoMatricula').val(),
        pCodigoModulo: ObtenerCodigoModulo($('#cmbModuloMatricula').val()),  
        pModalidad: $('#cmbModalidadMatricula').val() 
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueMatriculasPre(data);
        }
		else{
			mostrarPopUpError("No se encontraron datos de preprogramación.");
		}
    }, "json");
}

function CargarMatriculasPre2() { 
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'ConsultarMatriculasPre2',
        pCodigoCurso: $('#cmbNombreCursoMatricula').val(),
        pCodigoModulo: ObtenerCodigoModulo($('#cmbModuloMatricula').val()),  
        pModalidad: $('#cmbModalidadMatricula').val() 
    }, function(data) {
        if (data !== 0) {
            FormarOptionValueMatriculasPre(data);
        }
		else{
			mostrarPopUpError("No se encontraron datos de preprogramación");
		}
    }, "json");
}

function CargarDatosCursoPorCodigo(pCodigoCurso) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsCurso',
        oper: 'CargarCursoPorCodigo',
        rut_cod: pCodigoCurso
    }, function(data) {
        if (data !== 0) {
            $("#estado2").val(data[0].Estados);
            $("#txtDuracionCursoMatricula").val(data[0].Duracion);
            CargarModulosCurso(data[0].Id);
        }
        else {
            alert('error curso por codigo');
        }
    }, "json");
        // $('#rutanumero2 > option[value="' + r + ' ' + '"]').attr('selected', 'selected');
    }

    function CargarCursosPorRuta(pIdRuta) {
        $.post("../../controlador/fachada.php", {
            clase: 'clsCurso',
            oper: 'CargarCursosPorRuta',
            pIdRuta: pIdRuta
        }, function(data) {
            if (data !== 0) {
                FormarOptionValueCursos(data);
            }
            else {
                alert('error curso por ruta');
            }
        }, "json");
    }

    function CargarSedes() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsCurso',
            oper: 'CargarSedes'
        }, function(data) {
            if (data !== 0) {
                FormarOptionValueSedes(data);
            }
            else {
                alert('error sedes');
            }
        }, "json");
    }

    function CargarDatosMatricula() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsParticipante',
            oper: 'ConsultarMatricula',
            pIdCarga: $.cookie("pIdCarga")
        }, function(data) {
            if (data !== 0) {
                console.log(JSON.stringify(data));
                var nombres = data[0].Nombres;
                var apellidos = data[0].Apellidos;
                var tipoident = data[0].TipoIdentificacion;
                var telefono1 = data[0].Telefono1;
                var telefono2 = data[0].Telefono2;
                var telefono3 = data[0].Telefono3;
                var correo = data[0].CorreoElectronico;
                var numeroIdentificacion = data[0].NumeroIdentificacion;
                var observaciones = data[0].Observaciones;
                var estadoCivil = data[0].IdEstadoCivil;
                var escolaridad = data[0].IdGradoEscolaridad;
                var localidad = data[0].IDLocalidad;
                var convocatoria = data[0].Convocatoria;
                var mesAsignacion = data[0].FechaAsignacion;
                var idRutaFormacion = data[0].NombreRuta;
                $("#txtTipoDeConvocatoriaMatriculaOculta").val(data[0].IdConvocatoria);
                idRuta = data[0].IdRuta;
                $("#txtRutaNumeroMatriculaOculta").val(data[0].IdRuta);
                var nombreRutaFormacion = data[0].NombreRuta;
                var lugarExpedicion = data[0].IdMunicipio;
                var codigoCurso = data[0].CodigoCurso;
                var nombreCurso = data[0].NombreCurso;
                var modulo = data[0].Modulo;
                var moduloDuracion = data[0].DuracionCurso;
                var fechaNacimiento = data[0].FechaNacimiento;
                var sexo = data[0].Sexo;
                var direccion =  data[0].Direccion;
                var ciudadResidencia = data[0].CiudadResidencia;
                var tipoIdentificacion = data[0].TipoIdentificacion;
                var today = new Date();
                var olday = new Date(data[0].FechaNacimiento);
                $("#txtEdad").val(dateDiff(olday,today));
                formarOptionValue("#selectEstadoCivil", estadocivil,estadoCivil);
                formarOptionValue("#selectGradoEscolaridad", grado, escolaridad);
                formarOptionValue("#selectLugarExpedicion", ciudades,lugarExpedicion);
                formarOptionValue("#selectLocalidad", localidades,localidad);
				estadoParticipante= data[0].EstadoParticipante;
				//estadoParticipante= "Cumple";
                $("#txtNombre").val(nombres);
                $("#txtApellido").val(apellidos);
                $("#txtIdentificacion").val(numeroIdentificacion);
                $("#txtEstadoCivil").val(estadoCivil);
                $("#txtTelefonoFijo").val(telefono1);
                $("#txtTelefonoCelular").val(telefono2);
                $("#txtTelefonoAlterno").val(telefono3);
                $("#txtCorreoElectronico").val(correo);
                $("#txtGradoEscolaridad").val(escolaridad);
                $("#txtMesAsignacion").val(mesAsignacion);
                $("#txtLugarExpedicion").val(lugarExpedicion);
                $("#txtLocalidad").val(localidad);
                $("#txtfechaNacimiento").val(fechaNacimiento); 
                $("#sexo").val(sexo);
                $("#direccion").val(direccion);
                $("#ciudad").val(ciudadResidencia);
                $("#txtTipoDeConvocatoriaCarga").val($.cookie("convocatoria"));
                $("#txtTipoDeConvocatoriaMatricula").val($.cookie("convocatoria"));
                //$("#txtRutaNumeroCarga").val($.cookie("ruta"));
                $("#txtRutaNumeroCarga").val(idRutaFormacion);
                //$("#txtRutaNumeroMatricula").val($.cookie("ruta"));
                $("#txtRutaNumeroMatricula").val(idRuta);
                $("#txtEstadoCarga").val(estadoParticipante); //llena el estado
                $("#txtObservaciones").val(observaciones);
                $("#tipoIdentificacion").val(tipoIdentificacion);
				
                $.post("../../controlador/fachada.php", {
                    clase: 'clsParticipante',
                    oper: 'ConsultarModulo',
                    pIdmodulo: $.cookie("pModulo")
                }, function(data) {
                    if (data !== 0) {
                        $("#txtNombreCursoCarga").val(data[0].NombreCurso);
                        $("#txtCodigoCursoCarga").val(data[0].CodigoCurso);
                        $("#txtModuloCarga").val(data[0].Modulo);
                        $("#txtDuracionModuloCarga").val(data[0].Duracion);
                    }else {
                        alert('error matricula');
                    }
                }, "json");
                // $("#txtObservaciones").val(observaciones);
                VerificarEstadoProceso();
                CargarCursosPorRuta($.cookie("ruta")); 
            }else {
                alert('error matricula 2');
            }
        }, "json");
    }

	

    function CargarHorarios() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsCurso',
            oper: 'ConsultarHorarios'
        }, function(data) {
            if (data !== 0) {
                FormarOptionValueHorario(data);
            }else {
                alert('error horarios');
            }
        }, "json");
    }

    function CargarDocentes() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsDocente',
            oper: 'ConsultarDocentes'
        }, function(data) {
            if (data !== 0) {
                FormarOptionValueDocentes(data);
            }
            else {
                alert('error docentes');
            }
        }, "json");
    }

    function CargartipoServicio() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsConvocatoria',
            oper: 'ConsultarConvocatorias'
        }, function(data) {
            if (data !== 0) {
                FormarOptionValueConvocatorias(data);
            }
            else {
                alert('error tipo servicio');
            }
        }, "json");
    }

    function CargarModulosCurso(cur_id) {
        $.post("../../controlador/fachada.php", {
            clase: 'clsCurso',
            oper: 'ConsultarModulos',
            pIdCurso: cur_id
        }, function(data) {
            if (data !== 0) {
                FormarOptionValueModulos(data);
            }
            else {
                alert('error modulos curso');
            }
        }, "json");
    }



    function FormarOptionValueEstadoCurso(estadoActual) {

    }

    function GuardarInfo() {
        var d = new Date();
        var strDate = d.getFullYear() + "/" + (d.getMonth()+1) + "/" + d.getDate();
        $.cookie("nom_usu", $("#txtNombre").val() +" " + $("#txtApellido").val());
        $.cookie("mes_asi", $("#txtMesAsignacion").val());
        $.cookie("ide_usu", $("#txtIdentificacion").val());
        //$.cookie("lug_exp", $("#txtLugarExpedicion").val());
        $.cookie("lug_exp", $('#selectLugarExpedicion :selected').text());
        //$.cookie("est_civ", $("#txtEstadoCivil").val());
        $.cookie("est_civ", $('#selectEstadoCivil :selected').text());
        $.cookie("tel_fij", $("#txtTelefonoFijo").val());
        $.cookie("tel_cel", $("#txtTelefonoCelular").val());
        $.cookie("tel_alt", $("#txtTelefonoAlterno").val());
        $.cookie("cor_ele", $("#txtCorreoElectronico").val());
        $.cookie("eda_usu", $("#txtEdad").val());
       //$.cookie("gra_esc", $("#txtGradoEscolaridad").val());
        $.cookie("gra_esc", $('#selectGradoEscolaridad :selected').text());
        //$.cookie("loc_usu", $("#txtLocalidad").val());
        $.cookie("loc_usu", $('#selectLocalidad :selected').text());
        $.cookie("tip_ser", $("#txtTipoDeConvocatoriaCarga").val());
        $.cookie("rut_num", $("#txtRutaNumeroCarga").val());
        $.cookie("hor_cur", $("#txtHorarioMatricula").val() + "  "+$("#txtHoraInicio").val());
        $.cookie("nom_cur", $("#cmbNombreCursoMatricula option:selected").text());
        $.cookie("cod_cur", $("#cmbNombreCursoMatricula").val());
        $.cookie("dur_cur", $("#txtDuracionCursoMatricula").val());
        $.cookie("mod_cur", $("#cmbModalidadMatricula option:selected").text());
        $.cookie("est_cur", $("#txtEstadoCarga").val());
        $.cookie("sed_cur", $("#txtSedeMatricula").val());
        $.cookie("doc", $("#txtDocenteMatricula").val());
        $.cookie("fec_matr", strDate);
        var maten = $("#cmbMatriculadoEnMatricula option:selected").text();
        var matarray = maten.split("-");
        $.cookie("mat", matarray[0].trim());
        $.cookie("mod", $("#cmbModuloMatricula option:selected").text());
        $.cookie("dur_mod", $("#txtDuracionModuloMatricula").val());
        window.open('formato.html', '_self');
    }

    function FormarOptionValueHoras(horas) {
        for (i = 0; i < horas.length; i++) {
            $('#horainicio2').append($('<option>', {
                value: horas[i].id,
                text: horas[i].nombre
            }));
            $('#horafinal2').append($('<option>', {
                value: horas[i].id,
                text: horas[i].nombre
            }));
        }
    }

    function FormarOptionValueModalidades(pModalidades) {
        $('#cmbModalidadMatricula').find('option').remove();
        SetParametroCursoPorDefecto("#cmbModalidadMatricula", '', 'Seleccione...');
        for (i = 0; i < pModalidades.length; i++) {
            if (pModalidades[i].id !== null) {
                $('#cmbModalidadMatricula').append($('<option>', {
                    value: pModalidades[i].Id,
                    text: pModalidades[i].Nombre
                }));
            }
        }
    }

    function FormarOptionValueCursos(pCursos) {
        $('#cmbNombreCursoMatricula').find('option').remove();
        SetParametroCursoPorDefecto("#cmbNombreCursoMatricula", '', 'Seleccione...');
        for (i = 0; i < pCursos.length; i++) {
            $('#cmbNombreCursoMatricula').append($('<option>', {
                value: pCursos[i].Codigo,
                text: pCursos[i].Nombre
            }));
        }
        $("#cmbNombreCursoMatricula").val($("#txtCodigoCursoCarga").val());
        $("#txtCodigoCursoMatricula").val($("#txtCodigoCursoCarga").val());
        CargarDatosCursoPorCodigo($("#txtCodigoCursoCarga").val());
    }

    function SetParametroCursoPorDefecto(atributo, valor, texto) {
        $(atributo).append($('<option>', {
            value: valor,
            text: texto
        }));
    }

    function FormarOptionValueHorario(horarios) {
        $('#txtHorarioMatricula').find('option').remove();
        SetParametroCursoPorDefecto("#txtHorarioMatricula", '', 'Seleccione...');
        for (i = 0; i < horarios.length; i++) {
            $('#txtHorarioMatricula').append($('<option>', {
                value: horarios[i].id,
                text: horarios[i].nombre
            }));
        }
    }

    function FormarOptionValueDocentes(docentes) {
        $('#txtDocenteMatricula').find('option').remove();
        SetParametroCursoPorDefecto("#txtDocenteMatricula", '', 'Seleccione...');
        for (i = 0; i < docentes.length; i++) {
            $('#txtDocenteMatricula').append($('<option>', {
                value: docentes[i].id,
                text: docentes[i].nombres_completos
            }));
        }
    }

    function FormarOptionValueSedes(sedes) {
        $('#txtSedeMatricula').find('option').remove();
        SetParametroCursoPorDefecto("#txtSedeMatricula", '', 'Seleccione...');
        for (i = 0; i < sedes.length; i++) {
            $('#txtSedeMatricula').append($('<option>', {
                value: sedes[i].id,
                text: sedes[i].nombre
            }));
        }
    }

    function FormarOptionValueConvocatorias(tiposServicio) {
        $('#tipodeservicio2').find('option').remove();
        SetParametroCursoPorDefecto("#tipodeservicio2", '', 'Seleccione...');
        var select = '<select id="tipo_servicios" name="Servicios">';
        var options = '';
        for (i = 0; i < tiposServicio.length; i++) {
    //        options += '<option value="'+tiposServicio.id+'">'+tiposServicio.nombre+'</option>';
    $('#tipodeservicio2').append($('<option>', {
        value: tiposServicio[i].id,
        text: tiposServicio[i].nombre
    }));
}
select += options;
select += '</select>';
}



function FormarOptionValueModulos(modulos) {    
    $("#txtTipoFormacionMatricula").val("");
    $("#txtAreaOcupacionalMatricula").val("");
    $('#cmbModuloMatricula').find('option').remove();
    SetParametroCursoPorDefecto("#cmbModuloMatricula", '', 'Seleccione...');
    $('#txtDuracionModuloMatricula').val("");
    for (i = 0; i < modulos.length; i++) {
        $('#cmbModuloMatricula').append($('<option>', {
            value: modulos[i].Codigo + "$$" + modulos[i].Duracion,
            text: modulos[i].Nombre
        }));
    }
}

function FormarOptionValueMatriculasPre(pMatriculas) { 
    if (pMatriculas!== null) {
        setTimeout(function() {
            $('#cmbMatriculadoEnMatricula').find('option').remove();
            $('#cmbMatriculadoEnMatricula').attr("onchange", "validarCantidadInscritos(this)");
            SetParametroCursoPorDefecto("#cmbMatriculadoEnMatricula", '', 'Seleccione...');
            for (i = 0; i < pMatriculas.length; i++) {
                $('#cmbMatriculadoEnMatricula').append($('<option>', {
                    value: pMatriculas[i].Id,
                    text: pMatriculas[i].Salon + " - " + pMatriculas[i].Horario,
                    "data-matriculados" : pMatriculas[i].CantidadMatriculados
                }));
            }
        }, 500);
    }else{
        swal({title: "No hay salones disponibles, debe preprogramar",   
                        showConfirmButton: true,
                        type: "warning"});
    }
}

function validarCantidadInscritos(element){ 
	
    var inscritos = element.options[element.selectedIndex].getAttribute("data-matriculados"); 
    var salon = element.options[element.selectedIndex].text;
    inscritos = parseInt(inscritos);
    if(inscritos > 24){
        // var cuposLibres = 30-inscritos;
        var cuposLibres = cuposSalones-inscritos;
		//a la fecha existen tantos inscritos en el salon tal
		swal({title: "Actualmente existen " + inscritos + " inscritos en salón "+salon+" - Recuerde preprogramar",   
                        showConfirmButton: true,
                        type: "warning"});
        // swal({title: "Sólo quedan " + cuposLibres + " cupos libres en salón "+salon+" - Recuerde preprogramar",   
                        // showConfirmButton: true,
                        // type: "warning"});
    }
}

function AgregarObservacion() {
    var observaciones = $("#txtObservaciones").val();
    if (observaciones.trim().length > 0) {
        $.post("../../controlador/fachada.php", {
            clase: 'clsPersona',
            oper: 'AgregarObservacion',
            pIdTercero: parseInt($.cookie("id_ter")),
            pObservaciones: observaciones
        }, function(data) {
            if (data !== 0) {
                alert("Agrego observaciones a nit " + $("#identificacion2").val());
            }
            else {
                alert('error observacion');
            }
        }, "json");
    }
}

function LimpiarCampos(){
    $("#txtTipoFormacionMatricula").val("");
    $("#txtAreaOcupacionalMatricula").val("");
    $("#txtCodigoModuloMatricula").val("");
    $("#txtDuracionModuloMatricula").val("");
    $("#txtSedeMatricula").val("");
    $("#txtHorarioMatricula").val("");
    $("#txtDocenteMatricula").val(""); 
    $("#cmbMatriculadoEnMatricula").val(""); 
    $('#cmbMatriculadoEnMatricula').find('option').remove();
    SetParametroCursoPorDefecto("#cmbMatriculadoEnMatricula", '', 'Seleccione...');
}

function LimpiarCamposTercero(){
    $("#txtNombre").val("");
    $("#txtApellido").val("");
    $("#txtIdentificacion").val("");       
    $("#txtEstadoCivil").val("");
    $("#txtTelefonoFijo").val("");
    $("#txtTelefonoCelular").val("");
    $("#txtTelefonoAlterno").val("");
    $("#txtCorreoElectronico").val("");
    $("#txtGradoEscolaridad").val("");
    $("#txtMesAsignacion").val("");
    $("#txtLugarExpedicion").val("");
    $("#txtLocalidad").val("");
    $("#txtTipoDeConvocatoriaMatricula").val("");        $("#txtTipoDeConvocatoriaCarga").val("");
    $("#txtRutaNumeroCarga").val("");
    $("#txtRutaNumeroMatricula").val("");        $("#txtNombreCursoCarga").val("");      
    $("#txtCodigoCursoCarga").val("");
    $("#txtModuloCarga").val("");
    $("#txtDuracionModuloCarga").val("");
    $("#txtObservaciones").val("");
    $("#txtEstadoCarga").val("");
}

function ObtenerCodigoModulo(mod) {
    var aux = mod.split('$$');
    return aux[0];
}

function ActualizarTercero(){
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'ActualizarTercero',
        id:  $.cookie("pIdTercero"),
        tipoIdentificacion : $("#tipoIdentificacion").val(),
        identificacion: $("#txtIdentificacion").val(),
        lugarExpedicion : $("#selectLugarExpedicion").val(),
        nombres: $("#txtNombre").val(),
        apellidos: $("#txtApellido").val(),
        fechaNacimiento : $("#txtfechaNacimiento").val(),
        sexo : $("#sexo").val(),
        estadoCivil : $("#selectEstadoCivil").val(),
        gradoEscolaridad : $("#selectGradoEscolaridad").val(),
        tel_fijo: $("#txtTelefonoFijo").val(),
        tel_celular:$("#txtTelefonoCelular").val(),
        tel_alterno:$("#txtTelefonoAlterno").val(),
        direccion : $("#direccion").val()!=''?$("#direccion").val():'No suministrado',
        correo_electronico:$("#txtCorreoElectronico").val(),
        localidad : $("#selectLocalidad").val(),
        ciudad: $("#ciudad").val(),
        observaciones : $("#txtObservaciones").val()!=''?$("#txtObservaciones").val():'No suministrado'
    }, function(data) {
        if (data == 1) {
            alert("Actualizado con éxito");
        }else {
            console.log(data);
            alert('error actualizando tercero');
        }}, "json");
}


function dateDiff(dateold, datenew){
  var ynew = datenew.getFullYear();
  var mnew = datenew.getMonth();
  var dnew = datenew.getDate();
  var yold = dateold.getFullYear();
  var mold = dateold.getMonth();
  var dold = dateold.getDate();
  var diff = ynew - yold;
  if(mold > mnew) diff--;
  else
  {
    if(mold == mnew)
    {
      if(dold > dnew) diff--;
    }
  }
  return diff;
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

$( "#txtNombre" ).change(function() { //alert("hohoho");
	var today = new Date();
    var olday = new Date($("#txtfechaNacimiento").val());
    $("#txtEdad").val(dateDiff(olday,today));
					});
					
					
// function cargarCupos(preprogramacion) { 
    // $.post("../../controlador/fachada.php", {
        // clase: 'clsProgramacion',
        // oper: 'cargarCuposFaltantes',
        // preprogramacion: preprogramacion
    // }, function(data) { console.log(data);
        // if (data !== 0) { alert("ddd");
			// // if (data.CuposFaltantes <=5){
				// mostrarPopUpError("Faltan "+data.CuposFaltantes+" cupos para llenar el cupo total del salón");
				// // }
            // }
        // }, "json");
// }

function cargarCupos(preprogramacion){ 
		
		
		$.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'cargarCuposFaltantes',
        preprogramacion: preprogramacion
			
			
		}, function(data) { console.log(data);
			if (data !== "") {
				 if (data[0].CuposFaltantes <=5 && data[0].CuposFaltantes >= 0){
				mostrarPopUpError("Faltan "+data[0].CuposFaltantes+" cupos para llenar el cupo total del salón");
				 }
				 else if (data[0].CuposFaltantes < 0){
					 var valor = data[0].CuposFaltantes*(-1); 
					mostrarPopUpError("Tiene un sobrecupo de "+valor+" inscritos en el salón");
				 }
			}
			// else 
			// {
				// PopUpError(data.mensaje);
				
			// }
			}, "json");
	}
	
	function consultarCupos() {
		//cuposSalones=25; 
        $.post("../../controlador/fachada.php", {
            clase: 'clsProgramacion',
            oper: 'consultarCupos'
            
        }, function(data) {
            if (data !== 0) {
               cuposSalones=data[0].Nombre; 
            }
            else {
                alert('No se consultaron los cupos');
            }
        }, "json");
    
}
