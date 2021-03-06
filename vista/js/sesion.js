 var timer;
 var tiempo_sesion1;
 var tiempo_sesion2;
 $(document).on('ready',function(){
     //Inicio Cerrar Sesion
    $.ajax({
        url: '../../controlador/fachada.php',
        type: 'POST',
        dataType: 'json',
        async :false,
        data: {
            clase: 'clsUtilidades',
            oper: 'consultarTiempoSesion',
            pVariableX: 1,
            }
    }).done(function(data) {
        if(data[0].tiempo !== null){
            tiempo_sesion1 = data[0].tiempo;
            tiempo_sesion2 = data[1].tiempo;
        }
        
    }); 
    $(document).idle({
        onIdle: function(){
                popUpConfirmacionSesion("Su sesión se va a cerrar por inactividad<br>en "+tiempo_sesion2+" minutos!",1);
                timer = setTimeout(function() {
                            actualizarBandera();
                        }, (tiempo_sesion2 * 60000));
              },
              onActive: function(){
                //$('#status').toggleClass('idle').html('Active!');
              },
              idle: (tiempo_sesion1 * 60000),
              keepTracking: true
            });    
            //Fin Cerrar Sesion   

    });


//para el confirm
function popUpConfirmacionSesion(msj, fn){
    //contenedor vacion
     var contenedor = $("#contenedor");
     //se le envia a contenedor el contenido de element_to_pop_upCon1
    contenedor.html( $("#element_to_pop_upConSesion").html() );
    /*como el id textoConfirmacion2 esta dos veces (en contenedor y en element_to_pop_upCon1)
    * se esta poniendo el texto en el de contenedor
    */
    $("#textoConfirmacionSesion", contenedor ).html(msj);
    $("[id=btnAceptar]:button", contenedor ).click(function(){ 
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
    } );
    
    $("[id=btnCerrar]:button", contenedor ).click(function(){
        actualizarBandera();
    } );
    
    //se muestra el conetenedor 
    $('#contenedor').bPopup({
        speed: 450,
        transition: 'slideDown'
    });

}

var pop_err = '<div id="element_to_pop_upError" class="element_to_pop_upError"><div><label id="textoError" class="popup" style="margin-left: 174px; font-family: \'Roboto-Light\'; font-size: 18px;"> </label></div><br><br><div><label id="textoError1" class="popup" style="margin-left: 174px; font-family: \'Roboto-Light\'; font-size: 18px;"> </label></div></div>';
 
var vistas = {
    0:{"nombre":"Cargas Masivas","url":"captura.html"}, 
    1:{"nombre":"Buscar por Documento","url":"busqueda.html"}, 
    2:{"nombre":"Preprogramación","url":"preprogramacion.html"}, 
    3:{"nombre":"Novedades","url":"novedades.html"}, 
    4:{"nombre":"Matrículas","url":"consultarMatriculas.html"}, 
    5:{"nombre":"Evaluación","url":"ingresoEvaluacion.html"}, 
    8:{"nombre":"Reportes","url":"reportes.html"},
    9:{"nombre":"Registrar Asistencia","url":"registrarAsistencia.html"},
    10:{"nombre":"Imprimir Asistencia","url":"imprimirAsistencia.html"},
	11:{"nombre":"Configuración","url":"configuracion.html"},
	12:{"nombre":"Anexar Soportes","url":"anexarSoporte.html"},
    13:{"nombre":"Alimentacion","url":"reporteAlimentacion.html"},
	14:{"nombre":"Calidad","url":"calidad.html"},
    15:{"nombre":"Seguimiento","url":"academico.html"},
    16:{"nombre":"S. Académica","url":"certificado.html"},
    17:{"nombre":"Firma Digital","url":"firmaDigital.html"},
    18:{"nombre":"Anular Certificado","url":"anularCertificado.html"},
    19:{"nombre":"Reexpedir Certificado","url":"reexpedirCertificado.html"}
};

var vistasAdministrador = [0,1,2,3,4,5,8,11];
var vistasAvanzado = [0,1,2,3,4,5,8];
var vistasMatriculador = [1,4,8];
var vistasAlimentacion = [13];
var vistasCalidad = [14,8];
var vistasSeguimiento = [15,8];
var vistasSAcademica = [16,17,18,19,8];

$(function(){
	 
	if (!$('#page').length) {
		ObtSesion(2);
	}
		
			
     $("#btnEntrar").click(function() {
        IniciarSesion();
        
    });

    setTimeout(function(){ 
        
	   cargarDatosSesion();

	
    $("#cerrarSesion").click(function() {
        actualizarBandera();
    });
    $("#cambiarRol").click(function() {
        cambiarRol();
    });
	
	$("#btnacceso").click(function () {
        window.location = "vista/html/acceso.html";
    });
    
    $("#btnregistro").click(function () {
        window.location = "vista/html/registro.html";
    });

    },1000);
	
	
});

