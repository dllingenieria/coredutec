<?php
require("../controlador/session.php");
ini_set('memory_limit', '9024M');
set_time_limit(0);
/** Error reporting */
class clsConfiguracion {

    ///***CRUD TIPO PARAMETRO***///
    public function AgregarTipoParametro($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARTIPOPARAMETRO('$tpNombre',$tpEstado,'$IdUsuario');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function modificarTipoParametro($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARTIPOPARAMETRO ($idTipoParametro, '$tipoParametro' , '$estadoTipoParametro', '$IdUsuario');";

        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }
    
    public function consultarCargaTipoParametro($param) {
		extract($param);
		$rs = null;
		$resultado = array();
		$registro = array();
		$conexion->getPDO()->query("SET NAMES 'utf8'");
		$sql = "CALL SPCARGARTIPOPARAMETRO();";
		if ($rs = $conexion->getPDO()->query($sql)) {
			if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
				foreach ($filas as $fila) {
					foreach ($fila as $key => $value) {
                        if($fila['Estado']==1){
                            $value="Activo";
                        }else{
                            $value="Inactivo";
                        }
						array_push($registro, $fila['Id'],$fila['Nombre'],$value);
					}
					array_push($resultado, $registro);
					   $registro = array();
				}
			}
		} else {
			$registro = 0;
		}
			echo json_encode($resultado);
    }


