<?php
require("../controlador/session.php");
set_time_limit(0);	
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsServicio
 *
 * @author user
 */
class clsServicio {

    public function consultarServicios($param) {
        extract($param);
        $sql = "CALL SPCARGARSERVICIOS();";
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
