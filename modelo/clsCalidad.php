<?php
require("../controlador/session.php");	
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

class clsCalidad {

    public function ConsultarEvaluacionesPorCedula($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        
        // $sql = "CALL SPCONSULTAREVALUACIONESPORCEDULA($cedula);";
        $sql = "CALL SPCONSULTAREVALUACIONESPORPREPROGRAMACION($IdPreprogramacion);";
	
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
            }
        } else {
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); die();
        }
        echo json_encode($resultado);
    }

    /**
	 * Metodo cargarDetallePlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPplaneacion
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No ingrese los datos en la db
	 */	
    public function cargarDetalleEvaluacion($param) { 
    	extract($param); 
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDETALLEEVALUACION($IdEvaluacion);";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
			print_r($conexion->getPDO()->errorInfo()); 
			$array = 0;
        }
        echo json_encode($array);
	}	
}
?>