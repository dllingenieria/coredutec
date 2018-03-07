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
                print_r("Correo desde el que se envia: ".$array[1]['Parametro']);
                print_r("Contraseña: ".$array[0]['Parametro']);
                $link = "http://sinfompc.cetcolsubsidio.edu.co/vista/html/cambiarContrasena.html?id=".$link;
                require_once("../includes/PHPMailer/class.phpmailer.php");
                $mail = new PHPMailer();
                $mail->IsSMTP();                                      // set mailer to use SMTP
                $mail->Host = "smtp.office365.com";  // specify main and backup server
                $mail->SMTPAuth = true;     // turn on SMTP authentication
                $mail->Username = $array[1]['Parametro'];  // SMTP username
                $mail->Password = $array[0]['Parametro'];
                $mail->Port = 587;
                $mail->SMTPSecure = "tls";
                $mail->From = $array[1]['Parametro']; 
                $mail->FromName = "Corporación de Educación Tecnológica Colsubsidio AIRBUS Group";
                $mail->AddAddress($para);                  // name is optional
                $mail->WordWrap = 50; 
                $mail->IsHTML(true);                                  // set email format to HTML
                $mail->Subject = "Restablecimiento contrasena";
                $mensaje = file_get_contents("../vista/html/correo_restablecimiento_contrasena.html");
                $mensaje = str_replace("link", $link, $mensaje);
                $mail->Body = $mensaje;
                //$envio=1;
                if(!$mail->Send())
                {
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
