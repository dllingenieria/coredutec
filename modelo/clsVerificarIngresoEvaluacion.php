<?php 
require("../controlador/session.php");	
set_time_limit(0);
error_reporting(E_ALL);
/**
 * Description of clsVerificarIngresoEvaluacion
 *
 * @author DimensionIt
 */
class clsVerificarIngresoEvaluacion {
    /*Funcion verificarChatcha
	*param: recibe el codigo que se genero de catcha y lo ingresado por el usuario
	*return: mesaje de ingreso o error en los datos de ingreso
	*/
	
    public function verificarIngreso($param) {
		extract($param);
		$data=array('error'=>'','mensaje'=>'','nombres'=>'');
	
		//Verificar fecha de nacimiento y cedula
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$rs=null;
        $sql = "CALL SPBUSCARDATOSTERCEROEVALUACION($pTipoDocumento,'$identificacion',$IdMatricula);";        
        if ($rs = $conexion->getPDO()->query($sql)) {
            $fila = $rs->fetch(PDO::FETCH_ASSOC);
				if ($fila['Nombres'] == ""){
					$data["mensaje"]="Los datos ingresados de id matrícula y documento no son válidos";
					$data["error"]=1;
					// echo json_encode($data);
					// exit;
				}
				else{
					$data["nombres"]=$fila['Nombres']; 
					$data["Id"]=$fila['Id']; 
					$data["NumeroIdentificacion"]=$fila['NumeroIdentificacion']; 
					$data["LugarExpedicion"]=$fila['LugarExpedicion'];
					$data["TipoIdentificacion"]=$fila['TipoIdentificacion'];
				}
        } else {
            $data["mensaje"]="No se pudieron consultar los datos de ingreso";
			$data["error"]=1;
        }
		
		//Verificar el captcha
		$key=$_SESSION[ 'key' ];
		if( md5( $code) != $key ) {
			if($data["mensaje"]==""){
					$data["mensaje"].=" El código catcha no corresponde";
				}
				else{
					$data["mensaje"].=" ademas el código catcha no corresponde";
				}
			   $data["error"]=1;

		} 
		// else 
		// {
			 // $data["mensaje"]="El codigo es correcto";
        // }
		echo json_encode($data);
	}
	
	public function cargarDatosGeneralesEvaluacion($param) {
		extract($param);
		$data=array('error'=>'','mensaje'=>'','array'=>'');
	
		//Verificar fecha de nacimiento y cedula
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$rs=null;
        $sql = "CALL SPCARGARDATOSGENERALESEVALUACION($IdMatricula);";        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                if($filas != ""){
					foreach ($filas as $fila) {
						$array[] = $fila;
					}
					
					// $array=array();
					// $array['servicio']='servicios';
					// $array['docente']='docente';
					// $array['lugar']='lugar';
					// $data['array']=$array;
				}
				else{
					$data["mensaje"]="No se encontraron los datos generales para la evaluación";
					$data["error"]=1;
				}
            }
        } else {
            $data["mensaje"]="No se pudieron consultar los datos generales de la evaluación";
			$data["error"]=1;
        }
		//print_r($array);
		echo json_encode($array);
	}
	
	public function cargarModulosVistosAevaluar($param) {
		extract($param);
		$resultado = array();
        $registro = array();
		$data=array('error'=>'','mensaje'=>'','array'=>'');
		//Verificar fecha de nacimiento y cedula
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$rs=null;
        $sql = "CALL SPCARGARMODULOSVISTOSAEVALUAR($tipoIdentificacion,'$identificacion',$IdMatricula);";        
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
		}
		echo json_encode($resultado);
	}
	
	public function cargarModulosVistosAcertificar($param) {
		extract($param);
		$resultado = array();
        $registro = array();
		$data=array('error'=>'','mensaje'=>'','array'=>'');
		//Verificar fecha de nacimiento y cedula
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$rs=null;
        $sql = "CALL SPCARGARMODULOSVISTOSACERTIFICAR($tipoIdentificacion,'$identificacion',$IdMatricula);";        
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
		}
				// else{
					// $data["mensaje"]="No se encontraron módulos para mostrar";
					// $data["error"]=1;
				// }
		
        // } else {
            // $data["mensaje"]="No se pudieron consultar los módulos ";
			// $data["error"]=1;
        // }
		
		echo json_encode($resultado);
	}
	
	public function cargarCursos($param) {
		extract($param);
		$resultado = array();
        $registro = array();
		$data=array('error'=>'','mensaje'=>'','array'=>'');
		//cargar cursos
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$rs=null;
        $sql = "CALL SPCARGARCURSOSVISTOS($tipoIdentificacion,'$identificacion',$IdMatricula);";        
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
		}
				// else{
					// $data["mensaje"]="No se encontraron módulos para mostrar";
					// $data["error"]=1;
				// }
		
        // } else {
            // $data["mensaje"]="No se pudieron consultar los módulos ";
			// $data["error"]=1;
        // }
		// $resultado1=array();
		// $resultado1[0]="5.01.T4";
		// $resultado1[1]=5;
		// $resultado1[2]="Curso prueba";
		// $resultado1[3]=10;
		// $resultado[0]=$resultado1;
		//print_r($resultado);
		echo json_encode($resultado);
	}

}

?>
