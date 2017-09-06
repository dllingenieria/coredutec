<?php
require("../controlador/session.php");
set_time_limit(0);
	
class clsUsuario {

    //==============================================================
    //                      CARGAR LISTAS
    //==============================================================
    
    /**
     * [consultarNotasPorSalon Obtiene las notas por estudiante de un curso]
     * @author John James Granados Restrepo (gjohnj)
     * @param  [string] $param [id de preprogramación]
     * @return [array]        [array con los datos y notas asociadas a cada estudiante]
     */
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

     public function cargarListas1($param) {
        extract($param);
        $opciones="";
        $sql = "CALL ".$procedimiento."();";
		$rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            $opciones.='<option value="0">Seleccionar</option>';
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                   // $array[] = $fila;
                    $opciones.='<option value="'.$fila["Id"].'">'.$fila["Nombre"].'</option>';
                }
            }
        } 
        mysqli_free_result($rs);
        echo $opciones;
        //echo json_encode($array);
    }

    public function consultarEstudiantesPorSalon($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARESTUDIANTESPORSALON($IdPreprogramacion);";
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
    
}

?>
