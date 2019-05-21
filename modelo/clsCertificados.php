<?php
require("../controlador/session.php");
require("clsUtilidades.php");
set_time_limit(0);
/**
 * Clase para procedimientos que se pueden usar en toda la aplicacion
 *
 * @author John James Granados Restrepo
 */
class clsCertificados {
    
    //----- Función para buscar un certificado por Id -----//
    public function consultarFirmaDigital1($param){
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSFIRMAPORID($pIdFirma)";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para buscar un certificado por Id -----//
    public function consultarFirmaDigital2($param){
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSFIRMAPORTERCERO($pIdTercero)";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para recuperar el Id de un Tercero -----//
    public function consultarTercero($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARIDTERCERO($IdUsuario);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para guardar datos de la firma en base de datos -----//
    public function guardarFirma($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARFIRMA($pIdTercero,".$IdUsuario.");";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Funcion para cargar los modulos con estado por certificar-----//
    public function ConsultarModulosPorCertificar($param) {
        extract($param);
        $rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMODULOSPORCERTIFICAR($IdDocente);";
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
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); die();
        }
        echo json_encode($resultado);
    }

    //----- Funcion para cargar los modulos con estado por certificar-----//
    public function ConsultarCursosPorCertificar($param) {
        extract($param);
        $rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCURSOSPORCERTIFICAR('$pFechaInicial','$pFechaFinal');";
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
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); die();
        }
        echo json_encode($resultado);
    }

