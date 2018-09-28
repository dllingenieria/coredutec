<?php
set_time_limit(0);
/**
 * Clase para procedimientos que se usan para restablecer la contraseña
 *
 * @author John James Granados Restrepo
 */
class clsRecuperarContrasena {
    //----- Función para insertar el link con el token para recuperar la contraseña -----//
   public function insertarLinkToken($param) {
        extract($param);
        $token = sha1($token);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARLINKTOKEN('$login','$token');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }
        }else{
            $array = 0;
        }
        echo json_encode($array); 
    }

    //----- Función que envía correo para restablecer la contraseña -----//
    public function enviarCorreoContrasena($param){
        extract($param);
        $array=array();
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREO();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
                $link = "https://sirex.cetcolsubsidio.edu.co/vista/html/cambiarContrasena.html?id=".$link;
                require_once("../includes/PHPMailer/class.phpmailer.php");
                $mail = new PHPMailer();
                $mail->IsSMTP();                                      // set mailer to use SMTP
                $mail->Host = "smtp.gmail.com";//"smtp.zoho.com"; //"smtp.office365.com"; specify main and backup server
                $mail->SMTPAuth = true;     // turn on SMTP authentication
                $mail->Username = $array[0]['Parametro'];
                $mail->Password = $array[1]['Parametro']; //c3T-C0lsUBs1d10*S13mpr3$
                $mail->Port = 465; //587;
                $mail->SMTPSecure = "ssl"; //"tls";
                $mail->From = $array[0]['Parametro'];
                $mail->FromName = "CET COLSUBSIDIO - AIRBUS GROUP";
                $mail->AddAddress($para);                  // name is optional
                $mail->WordWrap = 50; 
                $mail->IsHTML(true);                                  // set email format to HTML
                $mail->Subject = "Solicitud recuperacion clave de acceso";
                $mensaje = file_get_contents("../vista/html/correo_restablecimiento_contrasena.html");
                $mensaje = str_replace("fecha", date("Y-m-d"), $mensaje);
                $mensaje = str_replace("pNombres", $nombres, $mensaje);
                $mensaje = str_replace("pLink", $link, $mensaje);
                $mail->CharSet = 'UTF-8';
                $mail->Body = $mensaje;
                if(!$mail->Send())
                {   echo "Mailer Error: " . $mail->ErrorInfo;
                    $envio=0;
                }else{
                    $envio=1;
                }
            }else{
                $envio=0;
            }
        }else{
            $envio=0;
        }
   echo json_encode($envio);
   }

   public function cambiarContrasena($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCAMBIARCONTRASENA('$token','$Contrasena');";
        //print_r($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }
        }else{
            $array = 0;
        }
        echo json_encode($array); 
    }


}
?>
