<?php
/**
 * Description of clsNovedades
 *
 * @author Reinel Tabaress
 */
class clsNovedades {

    
    public function agregarNovedad($param) {
        extract($param);
        $sql = "CALL AGREGAR_NOVEDAD($nov_ter, $nov_tip, '$nov_pre_ant',
        '$nov_pre_nue','$nov_fin','$nov_ffi','$nov_est_ant','$nov_est_nue','$nov_rar');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            $array = 1;
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }
    
    public function anexarSoporte($param){
        $fileTMP = $_FILES['soporte']['tmp_name'];
        $file = $_FILES['vid']['name'];
        $uploadDir = '../anexos/Soportes/';
        $array1 = explode(".", $file);
        $ext = $array1[count($array1) - 1];
        $array = "";
        $fullPath = $uploadDir . $file;
        if (move_uploaded_file($fileTMP, $fullPath)) {
            $array = $file;
        } else {
            $array = "Error al cargar, intente nuevamente 1";
        }
        echo json_encode(str_replace('"', "", $array));
    }
    
    public function eliminarNovedad() {
        extract($param);
        $sql = "CALL ELIMINAR_NOVEDAD($id);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            $array = 1;
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function consultarNovedad($param) {
        extract($param);
        $sql = "CALL CONSULTAR_NOVEDAD($id);";
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

    public function actualizarNovedad($param) {
        extract($param);
        $sql = "CALL ACTUALIZAR_NOVEDAD($id,$nov_ter, $nov_tip, '$nov_pre_ant', $nov_ser, '$nov_rut',
        '$nov_cur','$nov_mod', '$nov_pre_nue','$nov_fin','$nov_ffi','$nov_est_ant','$nov_est_nue');";
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

    public function consultarTiposNovedades($param) {
        extract($param);
        $sql = "CALL SPCARGARTIPONOVEDAD();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $fila = $this->CodificarEnUtf8($fila);
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        } //print_r($array);
        echo json_encode($array);
    }
    
    public function consultarNovedades($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARNOVEDADES();";
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
            $array = 0;
        }
        echo json_encode($resultado);
    }
    
    public function consultarNovedades2($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARNOVEDADES();";
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


public function consultarMatriculasOferente($param) {
    extract($param);
    $resultado = array();
    $registro = array();
    $sql = "CALL SPCONSULTARMATRICULASOFERENTE($pIdTercero)";
    $conexion->getPDO()->query("SET NAMES 'utf8'");
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
    }else {
        $array = 0;
    }
    echo json_encode($resultado);
}


    public function consultarCursosPorTercero($param) {
    extract($param);
    $resultado = array();
    $registro = array();
    $sql = "CALL SPBUSCARCURSOSMATRICULADOSPORTERCERO($pIdTercero)";
    $conexion->getPDO()->query("SET NAMES 'utf8'");
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
    }else {
        $array = 0;
    }
    echo json_encode($resultado);
}


    public function consultarNuevosCursos($param) {
    extract($param);
    $resultado = array();
    $registro = array();
    $sql = "CALL SPCONSULTARPREPROGRAMACIONESPORMODULOYCURSO($IdCurso,$IdModulo)";
    $conexion->getPDO()->query("SET NAMES 'utf8'");
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


public function cambiarCurso($param) {
    session_start(); 
    extract($param);
    $IdUsuario = $_SESSION['idUsuario'];
    $sql = "CALL SPMODIFICARMATRICULAPORTERCERO($pIdMatricula,$pIdPreprogramacion,".$IdUsuario.");";
    if ($rs = $conexion->getPDO()->query($sql)) {          
        $array = 1;
    } else {
        $array = 0;
    }
    echo json_encode($array);
}

public function anularMatricula($param) {
    session_start(); 
    extract($param);
    $IdUsuario = $_SESSION['idUsuario'];
    $sql = "CALL SPANULARMATRICULA($pIdMatricula,".$IdUsuario.");";
    if ($rs = $conexion->getPDO()->query($sql)) {          
        $array = 1;
    } else {
        $array = 0;
    }
    echo json_encode($array);
}

public function cambiarEstado($param) {
    session_start(); 
    extract($param);
    $IdUsuario = $_SESSION['idUsuario'];
    $sql = "CALL SPMODIFICARESTADO($pIdTercero,$pEstado,".$IdUsuario.");";
    if ($rs = $conexion->getPDO()->query($sql)) {          
        $array = 1;
    } else {
        $array = 0;
    }
    echo json_encode($array);
}


public function modificarCantidadEstudiantesCurso($param) {
    session_start(); 
    extract($param);
    $IdUsuario = $_SESSION['idUsuario'];
    $sql = "CALL SPMODIFICARCANTIDADESTUDIANTESSALON($pIdPreprogramacionNueva,$pIdPreprogramacionAnterior,".$IdUsuario.");";
    if ($rs = $conexion->getPDO()->query($sql)) {          
        $array = 1;
    } else {
        $array = 0;
    }
    echo json_encode($array);
}
    

public function consultarEstados($param) {
        extract($param);
        $sql = "CALL SPCARGARESTADOPARTICIPANTE();";
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

	/*
	*Consulta la carga por un idtercero enviado
	*Recibe el idTercero
	*Retorna un array 
	*/
	public function consultarCargasPorTercero($param) {
        extract($param);
		$resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARCARGASPORTERCERO($IdTercero);";
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, utf8_encode($value));
                    }
                    array_push($resultado, $registro);
                    $registro = array();
                }
            }
        } else {
            print_r($conexion->getPDO()->errorInfo()); die();
			$registro = 0;
        }
		//print_r($resultado);
        echo json_encode($resultado); 
    }
	
	/*
	*Elimina el id de la carga 
	*Recibe el IdCarga
	*Retorna si se ejecuto la consulta 
	*/
	public function eliminarCargaPorId($param) {
        extract($param);
        $sql = "CALL SPELIMINARCARGA($IdCarga);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            $registro=1;
        } else {
            $registro = 0;
			print_r($conexion->getPDO()->errorInfo()); die();
        }
        echo json_encode($resultado);
    }
	
	private function CodificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
        return $aux;
    }
	

}

?>
