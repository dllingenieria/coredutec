$(function() { 
	$("#btnRecuperar").click(function(){ 
		var cedula = "";
        var email = "";
        cedula = $("#txtCedula").val();
        email = $("#txtEmail").val();
		if (cedula == "" || email == ""){
		mostrarPopUpError("Por favor ingrese los datos solicitados");
		}
		else{
            // var mensaje="Procesando la información<br>Espere por favor";
            // jsShowWindowLoad(mensaje);
			generarLinkTemporal(cedula,email);
		}
	});

    function generarLinkTemporal(cedula, email){
        // Se genera una cadena para validar el cambio de contraseña
        var token = cedula+email+Math.random(1,9999999);
        $.post("../../controlador/fachada.php", {
            clase: 'clsRecuperarContrasena',
            oper: 'insertarLinkToken',
            cedula: cedula,
            token: token
            }, function(data) {
            if (data[0].pEmail == 0) {
                $("#lblDatosIncorrectos").html("Por favor verifique el número de cédula ingresado");
                $("#recuperarContrasena").show();
                // jsRemoveWindowLoad();
            }else{
                var res = data[0].pEmail.split("_");
                var para = res[0];
                var link = res[1];
                enviarCorreo(para,link);
            } 
        }, "json");
    }

    function enviarCorreo(para, link){
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
            }
        }).done(function(data) {
            if(data == 1){
                $("#lblDatosIncorrectos").html("Hemos recibido su solicitud, en breve recibir&aacute; un correo electr&oacute;nico con las instrucciones");
                $("#recuperarContrasena").show();
                setTimeout(function() {
                    window.location.href = "../../index.html";
                }, 5000);
            }else{
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
