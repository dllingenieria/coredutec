<?php 
require("../controlador/session.php");
set_time_limit(0);
	
class clsTercero{
	public function guardarTercero($param){
        extract($param);
        $clasesw = 'Docente';
        $IdUsuario = $_SESSION['idUsuario'];
        $resp = 'ok';

        if(sizeof($eliminar) != 0){
        	$conexion->getPDO()->query("SET NAMES 'utf8'");
        	foreach ($eliminar as $ideliminar) {
        		$sql = "CALL SPDESACTIVARDOCENTE($ideliminar,$IdUsuario);";
				$rs=null;
        		echo $sql;
        		$rs = $conexion->getPDO()->query($sql);
        	}
        }

        if(sizeof($datos) != 0){
	        foreach ($datos as $d) {
	        	$d[1] = $d[1]!=''?$d[1]:'No suministrado';
	        	$d[5] = $d[5]!=''?$d[5]:0;
	        	$d[7] = $d[7]!=''?$d[7]:'No suministrado';
	        	$d[8] = $d[8]!=''?$d[8]:'No suministrado';
	        	$d[13] = $d[13]!=''?$d[13]:0;
	        	$d[14] = $d[14]!=''?$d[14]:0;
	        	$d[15] = $d[15]!=''?$d[15]:0;
	        	$d[16] = $d[16]!=''?$d[16]:'No suministrado';
	        	$d[17] = $d[17]!=''?$d[17]:'No suministrado';
	        	$d[20] = $d[20]!=''?$d[20]:'No suministrado';
	            if($d[0] != ''){
	                $conexion->getPDO()->query("SET NAMES 'utf8'");
	                $sql = "CALL SPMODIFICARDOCENTE($d[0],'$d[1]',$d[2],$d[3],$IdUsuario)";
					$rs=null;
	                //echo $sql;
	                $rs = $conexion->getPDO()->query($sql);

	                $sql = "CALL SPMODIFICARTERCERO($d[2],$d[4],$d[5],$d[6],'$d[7]','$d[8]','$d[9]',$d[10],$d[11],$d[12],'$d[13]','$d[14]','$d[15]','$d[16]','$d[17]',$d[18],$d[19],'$d[20]',1,$IdUsuario)";
	                //echo json_encode($sql);
					$rs=null;
	                echo $sql;
	                $rs = $conexion->getPDO()->query($sql);

	                
	            }else{
	            	$conexion->getPDO()->query("SET NAMES 'utf8'");
	            	$sql = "CALL SPAGREGARTERCERO($d[4],$d[5],$d[6],'$d[7]','$d[8]','$d[9]',$d[10],$d[11],$d[12],'$d[13]','$d[14]','$d[15]','$d[16]','$d[17]',$d[18],$d[19],'$d[20]',$IdUsuario)";
	            	//echo json_encode($sql);
					$rs=null;

	            	if ($rs = $conexion->getPDO()->query($sql)) {
	            		if ($fila = $rs->fetchAll(PDO::FETCH_ASSOC)) {
	            			$idTercero = $fila[0]['IdTercero'];
	            		}
	        		}
	        		//echo $idTercero;
	        		if($idTercero != ''){
	        			switch ($clasesw) {
	        				case 'Docente':
	        					$sql = "CALL SPAGREGARDOCENTE('$d[1]',$idTercero,$IdUsuario)";
								$rs=null;
	        					break;
	        				
	        				default:
	        					break;
	        			}
	        			//echo json_encode($sql);
	        			$conexion->getPDO()->query("SET NAMES 'utf8'");						
	        			$rs = $conexion->getPDO()->query($sql);

	        		}

	            }
	            
	        }
    	}
        echo json_encode('success');
        
    }


    function obtenerTipoIdentificacion($params){
    	extract($params);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPOBTENERTIPOIDENTIFICACION();";  
		$rs=null;		
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array(0 => $fila['IdTipoIdentificacion'], 1 => $fila['Nombre']);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function obtenerSexo($params){
        extract($params);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARSEXO();";  
        $rs=null;       
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array(0 => $fila['Id'], 1 => $fila['Nombre']);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function obtenerCiudades($params){
    	extract($params);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPOBTENERCIUDADES();";        
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array(0 => $fila['IdMunicipio'], 1 => $fila['Nombre']);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function obtenerEstadoCivil($params){
    	extract($params);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPOBTENERESTADOCIVIL();";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array(0 => $fila['IdEstadoCivil'], 1 => $fila['Nombre']);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function obtenerGradoEscolaridad($params){
    	extract($params);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPOBTENERGRADOESCOLARIDAD();";        
		$rs=null;
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array(0 => $fila['IdGradoEscolaridad'], 1 => $fila['Nombre']);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function obtenerLocalidades($params){
    	extract($params);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPOBTENERLOCALIDADES();";
		$rs=null;        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array(0 => $fila['IdLocalidad'], 1 => $fila['Nombre']);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

}
 ?>