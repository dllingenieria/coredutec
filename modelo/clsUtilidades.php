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
    public function enviarCorreoEstudiante($cod_mat, $correo,$correode,$clave){
        require_once("../includes/PHPMailer/class.phpmailer.php");
        $mail = new PHPMailer();
        $mail->IsSMTP();                                      // set mailer to use SMTP
        $mail->Host = "smtp.zoho.com";  // specify main and backup server
        $mail->SMTPAuth = true;     // turn on SMTP authentication
        $mail->Username = $correode;  // SMTP username
        $mail->Password = $clave; 
        $mail->Port = 465;
        $mail->SMTPSecure = "ssl";
        $mail->From = $correode;
        $mail->FromName = "Corporación de Educación Tecnológica Colsubsidio AIRBUS Group";
        $mail->AddAddress($correo);                  // name is optional
        $mail->WordWrap = 50;                                 // set word wrap to 50 characters
        $mail->AddAttachment("../anexos/manuales/Manual_CET_Encuestas_de_satisfaccion.pdf");         // add attachments
        $mail->IsHTML(true);                                  // set email format to HTML
        $mail->Subject = "Preprogramacion Asignada";
        $mensaje = file_get_contents("../vista/html/correo_curso.html");
        $mensaje = str_replace("cod_mat", $cod_mat, $mensaje);
        $mensaje = str_replace("usuario", $_SESSION['nombreUsuario'], $mensaje);
        $mail->Body    = $mensaje;
        $envio=-1;
        if(!$mail->Send())
        {
         $envio=0;
        }
        return  $envio;  
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

}
?>
