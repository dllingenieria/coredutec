<?php

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
        $sql = "CALL SPCONSULTARSERIALDADOID($conId);";
        $rs = $conexion->getPDO()->query($sql);
        $id = $rs->fetch(PDO::FETCH_ASSOC);
        echo json_encode($id['Serie']);
    }


    public function insertarJornadaConvocatoria($param) {
        session_start(); 
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $pFecha;
		$fecha = explode("/",$pFecha);
		$dia = $fecha[0];
		$mes = $fecha[1];
		$anio = $fecha[2];
		$pFecha = $anio."-".$mes."-".$dia;
        $sql = "CALL SPAGREGARJORNADACONVOCATORIA('$pJornada','$pFecha','$pDireccion',".$IdUsuario.");";
       // CALL SPAGREGARJORNADACONVOCATORIA('aaa','--2017-05-11','aaaa',1);
        
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;

                }
            }
        } else {
            $array = 0;//print_r($conexion->getPDO()->errorInfo()); die();
        }
        echo json_encode($array);
    }

}

?>
