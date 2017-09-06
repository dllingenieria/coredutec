<?php
// session_start();
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsArchivo
 * @author ADMIN
 */
class clsArchivo {
    /*
     * @author Wilmer Andrés
     * crearArchivoenServer($nombre_archivo,$contenido_archivo,$url_destino)
     * Crear un archivo en el servidor con los parámetros que recibe la función.
     */

    public function CrearArchivoEnServer($nom_arc, $con_arc, $url_des) {
        $fil_com = $url_des.str_replace('"', "", $nom_arc);
        $nue_arc = fopen($fil_com, "w") or die("Error al crear archivo de Logs :".$fil_com."");
        fwrite($nue_arc, $con_arc);
        //fwrite($nue_arc, $nue_arc);
        fclose($nue_arc);
        return "Archivo <a href=\"../../".trim(str_replace("..","", $fil_com))."\" download>".str_replace('"', "", $nom_arc)."</a> guardado en servidor.";
    }

    //Clase GuardarArchivoPlano()
    function GuardarArchivoPlano() {
        $fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $uploadDir = '../anexos/Formatos/';
        $array1 = explode(".", $file);
        $ext = $array1[count($array1) - 1];
        $array = "";
        if ($ext == 'CSV' || $ext == 'csv') {
            $fullPath = $uploadDir . $file;
            if (move_uploaded_file($fileTMP, $fullPath)) {
                $array = $file;
            } else {
                $array = "Error al cargar, intente nuevamente 1";
            }
        } else {
            $array = "Error al cargar, archivo no es formato CSV";
        }
        echo json_encode(str_replace('"', "", $array));
    }

}

?>
