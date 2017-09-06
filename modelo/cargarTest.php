<?php
require("../controlador/session.php");
set_time_limit(0);	
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class cargarTest {
    
    function cargar($param){
        extract($param);
        $usum = $_SESSION['usuario'];
		$rs = null;
        $sql = "CALL cargar()";
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
