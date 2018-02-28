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
    public function enviarCorreoEstudiante($estudiante,$correoElectronico,$salon,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$modalidad,$sede,$estado,$IdMatricula,$usuario,$correode,$clave){
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
        $mail->AddAddress($correoElectronico);                  // name is optional
        $mail->WordWrap = 50;                                 // set word wrap to 50 characters
        $mail->AddAttachment("../anexos/manuales/Manual_CET_Encuestas_de_satisfaccion.pdf");         // add attachments
        $mail->IsHTML(true);                                  // set email format to HTML
        $mail->Subject = "Confirmacion de Matricula";
        $mensaje = file_get_contents("../vista/html/correo_curso.html");
        $mensaje = str_replace("estudiante", $estudiante, $mensaje);
        $mensaje = str_replace("cod-salon", $salon, $mensaje);
        $mensaje = str_replace("capacitacion", $curso, $mensaje);
        $mensaje = str_replace("ruta", $ruta, $mensaje);
        $mensaje = str_replace("duracioncurso", $duracionCurso, $mensaje);
        $mensaje = str_replace("diascurso", $diasCurso, $mensaje);
        $mensaje = str_replace("fechai", $fechaInicial, $mensaje);
        $mensaje = str_replace("fechaf", $fechaFinal, $mensaje);
        $mensaje = str_replace("horai", $horaInicial, $mensaje);
        $mensaje = str_replace("horaf", $horaFinal, $mensaje);
        $mensaje = str_replace("modulo", $modulo, $mensaje);
        $mensaje = str_replace("duracionmodulo", $duracionModulo, $mensaje);
        $mensaje = str_replace("modalidad", $modalidad, $mensaje);
        $mensaje = str_replace("sede", $sede, $mensaje);
        $mensaje = str_replace("estado", $estado, $mensaje);
        $mensaje = str_replace("cod_mat", $$IdMatricula, $mensaje);
        $mensaje = str_replace("usuario", $usuario, $mensaje);
        $mail->Body = $mensaje;
        $envio=-1;
        if(!$mail->Send())
        {
         $envio=0;
        }
        return  $envio;  
   }

   //----- Funcion que envía correo a los docentes luego que son preprogramados o modificados -----//
   public function enviarCorreoDocente($cod_mat, $cod_sal,$tip_ser, $rut_for, $cur_cod, $diasDelCurso,
        $horaInicio,$horaFinal, $cod_mod,$mod_pre, $sede, $id_doc, $fec_ini, $fec_fin, $pro_ent, 
        $tip_cer,$pre_est,$canSesiones,$capSalon,$inteHoraria,$observacion,$conexion){
        $array=array();
        $envio = "";
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCORREODOCENTE($id_doc);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
                require_once("../includes/PHPMailer/class.phpmailer.php");
                $mail = new PHPMailer();
                $mail->IsSMTP();                                      // set mailer to use SMTP
                $mail->Host = "smtp.zoho.com";  // specify main and backup server
                $mail->SMTPAuth = true;     // turn on SMTP authentication
                $mail->Username = $array[1]['Email'];  // SMTP username
                $mail->Password = $array[2]['Email']; // SMTP password
                $mail->Port = 465;
                $mail->SMTPSecure = "ssl";
                $mail->From = $array[1]['Email'];
                $mail->FromName = "Corporación de Educación Tecnológica Colsubsidio AIRBUS Group";                 // name is optional
                $mail->AddAddress($array[0]['Email']); 
                $mail->WordWrap = 50; 
                $mail->IsHTML(true);                                  // set email format to HTML
                $mail->Subject = "Preprogramacion Asignada";
                $mensaje = file_get_contents("../vista/html/correo_preprogramacion.html");
                $mensaje = str_replace("cod_sal",$cod_sal, $mensaje);
                $mensaje = str_replace("cur_cod",$cur_cod, $mensaje);
                $mensaje = str_replace("cur_dia",$diasDelCurso, $mensaje);
                $mensaje = str_replace("hra_ini",$horaInicio, $mensaje);
                $mensaje = str_replace("hra_fin",$horaFinal, $mensaje);
                $mensaje = str_replace("id_sed" ,$sede,  $mensaje);
                $mensaje = str_replace("fec_ini",$fec_ini, $mensaje);
                $mensaje = str_replace("fec_fin",$fec_fin, $mensaje);
                $mensaje = str_replace("id_docente", $_SESSION['nombreUsuario'], $mensaje);
                $mail->Body = $mensaje;
                $envio=-1;
                if(!$mail->Send())
                {
                 $envio = "";
                }
                else{
                    $envio=1;
                }
            }
        } else {
            $envio = "";
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

    //----- Funcion para cargar la lista de tipos de identificacion -----//
    // public function consultarTipoIdentificacion() {
    //     $rs = null;
    //     $conexion->getPDO()->query("SET NAMES 'utf8'");
    //     $sql = "CALL SPCARGARTIPOIDENTIFICACION($IdP);";
    //     if ($rs = $conexion->getPDO()->query($sql)) {
    //         if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
    //             foreach ($filas as $fila) {
    //                 $array[] = $fila;
    //             }
    //         }
    //     } else {
    //         $array = 0;
    //     }
    //     echo json_encode($array);
    // }

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
