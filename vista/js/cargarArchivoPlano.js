/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(function() {

//$(document).ready(function() {
//    cargarArchivoPlano();
//});
    var nom_arc = '';
    var idJornada='';

    function CargarArchivoPlano() {
        console.log("cargarArchivoPlano()");
        $.post("../../controlador/fachada.php", {
            clase: 'clsPersona',
            oper: 'AgregarDesdeArchivoPlano'
        }, function(data) {
//        alert('Server: '+data);
            $('body').html(data);
        });
    }

    function GuardarArchivo() {
        var archivos = document.getElementById("txtexaminararchivos");
        var archivo = archivos.files;
        if (typeof archivo[0] !== "undefined") {
            if (archivo[0].size < 1048576) {
                var data = new FormData();
                data.append('vid', archivo[0]);
                $.ajax({
                    type: 'POST',
                    url: "../../controlador/fachada.php?clase=clsArchivo&oper=GuardarArchivoPlano",
                    data: data, //Le pasamos el objeto que creamos con los archivos
                    contentType: false, //Debe estar en false para que pase el objeto sin procesar
                    processData: false, //Debe estar en false para que JQuery no procese los datos a enviar
                    cache: false //Para que el formulario no guarde cache
                }).done(function(msg) {
                    nom_arc = msg;
                }).success(function() {
                    EvaluarArchivo();
					jsRemoveWindowLoad();
                });
            } else
            {
                alert('EL TAMAÑO DEl  DOCUMENTO ES MAYOR A 1MB,\nPARA SUBIR LA IMAGEN ASEGURESE QUE SU TAMAÑO SEA MENOR.');
            }
        }
    }

    function EvaluarArchivo() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsGestorBDPlanas',
            oper: 'CargarArchivoPlano',
            nom_arc: nom_arc.replace('"',"").replace('"',""),
            pIdJornada:idJornada
        }, function(data) {
            $("#circulo").hide();
            $("#xerror").hide();
            $("#fondoerrores").show();
            $("#fondoerrores").empty();
            if (data.indexOf("<ul>") !== -1) {
                $("#circulo").show();
                $("#xerror").show();
            }
            $("#fondoerrores").append(data);
//            $(".fondoerrores").append(data);
        }
        );
   }

    $("#txtexaminararchivos").change(function() {
        
		var mensaje="Procesando la información<br>Espere por favor";
		jsShowWindowLoad(mensaje);
		
        if($("#txtDescripcion").val()!='' && $("#txtFecha").val()!='' && $("#txtDireccion").val()!=''){
            insertarConvocatoria();
            GuardarArchivo(); 
				
        }
        else{
            alert("Falta diligenciar campos")
        }
    });


    function insertarConvocatoria() {
        $.post("../../controlador/fachada.php", {
            clase: 'clsConvocatoria',
            oper: 'insertarJornadaConvocatoria',
            pJornada:$("#txtDescripcion").val(),
            pDireccion:$("#txtDireccion").val(),
            pFecha:$("#txtFecha").val()
        }, function(data) {
            idJornada=data[0].IdTabla;
        }, "json"
        );
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


});