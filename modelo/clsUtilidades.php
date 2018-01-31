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
        $mail->Body    = $mensaje;
        $envio=-1;
        if(!$mail->Send())
        {
         $envio=0;
        }
        return  $envio;  
   }
}
?>