       ///***CRUD PARAMETRO***///
     public function consultarCargaParametro($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARPARAMETRO($idTipoParametro);";
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
            $registro = 0;
        }
            echo json_encode($resultado);
    }


    public function AgregarParametro($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARPARAMETRO('$idTipoParametro','$tpNombre','$tpEstado','$IdUsuario');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

     public function modificarParametro($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARPARAMETRO ($idParametro, $idTipoParametro, '$parametro' , '$estadoParametro', '$IdUsuario');";
        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

     ///***CRUD USUARIO***///
     public function AgregarUsuario($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARUSUARIO('$tIdenUsu','$IdeUsu','$LExpUsu','$NomUsu','$ApeUsu','$FNacUsu','$sexUsu','$ECivUsu','$gEscUsu','$te1Usu','$te2Usu', '$te3Usu', '$dirUsu','$emaUsu','$locUsu','$ciuUsu','$estUsu','$usuUsu','$passUsu','$rolUsu', '$carUsu', '$IdUsuario');";
       if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = $filas[0]["IdTabla"];
            }else{
                $array = $filas[0]["IdTabla"];
            }
        } else {
            print_r($conexion->getPDO()->errorInfo()); die();
            $array = -1;
        }
        echo json_encode($array);
    }


     public function consultarUsuarioGeneral($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARUSUARIOGENERAL();";

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
            $registro = 0;
        }
            echo json_encode($resultado);
    }

     public function consultarUsuarioEspecifico($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARUSUARIODETALLE('$idTercero');";
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

   public function consultarTerceroEspecifico($idTercero) {
        $resultado = array();
        $registro = array();
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARUSUARIODETALLE('$idTercero');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                 foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
            return $array;
    }


    public function consultarTerceroCedula($param) {
        extract($param);
		$rs = null;
        $array[]="";
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPBUSCARPORCEDULA('$DocumentoTercero');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                 foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        $idTercero= $fila['Id'];
						$rs = null;
                        $conexion->getPDO()->query("SET NAMES 'utf8'");
                        $sql = "CALL SPCONSULTARUSUARIODETALLE('$idTercero');";
                        if ($rs = $conexion->getPDO()->query($sql)) {
                            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                                 foreach ($filas as $fila) {
                                    foreach ($fila as $key => $value) {
                                        array_push($registro, $fila['IdTercero'],$fila['NumeroIdentificacion'],$fila['Nombres'],$fila['Apellidos'],$fila['NombreUsuario'],$fila['Estado'],$value);
                                        array_push($registro, $value);
                                    }
                                       array_push($resultado, $registro);
                                      $registro = array();
                                }
                            }
                        }  
                    }
                }
            }
        } else {
            $registro = 0;
        }
            echo json_encode($resultado);
    }


     public function modificarUsuario($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARUSUARIO($idTer,$tIdenUsu,$IdeUsu,$LExpUsu,'$NomUsu','$ApeUsu','$FNacUsu',$sexUsu,$ECivUsu,$gEscUsu,'$te1Usu','$te2Usu', '$te3Usu', '$dirUsu','$emaUsu',$locUsu,$ciuUsu,'$estUsu', '$idUsu','$usuUsu','$passUsu','$rolUsu', '$idDocUsu', '$carUsu', '$IdUsuario');";
        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    
    public function validarNombreUsuario($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPVALIDARNOMBREUSUARIO('$nomUsu');";
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


     ///***CRUD CONVOCATORIA***///
     public function consultarConvocatoria($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARCONVOCATORIA();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        if($fila['Estado']==1){
                            $value="Activo";
                        }else{
                            $value="Inactivo";
                        }
                        array_push($registro, $fila['Id'],$fila['Nombre'],$fila['NombreCorto'],$fila['Serie'],$value);
                    }
                    array_push($resultado, $registro);
                       $registro = array();
                }
            }
        } else {
            $registro = 0;
        }
            echo json_encode($resultado);
    }


    public function AgregarConvocatoria($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARCONVOCATORIA('$conNombre','$conNombreCorto','$conEstado','$conSerie','$IdUsuario');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

     public function modificarConvocatoria($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARCONVOCATORIA ($idConvocatoria, '$conNombre', '$conNombreCorto' , '$conEstado','$conSerie','$IdUsuario');";
        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }


      ///***CRUD CURSO***///
     public function consultarCurso($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARCURSO();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        if($fila['Estado']==1){
                            $value="Activo";
                        }else{
                            $value="Inactivo";
                        }
                        array_push($registro, $fila['Id'],$fila['Codigo'],$fila['Nombre'],$fila['Duracion'], $fila['DuracionId'],$fila['Ruta'], $fila['RutaId'],$value);
                    }
                    array_push($resultado, $registro);
                       $registro = array();
                }
            }
        } else {
            $registro = 0;
        }
            echo json_encode($resultado);
    }


    public function AgregarCurso($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARCURSO('$curCodigo','$curNombre','$curDuracion','$curRuta','$IdUsuario');";
        //echo ($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

     public function modificarCurso($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARCURSO ($idCurso, '$txtCodigoCurso', '$txtNombreCurso' , '$selectDuracionCurso', '$selectRutaCurso', '$txtEstadoCurso', '$IdUsuario');";
        //echo $sql;
        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

      ///***CRUD MODULOS***///
     public function consultarModulo($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARMODULO($idCurso);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        if($fila['Estado']==1){
                            $value="Activo";
                        }else{
                            $value="Inactivo";
                        }
                        array_push($registro, $fila['Id'],$fila['Codigo'],$fila['Nombre'],$fila['Duracion'], $fila['TipoFormacion'], $fila['TipoFormacionNombre'], $fila['AreaOcupacional'], $fila['AreaOcupacionalNombre'],  $fila['TipoCapacitacionR4547'], $fila['TipoCapacitacionR4547Nombre'], $fila['EstadoAsistenciaR4547'], $fila['EstadoAsistenciaR4547Nombre'],$fila['CertificacionEmitida'], $fila['CertificacionEmitidaNombre'], $fila['CupoMinimo'],$fila['CupoMaximo'],$value);
                    }
                    array_push($resultado, $registro);
                       $registro = array();
                }
            }
        } else {
            $registro = 0;
        }
            array($resultado);
            echo json_encode($resultado);
    }


    public function AgregarModulo($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARMODULO('$modCodigo','$modNombre','$modDuracion','$modFormacion','$modArea','$modCapacitacion','$modEstadoAsistencia','$modCertificacion','$modMaximo','$modMinimo','$modCurso','$IdUsuario');";
         //echo ($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

     public function modificarModulo($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARMODULO ($idModulo, '$modCodigo','$modNombre','$modDuracion','$modFormacion','$modArea','$modCapacitacion','$modEstadoAsistencia','$modCertificacion','$modMaximo','$modMinimo', '$modCurso','$modEstado','$IdUsuario');";
        //echo ($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }


    public function cargarListas1($param) {
        extract($param);
        $opciones="";
		$rs=null;
        $sql = "CALL ".$procedimiento."();";
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            $opciones.='<option value="0">Seleccionar</option>';
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                   // $array[] = $fila;
                    $opciones.='<option value="'.$fila["Id"].'">'.$fila["Nombre"].'</option>';
                }
            }
        } 
        //mysql_free_result($rs);
        echo $opciones;
        //echo json_encode($array);
    }
}
?>