<?php
require("../controlador/session.php");
set_time_limit(0);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
// Report all errors
error_reporting(E_ALL);
class clsPersona {

    public function __construct() {
        include_once '../controlador/clsControlador_Sesion.php';
    }

    public function obtenerIdUsuario() {
        if (strlen($_SESSION['idUsuario']) > 0) {
            echo $_SESSION['idUsuario'];
        }else{
            echo "sin sesion";
        }
    }

    public function obtenerIdTercero() {
         if(isset($_SESSION['idTercero'])) {
            $session= $_SESSION['idTercero'];
            // echo $_SESSION['idUsuario'];
        }else{
            $session="sin sesion";
        }		
		 echo json_encode($session);        
    }

    /*
    Wilmer Andrés 
    Abril 26 - 2016
    ActualizarTercero()
    0 encargado de la transacción en la bd.
    */
    public function ActualizarTercero($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $tipoIdentificacion= $tipoIdentificacion != '' ?$tipoIdentificacion:3;
        $lugarExpedicion= $lugarExpedicion != '' ?$lugarExpedicion:1121;
        $nombres= $nombres != '' ?$nombres:'No Suministrado';
        $apellidos= $apellidos != '' ?$apellidos:'No Suministrado';
		$nombres=utf8_decode($nombres);
		$apellidos=utf8_decode($apellidos);
        $fechaNacimiento= $fechaNacimiento != '' ?$fechaNacimiento:'2000-01-01';
        $sexo= $sexo != '' ?$sexo:'86';
        $estadoCivil= $estadoCivil != '' ?$estadoCivil:17;
        $gradoEscolaridad= $gradoEscolaridad != '' ?$gradoEscolaridad:18;
        $tel_fijo= $tel_fijo != '' ?$tel_fijo:0;
        $tel_celular= $tel_celular != '' ?$tel_celular:0;
        $tel_alterno= $tel_alterno != '' ?$tel_alterno:0;
        $direccion= $direccion != '' ?$direccion:'No Suministrado';
        $correo_electronico= $correo_electronico != '' ?$correo_electronico:'No Suministrado';
        $correo_electronico2= $correo_electronico2 != '' ?$correo_electronico2:'No Suministrado';
        $localidad= $localidad != '' ?$localidad:27;
        $ciudad= $ciudad != '' ?$ciudad:1121;
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARTERCERO($id,$tipoIdentificacion,$lugarExpedicion,'$nombres','$apellidos','$fechaNacimiento',$sexo,$estadoCivil,$gradoEscolaridad,'$tel_fijo','$tel_celular','$tel_alterno','$direccion','$correo_electronico','$correo_electronico2',$localidad,$ciudad,1,$IdUsuario);";
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
    
    /*
    registrarPersona()
    Llama el procedimiento que registra una persona(tercero) nueva en la base de datos,
    y tambièn sus credenciales de acceson en la tabla acceso.
     */

    public function registrarPersona($param) {
        extract($param);
        $sql = "CALL AGREGAR_TERCERO('$nom_usu','$ape_usu',$ced_usu,'$ema_usu','" . md5($con_usu) . "');";
		$rs=null;
	   if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    /*
     * agregarObservacion()
     * Actualiza la observacion que tiene el tercero
     */

    public function AgregarObservacion($param) {
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $sql = "CALL SPAGREGAROBSERVACIONES($pIdTercero,'$pObservaciones',$IdUsuario);";
        $rs=null;
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function consultarNombresTercero($param) {
        extract($param);
        $sql = "CALL SPCONSULTARNOMBRESTERCERO($pIndentificacion);";
        $rs=null;
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = array_map('utf8_encode', $fila);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function BuscarCedula($param) {
        extract($param);
        $sql = "CALL SPBUSCARPORCEDULA($pNumeroIdentificacion);";
        $rs=null;
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

    public function BuscarCedula2($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $sql = "CALL SPBUSCARPARTICIPANTEPORCEDULA($pNumeroIdentificacion);";
        $rs=null;
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                        array_push($registro, $value);
                    }
                    array_push($resultado, $registro);
                }
            }
        } else {
            $registro = 0;
        }
        echo json_encode($resultado);
    }

    public function IngresoSistema($param) {
        extract($param);
        $sql = "CALL SPINGRESAR('$pNic_usu','" . md5($pCon_usu) . "');";
        $rs=null;
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                    $nombreUsuario = $fila['Nombre'];
                    $idTercero = $fila['IdTercero'];
                    $idUsuario = $fila['Id'];
                    $roles = $fila['Roles'];
                    $_SESSION['idTercero'] = $idTercero;
                    $_SESSION['idUsuario'] = $idUsuario;
                    $_SESSION['nombreUsuario'] = $nombreUsuario;
                    $rolesUsuario = explode (",",$roles);
                    $esAdministrador = strcmp($rolesUsuario[0], "1") === 0;
                    $esDocente = strcmp($rolesUsuario[1], "1") === 0;
                    $esMatriculador = strcmp($rolesUsuario[2], "1") === 0;
                    $esCallCenter = strcmp($rolesUsuario[3], "1") === 0;
                    $_SESSION['esAdministrador'] = $esAdministrador;
                    $_SESSION['esDocente'] = $esDocente;
                    $_SESSION['esMatriculador'] = $esMatriculador;
                    $_SESSION['esCallCenter'] = $esCallCenter;
                    $_SESSION['ult_mov'] = '';
                }
            }else{
                $array = 0;
            }
          echo json_encode($array);
        }
    }    

    /*
     * agregarDesdeArchivoPlano()
     * Carga un archivo plano  con la siguiente estructura
     * cedula;nombres;apellidos;fecha_nacimiento;descripcion;
     * Instancia la clase clsGestorArchivosPlanos() para leer
     * el archivo plano a cargar.
     */

    public function agregarDesdeArchivoPlano($param) {
        include_once '../auxiliar/clsGestorArchivosPlanos.php';
        $cls_gar = new clsGestorArchivosPlanos();
        $inf_txt = $cls_gar->leerArchivoPlano();
        $err_arc = $this->validarArchivo($inf_txt);
        if (strlen($err_arc) === 0) {
            foreach ($inf_txt as $lin_txt) {
                $aux_lin = explode(';', $lin_txt);  //cedula;nombres;apellidos,fecha_nacimiento;descripción;
                $this->insertarPersona($aux_lin[0], $aux_lin[1], $aux_lin[2], $aux_lin[3], $aux_lin[4], $param);
            }
            echo 'Guardados correctamente <br>';
        } else {
            echo 'No se puede guardar, corrija los siguientes errores:   <br> ' . $err_arc;
        }
    }

    /*
     * insertarPersona($ced_usu,$nom_usu,$ape_usu,$fec_nac,$param)
     * Encargado de hacer la inserción a la base de datos de
     * un nuevo usuario. Retorna E en caso de èxito en el proceso, de otro caso 
     * retorna mensaje de error.
     */

    private function insertarPersona($ced_usu, $nom_usu, $ape_usu, $fec_nac, $des_usu, $param) {
        extract($param);
        $sql = "CALL AGREGAR_TERCERO_PLANO($ced_usu,'$nom_usu','$ape_usu','$fec_nac','$des_usu');";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }
        } else {
            $array = 0;
        }
    }

    /*
     * evaluarLinea($lin_txt)
     * Este método es llamada por validarArchivo y recibe por parámetro la línea actual que se
     * está evaluando del archivo plano y retorna los errores que halla en esa línea
     */

    private function evaluarLinea($lin_txt) {
        $aux_lin = explode(';', $lin_txt);  //cedula;nombres;apellidos,fecha_nacimiento;descripción;
        $men_err = '';
        $men_err .= $this->esCedulaValida($aux_lin[0]);
        $men_err .= $this->esFechaNacimientoValida($aux_lin[3]);
        return $men_err;
    }

    public function haySesion() {
        $array = array();
		require("../controlador/session.php");
		
        if (isset($_SESSION['nombreUsuario'])) {			
            array_push($array, $_SESSION['nombreUsuario'], 
                array('esAdministrador' => $_SESSION['esAdministrador'],
                    'esDocente' => $_SESSION['esDocente'],
                    'esMatriculador' => $_SESSION['esMatriculador']
                    // 'esEstudiante' => $_SESSION['esEstudiante']
					));
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function killSesion() {
      // Destruir todas las variables de sesión.
        $_SESSION = array();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 4200, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
                );
        }
        session_destroy();
        
		 echo json_encode("cerrando !");
    }

    /*
     * esTipoNitValido($ced)
     * Valida que el nit recibido por parámetro sea solo
     * numérica.
     */

    public function esTipoNitValido($ced) {
        $men_err = '';
        if (!is_numeric(trim($ced))) {
            $men_err = 'El tipo de nit  ' . $ced . '. solo debe tener valores numericos. ';
        }
        return $men_err;
    }

    /*
     * esNitValido($ced)
     * Valida que el nit recibido por parámetro sea solo
     * numérica.
     */

    public function esNitValido($num) {
        $men_err = '';
        if (!is_string($num)) {
            $men_err = "Este número de nit (" . $num . ") no es válido.";
        }
        return $men_err;
    }

    public function esLugarExpedicionValido($num) {
        $men_err = '';
        if (!is_string($num)) {
            $men_err = "Este número de lugar de expedición (" . $num . ") no es válido.";
        }
        return $men_err;
    }

    public function esMesAsignacionValido($fec) {
        $men_err = '';
        if (ereg("^[0-9]{4}-[01][0-9]-[0-3][0-9]$", $fec)) {
            list( $year, $month, $day ) = explode('-', $fec);
            if (!checkdate($month, $day, $year)) {
                $men_err = "Mes asignacion " . $fec . " no valido. ";
            }
        } else {
            $men_err = "Mes asignacion " . $fec . " no valido. ";
        }
        return $men_err;
    }

    private function esDiaValido() {
        if (!is_numeric($par) || strlen($par) > 2) {
            $flag = false;
        } else if ($par < 1 || $par > 12) {
            $flag = false;
        }
    }

    /*
     * esFechaNacimientoValida($fec_nac)
     * Valida si la fecha ingresada por parametro si esta en el formato correcto
     *                      aaaa/mm/dd
     */

    public function esFechaNacimientoValida($fec) {
        $men_err = '';
        if (ereg("^[0-9]{4}-[01][0-9]-[0-3][0-9]$", $fec)) {
            list( $year, $month, $day ) = explode('-', $fec);
            if (!checkdate($month, $day, $year)) {
                $men_err = "Fecha nacimiento " . $fec . " no valida. ";
            }
        } else {
            $men_err = "Fecha nacimiento " . $fec . " no valida. ";
        }
        return $men_err;
    }

    public function esEdadValida($eda) {
        $men_err = '';
        if (!is_string($eda)) {
            $men_err = "Este número de edad (" . $eda . ") no es válido.";
        }
        return $men_err;
    }

    public function esGeneroValido($gen) {
        $men_err = '';
        if (!is_string($gen)) {
            $men_err = "Este número de genero (" . $gen . ") no es válido.";
        }
        return $men_err;
    }

    public function esEstadoCivilValido($est_civ) {
        $men_err = '';
        if (!is_string($est_civ)) {
            $men_err = "Este número de estado civil (" . $est_civ . ") no es válido.";
        }
        return $men_err;
    }

    public function esGradoEscolaridadValido($gra_esc) {
        $men_err = '';
        if (!is_string($gra_esc)) {
            $men_err = "Este número de grado de escolaridad (" . $gra_esc . ") no es válido.";
        }
        return $men_err;
    }

    public function esTelefonoValido($tel) {
        $men_err = '';
        if (trim($tel) !== '') {
            if (!is_numeric($tel)) {
                $men_err = "Este número de telefono (" . $tel . ") no es válido.";
            }
        }
        return $men_err;
    }

    public function esCorreoValido($correo) {
        $men_err = '';
        if (!filter_var(trim($correo), FILTER_VALIDATE_EMAIL)) {
            $men_err = "Esta dirección de correo (" . $correo . ") no es válida.";
        }
        return $men_err;
    }

    public function esCodigoLocalidadValido($cod_loc) {
        $men_err = '';
        if (!is_string($cod_loc)) {
            $men_err = "Este codigo de localidad (" . $cod_loc . ") no es válido.";
        }
        return $men_err;
    }

    public function esTipoSolicitudValido($num) {
        $men_err = '';
        if (!is_string($num)) {
            $men_err = "Este número de solicitud (" . $num . ") no es válido.";
        }
        return $men_err;
    }

    public function esNumeroSolicitud($num) {
        $men_err = '';
        if (!is_string($num)) {
            $men_err = "Este número de solicitud (" . $num . ") no es válido.";
        }
        return $men_err;
    }

}

?>
