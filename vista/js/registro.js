$(function() {
    $("#btnregistrarse").click(function() {
        registrarTercero();
    });
    $("#btnacceso").click(function() {
        window.location = "../../index.html";
    });
    $("#btnregistro").click(function() {
        window.location = "../html/registro.html";
    });
    $("#btnDireccion").click(function() {
        limpiarRegistro();
    });
});

function registrarTercero() {
        if (coincidenContrasenas()) {
            console.log("registrar tercero");
            $.post("../../controlador/fachada.php", {
                clase: 'clsPersona',
                oper: 'registrarPersona',
                nom_usu: $("#txtnombre").val(),
                ape_usu: $("#txtapellido").val(),
                ced_usu: $("#txtcedula").val(),
                ema_usu: $("#txtusuario").val(),
                con_usu: $("#txtcontrasena").val()
            }, function(data) {
                console.log("Data : " + data);
                if (data !== 0) {
                    //alert('Registrado Correctamente');
                    $("#textoConfirmacion").text("Registrado Correctamente");
                    $('#element_to_pop_upCon').bPopup({
                        speed: 450,
                        transition: 'slideDown'
                    });
                    //limpiarRegistro();
                }
                else {
                    alert('error');
                }
            }, "json");
        } else {
           alert("Las contraseñas no coinciden");
        }
    }

    function limpiarRegistro() {
        $("#txtnombre").val("");
        $("#txtapellido").val("");
        $("#txtcedula").val("");
        $("#txtusuario").val("");
        $("#txtcontrasena").val("");
        window.location = "../../index.html";
    }

    function coincidenContrasenas() {
        console.log("coincidenContrasenas() ");
        var flag = false;
        var con = $("#txtcontrasena").val();
        console.log('$("txtcontrasena").val(): ' + $("#txtcontrasena").val());
        var conf = $("#txtconfirmarcontrasena").val();
        console.log('$("txtconfirmarcontrasena").val(): ' + $("#txtconfirmarcontrasena").val());
        if (con === conf) {
            console.log("Trure");
            flag = true;
        }
        return flag;
    }




