<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
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

    public function CrearArchivoEnServer($nom_arc, $con_arc, $url_des) {
        $fil_com = $url_des.str_replace('"', "", $nom_arc);
        $nue_arc = fopen($fil_com, "w") or die("Error al crear archivo de Logs :".$fil_com."");
        fwrite($nue_arc, $con_arc);
        //fwrite($nue_arc, $nue_arc);
        fclose($nue_arc);
        return "Archivo <a href=\"../../".trim(str_replace("..","", $fil_com))."\" download>".str_replace('"', "", $nom_arc)."</a> guardado en servidor.";
    }



    function GuardarArchivoOriginal($param){
        extract($param);
        $archivo= str_replace('"', '',$archivo);
        $array1 = explode(".", $archivo);
        $ext = $array1[count($array1) - 1];
      
        $nuevoNombre= $nombreCorto."_".$idTablaGeneral.".".$ext;
       $nuevoNombre="../".$ubicacion.$nuevoNombre;
       //rename('$archivo', '$nuevoNombre');
       $archivo="../tmp/".$archivo;
       
        if (copy($archivo, $nuevoNombre)) {
                $array = $nuevoNombre;

            if (file_exists($nuevoNombre)) {
                 unlink($archivo);
                $array=$nuevoNombre;
            }else{
                 $array="2";
            }
            
        } else {
                $array = "Error al cargar, intente nuevamente ";
        }


        echo json_encode($array);
    }

    //Clase GuardarArchivoPlano()
    function GuardarArchivoPlano() {

	   $ubicacion= $_REQUEST['ubicacion'];
       $valorSeleccionado= $_REQUEST['valorSeleccionado'];

       if($valorSeleccionado=="Autorizacion"){// Me llama el metodo que carga zip
            $array=$this->GuardarArchivoPdf($ubicacion);
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
        //echo "ubicacion".$ubicacion;
        $randName= rand(1000, 1000000);
        //echo "randname".$randName;
        $fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $type = $_FILES["vid"]["type"];
        $carpetaZip="../".$ubicacion."/".$randName."/";
            umask(0);
        if (mkdir($carpetaZip, 0777)){; // se crea carpeta donde se va a descomprimir el zip
            chmod($dir,0777);
            $uploadDir = '../'.$ubicacion.$randName."/";
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

            //echo $fullPath;
            if(move_uploaded_file($fileTMP, $fullPath)) {
            $zip = new ZipArchive();
            $x = $zip->open($fullPath);
            if ($x === true) {
                $zip->extractTo($uploadDir); // change this to the correct site path
                $zip->close();
        
                unlink($fullPath);
                $array=$randName;
            }
                //$array = "Your .zip file was uploaded and unpacked.";
            } else {   

                $error = error_get_last();
                $array= "error move_uploaded_file: ".$error['message']." *fullPath: ".$fullPath." *fileTMP: ".$fileTMP." *carpetaZip ".$carpetaZip;
                //$array = "There was a problem with the upload. Please try again.";
            }
    }else{

            $error = error_get_last();
            $array= "error mkdir".$error['message'];
    }
        echo json_encode($array);
    
    }

    public function GuardarArchivoCsv($ubicacion){
        $randName= rand(100, 10000);
        $fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $uploadDir = '../'.$ubicacion;
        $array1 = explode(".", $file);
        $ext = $array1[count($array1) - 1];
        $array = "";
        if ($ext == 'CSV' || $ext == 'csv') {
            $nameArchivo=$randName.".".$ext;
            $fullPath = $uploadDir . $nameArchivo;
            if (move_uploaded_file($fileTMP, $fullPath)) {
                $array = $nameArchivo;
            } else {
                $array = "Error al cargar, intente nuevamente 1";
            }
        } else {
            $array = "Error al cargar, archivo no es formato CSV";
        }

        return $array;
    }

    public function GuardarArchivoPdf($ubicacion){
        $randName= rand(100, 10000);
        $fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $uploadDir = '../'.$ubicacion;
        $array1 = explode(".", $file);
        $ext = $array1[count($array1) - 1];
        $array = "";
            $nameArchivo=$randName.".".$ext;
            $fullPath = $uploadDir . $nameArchivo;
            if (move_uploaded_file($fileTMP, $fullPath)) {
                $array = $nameArchivo;
            } else {
                $array = "Error al cargar, intente nuevamente ".$_FILES["vid"]["error"];
            }

        return $array;
    }

}

?>
