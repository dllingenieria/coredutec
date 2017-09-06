<?php
require("../controlador/session.php");	
set_time_limit(0);
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class cargar {
    
    function cargar($param){
        extract($param);
        $usum = $_SESSION['usuario'];
        $sql = "CALL cargar()";
		$rs = null;
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
       
       function guardarArchivoPlano() {
        $dir_subida = '../anexos/Formatos/';
        $fichero_subido = $dir_subida . basename($_FILES['fichero_usuario']['name']);

        echo '<pre>';
        if (move_uploaded_file($_FILES['fichero_usuario']['tmp_name'], $fichero_subido)) {
            echo "El fichero es válido y se subió con éxito.\n";
        } else {
            echo "¡Posible ataque de subida de ficheros!\n";
        }
        echo 'Más información de depuración:';
        print_r($_FILES);

        print "</pre>";
    }
}
       
       ?>
