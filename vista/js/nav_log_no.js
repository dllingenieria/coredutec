$(function() {
    $("#btnEntrar").click(function() {
        IniciarSesion();
    });

    $("#btnacceso").click(function() {
        window.location = "/cet/";
    });

    $("#btnregistro").click(function() {
        window.location = "/cet/vista/html/registro.html";
    });
})

