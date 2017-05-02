<?php
ini_set('memory_limit', '9024M');
set_time_limit(0);
/** Error reporting */
class clsConfiguracion {

    ///***CRUD TIPO PARAMETRO***///
    public function AgregarTipoParametro($param) {
        session_start();
        extract($param);
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
        session_start();
        extract($param);
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
        session_start();
        extract($param);
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
        session_start();
        extract($param);
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
        session_start();
        extract($param);
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
        session_start();
        extract($param);
        //var_dump("parametros".$param);
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARUSUARIO($idTer,$tIdenUsu,$IdeUsu,$LExpUsu,'$NomUsu','$ApeUsu','$FNacUsu',$sexUsu,$ECivUsu,$gEscUsu,'$te1Usu','$te2Usu', '$te3Usu', '$dirUsu','$emaUsu',$locUsu,$ciuUsu,'$estUsu', '$idUsu','$usuUsu','$passUsu','$rolUsu', '$idDocUsu', '$carUsu', '$IdUsuario');";
        //echo ($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
             if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }else{
                $array = 1;
            }
        } else {
            //print_r($conexion->getPDO()->errorInfo()); die();
            $array = 0;
        }
        //print_r("Arrays ".$array);
        echo json_encode($array);
    }

    
    public function validarNombreUsuario($param) {
        extract($param);
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
        session_start();
        extract($param);
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
        session_start();
        extract($param);
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
                        array_push($registro, $fila['Id'],$fila['Codigo'],$fila['Nombre'],$fila['Duracion'], $fila['Ruta'],$value);
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
        session_start();
        extract($param);
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
        session_start();
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARCONVOCATORIA ($idConvocatoria, '$conNombre', '$conNombreCorto' , '$conEstado', '$IdUsuario');";
        echo ($sql);
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
                        array_push($registro, $fila['Id'],$fila['Codigo'],$fila['Nombre'],$fila['Duracion'], $fila['TipoFormacion'], $fila['AreaOcupacional'], $fila['CupoMinimo'],$fila['CupoMaximo'],$fila['Curso'],$value);
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


    public function AgregarModulo($param) {
        session_start();
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARCONVOCATORIA('$conNombre','$conNombreCorto','$conSerie','$conEstado','$IdUsuario');";
         echo ($sql);
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
        session_start();
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARCONVOCATORIA ($idConvocatoria, '$conNombre', '$conNombreCorto' , '$conEstado', '$IdUsuario');";
        echo ($sql);
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

}
?>