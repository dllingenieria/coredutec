<?php
require("../controlador/session.php");
set_time_limit(0);
/**
 * Description of clsSoportes
 *
 * @author Reinel Tabaress
 */
class clsSoportes {

    
    

    public function consultarTiposSoportes($param) {
        extract($param);
        $sql = "CALL SPCARGARTIPOSOPORTE();";
		  $rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $fila = $this->CodificarEnUtf8($fila);
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        } 
        echo json_encode($array);
    }
	
	   public function consultarSoportesPorCedula($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
       
        $sql = "CALL SPCONSULTARSOPORTESPORCEDULA($cedula,$tipoSoporte);";
        // $sql = "CALL SPCONSULTARSOPORTESPORCEDULA($cedula);";
	
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
			
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, $value);
                    }
                    array_push($resultado, $registro);
                    $registro = array();
                }
				
            }
        } else {
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); 
        }
		
			// $resultado[0][0]="Cedula";
			// $resultado[0][1]="soportes/30237370";
			// $resultado[1][0]="Cedula";
			// $resultado[1][1]="soportes/1111111";

		// print_r($resultado);
        echo json_encode($resultado);
    }
	
	 public function consultarSoportesPorConvocatoria($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
       
        //se consulta por la descripcion convocatoria
		$sql = "CALL SPCONSULTARSOPORTESPORCONVOCATORIA($dConvocatoria,$tipoSoporte);";
        	
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
			
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, $value);
                    }
                    array_push($resultado, $registro);
                    $registro = array();
                }
				
            }
        } else {
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); 
        }
		
		// print_r($resultado);
        echo json_encode($resultado);
    }
	
	public function subirArchivo($param) {
        extract($param);
		$ruta="";
		$nombre="";
		$resultado=-1;
        if (unlink($ruta."/".$nombre))
		{
			$resultado=1;
		}
		
        echo json_encode($resultado);
    }
	
	  public function eliminarArchivo($param) {
        extract($param);
		
		$rs = null;
       
        $conexion->getPDO()->query("SET NAMES 'utf8'");
       
        if ($accion == 299){
			$sql = "CALL SPELIMINARSOPORTECONVOCATORIA ('$IdSoporte');";
		}
		else{
			$sql = "CALL SPELIMINARSOPORTE('$IdSoporte');";
		}
		
		
        if ($rs = $conexion->getPDO()->query($sql)) 
		{
            	$resultado=1;
					//borrar archivo
					// if(@unlink($url))
						// {
							// $resultado=1;
						// }
            
        }
		else 
		{
            $resultado = 0; print_r($conexion->getPDO()->errorInfo()); 
        }
		
		
        echo json_encode($resultado);
    }
	
	public function consultarCedulaSoportes($param) {
        extract($param);
		$rs = null;
        
        $conexion->getPDO()->query("SET NAMES 'utf8'");
       
        $sql = "CALL SPCONSULTARCEDULA($cedula);";
		
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
					$resultado=$filas[0]['IdTercero']; //print_r($resultado);
					
            }
        } else {
            $resultado = 0; 
			print_r($conexion->getPDO()->errorInfo()); 
        }
		//print_r($resultado);
        echo json_encode($resultado); 
    }
	
	private function CodificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
        return $aux;
    }
    
	public function descargaMultiple($param)
	{
		
		extract($param);
		$zip = new ZipArchive();
		$filename = "../tmp/".$cedula.$this->getStamp().".zip";
		if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) 
		{
			exit("cannot open <$filename>\n");
		}
		foreach($arrayUrl as $url)
		$zip->addFile($url);
		$zip->close();
		// print_r($filename);
		echo json_encode($filename);
	}
	

	public function getStamp()
	{
	  $now = (string)microtime();
	  $now = explode(' ', $now);
	  $mm = explode('.', $now[0]);
	  $mm = $mm[1];
	  $now = $now[1];
	  $segundos = $now % 60;
	  $segundos = $segundos < 10 ? "$segundos" : $segundos;
	  return strval(date("YmdHi",mktime(date("H"),date("i"),date("s"),date("m"),date("d"),date("Y"))) . "$segundos$mm");
	}	
	
	
}

?>
