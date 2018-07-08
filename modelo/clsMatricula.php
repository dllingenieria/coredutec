<?php
require("../controlador/session.php");
require("clsUtilidades.php");
set_time_limit(0);
/**
 * Description of clsCurso
 * @author Wilmer Andres Escobar Naranjo
 */

class clsMatricula {

    public function AgregarMatricula($param) {
    extract($param);
    $IdUsuario = $_SESSION['idUsuario'];
    $rs=null;
    $sql = "CALL SPAGREGARMATRICULAS($pTerceroNit,$pIdConvocatoria, $pIdRuta,'$pCodigoCurso', $pIdModalidad,'$pCodigoModulo', $pIdMatricula,$pIdCarga,".$IdUsuario.");";
    if ($rs = $conexion->getPDO()->query($sql)) {      
        if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)){
            $IdMatricula = $filas[0]['pIdTabla'];
        }
        $rs->closeCursor();
        $rs1=null;
        $array1=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREOMATRICULA($IdMatricula);";
        if ($rs1 = $conexion->getPDO()->query($sql)) {      
            if ($filas = $rs1->fetchAll(PDO::FETCH_ASSOC)) {
               //----- Inicio código para enviar el correo al estudiante luego de la matrícula -----//
                foreach ($filas as $fila) {
                    $array1[] = $fila; 
                }
                $rs1->closeCursor();
                $utilidades = new clsUtilidades();
                $rs2=null;
                $array2=array();
                $IdTercero = $array1[0][Id];
                $sql2 = "CALL SPCONSULTARCORREOSESTUDIANTES($IdTercero);";
                if ($rs2 = $conexion->getPDO()->query($sql2)) {
                    if ($filas2 = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
                        foreach ($filas2 as $fila1) {
                            $array2[] = $fila1; 
                        }
                    }
                    $rs2->closeCursor();
                    $clave = array_pop($array2)['Email'];
                    $correode = array_pop($array2)['Email'];
                    $rs3=null;
                    $array3=array(); 
                    $sql3 = "CALL SPCONSULTARCORREOUSUARIO($IdUsuario);";
                    if ($rs3 = $conexion->getPDO()->query($sql3)) {
                        if ($filas3 = $rs3->fetchAll(PDO::FETCH_ASSOC)) {
                            foreach ($filas3 as $fila3) {
                                $array3[] = $fila3; 
                            }
                        }
                        $rs3->closeCursor();
                    }
                    if (count($array2)>0){
                        $estudiante = $array1[0]['Estudiante'];
                        $tipoidentificacion = $array1[0]['TipoIdentificacion'];
                        $cedula = $array1[0]['NumeroIdentificacion'];
                        $correoElectronico = $array1[0]['CorreoElectronico'];
                        $salon = $array1[0]['Salon'];
                        $curso = $array1[0]['Curso'];
                        $ruta = $array1[0]['Ruta'];
                        $duracionCurso = $array1[0]['DuracionCurso'];
                        $diasCurso = $array1[0]['DiasCurso'];
                        $fechaInicial = $array1[0]['FechaInicial'];
                        $fechaFinal = $array1[0]['FechaFinal'];
                        $horaInicial = $array1[0]['HoraInicial'];
                        $horaFinal = $array1[0]['HoraFinal'];
                        $modulo = $array1[0]['Modulo'];
                        $duracionModulo = $array1[0]['DuracionModulo'];
                        $modalidad = $array1[0]['Modalidad'];
                        $sede = $array1[0]['Sede'];
                        $docente = $array1[0]['Docente'];
                        $usuario = $_SESSION['nombreUsuario'];
                        $usuarioe = $array3[0]['CorreoElectronico'];
                        $asunto = "ID DE MATRICULA";
                        $correo=$utilidades->enviarCorreoEstudiante($estudiante,$tipoidentificacion,$cedula,$correoElectronico,$salon,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$modalidad,$sede,$docente,$IdMatricula,$usuario,$usuarioe,$correode,$clave,$asunto);
                    }else{
                        print_r("Error2");
                        $data["error"]="No se encontraron correos de estudiantes";
                    }
                }else{
                    print_r("Error3");
                    $data["error"]="No se consultaron los correos";
                    print_r($conexion->getPDO()->errorInfo()); die();
                } 
             }
        }else{
            $IdMatricula = 0;
            print_r("Error1");
            print_r($conexion->getPDO()->errorInfo());
        }   
    }else{
        $IdMatricula = 0;
		print_r($conexion->getPDO()->errorInfo());
    }
    echo json_encode($IdMatricula);
}

    public function enviarCorreo($IdMatricula) {
        //extract($param);
        $rs1=null;
        $array1=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREOMATRICULA($IdMatricula);";
        if ($rs1 = $conexion->getPDO()->query($sql)) {      
             if ($filas = $rs1->fetchAll(PDO::FETCH_ASSOC)) {
               //----- Inicio código para enviar el correo al estudiante luego de la matrícula -----//
                foreach ($filas as $fila) {
                    $array1[] = $fila; 
                }


                $utilidades = new clsUtilidades();
                $rs2=null;
                $array2=array();
                $IdTercero = $array1[0][Id];
                echo $sql2 = "CALL SPCONSULTARCORREOSESTUDIANTES($IdTercero);";

                if ($rs2 = $conexion->getPDO()->query($sql2)) {
                 if ($filas2 = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
                     foreach ($filas2 as $fila1) {
                         $array2[] = $fila1; 
                     }
                 }
                 $clave = array_pop($array2)['Email'];
                 $correode = array_pop($array2)['Email'];
                     if (count($array2)>0){
                        $estudiante = $array1[0]['Estudiante'];
                        $correoElectronico = $array1[0]['CorreoElectronico'];
                        $salon = $array1[0]['Salon'];
                        $curso = $array1[0]['Curso'];
                        $ruta = $array1[0]['Ruta'];
                        $duracionCurso = $array1[0]['DuracionCurso'];
                        $diasCurso = $array1[0]['DiasCurso'];
                        $fechaInicial = $array1[0]['FechaInicial'];
                        $fechaFinal = $array1[0]['FechaFinal'];
                        $horaInicial = $array1[0]['HoraInicial'];
                        $horaFinal = $array1[0]['HoraFinal'];
                        $modulo = $array1[0]['Modulo'];
                        $duracionModulo = $array1[0]['DuracionModulo'];
                        $modalidad = $array1[0]['Modalidad'];
                        $sede = $array1[0]['Sede'];
                        $estado = $array1[0]['Estado'];
                        $usuario = $_SESSION['nombreUsuario'];
                        $correo=$utilidades->enviarCorreoEstudiante($estudiante,$correoElectronico,$salon,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$modalidad,$sede,$estado,$IdMatricula,$usuario,$correode,$clave);
                     }else{
                        print_r("Error2");
                        $data["error"]="No se encontraron correos de estudiantes";
                     }
                }else{
                    print_r("Error3");
                    $data["error"]="No se consultaron los correos";
                    print_r($conexion->getPDO()->errorInfo()); die();
                } 

             }
        }else{
            $IdMatricula = 0;
            print_r("Error1");
            print_r($conexion->getPDO()->errorInfo());
        }   
        
       //----- Fin Código para enviar el correo al estudiante luego de la matrícula -----//
             
        echo json_encode($IdMatricula);
    }

    public function consultarMatriculadosFecha($params){
        extract($params);
    	$rs=null;
        $IdUsuario = $_SESSION['idUsuario'];
        $sql = "CALL SPREPORTEMATRICULASALAFECHA('$fecha_inicio');";
        //echo json_encode($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
            if($filas = $rs->fetchAll(PDO::FETCH_ASSOC)){
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }else{
                $array = 0;
            }
        }
        echo json_encode($array);
    }

    public function consultarFechaMatricula($param) {
        extract($param);
        $resultado = array();
        $registro = array();
    	$rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMATRICULASPORTERCERO2($idMatricula);";
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

    public function consultarMatriculas($param) {
        extract($param);
        $resultado = array();
        $registro = array();
    	$rs= null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMATRICULASPORTERCERO1($identificacion,$TipoIdentificacion);";
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

    public function consultarMatriculas2($param) {
        extract($param);
    	$rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMATRICULAS();";
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

    public function cargarEntregables($param) {
        extract($param);
    	$rs=null;
        $sql = "CALL CONSULTAR_ENTREGABLES();";
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

    public function CargarEstados($param) {
        extract($param);
    	$rs=null;
        $sql = "CALL SPCARGARESTADOS();";
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

    public function consultarEstudiantesNoMatriculados($param) {
        extract($param);
    	$rs=null;
        $sql = "CALL SPCONSULTARESTUDIANTESNOMATRICULADOS($jornada);";
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

    private function codificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
        return $aux;
    }

}
?>