<?php

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
        $array = array('error'=>0,'mensaje'=>'','nombreArchivo'=>'');
		$valorSeleccionado=$_GET['valorSeleccionado'];
		$ubicacion=$_GET['ubicacion'];
		
		$fileTMP = $_FILES['vid']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $array = "";
		switch ($valorSeleccionado) {
				case "289":
					$uploadDir = '../anexos/Formatos/';
					break;
				case "290":
					$uploadDir = '../anexos/soporteMatriculas/'.$ubicacion.'/';
					if(!mkdir($uploadDir, 0777, true)) {
						$array[ 'error' ]=1;
						$array[ 'mensaje' ]='Fallo al crear las carpetas...';
						echo json_encode(str_replace('"', "", $array));
					}
					break;
				case "291":
					$uploadDir = '../anexos/soporteFirmas/'.$ubicacion.'/';
					if(!mkdir($uploadDir, 0777, true)) {
						$array[ 'error' ]=1;
						$array[ 'mensaje' ]='Fallo al crear las carpetas...';
						echo json_encode(str_replace('"', "", $array));
					}
					break;
				case "292":
					$uploadDir = '../anexos/cambioEstados/'.$ubicacion.'/';
					if(!mkdir($uploadDir, 0777, true)) {
						$array[ 'error' ]=1;
						$array[ 'mensaje' ]='Fallo al crear las carpetas...';
						echo json_encode(str_replace('"', "", $array));
					}
					break;
				case "293":
					$uploadDir = '../anexos/soporteRefrigerios/'.$ubicacion.'/';
					if(!mkdir($uploadDir, 0777, true)) {
						$array[ 'error' ]=1;
						$array[ 'mensaje' ]='Fallo al crear las carpetas...';
						echo json_encode(str_replace('"', "", $array));
					}
					break;
				case "294":
					$uploadDir = '../anexos/informeAgencia/'.$ubicacion.'/';
					if(!mkdir($uploadDir, 0777, true)) {
						$array[ 'error' ]=1;
						$array[ 'mensaje' ]='Fallo al crear las carpetas...';
						echo json_encode(str_replace('"', "", $array));
					}
					
			}
        $array1 = explode(".", $file);
        $ext = $array1[count($array1) - 1];
        
        if ($ext == 'CSV' || $ext == 'csv' || $ext == 'PDF' || $ext == 'pdf') {
            $fullPath = $uploadDir . $file;
            if (move_uploaded_file($fileTMP, $fullPath)) {
                $array[ 'nombreArchivo' ] = $file;
				$guardarArchivo=guardarUbicacion($valorSeleccionado, $uploadDir, $file);
				if ($guardarArchivo == 0){
					$array[ 'error' ]=1;
					$array[ 'mensaje ']= 'No se guardo la ubicación del archivo, intente nuevamente' ]; 
				}
				
           } else {
                $array[ 'error' ]=1;
				$array[ 'mensaje ']= 'Error al cargar, intente nuevamente' ]; 
            }
        } else {
            $array[ 'error' ]=1;
			$array[ 'mensaje ']= "Error al cargar, archivo no es formato CSV o PDF";
        } print_r($array);
		
        echo json_encode(str_replace('"', "", $array));
    }
	
	function guardarUbicacion($tipoSoporte, $ubicacionArchivo,$nombreaArchivo){
		
        
        $array=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPGUARDARUBICACION($tipoSoporte,$ubicacionArchivo,$nombreaArchivo);";
        //print_r($sql);
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        } //print_r($array); die();
        return($array);
    
	}

}

?>
