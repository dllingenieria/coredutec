 $(function () {
    $("#btnacceso").click(function () {
        window.location = "vista/html/acceso.html";
    });
    
    $("#btnregistro").click(function () {
        window.location = "vista/html/registro.html";
    });
});

 function IniciarSesion() {
    
    if ($("#txtUsuario").val() === "docente" && $("#txtContrasena").val() === "1234") {
        window.location = "vista/html/docente.html";
    }else{
        $.post("controlador/fachada.php", {
            clase: 'clsPersona',
            oper: 'IngresoSistema',
            pNic_usu: $("#txtUsuario").val(),
            pCon_usu: $("#txtContrasena").val()
        }, function(data) {
            console.log("hola")
            if (data !== null) {
                var roles = data[0].Roles.split(",");
                sessionStorage.esAdministrador=roles[0];
                sessionStorage.esDocente=roles[1];
                sessionStorage.esMatriculador=roles[2];
                sessionStorage.esCallCenter=roles[3];
				sessionStorage.esAlimentacion=roles[4];
                var rolesDisponibles=0;
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i] === "1") {
                        rolesDisponibles++;
                    }
                }
                if (rolesDisponibles>1) {
                    window.location = "vista/html/iniciarSesion.html";
                }else{
                    if (sessionStorage.esAdministrador==="1") {
                        window.location = "vista/html/captura.html";
                    }
                    if (sessionStorage.esDocente==="1") {
                        window.location = "vista/html/docente.html";
                    }
                    if (sessionStorage.esMatriculador==="1") {
                        window.location = "vista/html/busqueda.html";
                    }
                    if (sessionStorage.esCallCenter==="1") {
                        window.location = "vista/html/callCenter.html";
                    }
					if (sessionStorage.esAlimentacion==="1") {
                        window.location = "vista/html/alimentacion.html";
                    }
                }
            }else {
                $("#textoError").text("Usuario o Contraseña incorrectos");
                $('#element_to_pop_upMen').bPopup({speed: 450,transition: 'slideDown'});
            }}, "json");
    }
}

function insertarTercero() {
    if (coincidenContrasenas()) {
        $.post("../../controlador/fachada.php", {
            clase: 'acceso',
            oper: 'insertar'
        }, function(data) {
            if (data !== null) {
                alert('Data------>' + data);
            }else {
                alert('Error');
            }
        }, "json");
    } else {
        $("#textoError").text("Las contaseñas no coinciden.");
        $('#element_to_pop_upError').bPopup({
            speed: 450,
            transition: 'slideDown'
        });
    }
}

function coincidenContrasenas() {
    var flag = false;
    var con = $("txtcontrasena").val();
    var conf = $("txtconfirmarcontrasena").val();
    if (con === conf) {
        flag = true;
    }
    return flag;
}