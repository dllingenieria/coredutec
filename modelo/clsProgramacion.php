<?php
require("../controlador/session.php");
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsProgramacion
 *
 * @author wandres
 */
class clsProgramacion {

    public function actualizarProgramacion($param){
        extract($param);
        foreach ($datos as $dato) {
            echo $dato[0];
        }
        /*$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARDOCENTES();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }*/
        //echo json_encode($array);
    }

    public function AgregarPreprogramacion($param) { 
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
		//id_doc docente
        $sql = "CALL SPAGREGARPREPROGRAMACION('$cod_mat', '$cod_sal',$tip_ser, $rut_for, '$cur_cod', $cur_dia,
            $hra_ini,$hra_fin, '$cod_mod',$mod_pre, $id_sed, $id_doc, '$fec_ini', '$fec_fin', $pro_ent, 
            $tip_cer,".$IdUsuario.",$pre_est,'$canSesiones','$capSalon','$inteHoraria','$observacion');";
        $rs=null;
        $buscar=array(chr(13).chr(10), "\r\n", "\n", "\r");
        $reemplazar=array("", "", "", "");
        $sql=str_ireplace($buscar,$reemplazar,$sql);
         if ($rs = $conexion->getPDO()->query($sql)) {  
				// $array = 1;	
				 if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
				   $array1 = $filas[0]['pIdTabla']; 
				   if ( count($array1) > 0){ 
				   unset($rs);
					$sql = "CALL SPAGREGARSERIE($tip_ser,$IdUsuario,$matriculaExistente);"; 
					$rs=null;
						if ($rs = $conexion->getPDO()->query($sql)) {  
							$array = 1;	
						}
						else{
							print_r($conexion->getPDO()->errorInfo()); die();
							$array = 0;
						}
					}
				 } 
				$correo=$this->enviarCorreoDocente($cod_mat, $cod_sal,$tip_ser, $rut_for, $cur_cod, $diasDelCurso,
            $horaInicio,$horaFinal, $cod_mod,$mod_pre, $sede, $id_doc, $fec_ini, $fec_fin, $pro_ent, 
            $tip_cer,$pre_est,$canSesiones,$capSalon,$inteHoraria,$observacion,$conexion);
				if($correo == ""){
					$array = -1;
				}
			}
				
			 else {    
				print_r($conexion->getPDO()->errorInfo()); die();
				$array = 0;
			}
		
        echo json_encode($array);
    }

    public function AgregarPreprogramacion2($param) {
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $sql = "CALL SPAGREGARPREPROGRAMACION2('$cod_mat', '$cod_sal',$tip_ser, $rut_for, '$cur_cod', $cur_dia,
            $hra_ini,$hra_fin, '$cod_mod',$mod_pre, $id_sed, $id_doc, '$fec_ini', '$fec_fin', $pro_ent, 
            $tip_cer,$mat_num, $salon, $horarioCurso, ".$IdUsuario.");";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {          
            $array = 1;
        } else {    
            $array = 0;
        }
        echo json_encode($array);
    }

    public function obtenerUltimaMatricula($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARULTIMAMATRICULA();";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    if($filas['mat_num'] === null){
                        $filas['mat_num'] = 0;
                    }
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function CargarPreprogramaciones($param) {
        extract($param);
		$resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARPREPROGRAMACIONES();";
		$rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) { 
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
                foreach ($filas as $fila) {
					foreach ($fila as $key => $value){
						array_push($registro, $value);
					}
					array_push($resultado, $registro);
                    $registro = array(); 
                }
            } //print_r($resultado);
        } else {
            $array = 0;
        }
        echo json_encode($resultado);
    } 


    public function consultarPreprogramacionDesdeFecha($param) {
        extract($param);
        $sql = "CALL SPCONSULTARPREPROGRAMACIONFECHAINICIO('2016-01-01');";
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
    


    public function consultarMatriculaPorCodigo($param) {
        extract($param);
		$array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPBUSCARPREPROGRAMACIONPORMATRICULA('$mat_cod');";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        } //print_r($array); die();
        echo json_encode($array);
    }

     public function consultarCalendarioPreprogramacion($param) {
        extract($param); 
		$array = array();
        $sql = "CALL SPCONSULTARCALENDARIOPREPROGRAMACION($idPreprogramacion);";
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
			print_r($conexion->getPDO()->errorInfo()); 
        }
		// print_r($array);
        echo json_encode($array);
    }

    

    public function CargarDatosPreProgramacion($param) {
        extract($param);
        $sql = "CALL SPCONSULTARDATOSSALON($pId);";
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

    public function CargarPreprogramacionPorId($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARPREPROGRAMACIONPORID($pIdPreprogramacion);";
		$rs=null;
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


    public function eliminarPreprogramacion($param) {
        $res = '';
        extract($param);
        $sql = "CALL ELIMINAR_PREPROGRAMACION('$cod_mat');";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            $res = "Eliminado satisfactoriamente $cod_mat";
        } else {
            $res = 'Hubo un error, no se pudo eliminar';
        }
        echo json_encode($res);
    }
    
    public function ActualizarPreprogramacion($param) {
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARPREPROGRAMACION($pre_id, $tip_ser, $rut_for, '$cur_cod', $cur_dia,
            $hra_ini,$hra_fin,'$cod_mod',$mod_pre, $id_sed, $id_doc, '$fec_ini', '$fec_fin', $pro_ent, 
            $tip_cer,$pre_est,".$IdUsuario.",'$canSesiones','$capSalon','$inteHoraria','$observacion','$codSalon');";
        $rs=null;
		// echo json_encode(array($sql));
        if ($rs = $conexion->getPDO()->query($sql)) {          
            $array = 1;
			$correo=$this->enviarCorreoDocente($cod_mat, $cod_sal,$tip_ser, $rut_for, $cur_cod, $diasDelCurso,
            $horaInicio,$horaFinal, $cod_mod,$mod_pre, $sede, $id_doc, $fec_ini, $fec_fin, $pro_ent, 
            $tip_cer,$pre_est,$canSesiones,$capSalon,$inteHoraria,$observacion,$conexion);
			if($correo == ""){
				$array = -1;
			}
        } else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo()); 
        }
            // echo $sql;
        echo json_encode($array);
    }

    public function ActualizarPreprogramacion2($param) {
        $arr = array("test");

        echo json_encode($arr);
    }
	
	  public function cargarCuposFaltantes($param) {
        extract($param); 
        $sql = "CALL SPCONSULTARCUPOSFALTANTES ($preprogramacion);";
		$rs=null;
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = "";
        }
		// print_r($array);
        echo json_encode($array);
    }
	
	public function consultarCupos($param) {
        extract($param); 
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARCUPOS();";
		$rs=null;

        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = "";
        }
		
        echo json_encode($array);
	}

