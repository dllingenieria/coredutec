<?php
require("../controlador/session.php");
set_time_limit(0);
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsConvocatoria
 *
 * @author Wilmer Andrés Escobar Naranjo
 */
class clsConvocatoria {

    public function ConsultarConvocatorias($param) {
        extract($param);
		$rs = null;
        $sql = "CALL SPCARGARCONVOCATORIAS();";
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
    
    public function consultarSerialPorId($param){
        extract($param);
		$rs = null;
        $sql = "CALL SPCONSULTARSERIALDADOID($conId);";
        $rs = $conexion->getPDO()->query($sql);
        $id = $rs->fetch(PDO::FETCH_ASSOC);
        echo json_encode($id['Serie']);
    }


    public function insertarJornadaConvocatoria($param) {
        // session_start(); 
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $sql = "CALL SPAGREGARJORNADACONVOCATORIA('$pJornada','$pFecha','$pDireccion',".$IdUsuario.");";
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
