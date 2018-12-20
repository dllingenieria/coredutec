<?php
require("../controlador/session.php");	
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

class clsAcademico {

 
  public function agregarSeguimiento($param) 
    {
        
        extract($param);
		$array = array();
		$rs = null;		
        // print_r($serializedAsistencia);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
        
        $sql = "CALL SPAGREGARSEGUIMIENTOACADEMICO('$IdPreprogramacion','$seguimiento',$tipo,$usuario);";
        
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
            echo json_encode($array);
    }
	
	/*
	*Funcion consultarSeguimientoPorTercero
	*params: IdPreprogramacion
	*return: array los datos de las observaciones por tercero
	*/
	public function consultarSeguimiento($param) {
        extract($param); 
		$rs = null;
        $array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");

			$sql = "CALL SPCONSULTARSEGUIMIENTOPORPREPROGRAMACION($IdPreprogramacion,$tipo);";
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
			} //print_r($array); die();
		//}
        echo json_encode($array);
    }
	
    //----- Función para modificar el estado de un salon al enviarlo a certificar -----//
    public function enviarCertificar($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCAMBIARESTADOSALONPARACERTIFICAR($idPreprogramacion,".$IdUsuario.");";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Funcion para cargar los modulos disponibles -----//
    public function ConsultarModulosPorDocente($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMODULOSPORDOCENTE3($IdDocente,'$Anio');";
	
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
			// print_r($sql);
			// print_r($filas);
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, $value);
                    }
                    array_push($resultado, $registro);
                    $registro = array();
                }
				// foreach ($filas as $fila) {
                    // $array[] = $fila;
                // }
            }
        } else {
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); die();
        }
		
		//print_r($filas);
        echo json_encode($resultado);
    }
}
?>