$(function() {
    var tipoParametro="";
    cargarDatos();

    //Cargar datos en el formulario de tipo parametro//
    function recuperarDatosTipoParametro() {
        $("#txtNombreTipoParametro").val(sessionStorage.nom_tpar);
        $("#SelectEstadoTipoParametro").val(sessionStorage.est_tpar);
        $("#btn-save").hide();
        $("#btn-view1").hide();
    }

    //Oculta los campos en el formulario de tipo parametro//
    function ocultarCamposTipoParametro(){
        $("#btn-add").hide();
        $("#btn-view").show();
        $("#btn-save").show();
        $("#btn-edit").hide();
        $("#btn-view1").hide();
        $("#ContentEstadoTipoParametro").hide();
    }


    //Cargar datos en el formulario de parametro//
    function recuperarDatosParametro() {
        $("#txtNombreParametro").val(sessionStorage.nom_par);
        $("#txtEstadoParametro").val(sessionStorage.est_par);
        $("#btn-save").hide();
        $("#btn-view1").hide();
    }

    //Oculta los campos en el formulario de tipo parametro//
    function ocultarCamposParametro(){
        $("#btn-add").hide();
        $("#btn-view").show();
        $("#btn-save").show();
        $("#btn-edit").hide();
        $("#btn-view1").hide();
    }

    //Cargar datos en el formulario de Convocatoria//
    function recuperarDatosConvocatoria() {
        $("#txtNombreConvocatoria").val(sessionStorage.nom_conv);
        $("#txtNombreCortoConvocatoria").val(sessionStorage.nom_convC);
        $("#SelectEstadoConvocatoria").val(sessionStorage.est_conv);
        $("#txtSerieConvocatoria").val(sessionStorage.ser_conv);
        $("#btn-save").hide();
        $("#btn-view1").hide();
    }

    //Oculta los campos en el formulario convocatoria//
    function ocultarCamposConvocatoria(){
        $("#btn-add").hide();
        $("#btn-view").show();
        $("#btn-save").show();
        $("#btn-edit").hide();
        $("#btn-view1").hide();
        $("#ContentEstadoConvocatoria").hide();
    }


    //Oculta los campos en el formulario curso//
    function ocultarCamposCurso(){
        $("#btn-add").hide();
        $("#btn-view").show();
        $("#btn-save").show();
        $("#btn-edit").hide();
        $("#btn-view1").hide();
        $("#ContentEstadoCurso").hide();
        cargarCombos('clsCurso','SPCARGARRUTAS','#selectRutaCurso');
        cargarCombos('clsCurso','SPCARGARDURACIONCURSO', '#selectDuracionCurso');
    }


    //Oculta los campos en el formulario curso//
    function ocultarCamposUsuario(){
        $("#emp-SaveForm").hide();
        $("#btn-add").hide();
        $("#btn-view").show();
        $("#btn-save").show();
        $("#btn-edit").hide();
        $("#btn-view1").hide();
        $("#selectEstadoUsuario").hide();
        $(".estado").hide();
        cargarCombos1('clsUsuario','SPCARGARTIPOIDENTIFICACION','#cmbTipoIdentificacion');
        cargarCombos1('clsUsuario','SPCARGARCIUDADES','#cmbLugarExpedicion');
        cargarCombos1('clsUsuario','SPCARGARSEXO', '#cmbSexo');
        cargarCombos1('clsUsuario','SPCARGARESTADOCIVIL','#cmbEstadoCivil');
        cargarCombos1('clsUsuario','SPCARGARGRADOESCOLARIDAD','#cmbGradoEscolaridad');
        cargarCombos1('clsUsuario','SPCARGARLOCALIDAD','#cmbLocalidad');
        cargarCombos1('clsUsuario','SPCARGARCIUDADES','#cmbCiudadResidencia');
        configuracionDatapicker();
        $("#txtFechaNacimiento").datepicker();
    }

    //Cargar datos en el formulario curso//
    function recuperarDatosUsuario() {
        cargarCombos1('clsUsuario','SPCARGARTIPOIDENTIFICACION','#cmbTipoIdentificacion');      
        cargarCombos1('clsUsuario','SPCARGARCIUDADES','#cmbLugarExpedicion');
        cargarCombos1('clsUsuario','SPCARGARSEXO', '#cmbSexo');   
        cargarCombos1('clsUsuario','SPCARGARESTADOCIVIL','#cmbEstadoCivil');
        cargarCombos1('clsUsuario','SPCARGARGRADOESCOLARIDAD','#cmbGradoEscolaridad');
        cargarCombos1('clsUsuario','SPCARGARLOCALIDAD','#cmbLocalidad');
        cargarCombos1('clsUsuario','SPCARGARCIUDADES','#cmbCiudadResidencia');
        //cargarCombos1('clsUsuario','SPCARGARCIUDADES','#cmbRol');
        //cargarCombos1('clsUsuario','SPCARGARCIUDADES','#cmbCargo');
        if((sessionStorage.idUsu=="") && (sessionStorage.idDocUsu=="")){
            $("#rEstudiante").prop( "checked", true );
        }else{
             $("#rEstudiante1").prop( "checked", true);
        }
        $("#txtIdentificacion").val(sessionStorage.IdeUsu);
        $("#txtNombres").val(sessionStorage.NomUsu);
        $("#txtApellidos").val(sessionStorage.ApeUsu);   
        configuracionDatapicker();
        $("#txtFechaNacimiento").datepicker();
        $("#txtFechaNacimiento").val(sessionStorage.FNacUsu);
        $("#txtTelefono1").val(sessionStorage.te1Usu); 
        $("#txtTelefono2").val(sessionStorage.te2Usu); 
        $("#txtTelefono3").val(sessionStorage.te3Usu); 
        $("#txtDireccion").val(sessionStorage.dirUsu);
        $("#txtEmail").val(sessionStorage.emaUsu);  
        $("#txtUsuario").val(sessionStorage.usuUsu);  
        var rol = sessionStorage.rolUsu.split(',');
            if(rol[0]=="1"){
                $("input[value=administrador]").prop('checked', true);
            }
            if(rol[1]=="1"){
                $("input[value=docente]").prop('checked', true);
            }
            if(rol[2]=="1"){
                $("input[value=matriculador]").prop('checked', true);
            }
        $("#selectEstadoUsuario").val(sessionStorage.estUsu);
        cargarValorSelected('#cmbTipoIdentificacion',sessionStorage.tIdenUsu,2000); 
        cargarValorSelected('#cmbLugarExpedicion',sessionStorage.LExpUsu,3000);   
        cargarValorSelected('#cmbSexo',sessionStorage.sexUsu,4000); 
        cargarValorSelected('#cmbEstadoCivil',sessionStorage.ECivUsu,5000);   
        cargarValorSelected('#cmbGradoEscolaridad',sessionStorage.gEscUsu,6000);   
        cargarValorSelected('#cmbLocalidad',sessionStorage.locUsu,7000);  
        cargarValorSelected('#cmbCiudadResidencia',sessionStorage.ciuUsu,8000);
        $("#btn-save").hide();
        $("#btn-view1").hide();
    }

    ///Valida que tipo de datos debe cargar
    function cargarDatos(){
        tipoParametro = sessionStorage.tip_conf;
        switch(tipoParametro) {
            case '0':
                 ocultarCamposTipoParametro();
            break;
            case '1':
                 recuperarDatosTipoParametro();
            break;
            case '2':
                 ocultarCamposParametro();
            break;
            case '3':
                 recuperarDatosParametro();
            break;
            case '4':
                 ocultarCamposConvocatoria();
            break;
            case '5':
                 recuperarDatosConvocatoria();
            break;
            case '6':
                 ocultarCamposCurso();
            break;
            case '8':
                 ocultarCamposUsuario();
            break; 
            case '9':
                 recuperarDatosUsuario();
            break;
        }
        
    }

    //Carga Información Combos desplegables
    function cargarCombos(clase,procedimiento,objeto) {
        $.post("../../controlador/fachada.php", {
            clase: clase,
            oper: "cargarListas",
            procedimiento: procedimiento
        }, function(data) {
            if (data !== 0) {
                formarOptionValue(data, objeto);
            }
            else {
                alert('error cargar '+procedimiento);
            }
        }, "json");
    }


       //Carga Información Combos desplegables
    function cargarCombos1(clase,procedimiento,objeto) {
        $.post("../../controlador/fachada.php", {
            clase: clase,
            oper: "cargarListas1",
            procedimiento: procedimiento
        }, function(data) {
            console.log(data);
            if (data !== 0) {

                 $(objeto).html(data);
            }
            else {
                alert('error cargar '+procedimiento);
            }
        });
    }


  
    function formarOptionValue(data,selectData) {
        $(selectData).find('option').remove();
        SetParametroPorDefecto(selectData, '', 'Seleccione...');
        for (i = 0; i < data.length; i++) {
            $(selectData).append($('<option>', {
                value: parseInt(data[i].Id),
                text: data[i].Nombre
            }));
        }
    }


    function SetParametroPorDefecto(atributo, valor, texto) {
        $(atributo).append($('<option>', {
            value: valor,
            text: texto
        }));
    }
 

   function configuracionDatapicker(){
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
        $.datepicker.setDefaults($.datepicker.regional['es']);
    }

    function cargarValorSelected(objeto,value,tiempo){
        setTimeout(function() {
            $(objeto+' option[value="'+value+'"]').attr('selected','selected');    
        }, tiempo);       
    }

    //**** Valida en el formulario de Usuario si en nombre de usuario existe o no ****//
   $("input[id='txtUsuario']").change(function() {
        if(tipoParametro==8){
           validarUsuarioChange($("#txtUsuario").val());
            $("#txtPassword").focus()
        }
    });
    function validarUsuarioChange(valor){
       var msj="";
         $.post("../../controlador/fachada.php", {
                clase: 'clsConfiguracion',
                oper: 'validarNombreUsuario',
                nomUsu: valor
            }, function(data) {
                if (data !== null) {
                    var idUsuario=data[0]['IdUsuario'];
                    if(idUsuario!="0"){
                       PopUpError("Ya existe un usuario: "+$("#txtUsuario").val());
                      msj="Ya existe un usuario: "+$("#txtUsuario").val();
                    }
                }
                else {
                      PopUpError('Hay varios usuarios con este nombre de usuario');
                      msj="Hay varios usuarios con este nombre de usuario";
                }
            }, "json");    
        return msj;
    }

         
    //**** Valida en el formulario de Usuario si es estudiante o no para enviar si hay que guardar usuario y docente ****//
     $("#rEstudiante").on('change', function() {
            $(".formUsuario").hide();
            $("#emp-SaveForm").show();
           
    });
   
     $("#rEstudiante1").on('change', function() {
            $(".formUsuario").show();
            $("#emp-SaveForm").show();
    });
   

    function PopUpConfirmacion(msj){
    $("#textoConfirmacion1").text(msj);
        $('#element_to_pop_upCon').bPopup({
            speed: 450,
            transition: 'slideDown'
        });
    }

    function PopUpError(err_men) {
        $("#textoError").text(err_men);
        $('#element_to_pop_upMen').bPopup({
            speed: 450,
            transition: 'slideDown'
        });
    }
});
