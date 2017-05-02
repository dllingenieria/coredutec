function mostrarMatricula(id) {
    $("#pre_id").val(id);
    $("#ins_dat").show();
    $("#consultadatos").hide();
    $.post("../../controlador/fachada.php", {
        clase: 'clsProgramacion',
        oper: 'cargarPreprogramacionPorId',
        id: parseInt(id)
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

//FUNCION ECARGADA DE RECIBIR EL RESPONSE CON INFORMACIÒN DE LA 
function cargarDatosPreprogramacion(res) {
    //alert('res[0].id_rut: '+res[0].id_rut);
    flag_car_mod = false;
    $("#codigomatricula2").val(res[0].cod_mat);
    obtenerTipoServicio(res[0].tip_ser);
    // horafinal2
    obtenerRuta(res[0].id_rut);
    setTimeout(function() {
        obtenerCurso(res[0].cod_cur);
    }, 1000);
    obtenerHora('horainicio2', res[0].hra_ini);
    obtenerHora('horafinal2', res[0].hra_fin);
    $("#fechainicio2").val(res[0].fec_ini);
    $("#fechafinal2").val(res[0].fec_fin);
    $("#diasdelcurso2").val(res[0].dia_cur);
    $("#estado2").val(res[0].pre_est);
    $("#tipodecertificacion2").val(res[0].tip_cer);
    console.log("val _>"+res[0].pre_est);
    if (res[0].cod_mod !== '') {
        setTimeout(function() {
            obtenerModulo(res[0].cod_mod);
        }, 2000);
    }
    ;
    obtenerDocente(res[0].docente);
    obtenerSede(res[0].sede);
    obtenerEntregable(res[0].ent_pro);
    modoModificarOn();
}

function modoModificarOn() {
    modo_modificar = true;
    $("#btncancelar").click(function(){
        modo_modificar = false;
        location.reload(true);
    });
}

function obtenerEntregable(ent) {
    $("#entregables2 option").each(function() {
        if ($(this).attr('value') === ent) {
            $("#entregables2").val($(this).attr('value')).prop('selected', true);
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
    $("#sede2 option").each(function() {
        if ($(this).attr('value') === sed) {
            $("#sede2").val($(this).attr('value')).prop('selected', true);
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
    $("#modulo2 option").each(function() {
        aux_nom = $(this).attr('value').split('$$');
        if (aux_nom[0] === cod_mod) {
            $("#modulo2").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
            var aux_dur = $(this).val().split("$$");
            $('#duracionmodulo2').val(aux_dur[1]);
        }
    });
}

function obtenerTipoServicio(tip_ser) {
    $("#tiposdeservicio2 option").each(function() {
        if ($(this).attr('value') === tip_ser) {
            $("#tipodeservicio2").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
        }
    });
}


function obtenerRuta(rut) {
    var aux_rut = '';
    $("#rutadeformacion2 option").each(function() {
        if ($(this).attr('value') === rut) {
            $("#rutadeformacion2").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
            aux_rut = $(this).text();
        }
    });
    cargarCursosPorRuta(aux_rut);
}

function obtenerCurso(cur) {
    $("#curso2 option").each(function() {
        if ($(this).attr('value') === cur) {
            $("#curso2").val($(this).attr('value')).prop('selected', true);
            this.selected = true;
            cargarDatosCursoPorCodigo($(this).attr('value'));
        }
    });
}

function cargarGridMatriculas() {
    var grid;
    $("#ins_dat").hide();
    $("#consultadatos").show();
    var clase = 'clsProgramacion';
    var fun = 'cargarPreprogramaciones';
    var columnas = {
        'cabeceras': ['id', 'Codigo matricula', 'Tipo servicio', 'Nombre curso', 'Horario', 'Hora inicio', 'Hora fin', 'Sede', 'Docente', 'Fecha inicio', 'Fecha fin'],
        'datos': [
            //accionesGrid,
            {name: 'id', index: 'id_pre', hidden: true, width: 120, sortable: true, editable: true, editrules: {required: true}},
            {name: 'cod_mat', index: 'cod_mat', width: 120, sortable: true, editable: true, search: true, editrules: {required: true}},
            {name: 'tip_ser', index: 'tip_ser', width: 140, sortable: true, editable: true, search: true, editrules: {required: true}},
            {name: 'curso', index: 'nom_cur', width: 200, sortable: true, editable: true, search: true, editrules: {required: true}},
            {name: 'horario', index: 'pre_hor', width: 120, sortable: true, editable: true, search: true, editrules: {email: true, required: false}},
            {name: 'hra_ini', index: 'pre_hin', width: 120, sortable: true, editable: true, search: true, editrules: {required: true}},
            {name: 'hra_fin', index: 'pre_hfi', width: 120, sortable: true, editable: true, search: true, editrules: {required: true}},
            {name: 'sede', index: 'pre_sed', width: 200, sortable: true, editable: true, search: true, editrules: {required: true}},
            {name: 'docente', index: 'pre_doc', width: 200, sortable: false, search: true, editrules: {required: true}},
            {name: 'fec_ini', index: 'pre_fin', width: 120, sortable: false, search: true, editrules: {required: true}},
            {name: 'fec_fin', index: 'pre_ffi', width: 120, sortable: false, search: true, editrules: {required: true}}
        ]
    };
    var idBarraHerramientas = "#tbl-busqueda-paper";
    jQuery('#tbl-busqueda-grid').jqGrid('GridUnload');
    grid = jQuery('#tbl-busqueda-grid').jqGrid({
        url: '../../controlador/fachada.php',
        datatype: "json",
        mtype: 'POST',
        postData: {
            clase: clase,
            oper: fun
        },
        height: 300,
        rowNum: 10,
        rowList: [10, 20, 30],
        colNames: columnas.cabeceras,
        colModel: columnas.datos,
        autowidth: false,
        shrinkToFit: false,
        sortname: 'cod_mat',
        sortorder: "asc",
        width: 900,
        pager: idBarraHerramientas,
        viewrecords: false,
        caption: "Resultado",
        multiselect: false,
        hiddengrid: false,
        cellurl: 'controlador/fachada.php?clase=' + clase,
        cellsubmit: 'remote',
        search: {
            caption: "Search...",
            Find: "Find",
            Reset: "Reset",
            odata: ['equal', 'not equal', 'less', 'less or equal', 'greater', 'greater or equal', 'begins with', 'does not begin with', 'is in', 'is not in', 'ends with', 'does not end with', 'contains', 'does not contain'],
            groupOps: [{op: "AND", text: "all"}, {op: "OR", text: "any"}],
            matchText: " match",
            rulesText: " rules"
        },
        onSelectRow: function(ids) {
            var getData = grid.jqGrid('getRowData', ids);
            // id_ter = getData.id_ter;
            // id_par = getData.id_par;
            // num_ide = getData.numero_identificacion;
            // usu_cur = getData.nombre_curso;
            // est_pre = getData.estado_preprogramacion;
            // set_coo(id_ter, num_ide, id_par, usu_cur,est_pre);
            mostrarMatricula(getData.id);
        },
        editurl: "../../controlador/fachada.php?clase=" + clase
    }).jqGrid('navGrid', '#tbl-busqueda-paper', {
        refresh: true,
        edit: false,
        add: false,
        del: false,
        search: true},
    {multipleSearch: true, multipleGroup: true},
    {}, {}, {}
    ).jqGrid();
//    ).jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
    // grid.jqGrid('filterToolbar', {searchOnEnter: false, afterClear: false, beforeSearch: false, beforeClear: false});
//    ).jqGrid('filterToolbar', {stringResult: true, searchOnEnter: false, defaultSearch: "cn"});
    //grid.jqGrid('filterToolbar', {stringResult: true, searchOnEnter: true, defaultSearch: "cn"});
//    jQuery("#tbl-busqueda-grid").jqGrid('filterToolbar', {searchOnEnter: false, afterClear: false, beforeSearch: false, beforeClear: false});
}




