
$(document).ready(function() {
    setParametroPorDefecto("#cmbTipoIdentificacion", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbLugarExpedicion", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbSexo", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbEstadoCivil", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbGradoEscolaridad", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbLocalidad", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbCiudadResidencia", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbRol", '0', 'Seleccione...');
    //setParametroPorDefecto("#cmbEstadoUsuario", '0', 'Seleccione...');
    setParametroPorDefecto("#cmbCargo", '0', 'Seleccione...');
    //setParametroPorDefecto("#cmbEstadoDocente", '0', 'Seleccione...');
    cargarListas('cmbTipoIdentificacion','SPCARGARTIPOIDENTIFICACION');
    cargarListas('cmbLugarExpedicion','SPCARGARCIUDADES');
    cargarListas('cmbSexo','SPCARGARSEXO');
    cargarListas('cmbEstadoCivil','SPCARGARESTADOCIVIL');
    cargarListas('cmbGradoEscolaridad','SPCARGARGRADOESCOLARIDAD');
    cargarListas('cmbLocalidad','SPCARGARLOCALIDAD');
    cargarListas('cmbCiudadResidencia','SPCARGARCIUDADES');
    cargarListas('cmbRol','CARGAR_SEXO');
    //cargarListas('cmbEstadoUsuario','SPCARGARESTADOS');
    cargarListas('cmbCargo','CARGAR_TIPOIDENTIFICACION');
    //cargarListas('cmbEstadoDocente','SPCARGARESTADOS');
});
//==============================================================
//                      CARGAR LISTAS
//==============================================================

/**
* [cargarlistas Carga todas las listas provenientes de las tablas paramétro y tipoparametro]
* @author John James Granados Restrepo (gjohnj)
* @param  [string] $param [id de preprogramación]
* @return [array]        [array con los datos y notas asociadas a cada estudiante]
*/
function cargarListas(objeto,procedimiento) {
    $.post("../../controlador/fachada.php", {
        clase: 'clsUsuario',
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

function formarOptionValueLista(data,objeto) {
    $('#'+objeto).find('option').remove();
    setParametroPorDefecto('#'+objeto, '0', 'Seleccione...');
    for (i = 0; i < data.length; i++) {
        $('#'+objeto).append($('<option>', {
            value: data[i].Id,
            text: data[i].Nombre
        }));
    }
} 

function setParametroPorDefecto(atributo, valor, texto) {
    $(atributo).append($('<option>', {
        value: valor,
        text: texto
    }));
}