/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//$(document).ready(function() {
//    obtSesion();
//});



   function login() {
        $.post("controlador/fachada.php", {
            clase: 'clsPersona',
            oper: 'logIn',
            nic_usu: $("#txtusuario").val(),
            con_usu: $("#txtcontrasena").val()
        }, function(data) {
            if (data !== null) {
                limpiarLogin();
            }
            else {
                console.log("error sesion");
                $("#textoError").text("Usuario o Contraseña incorrectos");
                $('#element_to_pop_upError').bPopup({
                    speed: 450,
                    transition: 'slideDown'
                });
            }
        }, "json");
    }

    function limpiarLogin() {
        $("#txtusuario").val("");
        $("#txtcontrasena").val("");
        window.location = "vista/html/preprogramacion.html";
    }

    function insertarTercero() {
        if (coincidenContrasenas()) {
            $.post("../../controlador/fachada.php", {
                clase: 'acceso',
                oper: 'insertar'
            }, function(data) {
                if (data !== null) {
                    alert('Data------>' + data);
                }
                else {
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
