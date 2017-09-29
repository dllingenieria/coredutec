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

	   $ubicacion= $_REQUEST['ubicacion'];
       $valorSeleccionado= $_REQUEST['valorSeleccionado'];

       if($valorSeleccionado=="Autorizacion"){// Me llama el metodo que carga zip
            $array=$this->GuardarArchivoZip($ubicacion);
       }

       if($valorSeleccionado=="Fuente"){// Me llama el metodo que carga csv
            $array=$this->GuardarArchivoCsv($ubicacion);
       }

       if($valorSeleccionado=="Escaneado"){// Me llama el metodo que carga zip
             $array=$this->GuardarArchivoZip($ubicacion);
       }

        
        echo json_encode(str_replace('"', "", $array));
    }


    public function GuardarArchivoZip($ubicacion){
        $fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $type = $_FILES["vid"]["type"];

        $uploadDir = '../'.$ubicacion;
        $name = explode(".", $file);

        $accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
        
        foreach($accepted_types as $mime_type) {
            if($mime_type == $type) {
                $okay = true;
                break;
            } 
        }

        $continue = strtolower($name[1]) == 'zip' ? true : false;
        if(!$continue) {
            $array = "El archivo que intenta cargar no es un archivo .zip. Vuelve a intentarlo.";
        }
        $fullPath = $uploadDir . $file;
        if(move_uploaded_file($fileTMP, $fullPath)) {
        $zip = new ZipArchive();
        $x = $zip->open($fullPath);
        if ($x === true) {
            $zip->extractTo($uploadDir); // change this to the correct site path
            $zip->close();
    
            unlink($fullPath);
            $array=$file;
        }
            $array = "Your .zip file was uploaded and unpacked.";
        } else {    
            $array = "There was a problem with the upload. Please try again.";
        }


    }

    public function GuardarArchivoCsv($ubicacion){

        $fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $uploadDir = '../'.$ubicacion;
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

        return $array;
    }

}

?>
