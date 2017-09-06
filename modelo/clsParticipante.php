<?php
require("../controlador/session.php");
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
// Report all errors
error_reporting(E_ALL);

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class clsParticipante {

    //==============================================================
    //                      NOTAS
    //==============================================================
    
    /**
     * [consultarNotasPorSalon Obtiene las notas por estudiante de un curso]
     * @author Robinson Ramirez (rzc)
     * @param  [string] $param [id de preprogramación]
     * @return [array]        [array con los datos y notas asociadas a cada estudiante]
     */
     public function consultarNotasPorSalon($param){
   		extract($param);
        $resp = null;
		$usuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $rs=null;
        $sql = "CALL SPCONSULTARNOTASPORID($IdPreprogramacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
           if (!$filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //si no hay notas para la preprogramación
				
			  // $usuario = $_SESSION['idUsuario'];
			    $rs=null;
                $conexion->getPDO()->query("SET NAMES 'utf8'");
                $sql = "CALL SPAGREGARNOTA($IdPreprogramacion,33.33,33.33,33.33,$usuario);"; //Se agregan nota por defecto para la preprogramación
				if ($rs = $conexion->getPDO()->query($sql)) {
                     if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                        $idNota = $filas[0]['IdNota'];
                        $resp['idNota'] = $idNota;
						$rs=null;
                        $conexion->getPDO()->query("SET NAMES 'utf8'");
                        $sql = "CALL SPCONSULTARTERCEROSPREPROGRAMACION($IdPreprogramacion);"; //Se consultan los terceros
						if ($rs = $conexion->getPDO()->query($sql)) {
                            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                                foreach ($filas as $fila) {
									$idTercero = $fila['Id'];
									$arrayNotaInicial[]= array( 'idNota' => $idNota, 'idTercero'=> $idTercero);								
                                }
									$arrayNotaInicial=json_encode($arrayNotaInicial);								
                                    $conexion->getPDO()->query("SET NAMES 'utf8'");
									$rs=null;
                                  
                                    $sql = "CALL SPAGREGARNOTAINICIAL('$arrayNotaInicial',$usuario);"; //Se asignan notas por defecto a cada tercero
                                    $conexion->getPDO()->query($sql);
																
								$rs=null;
                                $conexion->getPDO()->query("SET NAMES 'utf8'");
                                $sql = "CALL SPCONSULTARNOTASDETALLEPORID($idNota,$IdPreprogramacion);";
                                if ($rs = $conexion->getPDO()->query($sql)) {
                                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                                        foreach ($filas as $fila) {
                                            $notaHacer = explode(',',$fila['NotaHacer']);
											$notaSaber = explode(',',$fila['NotaSaber']);
											$notaSer = explode(',',$fila['NotaSer']);
											
											$totalNotas[] =  $notaHacer[0];
											$totalNotas[] =  $notaHacer[1];
											$totalNotas[] =  $notaHacer[2];
											$totalNotas[] =  $notaSaber[0];
											$totalNotas[] =  $notaSaber[1];
											$totalNotas[] =  $notaSaber[2];
											$totalNotas[] =  $notaSer[0];
											$totalNotas[] =  $notaSer[1];
											$totalNotas[] =  $notaSer[2];
											
                                            $numeroNotas ="";
											foreach ($totalNotas as $nota) {
												if($nota != ''){
													$numeroNotas = ((float)$numeroNotas + 1);
												}
											}
											$notaDef = 0;
											$notaDef = number_format($notaDef, 2);
											if ($numeroNotas != 0 || $numeroNotas != ""){
											//echo json_encode($numeroNotas);
												$notaDef =  ((float)$notaHacer[0]+(float)$notaHacer[1]+(float)$notaHacer[2]+
															(float)$notaSaber[0]+(float)$notaSaber[1]+(float)$notaSaber[2]+
															(float)$notaSer[0]+(float)$notaSer[1]+(float)$notaSer[2]) / $numeroNotas;
												$notaDef = number_format($notaDef, 2);
											}
											$fila['total']=$notaDef;
											$datos [] = $fila;
											
											$numeroNotas = 0; 
											$totalNotas = []; 
											$notaDef = 0;	
                                        }
                                        $resp['datos'] = $datos;
                                    }
                                }
                            }
                        }
                    }
                }
            }else{ 
                $rs=null;
				$conexion->getPDO()->query("SET NAMES 'utf8'");
                $sql = "CALL SPCONSULTARIDNOTAPORPREPROGRAMACION($IdPreprogramacion);"; 
                if ($rs = $conexion->getPDO()->query($sql)) {
                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                        $idNota = $filas[0]['IdNota'];
                    }
                }
				
                if($idNota){
				$resp['idNota'] = $idNota;
					$conexion->getPDO()->query("SET NAMES 'utf8'");
						$rs=null;
						
                        $sql = "CALL SPCONSULTARTERCEROSPREPROGRAMACION($IdPreprogramacion);"; //Se consultan los terceros
						if ($rs = $conexion->getPDO()->query($sql)) {
                            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                                foreach ($filas as $fila) {
									
									$idTercero = $fila['Id'];
																	
									$arrayNotaInicial[]= array( 'idNota' => $idNota, 'idTercero'=> $idTercero);
									
                                }
								$arrayNotaInicial=json_encode($arrayNotaInicial);
								
								//var_dump($arrayNotaInicial);						
								$conexion->getPDO()->query("SET NAMES 'utf8'");                                   
								$rs=null;										
                                $sql = "CALL SPAGREGARNOTAINICIAL('$arrayNotaInicial',$usuario);"; //Se asignan notas por defecto a cada tercero
                                $conexion->getPDO()->query($sql);
								
															
                                $conexion->getPDO()->query("SET NAMES 'utf8'");
								$rs=null;
                                $sql = "CALL SPCONSULTARNOTASDETALLEPORID($idNota,$IdPreprogramacion);"; 
                                
								if ($rs = $conexion->getPDO()->query($sql)) {
                                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                                        foreach ($filas as $fila) {
											
											$notaHacer = explode(',',$fila['NotaHacer']);
											$notaSaber = explode(',',$fila['NotaSaber']);
											$notaSer = explode(',',$fila['NotaSer']);
											
											$totalNotas[] =  $notaHacer[0];
											$totalNotas[] =  $notaHacer[1];
											$totalNotas[] =  $notaHacer[2];
											$totalNotas[] =  $notaSaber[0];
											$totalNotas[] =  $notaSaber[1];
											$totalNotas[] =  $notaSaber[2];
											$totalNotas[] =  $notaSer[0];
											$totalNotas[] =  $notaSer[1];
											$totalNotas[] =  $notaSer[2];
											
                                            $numeroNotas ="";
											foreach ($totalNotas as $nota) {
												if($nota != ''){
													$numeroNotas = ((float)$numeroNotas + 1);
												}
											}
											$notaDef = 0;
											$notaDef = number_format($notaDef, 2);
											if ($numeroNotas != 0 || $numeroNotas != ""){
											//echo json_encode($numeroNotas);
												$notaDef =  ((float)$notaHacer[0]+(float)$notaHacer[1]+(float)$notaHacer[2]+
															(float)$notaSaber[0]+(float)$notaSaber[1]+(float)$notaSaber[2]+
															(float)$notaSer[0]+(float)$notaSer[1]+(float)$notaSer[2]) / $numeroNotas;
												$notaDef = number_format($notaDef, 2);
											}
											$fila['total']=$notaDef;
											$datos [] = $fila;
											
											$numeroNotas = 0; 
											$totalNotas = []; 
											$notaDef = 0;	
											
											
											
                                        }
                                        $resp['datos'] = $datos;
                                    }
                                }
                            }
                        }
					
           
                } //IdNota
            }
        } 
		
        echo json_encode($resp);
    }

    public function guardarNotas($param){
		extract($param);
		
		$array=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario = $_SESSION['idUsuario'];
        //$sql = "CALL SPMODIFICARNOTA($idNota,$idEstudiante,'$nSaber','$nHacer','$nSer',$usuario);";
		$sql = "CALL SPMODIFICARNOTA('$serializedtotalNotas',$usuario);";		
		
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo());
        }
        echo json_encode($array);
    }



    public function consultarEstudiantesPorSalonFormatoFirmas($param) {
		extract($param); 
        $array=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARESTUDIANTESPORSALON1($IdPreprogramacion);";
        $rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        } //print_r($array); die();
        echo json_encode($array);
    }


    public function consultarEstudiantesPorSalon($param) {
		extract($param); 
        $array=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARESTUDIANTESPORSALON($IdPreprogramacion);";
		$rs=null;
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        } //print_r($array); die();
        echo json_encode($array);
    }



    public function activarParticipante($param){
        
		extract($param);
        $sql = "CALL ACTUALIZAR_PARTICIPANTE_ACTIVAR($par_id);";
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

	/*
	*Se agrega el parametro actualizarTercero
	*/
    public function InscribirParticipante($numInsercion,$lin_inf, $conexion,$pIdJornada,$actualizarTercero) { //26
        
		header("Content-Type: text/html;charset=utf-8");  
        $IdUsuario = $_SESSION['idUsuario'];  
        $registro = explode(";", $lin_inf);
        $auxFecha = $this->obtenerFecha($registro[14]);
        $apellidos =($registro[2]);
        $nombres = $registro[3];
        $correo = $this->evalString(($registro[9]));
        @$sql = "CALL SPCARGAMASIVAPARTICIPANTES($registro[0],$registro[1],'$apellidos','$nombres', '$registro[4]', $registro[5], $registro[6],$registro[7],$registro[8], '$correo', '$pFecha', $registro[11],$registro[12],  $registro[13], '$auxFecha',
		$registro[15], $registro[16], $registro[17], $registro[18], $registro[19], $registro[20], $registro[21], $registro[22], $registro[23],$registro[24],$IdUsuario, ".$pIdJornada.", $actualizarTercero);";
		
		$rs=null;
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $response = 1;
                foreach ($filas as $fila) {
                    $resultado = $fila['resultado'];
                    $inserto = 1;

                }
            }else{
                echo $numInsercion.' 2--- '. $sql."<br>";
            }
        } else {
            echo $numInsercion.' --- '. $sql."<br>";
			
            $response = 0;
        }
        return $inserto;
    }

    public function obtenerFecha($pFecha){
        
		$fecha = $pFecha;
        if (strpos($fecha, '/') !== false) {
            list( $dia, $mes, $ano) = explode('/', $pFecha);
            $fecha = $ano.'-'.$mes.'-'.$dia;
        }
        return $fecha;
    }
    
    public function ConsultarMatricula($param) {
		extract($param);
        $sql = "CALL SPCONSULTARCARGAPORID3($pIdCarga);";
		$rs=null;
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
        //echo json_encode($sql);
        echo json_encode($array);
    }
    
    public function ConsultarModulo($param) {
		extract($param);
        $sql = "CALL SPCONSULTARMODULOPORID($pIdmodulo);";
		$rs=null;
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


    public function consultarEstudiantesPorSalonDadoSalon($param){
		extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $array = array();
		
        $sql = "CALL SPCONSULTARPREPROGRAMACIONPORSALON('$codigo_salon');";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql))
		{
            if($rs->fetch() != false)
			{
                $conexion->getPDO()->query("SET NAMES 'utf8'");
                $sql = "CALL SPCONSULTARESTUDIANTESPORSALONDADOSALON('$codigo_salon');";
                
				$rs = null;
				if ($rs = $conexion->getPDO()->query($sql)) 
				{
                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) 
					{
                        foreach ($filas as $fila) 
						{
                            $array[] = $fila;
                        }   
                    }
					else 
					{
                        $array = 1;
                    }
                } 
            }
			else
			{
                $array = 0;
            }
        } //print_r($array);
        echo json_encode($array);

    }


     public function consultarCargaEstudiantesPorSalonDocente($param) {
		extract($param);
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARESTUDIANTESPORSALONDADOSALON('$codigo_salon');";
		$rs=null;
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


    public function ConsultarParticipante($param) {
		extract($param);
		$array = array();
        $sql = "CALL SPBUSCARPARTICIPANTEPORCEDULA($pNumeroIdentificacion);";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $fila = $this->codificarEnUtf8($fila);
                    $array[] = $fila;
                }
            }
			else{
				$array = 0;
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

    public function esCodigoAgenciaValido($cod_age) {
        $men_err = '';
        if (!is_string($cod_age)) {
            $men_err = "Este número de código de agencia (" . $cod_age . ") no es válido.";
        }
        return $men_err;
    }

    public function esTipoServicioValido($tip_ser) {
        $men_err = '';
        if (!is_string($tip_ser)) {
            $men_err = "Este número de tipo de servicio (" . $tip_ser . ") no es válido.";
        }
        return $men_err;
    }

    public function esCodigoRutaCursoAgenciaCursoValido($cod) {
        $men_err = '';
        $aux = $cod . explode(".", $cod);
        if (!is_string($aux[0]) && strlen($aux[0] < 2)) {
            $men_err .= "Este número de código ruta-curso de agencia (" . $aux[0] . ") no es válido.";
        } else if (!is_string($aux[1]) && strlen($aux[1] <= 2)) {
            $men_err .= "Este número de código ruta-curso de agencia (" . $aux[1] . ") no es válido.";
        }
        return $men_err;
    }

    public function esRutaActualCetValida($cod) {
        $men_err = '';
        if (!is_string($cod)) {
            $men_err = "Este número de código ruta-curso de agenciaw (" . $cod . ") no es válido.";
        }
        return $men_err;
    }

    public function esFechaMatriculaAcademicaValida($fec) {
        $men_err = '';
        if (ereg("^[0-9]{4}-[01][0-9]-[0-3][0-9]$", $fec)) {
            list( $year, $month, $day ) = explode('-', $fec);
            if (!checkdate($month, $day, $year)) {
                $men_err = "Fecha matricula academica " . $fec . " no valida. ";
            }
        } else {
            $men_err = "Fecha matricula academica " . $fec . " no valida. ";
        }
        return $men_err;
    }
    
    public function esDuracionHorasValida($dur_hor) {
        $men_err = '';
        if (!is_string($dur_hor)) {
            $men_err = "Este número de código ruta-curso de agencia (" . $dur_hor . ") no es válido.";
        }
        return $men_err;
    }

    public function esEstadoValido($num_est) {
        $men_err = '';
        if (!is_string($num_est)) {
            $men_err = "Este número de estado (" . $num_est . ") no es válido.";
        }
        return $men_err;
    }
   
    public function evalString($string){
        $string = str_replace(
            array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
            array('a', 'a', 'a', 'a', 'a', 'A', 'A', 'A', 'A'),
            $string
        );

        $string = str_replace(
            array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
            array('e', 'e', 'e', 'e', 'E', 'E', 'E', 'E'),
            $string
        );

        $string = str_replace(
            array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
            array('i', 'i', 'i', 'i', 'I', 'I', 'I', 'I'),
            $string
        );

        $string = str_replace(
            array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
            array('o', 'o', 'o', 'o', 'O', 'O', 'O', 'O'),
            $string
        );

        $string = str_replace(
            array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
            array('u', 'u', 'u', 'u', 'U', 'U', 'U', 'U'),
            $string
        );

        $string = str_replace(
            array( 'ç', 'Ç'),
            array( 'c', 'C'),
            $string
        );
        //Esta parte se encarga de eliminar cualquier caracter extraño menos  "@","-","."
		$string = str_replace(array('\\', '¨', "º",      "~","#", "|", "!", '"',"·", "$", "%", "&", "/","(", ")", "?", "'", "¡",
             "¿", "[", "^", "<code>", "]",
             "+", "}", "{", "¨", "´",
             ">", "< ", ";", ",", ":"
             ),
        '',
       // $string = str_replace(array('\\', '¨', "º", "-",     "~","#", "@", "|", "!", '"',"·", "$", "%", "&", "/","(", ")", "?", "'", "¡",
             // "¿", "[", "^", "<code>", "]",
             // "+", "}", "{", "¨", "´",
             // ">", "< ", ";", ",", ":",
             // "."),
        // '',
        $string
       );
        return $string;
    }
    
}

?>