public function consultarGestionPreprogramacion($param) {
       extract($param); 
       echo $sql = "CALL SPCONSULTARGESTIONPREPROGRAMACION($IdPreprogramacion);";
       $conexion->getPDO()->query("SET NAMES 'utf8'");
       if ($rs = $conexion->getPDO()->query($sql)) {
           if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
               foreach ($filas as $fila) {
                   $array[] = $fila;
               }
           }
       } else {
           $array = "";
       }
       
       echo json_encode($array);
   }


    public function AgregarGestionPreprogramacion($param) {
       session_start();
       extract($param);
       $fechaHoy=date("Y-m-d");
       $IdUsuario = $_SESSION['idUsuario'];
       $conexion->getPDO()->query("SET NAMES 'utf8'");
       $sql = "CALL SPAGREGARGESTIONPREPROGRAMACION($IdPreprogramacion,$IdTercero,'".$IdTipificacion."','".$Observaciones."', '".$fechaHoy."', $IdUsuario);";
       if ($rs = $conexion->getPDO()->query($sql)) {
           if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
               $array = 1;
           }
       } else {
           $array = 0;
       }
       echo json_encode($array);
   }
   
   public function enviarCorreoDocente($cod_mat, $cod_sal,$tip_ser, $rut_for, $cur_cod, $diasDelCurso,
            $horaInicio,$horaFinal, $cod_mod,$mod_pre, $sede, $id_doc, $fec_ini, $fec_fin, $pro_ent, 
            $tip_cer,$pre_est,$canSesiones,$capSalon,$inteHoraria,$observacion,$conexion){
	   
	    $array=array();
		$envio = "";
		$sql = "CALL SPCONSULTARCORREODOCENTE($id_doc);";
		$rs=null;
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
				
				
				// Motrar todos los errores de PHP
				error_reporting(E_ALL);
				// Motrar todos los errores de PHP
				ini_set('error_reporting', E_ALL);
				// require("includes/PHPMailer/class.phpmailer.php");
				require("../includes/PHPMailer/class.phpmailer.php");
				// require("includes/PHPMailer/class.phpmailer.php");
				// require("../includes/PHPMailer/class.phpmailer.php");
				$mail = new PHPMailer();
				$mail->IsSMTP();                                      // set mailer to use SMTP
				$mail->Host = "smtp.zoho.com";  // specify main and backup server
				$mail->SMTPAuth = true;     // turn on SMTP authentication
				// $mail->Username = "d1@dllingenieria.com.co";  // SMTP username
				$mail->Username = $array[1]['Email'];  // SMTP username
				$mail->Password = $array[2]['Email']; // SMTP password
				// $mail->Password = "qouv5eFl"; // SMTP password
				$mail->Port = 465;
				$mail->SMTPSecure = "ssl";
				// $mail->From = "d1@dllingenieria.com.co";
				$mail->From = $array[1]['Email'];
				$mail->FromName = "CET";
				// $mail->AddAddress("vivirodasm@gmail.com");                  // name is optional
				$mail->AddAddress($array[0]['Email']);                  // name is optional
				// $mail->AddReplyTo("ld@dllingenieria.com.co", "Information");
				$mail->WordWrap = 50;                                 // set word wrap to 50 characters
				// $mail->AddAttachment("Manual_CET_Encuestas_de_satisfaccion.pdf");         // add attachments
				//$mail->AddAttachment("/tmp/image.jpg", "new.jpg");    // optional name
				$mail->IsHTML(true);                                  // set email format to HTML
				$mail->Subject = "Preprogramacion Asignada";
				$mensaje = file_get_contents("http://localhost:8084/coredutec/vista/html/correo_preprogramacion.html");
				$mensaje = str_replace("cod_sal",$cod_sal, $mensaje);
				$mensaje = str_replace("cur_cod",$cur_cod, $mensaje);
				$mensaje = str_replace("cur_dia",$diasDelCurso, $mensaje);
				$mensaje = str_replace("hra_ini",$horaInicio, $mensaje);
				$mensaje = str_replace("hra_fin",$horaFinal, $mensaje);
				$mensaje = str_replace("id_sed" ,$sede,  $mensaje);
				$mensaje = str_replace("fec_ini",$fec_ini, $mensaje);
				$mensaje = str_replace("fec_fin",$fec_fin, $mensaje);
				
				$mail->Body    = $mensaje;
				// $mail->AltBody = "This is the body in plain text for non-HTML mail clients";
				
				if(!$mail->Send())
				{
				 $envio = "";
				}
				else{
					$envio=1;
				}
				// echo $envio;
				

            }
        } else {
            $envio = "";
        }
   return $envio;
   }

}
?>