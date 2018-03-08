<?php
require("../controlador/session.php");
set_time_limit(0);
/**
 * Clase para procedimientos que se pueden usar en toda la aplicacion
 *
 * @author John James Granados Restrepo
 */
class clsUtilidades {
    //----- Función que envía correo luego de una matrícula -----//
    public function enviarCorreoEstudiante($estudiante,$correoElectronico,$salon,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$modalidad,$sede,$estado,$IdMatricula,$usuario,$usuarioe,$correode,$clave){
        require_once("../includes/PHPMailer/class.phpmailer.php");
        $mail = new PHPMailer();
        $mail->IsSMTP();                                      // set mailer to use SMTP
        $mail->Host =  "smtp.gmail.com"; //"smtp.office365.com";  // specify main and backup server
        $mail->SMTPAuth = true;     // turn on SMTP authentication
        $mail->Username = $correode;  // SMTP username
        $mail->Password = $clave; 
        $mail->Port = 465; //587;
        $mail->SMTPSecure = "ssl"; //"tls";
        $mail->From = $correode;
        $mail->FromName = "Corporación de Educación Tecnológica Colsubsidio AIRBUS Group";
        $mail->AddAddress($correoElectronico);                  // name is optional
        $mail->WordWrap = 50;                                 // set word wrap to 50 characters
        $mail->AddAttachment("../anexos/manuales/Manual_CET_Encuestas_de_satisfaccion.pdf");         // add attachments
        $mail->IsHTML(true);                                  // set email format to HTML
        $mail->Subject = "Confirmacion de Matricula";
        $mensaje = file_get_contents("../vista/html/correo_curso.html");
        $mensaje = str_replace("fecha", date("Y-m-d"), $mensaje);
        $mensaje = str_replace("estudiante", $estudiante, $mensaje);
        $mensaje = str_replace("cod-salon", $salon, $mensaje);
        $mensaje = str_replace("capacitacion", $curso, $mensaje);
        $mensaje = str_replace("ruta", $ruta, $mensaje);
        $mensaje = str_replace("duracioncurso", $duracionCurso, $mensaje);
        $mensaje = str_replace("diascurso", $diasCurso, $mensaje);
        $mensaje = str_replace("finicial", $fechaInicial, $mensaje);
        $mensaje = str_replace("ffinal", $fechaFinal, $mensaje);
        $mensaje = str_replace("horai", $horaInicial, $mensaje);
        $mensaje = str_replace("horaf", $horaFinal, $mensaje);
        $mensaje = str_replace("modulo", $modulo, $mensaje);
        $mensaje = str_replace("duracionm", $duracionModulo, $mensaje);
        $mensaje = str_replace("modalidad", $modalidad, $mensaje);
        $mensaje = str_replace("sede", $sede, $mensaje);
        $mensaje = str_replace("estado", $estado, $mensaje);
        $mensaje = str_replace("cod_mat", $IdMatricula, $mensaje);
        $mensaje = str_replace("usuario", $usuario, $mensaje);
        $mensaje = str_replace("emailu", $usuarioe, $mensaje);
        $mail->CharSet = 'UTF-8';
        $mail->Body = $mensaje;
        if(!$mail->Send()){
            $envio = 0;
        }else{
            $envio =- 1;
        }
        return $envio;
   }

   //----- Funcion que envía correo a los docentes luego que son preprogramados o modificados -----//
   public function enviarCorreoDocente($docente,$correoElectronico,$salon,$codigocurso,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$intensidadhoraria,$cantidadsesiones,$modalidad,$sede,$observaciones,$estado,$usuario,$usuarioe,$correode,$clave,$asunto){
        require_once("../includes/PHPMailer/class.phpmailer.php");
        $mail = new PHPMailer();
        $mail->IsSMTP();                                      // set mailer to use SMTP
        $mail->Host =  "smtp.gmail.com"; //"smtp.office365.com";  // specify main and backup server
        $mail->SMTPAuth = true;     // turn on SMTP authentication
        $mail->Username = $correode;  // SMTP username
        $mail->Password = $clave; // SMTP password
        $mail->Port = 465; //587;
        $mail->SMTPSecure = "ssl"; //"tls";
        $mail->From = $correode;
        $mail->FromName = "Corporación de Educación Tecnológica Colsubsidio AIRBUS Group";                 // name is optional
        $mail->AddAddress($correoElectronico); 
        $mail->WordWrap = 50; 
        $mail->IsHTML(true);                                  // set email format to HTML
        $mail->Subject = $asunto;
        $mensaje = file_get_contents("../vista/html/correo_preprogramacion.html");
        $mensaje = str_replace("fecha", date("Y-m-d"), $mensaje);
        $mensaje = str_replace("capacitador", $docente, $mensaje);
        $mensaje = str_replace("cod-salon", $salon, $mensaje);
        $mensaje = str_replace("cod-curso", $codigocurso, $mensaje);
        $mensaje = str_replace("capacitacion", $curso, $mensaje);
        $mensaje = str_replace("prut", $ruta, $mensaje);
        $mensaje = str_replace("duracioncurso", $duracionCurso, $mensaje);
        $mensaje = str_replace("diascurso", $diasCurso, $mensaje);
        $mensaje = str_replace("finicial", $fechaInicial, $mensaje);
        $mensaje = str_replace("ffinal", $fechaFinal, $mensaje);
        $mensaje = str_replace("horai", $horaInicial, $mensaje);
        $mensaje = str_replace("horaf", $horaFinal, $mensaje);
        $mensaje = str_replace("modulo", $modulo, $mensaje);
        $mensaje = str_replace("duracionm", $duracionModulo, $mensaje);
        $mensaje = str_replace("ihoraria", $intensidadhoraria, $mensaje);
        $mensaje = str_replace("sesiones", $cantidadsesiones, $mensaje);
        $mensaje = str_replace("pmodal", $modalidad, $mensaje);
        $mensaje = str_replace("sede", $sede, $mensaje);
        $mensaje = str_replace("observacion", $observaciones, $mensaje);
        $mensaje = str_replace("estado", $estado, $mensaje);
        $mensaje = str_replace("usuario", $usuario, $mensaje);
        $mensaje = str_replace("emailu", $usuarioe, $mensaje);
        $mail->CharSet = 'UTF-8';
        $mail->Body = $mensaje;
        if(!$mail->Send()){
            $envio = 0;
        }
        else{
            $envio = 1;
        }   
   return $envio;
   }

   //----- Función para recuperar la cantidad de estudiantes con asistencia en un módulo, se usa para los encabezados -----//
   public function consultarCantidadAsistentesPorSalon($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCANTIDADASISTENTESPORSALON($IdPreprogramacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para calcular la nota parcial de los estudiantes en un módulo, se usa para los encabezados -----//
   public function consultarNotaParcialPorSalon($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCALCULARNOTAPARCIALPORSALON($IdPreprogramacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para retornar los datos de la cuenta y contraseña para enviar correos -----//
    public function consultarDatosCorreo() {
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREO();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function cargarListas($param) {
        extract($param);
        $sql = "CALL ".$procedimiento."();";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

}
?>
