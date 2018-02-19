$(function() { 

	$("#btnCambiar").click(function(){ 
		var Contrasena1 = "";
        var Contrasena2 = "";
        Contrasena1 = $("#txtContrasena1").val();
        Contrasena2 = $("#txtContrasena2").val();
		if (Contrasena1 == "" || Contrasena2 == ""){
        mostrarPopUpError("Por favor ingrese una contraseña igual en ambas cajas de texto");
		}
		else{            
            if(Contrasena1 == Contrasena2){
                var token = getQueryVariable("id");
                if (token != ""){
                    $.ajax({
                        url: '../../controlador/fachada.php',
                        type: 'POST',
                        dataType: 'json',
                        async :false,
                        data: {
                            clase: 'clsRecuperarContrasena',
                            oper: 'cambiarContrasena',
                            token: token,
                            Contrasena: Contrasena1,
                            }
                        }).done(function(data) {
                            if(data[0].Resultado == 1){
                                mostrarPopUpError("La contraseña fue cambiada con éxito");
                                setTimeout(function() {
                                    window.location.href = "../../index.html";
                                }, 5000);
                            }else{
                                mostrarPopUpError("La contraseña no fue cambiada, intente de nuevo");
                                setTimeout(function() {
                                    window.location.href = "../../index.html";
                                }, 5000);
                            }
                        }, "json");
                }else{
                    mostrarPopUpError("La solicitud de cambio ha caducado");
                    setTimeout(function() {
                        window.location.href = "../../index.html";
                    }, 5000);
                }
            }else{
                mostrarPopUpError("Las contrasenas no son iguales");
            }
		}
	});

    function getQueryVariable(variable)
    {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
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
