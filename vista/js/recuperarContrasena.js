$(function() { 
    //$('#txtLogin').validCampoFranz1('abcdefghijklmnopqrstuvwxyz');

	$("#btnRecuperar").click(function(){ 
		var login = "";
        var email = "";
        login = $("#txtLogin").val();
        email = $("#txtEmail").val();
		if (login == ""){
            mostrarPopUpError("Por favor escriba el login usado");
		}else{
            if (email == ""){
                mostrarPopUpError("Por favor escriba el email registrado");
            }else{
                var mensaje="Procesando la información<br>Espere por favor";
                jsShowWindowLoad(mensaje);
                generarLinkTemporal(login,email);
            }
		}
	});

    function generarLinkTemporal(login, email){
        // Se genera una cadena para validar el cambio de contraseña
        var token = login+email+Math.random(1,9999999);
        $.post("../../controlador/fachada.php", {
            clase: 'clsRecuperarContrasena',
            oper: 'insertarLinkToken',
            login: login,
            token: token
            }, function(data) {
            if (data[0].pEmail == 0) {
                jsRemoveWindowLoad();
                $("#lblDatosIncorrectos").html("Por favor verifique el login suministrado");
                $("#recuperarContrasena").show();
            }else{
                var res = data[0].pEmail.split("_");
                var para = res[0];
                var link = res[1];
                var nombres = res[2];
                var correoparamostrar = para.replace(para.substr(2,(parseInt(para.length)-5)), "******");
                jsRemoveWindowLoad();
                $("#lblDatosIncorrectos").html("Se enviará un mensaje con instrucciones a la dirección "+correoparamostrar+" que aparece registrada. <br> ¿Desea continuar?");
                $("#recuperarContrasena").show();
                $("#botones").show();
                $("#btnSi").click(function(){ 
                    var mensaje="Procesando la información<br>Espere por favor";
                    jsShowWindowLoad(mensaje);
                    $("#recuperarContrasena").hide();
                    $("#botones").hide();
                    enviarCorreo(para,link,nombres)
                });
                $("#btnNo").click(function(){ window.location.href = "../../index.html"; });
            } 
        }, "json");
    }

    function enviarCorreo(para,link,nombres){
        $.ajax({
        url: '../../controlador/fachada.php',
        type: 'POST',
        dataType: 'json',
        async :false,
        data: {
            clase: 'clsRecuperarContrasena',
            oper: 'enviarCorreoContrasena',
            para: para,
            link: link,
            nombres: nombres,
            }
        }).done(function(data) {
            if(data == 1){
                jsRemoveWindowLoad();
                var correoparamostrar = para.replace(para.substr(2,(parseInt(para.length)-5)), "******");
                $("#lblDatosIncorrectos").html("El proceso terminó satisfactoriamente. Un mensaje con instrucciones del proceso fue enviado al correo. Por favor verifique");
                $("#recuperarContrasena").show();
                setTimeout(function() {
                    window.location.href = "../../index.html";
                }, 8000);
            }else{
                jsRemoveWindowLoad();
                $("#lblDatosIncorrectos").html("No ha sido posible enviar el correo, por favor rectif&iacute;quelo e intente de nuevo");
                $("#recuperarContrasena").show();
            }       
        }, "json");
    }

    function jsRemoveWindowLoad() {
        // eliminamos el div que bloquea pantalla
        $("#WindowLoad").remove();
     
    }
     
    function jsShowWindowLoad(mensaje) {
        //eliminamos si existe un div ya bloqueando
        jsRemoveWindowLoad();
        //si no enviamos mensaje se pondra este por defecto
        if (mensaje === undefined) mensaje = "Procesando la información<br>Espere por favor";
        //centrar imagen gif
        height = 20;//El div del titulo, para que se vea mas arriba (H)
        var ancho = 0;
        var alto = 0;
        //obtenemos el ancho y alto de la ventana de nuestro navegador, compatible con todos los navegadores
        if (window.innerWidth == undefined) ancho = window.screen.width;
        else ancho = window.innerWidth;
        if (window.innerHeight == undefined) alto = window.screen.height;
        else alto = window.innerHeight;
        //operación necesaria para centrar el div que muestra el mensaje
        var heightdivsito = alto/2 - parseInt(height)/2;//Se utiliza en el margen superior, para centrar
       //imagen que aparece mientras nuestro div es mostrado y da apariencia de cargando
        imgCentro = "<div style='text-align:center;height:" + alto + "px;'><div  style='color:#000;margin-top:" + heightdivsito + "px; font-size:20px;font-weight:bold'>" + mensaje + "</div><img src='../images/loading.gif' width='107' height='106'></div>";
            //creamos el div que bloquea grande------------------------------------------
            div = document.createElement("div");
            div.id = "WindowLoad"
            div.style.width = ancho + "px";
            div.style.height = alto + "px";
            $("body").append(div);
            //creamos un input text para que el foco se plasme en este y el usuario no pueda escribir en nada de atras
            input = document.createElement("input");
            input.id = "focusInput";
            input.type = "text"
            //asignamos el div que bloquea
            $("#WindowLoad").append(input);
            //asignamos el foco y ocultamos el input text
            $("#focusInput").focus();
            $("#focusInput").hide();
            //centramos el div del texto
            $("#WindowLoad").html(imgCentro);
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

});