    //----- Agrega certificados por Modulos -----//
    public function certificarPorModulos($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARCERTIFICADOPORMODULO($pIdPreprogramacion,".$IdUsuario.")";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Agrega certificados por Cursos -----//
    public function certificarPorCursos($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARCERTIFICADOPORCURSO('$pIdCursoTemporal',".$IdUsuario.")";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Reexpide certificados -----//
    public function reexpedirCertificado($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPREEXPEDIRCERTIFICADO($pIdCertificado,".$IdUsuario.")";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para enviar correos por modulos a los estudiantes certificados -----//
    public function enviarCorreosPorModulos($param){
        extract($param);
        $rs1=null;
        $array1=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREOCERTIFICADOPORMODULO($pIdPreprogramacion);";
        if ($rs1 = $conexion->getPDO()->query($sql)){      
            if($filas = $rs1->fetchAll(PDO::FETCH_ASSOC)){
                foreach ($filas as $fila){
                    $array1[] = $fila; 
                }
            }
            $rs1->closeCursor();
            $utilidades = new clsUtilidades();
            $rs2=null;
            $array2=array();
            $IdTercero = $array1[0][Id];
            $sql2 = "CALL SPCONSULTARDATOSCORREOCERTIFICADOS();";
            if ($rs2 = $conexion->getPDO()->query($sql2)){
                if ($filas2 = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
                    foreach ($filas2 as $fila1) {
                        $array2[] = $fila1; 
                    }
                }
                $rs2->closeCursor();
                $correode = $array2[0]['Parametro'];
                $clave = $array2[1]['Parametro'];
                $rs3=null;
                $array3=array();
                $IdUsuario = $_SESSION['idUsuario'];
                $sql3 = "CALL SPCONSULTARCORREOUSUARIO($IdUsuario);";
                if ($rs3 = $conexion->getPDO()->query($sql3)) {
                    if ($filas3 = $rs3->fetchAll(PDO::FETCH_ASSOC)) {
                            foreach ($filas3 as $fila3) {
                            $array3[] = $fila3; 
                        }
                    }
                    $rs3->closeCursor();
                }
                $usuario = $_SESSION['nombreUsuario'];
                $usuarioe = $array3[0]['CorreoElectronico'];
                if (count($array2)>0){
                    for($i=0;$i<count($array1);$i++){
                        $IdMatricula = $array1[$i]['Id'];
                        $IdCertificado = $array1[$i]['CodigoCertificado'];
                        $estudiante = $array1[$i]['Estudiante'];
                        $tipoidentificacion = $array1[$i]['TipoIdentificacion'];
                        $cedula = $array1[$i]['NumeroIdentificacion'];
                        $correoElectronico = $array1[$i]['CorreoElectronico'];
                        $salon = $array1[$i]['Salon'];
                        $curso = $array1[$i]['Curso'];
                        $fechaInicial = $array1[$i]['FechaInicial'];
                        $fechaFinal = $array1[$i]['FechaFinal'];
                        $modulo = $array1[$i]['Modulo'];
                        $asunto = "EXPEDICION DE CERTIFICADO";
                        $correo=$utilidades->enviarCorreoCertificadoModulo($estudiante,$tipoidentificacion,$cedula,$correoElectronico,$salon,$curso,$fechaInicial,$fechaFinal,$modulo,$IdMatricula,$usuario,$usuarioe,$correode,$clave,$asunto,$IdCertificado);
                    }
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
        echo json_encode($correo);
    }

    //----- Función para enviar correos por modulo luego de reexpedido -----//
    public function enviarCorreoPorModulo($param){
        extract($param);
        $rs1=null;
        $array1=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREOCERTIFICADOPORMODULO1($pIdCertificado);";
        if ($rs1 = $conexion->getPDO()->query($sql)){      
            if($filas = $rs1->fetchAll(PDO::FETCH_ASSOC)){
                foreach ($filas as $fila){
                    $array1[] = $fila; 
                }
            }
            $rs1->closeCursor();
            $utilidades = new clsUtilidades();
            $rs2=null;
            $array2=array();
            $IdTercero = $array1[0][Id];
            $sql2 = "CALL SPCONSULTARDATOSCORREOCERTIFICADOS();";
            if ($rs2 = $conexion->getPDO()->query($sql2)){
                if ($filas2 = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
                    foreach ($filas2 as $fila1) {
                        $array2[] = $fila1; 
                    }
                }
                $rs2->closeCursor();
                $correode = $array2[0]['Parametro'];
                $clave = $array2[1]['Parametro'];
                $rs3=null;
                $array3=array();
                $IdUsuario = $_SESSION['idUsuario'];
                $sql3 = "CALL SPCONSULTARCORREOUSUARIO($IdUsuario);";
                if ($rs3 = $conexion->getPDO()->query($sql3)) {
                    if ($filas3 = $rs3->fetchAll(PDO::FETCH_ASSOC)) {
                            foreach ($filas3 as $fila3) {
                            $array3[] = $fila3; 
                        }
                    }
                    $rs3->closeCursor();
                }
                $usuario = $_SESSION['nombreUsuario'];
                $usuarioe = $array3[0]['CorreoElectronico'];
                if (count($array2)>0){
                    for($i=0;$i<count($array1);$i++){
                        $IdMatricula = $array1[$i]['Id'];
                        $IdCertificado = $array1[$i]['CodigoCertificado'];
                        $estudiante = $array1[$i]['Estudiante'];
                        $tipoidentificacion = $array1[$i]['TipoIdentificacion'];
                        $cedula = $array1[$i]['NumeroIdentificacion'];
                        $correoElectronico = $array1[$i]['CorreoElectronico'];
                        $salon = $array1[$i]['Salon'];
                        $curso = $array1[$i]['Curso'];
                        $fechaInicial = $array1[$i]['FechaInicial'];
                        $fechaFinal = $array1[$i]['FechaFinal'];
                        $modulo = $array1[$i]['Modulo'];
                        $asunto = "EXPEDICION DE CERTIFICADO";
                        $correo=$utilidades->enviarCorreoCertificadoModulo($estudiante,$tipoidentificacion,$cedula,$correoElectronico,$salon,$curso,$fechaInicial,$fechaFinal,$modulo,$IdMatricula,$usuario,$usuarioe,$correode,$clave,$asunto,$IdCertificado);
                    }
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
        echo json_encode($correo);
    }

    //----- Función para enviar correos por cursos a los estudiantes certificados -----//
    public function enviarCorreoPorCurso($param){
        extract($param);
        $rs1=null;
        $array1=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCORREOCERTIFICADOPORCURSO($pIdCertificado);";
        if ($rs1 = $conexion->getPDO()->query($sql)){      
            if($filas = $rs1->fetchAll(PDO::FETCH_ASSOC)){
                foreach ($filas as $fila){
                    $array1[] = $fila; 
                }
            }
            $rs1->closeCursor();
            $utilidades = new clsUtilidades();
            $rs2=null;
            $array2=array();
            $IdTercero = $array1[0][Id];
            $sql2 = "CALL SPCONSULTARDATOSCORREOCERTIFICADOS();";
            if ($rs2 = $conexion->getPDO()->query($sql2)){
                if ($filas2 = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
                    foreach ($filas2 as $fila1) {
                        $array2[] = $fila1; 
                    }
                }
                $rs2->closeCursor();
                $correode = $array2[0]['Parametro'];
                $clave = $array2[1]['Parametro'];
                $rs3=null;
                $array3=array();
                $IdUsuario = $_SESSION['idUsuario'];
                $sql3 = "CALL SPCONSULTARCORREOUSUARIO($IdUsuario);";
                if ($rs3 = $conexion->getPDO()->query($sql3)) {
                    if ($filas3 = $rs3->fetchAll(PDO::FETCH_ASSOC)) {
                            foreach ($filas3 as $fila3) {
                            $array3[] = $fila3; 
                        }
                    }
                    $rs3->closeCursor();
                }
                $usuario = $_SESSION['nombreUsuario'];
                $usuarioe = $array3[0]['CorreoElectronico'];
                if (count($array2)>0){
                    for($i=0;$i<count($array1);$i++){
                        $IdCertificado = $array1[$i]['CodigoCertificado'];
                        $estudiante = $array1[$i]['Estudiante'];
                        $tipoidentificacion = $array1[$i]['TipoIdentificacion'];
                        $cedula = $array1[$i]['NumeroIdentificacion'];
                        $correoElectronico = $array1[$i]['CorreoElectronico'];
                        $curso = $array1[$i]['Curso'];
                        $duracion = $array1[$i]['Duracion'];
                        $ruta = explode('-',$array1[$i]['Ruta']);
                        $asunto = "EXPEDICION DE CERTIFICADO";
                        $correo=$utilidades->enviarCorreoCertificadoCurso($estudiante,$tipoidentificacion,$cedula,$correoElectronico,$curso,$duracion,$ruta[0],$ruta[1],$usuario,$usuarioe,$correode,$clave,$asunto,$IdCertificado);
                    }
                }else{
                    print_r("Error2");
                    $data["error"]="No se encontraron correos de estudiantes";
                }
            }else{
                print_r("Error3");
                $data["error"]="No se consultaron los correos";
                print_r($conexion->getPDO()->errorInfo()); die();
            }
        }else {
            $correo = 0;
        }
        echo json_encode($correo);
    }

    //----- Función para buscar un certificado por # de registro -----//
   public function consultarCertificadosPorRegistro($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCERTIFICADOPORNUMERO('$pCodigoCertificado');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, $value);
                    }
                    array_push($resultado, $registro);
                    $registro = array();
                }
            $rs->closeCursor();
            }else{
                $resultado = 0;
            }
        } else {
            $resultado = 0;
        }
        echo json_encode($resultado);
    }

    //----- Función para buscar un certificado por # de documento -----//
    public function consultarCertificadoAnuladoPorDocumento($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCERTIFICADOANULADOPORDOCUMENTO($pTipoDocumento,$pDocumento);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, $value);
                    }
                    array_push($resultado, $registro);
                    $registro = array();
                }
            $rs->closeCursor();
            // Se crea el certificado
            }else{
                $resultado = 0;
            }
        } else {
            $resultado = 0;
        }
        echo json_encode($resultado);
    }

    //----- Función para eliminar un certificado por Id -----//
    public function anularCertificadoPorId($param){
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPELIMINARCERTIFICADO($pIdCertificado)";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }
}
?>
