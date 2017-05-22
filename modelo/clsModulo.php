<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsCurso
 *
 * @author user
 */
class clsModulo {

	public function consultarestudiantesInasistenciaModulo($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARESTUDIANTESINASISTENCIAMODULO($idModulo, '$fecha');";
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

	public function consultarModulosConInasistencias($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARMODULOSCONINASISTENCIAS('$fecha');";
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

	public function ConsultarModuloParaPreprogramar($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARMODULOPARAPREPROGRAMAR();";
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

	public function ConsultarModuloPorCodigo($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARDATOSMODULO('$pCodigoModulo');";
		if ($rs = $conexion->getPDO()->query($sql)) {	
			if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
				foreach ($filas as $fila) {					
					$array[] = $fila;
				}
			}else{
				$array = [];
			}
		} else {
			$array = 0;
		}
		echo json_encode($array);
	}

	public function ConsultarModulosVistosPorTercero($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARMODULOSVISTOSPORTERCERO($idTercero);";
		if ($rs = $conexion->getPDO()->query($sql)) {
			if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
				foreach ($filas as $fila) {
					$array[] = $fila;
				}
			}else{
				$array = 0;
			}
		} else {
			$array = 0;
		}
		echo json_encode($array);
	}

	public function consultarEstudiantesPorModulo($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARESTUDIANTESPORMODULO('$codigoModulo');";
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

	public function ConsultarModulosCruzados($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARMODULOPORSALONES($idSalon, '$fechaInicial', '$fechaFinal');";
		if ($rs = $conexion->getPDO()->query($sql)) {
			if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
				foreach ($filas as $fila) {
					$array[] = $fila;
				}
			}else{
				$array = [];
			}
		} else {
			$array = 0;
		}
		echo json_encode($array);
	}

	public function CargarInformacionCompletaModulo($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCONSULTARMODULO1();";        
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

	public function ConsultarModulosPorRutaCurso($param) {
		extract($param);
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPBUSCARMODULOSPORRUTACURSO('$rutaId', '$cursoId');";
		if ($rs = $conexion->getPDO()->query($sql)) {
			if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
				foreach ($filas as $fila) {
					$array[] = $fila;
	
				}
			}else{
				$array = [];
			}
		} else {
			$array = 0;
		}
		// print_r($array);
		echo json_encode($array);
	}



	function codificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
		print_r($aux);
        return $aux;
    }

}

?>
