<?php
require("../controlador/session.php");
set_time_limit(0);
/**
 * Description of clsCurso
 * @author Wilmer Andres Escobar Naranjo
 */

class clsMatricula {

 public function AgregarMatricula($param) {
    extract($param);
    $IdUsuario = $_SESSION['idUsuario'];
    $sql = "CALL SPAGREGARMATRICULAS($pTerceroNit,$pIdConvocatoria, $pIdRuta,'$pCodigoCurso', $pIdModalidad,'$pCodigoModulo', $pIdMatricula,$pIdCarga,".$IdUsuario.");";
    if ($rs = $conexion->getPDO()->query($sql)) {      
         if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
           $IdMatricula = $filas[0]['pIdTabla'];
           //----- Inicio código para enviar el correo al estudiante luego de la matrícula -----//
            if($IdMatricula > 0){    
                $conexion->getPDO()->query("SET NAMES 'utf8'");
                $rs=null;
                $array=array();
                $sql = "CALL SPCONSULTARCORREOSESTUDIANTES ($pTerceroNit);";
                if ($rs = $conexion->getPDO()->query($sql)) {
                 if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                     foreach ($filas as $fila) {
                         $array[] = $fila; 
                     }
                 }
                 $clave = array_pop($array)['Email'];
                 $correode=array_pop($array)['Email'];
                 if (count($array)>0){
                    $correo=$this->enviarCorreoEstudiante($IdMatricula, $array[0]['Email'],$correode,$clave);
                 }
                 else{
                     $data["error"]="No se encontraron correos de estudiantes";
                 }
                }
                else{
                 $data["error"]="No se consultaron los correos";
                 print_r($conexion->getPDO()->errorInfo()); die();
                } 
            }
           //----- Fin Código para enviar el correo al estudiante luego de la matrícula -----//
         }
    } else {
        $IdMatricula = 0;
		print_r($conexion->getPDO()->errorInfo());
    }
    echo json_encode($IdMatricula);
}

public function consultarMatriculadosFecha($params){
    extract($params);
	$rs=null;
    $IdUsuario = $_SESSION['idUsuario'];
    $sql = "CALL SPREPORTEMATRICULASALAFECHA('$fecha_inicio');";
    //echo json_encode($sql);
    if ($rs = $conexion->getPDO()->query($sql)) {
        if($filas = $rs->fetchAll(PDO::FETCH_ASSOC)){
            foreach ($filas as $fila) {
                $array[] = $fila;
            }
        }else{
            $array = 0;
        }
    }
    echo json_encode($array);
}


public function consultarFechaMatricula($param) {
    extract($param);
    $resultado = array();
    $registro = array();
	$rs=null;
    $conexion->getPDO()->query("SET NAMES 'utf8'");
    $sql = "CALL SPCONSULTARMATRICULASPORTERCERO2($idMatricula);";
    if ($rs = $conexion->getPDO()->query($sql)) {
        if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
            foreach ($filas as $fila) {
                foreach ($fila as $key => $value) {
                    array_push($registro, $value);
                }
                array_push($resultado, $registro);
                $registro = array();
            }
        }
    } else {
        $registro = 0;
    }
    echo json_encode($resultado);
}



public function consultarMatriculas($param) {
    extract($param);
    $resultado = array();
    $registro = array();
	$rs= null;
    $conexion->getPDO()->query("SET NAMES 'utf8'");
    $sql = "CALL SPCONSULTARMATRICULASPORTERCERO1($identificacion);";
    if ($rs = $conexion->getPDO()->query($sql)) {
        if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
            foreach ($filas as $fila) {
                foreach ($fila as $key => $value) {
                    array_push($registro, $value);
                }
                array_push($resultado, $registro);
                $registro = array();
            }
        }
    } else {
        $registro = 0;
    }
    echo json_encode($resultado);
}

public function consultarMatriculas2($param) {
    extract($param);
	$rs=null;
    $conexion->getPDO()->query("SET NAMES 'utf8'");
    $sql = "CALL SPCONSULTARMATRICULAS();";
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

public function cargarEntregables($param) {
    extract($param);
	$rs=null;
    $sql = "CALL CONSULTAR_ENTREGABLES();";
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

public function CargarEstados($param) {
    extract($param);
	$rs=null;
    $sql = "CALL SPCARGARESTADOS();";
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

public function consultarEstudiantesNoMatriculados($param) {
    extract($param);
	$rs=null;
    $sql = "CALL SPCONSULTARESTUDIANTESNOMATRICULADOS($jornada);";
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
private function codificarEnUtf8($fila) {
    $aux;
    foreach ($fila as $value) {
        $aux[] = utf8_encode($value);
    }
    return $aux;
}

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
        $mail->AddAttachment("../Manual_CET_Encuestas_de_satisfaccion.pdf");         // add attachments
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
