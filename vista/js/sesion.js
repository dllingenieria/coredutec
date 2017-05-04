var pop_err = '<div id="element_to_pop_upError" class="element_to_pop_upError"><div><label id="textoError" class="popup" style="margin-left: 174px; font-family: \'Roboto-Light\'; font-size: 18px;"> </label></div><br><br><div><label id="textoError1" class="popup" style="margin-left: 174px; font-family: \'Roboto-Light\'; font-size: 18px;"> </label></div></div>';
 
var vistas = {
    // 0:{"nombre":"Captura Base de Datos","url":"captura.html"}, 
    0:{"nombre":"Cargas Masivas","url":"captura.html"}, 
    1:{"nombre":"Buscar por Documento","url":"busqueda.html"}, 
    2:{"nombre":"Preprogramación","url":"preprogramacionNueva.html"}, 
    3:{"nombre":"Novedades","url":"novedades.html"}, 
    4:{"nombre":"Matrículas","url":"consultarMatriculas.html"}, 
    // 5:{"nombre":"Evaluación","url":"evaluacion.html"}, 
    5:{"nombre":"Evaluación","url":"ingresoEvaluacion.html"}, 
    6:{"nombre":"Facturación","url":"facturacion.html"}, 
    7:{"nombre":"Administración","url":"administracion.html"}, 
    8:{"nombre":"Reportes","url":"reportes.html"},
    9:{"nombre":"Registrar Asistencia","url":"registrarAsistencia.html"},
    10:{"nombre":"Imprimir Asistencia","url":"imprimirAsistencia.html"},
	11:{"nombre":"Configuración","url":"configuracion.html"}
};

var vistasAdministrador = [0,1,2,3,4,5,6,7,8,11];
var vistasMatriculador = [1,4,9,10];

$(function(){
    ObtSesion();
    $("#cerrarSesion").click(function() {
        cerrarSesion();
    });
    $("#cambiarRol").click(function() {
        cambiarRol();
    });
});

function ObtSesion() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'haySesion'
    }, function(data) {
        if ( data !== 0 && typeof 'string') {
            verificarIntegridad(data);
        }
        else {
            alert("Por favor inicie sesión");
            window.location = "../../";
        }
    }, "json");
}

function obtenerIdUsuario(callback){
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'obtenerIdUsuario'
    },function(data) {
        if (data !== "sin sesion") {
            callback(data);
        }else{
            window.location = "../../";
        }
    }, "json");
}

function obtenerIdTercero(callback){
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'obtenerIdTercero'
    },function(data) {
        if (data !== "sin sesion") {
            callback(data);
        }else{
            window.location = "../../";
        }
    }, "json");
}

function verificarIntegridad(data){
    mostrarNombreUsuario(data[0]);
    validarPermisosPorRol(data[1]);
    cargarVistas();
}

function mostrarNombreUsuario(data){
     //Nueva implementacion
     if ($("#nombre").length) {
        $("#nombre").html(data);
    }
    //Vieja  implementacion
    if ($("#titulo3").length) {
        $("#titulo3").empty();
        $("#titulo3").append("Bienvenido (a)          " + data);
    }
}

function validarPermisosPorRol(roles){
    var url = window.location.pathname.split('/');
    var vista = url[url.length-1];

    if (roles.esMatriculador && !roles.esAdministrador) {      
        //Viejo html
        $("#btnCapturar").remove();
        $("#btnPreprogramacion").remove();
        $("#btnNovedades").remove();
        $("#btnPreprogramacion").remove();
        $("#btnEvaluacion").remove();
        $("#btnFacturacion").remove();
        $("#btnAdministracion").remove();
        $("#btnReportes").remove();
    }

    // if (roles.esAdministrador && !roles.esDocente) {
    //     if (!(vista === "captura.html" || vista === "busqueda.html" || vista === "formato.html" || 
    //         vista === "preprogramacion.html" || vista === "novedades.html" || vista === "consultarMatriculas.html" ||
    //         vista === "iniciarSesion.html" || vista === "matricula.html")) {
    //         window.location = "../../";}
    // }else if (roles.esMatriculador && !roles.esAdministrador && !roles.esDocente) {
    //     if (!(vista === "iniciarSesion.html" || vista === "matriculador.html" || 
    //         vista === "matricula.html" || vista === "consultarMatriculas.html")) {
    //         window.location = "../../"; }
    // }else if (roles.esMatriculador && !roles.esAdministrador && roles.esDocente) {
    //     if (!(vista === "iniciarSesion.html" || vista === "busqueda.html" || 
    //         vista === "formato.html" || vista === "matricula.html" || vista === "consultarMatriculas.html" || 
    //         vista === "docente.html" || vista === "asistencia.html" || 
    //         vista === "notas.html" || vista === "filtroReporteAsistencia.html" ||
    //         vista === "reporteAsistencia.html" ||vista === "formatoFirmas.html")) {
    //         window.location = "../../"; }
    // }else if (!roles.esMatriculador && !roles.esAdministrador && roles.esDocente) {
    //     if (!(vista === "iniciarSesion.html" || vista === "docente.html" || 
    //         vista === "asistencia.html" || vista === "notas.html" ||
    //         vista === "filtroReporteAsistencia.html" || vista === "reporteAsistencia.html" ||
    //         vista === "formatoFirmas.html")) {
    //         window.location = "../../"; }
    // }
}   

function cargarVistas(){
    switch(sessionStorage.rolSeleccionado){
        case "1":
        mostrarVistas(vistasAdministrador);
        break;
        case "3":
        mostrarVistas(vistasMatriculador);
        break;
    }
}

function mostrarVistas(vistasPermitidas){
    var url = window.location.pathname.split('/');
    var vistaActual = url[url.length-1];
    
    for (var i = 0; i < vistasPermitidas.length; i++) {
        var vista = vistas[vistasPermitidas[i]];
        var element = $(document.createElement('a'));
        element.html(vista.nombre);
        element.attr("href",vista.url);
        if (vistaActual === vista.url) {
            element.addClass("activo");
        }
        element.addClass("navegacion");
        $(".barraNavegacion").append(element);
    }
}

function cerrarSesion() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'killSesion'
    }, function(data) {      
    }, "json");
    setTimeout(function(){
       window.location = "../../";
   },1500); 
}

function cambiarRol() {
    window.location = "iniciarSesion.html";
}


function capitalizar(text) {
    newText = text.split(" ").map(function(word){
        return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
    }); 
    return newText.join(" ");
}