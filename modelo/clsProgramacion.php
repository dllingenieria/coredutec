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
				$correo=enviarCorreoDocente($id_doc);
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
			$correo=enviarCorreoDocente($id_doc);
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
   
   public function enviarCorreoDocente($id_doc){
	   
	    $sql = "CALL SPCONSULTARCORREODOCENTE($id_doc);";
		$rs=null;
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
				
				//plantilla para el envio del correo
				// Varios destinatarios
				$para  = 'aidan@example.com' . ', '; // atención a la coma
				$para .= 'wez@example.com';

				// título
				$título = 'Proprogramación Asignada';

				// mensaje
				$mensaje = '
				<html>
				<head>
				  <title>Preprogramación Asignada</title>
				</head>
				<body>
				  <p>Estos son los datos de la preprogramación</p>
				  <table>
					<tr>
					  <th>Código Sálon</th><th>Código Curso</th><th>Días Curso</th><th>Hora Inicial</th><th>Hora Inicial</th><th>Sede</th><th>Fecha Inicial</th><th>Fecha Final</th>
					</tr>
					<tr>
					  <td>$cod_sal</td><td>$cur_cod</td><td>$cur_dia</td><td>$hra_ini</td><td>$hra_fin</td><td>$id_sed</td><td>$fec_ini</td><td>$fec_fin</td>
					</tr>
					</table>
				</body>
				</html>
				';

				// Para enviar un correo HTML, debe establecerse la cabecera Content-type
				$cabeceras  = 'MIME-Version: 1.0' . "\r\n";
				$cabeceras .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

				// Cabeceras adicionales
				$cabeceras .= 'To: Docente <'.$array['correo'].'>' . "\r\n";
				$cabeceras .= 'From: Preprogramación <cumples@example.com>' . "\r\n";
				// $cabeceras .= 'Cc: birthdayarchive@example.com' . "\r\n";
				// $cabeceras .= 'Bcc: birthdaycheck@example.com' . "\r\n";

				// Enviarlo
				mail($para, $título, $mensaje, $cabeceras);
            }
        } else {
            $array = "";
        }
   }

}
?>