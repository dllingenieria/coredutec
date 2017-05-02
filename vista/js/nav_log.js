$(function() { 
    $("#btnCerrar").click(function() {
        cerrarSesion();
    });

    $("#btnCapturar").click(function() {
        window.location = "../html/captura.html";
    });

    $("#btnBuscar").click(function() {
        window.location = "../html/busqueda.html";
    });

    $("#btnCancelar").click(function() {
        window.location = "../html/busqueda.html";
    });

    $("#btnPreprogramacion").click(function() {
        window.location = "../html/preprogramacionNueva.html";
    });
    
    $("#btnNovedades").click(function() {
        window.location = "../html/novedades.html";
    }); 

    $("#btnMatriculas").click(function() {
        window.location = "../html/consultarMatriculas.html";
    }); 
    
    $("#btnEvaluacion").click(function() {
        // window.location = "../html/evaluacion.html";
        window.location = "../html/ingresoEvaluacion.html";
    }); 

    $("#btnReportes").click(function() {
        window.location = "../html/reportes.html";
    });    

    $("#btnAdministracion").click(function() {
        window.location = "../html/administracion.html";
    });    
});





