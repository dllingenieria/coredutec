<?php
require("../controlador/session.php");	
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

class clsAlimentacion {

    public function consultarUltimaSesionPorSalon($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARULTIMASESION($idSalon);";
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


  public function agregarAlimentacioGeneral($param) 
    {
        
        extract($param);
		$array = array();
		$rs = null;		
        // print_r($serializedAsistencia);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
        // $fecha = date('Y-m-d');
        // $sql = "CALL SPAGREGARASISTENCIA($idPreprogramacion,'$fecha', $sesion,$usuario);";
        $sql = "CALL SPAGREGARALIMENTACION('$serializedAlimentacion',$usuario);";
        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {               
                
                $filas = substr($filas[0]['pIdAlimentacion1'],1);
                $res = explode(",", $filas);
                //var_dump($res);
                foreach ($res as $resul) {
                	//var_dump($resul);
                    $array[] = array('IdAlimentacion' => $resul);

                }
             }
        } else {
            $array = 0;
            print_r($conexion->getPDO()->errorInfo()); die();
            
       }
        	
			 
            echo json_encode($array);
    }

    public function agregarAlimentacionDetalle($param) {
        extract($param);
        $array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario = $_SESSION['idUsuario'];
        $rs = null;
        // $sql = "CALL SPAGREGARASISTENCIADETALLE($idAsistencia, $idTercero, $valorAsistencia,  $idAsistenciaDetalle, $usuario);";
        $sql = "CALL SPAGREGARALIMENTACIONDETALLE('$serializedalimentacionD', $usuario);";
        //print_r($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                // foreach ($filas as $fila) {
                    // $array[] = $fila;
                // }
            // }
			$array = 1;
        } else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo()); die();
        }
		//print_r($array);
        echo json_encode($array);
    }
	
	   

    // public function consultarAsistenciaEstudiantes($param) {
        // extract($param);
        // $resultado = array();
        // $registro = array();
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
        // $sql = "CALL SPCONSULTARASISTENCIAPORSALON($idPreprogramacion,$sesion);";
        // if ($rs = $conexion->getPDO()->query($sql)) {
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                // foreach ($filas as $fila) {
                    // foreach ($fila as $key => $value) {
                        // array_push($registro, $value);
                    // }
                    // array_push($resultado, $registro);
                    // $registro = array();
                // }
            // }
        // } else {
            // $registro = 0;
        // }
        // echo json_encode($resultado);
    // }
	
	/*
	*Funcion consultarAsistenciasPorSalon
	*params: IdPreprogramacion
	*return: array con IdTercero y horas asistidas
	*/
	// public function consultarAsistenciasPorSalon($param) {
        // extract($param);
        // $resultado = array();
        // $registro = array();
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
		// for ($i=0; $i<=$registros;$i++){
			// $sql = "CALL SPCONSULTARASISTENCIASPORSALON($idPreprogramacion);";
			// if ($rs = $conexion->getPDO()->query($sql)) {
				// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					// foreach ($filas as $fila) {
						// foreach ($fila as $key => $value) {
							// array_push($registro, $value);
						// }
						// array_push($resultado, $registro);
						// $registro = array();
					// }
				// }
			// } else {
				// $registro = 0;
			// } //print_r($resultado); die();
		// }
        // echo json_encode($resultado);
    // }
	
	/*
	*Funcion consultaralimentacionPorPreprogramacion
	*params: IdPreprogramacion
	*return: array los datos de asistencias
	*/
	public function consultaralimentacionPorPreprogramacion($param) {
        extract($param);
		$array = array();
        //print_r("llego");
        $conexion->getPDO()->query("SET NAMES 'utf8'");
			$sql = "CALL SPCONSULTARALIMENTACIONPORPREPROGRAMACION($idPreprogramacion);";
			//print_r($sql);
			if ($rs = $conexion->getPDO()->query($sql)) {
				if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					foreach ($filas as $fila) {
						$array[] = $fila;
					}
				}
			} else {
				$array = 0;
				print_r($conexion->getPDO()->errorInfo()); 
			} //print_r($array);
			//print_r($array);
        echo json_encode($array);
    }
	
	public function consultarReporteAlimentacionPorPreprogramacion($param) {
		extract($param); 
        $array=array();
		$resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPREPORTEALIMENTACIONPORPREPROGRAMACION($IdPreprogramacion,'$fecha');";
		
		$rs=null;
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
        }else {
            $resultado = 0;
			print_r($conexion->getPDO()->errorInfo());
        } //print_r($array); die();
        echo json_encode($resultado);
    }


    // Devuelve los tipos de alimentación para ser cargados en el combo//
    public function cargarTipoAlimentacion($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
    //for ($i=0; $i<count($idTerceroHorasTotales);$i++){
            $sql = "CALL SPCARGARTIPOREFRIGERIO();";
            if ($rs = $conexion->getPDO()->query($sql)) {
                if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                    foreach ($filas as $fila) {
                        $array[] = $fila;
                    }
                    unset($rs);
                }
            } else {
                $array = 0;
                print_r($conexion->getPDO()->errorInfo()); die();
            } //print_r($array);
        //}
        echo json_encode($array);
    }

}
?>