function cargarDatosSesion() {
    if (sessionStorage.nombreUsuario !== null && sessionStorage.roles!== null) {
		verificarIntegridad(sessionStorage.nombreUsuario,sessionStorage.roles);
	}	
}

function ObtSesion(id) {
	var ruta="";
	
	if(id==1){
		ruta="controlador/fachada.php";
	}else{
		ruta="../../controlador/fachada.php";	
	}

    $.post(ruta, { 
        clase: 'clsPersona',
        oper: 'haySesion'
    }, function(data) {
        if (data !== 0) { 
            arrayDatosUsuario = data;
            sessionStorage.nombreUsuario =data[0];
            sessionStorage.roles =data[1];
        }
        else { 
            $("#textoError").text("Usuario o Contraseña incorrectos");
            $('#element_to_pop_upMen').bPopup({speed: 450,transition: 'slideDown'});
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
		console.log("obtenerIdTercero"+data);
        if (data !== "sin sesion") {
            callback(data);
        }else{
            window.location = "../../";
        } 
    }, "json");
}

function verificarIntegridad(user,rol){ //alert(data[0]);
   
   if(user!=""){
	   cargarCabezote(user);
	   cargarFooter();
	   if (!$('#page').length) {   			
			validarPermisosPorRol(rol); 
			cargarVistas();
		}
    }
}


function cargarCabezote(user){
	data="";		
	data+='<div class="contenedorLogo">';
	if (!$('#page').length) { 
		data+='<img class="imgLogo" src="../images/logocet2.png" alt="">';
	}else if($('#page1').length) { 
		data+='<img class="imgLogo" src="vista/images/logocet2.png" alt="">';
	}else{
		data+='<img class="imgLogo" src="vista/images/logocet2.png" alt="">';
	}
	
	data+='</div>';
	if (!$('#page1').length) { 
		data+='<div class="contenedorSesion">';
		data+='<div class="loginTexto">Bienvenido (a) <span id="nombre">'+user+'</span></div>';
		data+='<button type="button" id="cambiarRol" class="boton cerrarSesion">Cambiar Rol</button>';
		data+='<button type="button" id="cerrarSesion" class="boton cerrarSesion">Cerrar Sesión</button>';
		data+='</div>';
	}
	$(".cabecera").html(data);	
}

function cargarFooter(){
	data="";
	if (!$('#page').length) {   	
		data+='<div class="contenedorTitulo">';
		data+='<div class="titulo1">SIREX - Sistema de Información - Proceso Relacionamiento con el Sector Externo</div>';
		data+='</div>';
		data+='<img class="imgLogos" src="../images/barraLogos.png" alt="">';
	}else{
		data+='<div class="contenedorTitulo">';
		data+='<div class="titulo1">SIREX - Sistema de Información - Proceso Relacionamiento con el Sector Externo</div>';
		data+='</div>';
		data+='<img class="imgLogos" src="vista/images/barraLogos.png" alt="">';	
	}
	
	$("footer").html(data);	
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
}   

function cargarVistas(rol){
    switch(sessionStorage.rolSeleccionado){
        case "1":
        mostrarVistas(vistasAdministrador);
        break;
        case "3":
        mostrarVistas(vistasMatriculador);
        break;
        case "5":
        mostrarVistas(vistasAlimentacion);
        break;
        case "6":
        mostrarVistas(vistasSeguimiento);
        break;
        case "7":
        mostrarVistas(vistasCalidad);
        break;
        case "8":
        mostrarVistas(vistasSAcademica);
        break;
        case "9":
        mostrarVistas(vistasAvanzado);
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

function actualizarBandera() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'salir',
        pVariable1: 1
    }, function(data){
            if(data === 'A'){
                cerrarSesion(); 
            }
    }, "json");
}

function cerrarSesion() {
    $.post("../../controlador/fachada.php", {
        clase: 'clsPersona',
        oper: 'killSesion'
    }, function(data) {  
            localStorage.clear();
            sessionStorage.clear(); 
            window.location = "../../";   
    }, "json");
   
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
            if (data !== 0) {
                if(data[0].Ingresado === "S"){
                    $("#textoError").html("El Usuario tiene otra sesión activa desde<br>"+data[0].FechaIngreso);
                    $('#element_to_pop_upMen').bPopup({speed: 450,transition: 'slideDown'});
                }else{
                    ObtSesion(1); 
                    setTimeout(function(){
                    var roles = data[0].Roles.split(",");
                    sessionStorage.esAdministrador=roles[0];
                    sessionStorage.esDocente=roles[1];
                    sessionStorage.esMatriculador=roles[2];
                    sessionStorage.esCallCenter=roles[3];
                    sessionStorage.esAlimentacion=roles[4];
                    sessionStorage.esAcademico=roles[5]; 
                    sessionStorage.esCalidad=roles[6];
                    sessionStorage.esSAcademica=roles[7];
                    sessionStorage.esAvanzado=roles[8];
                    window.location = "vista/html/iniciarSesion.html";
                    },1000);
                }
            }else {
                $("#textoError").html("Usuario o Contraseña incorrectos");
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
