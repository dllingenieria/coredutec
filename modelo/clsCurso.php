<?php
require("../controlador/session.php");
require("clsUtilidades.php");
set_time_limit(0);
/**
 * Description of clsCurso
 *
 * @author Wilmer Andres Escobar Naranjo
 */
class clsCurso {
    /*
     * function validarNombreEspecifico()
     * validar nombre especifico curso sólo si  ruta = 'RUTA_3'
     */

    public function validarNombreCursoEspecifico($rut, $nom_cur) {
        $men_err = '';
        if (strlen(trim($nom_cur) > 0)) {
            if (trim($rut) !== 'RUTA_3') {
                $men_err = "Sólo se puede asociar el nombre especifico (" . $nom_cur . ")  si ruta es: RUTA_3.";
            }
        }
        return $men_err;
    }

    public function CargarInformacionCompletaCurso($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCURSO1();";        
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

    public function CargarCursosPorRuta($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCURSOSPORRUTA($pIdRuta);";        
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
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARESTADOSPARTICIPANTE();";        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                   // $fila = $this->CodificarEnUtf8($fila);
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function CargarCursoAnteriorTercero($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCARGAPORIDTERCERO($idTercero);";        
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

    public function CargarHoras($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARHORAS();";        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $fila = $this->CodificarEnUtf8($fila);
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function CargarCursoPorCodigo($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDATOSCURSO(\"$rut_cod\");";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
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

    public function ConsultarMatriculasPre($param) {
        extract($param);
		$rs = null;
		$array=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARSALONES2('$pCodigoCurso','$pCodigoModulo','$pModalidad');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
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

    public function ConsultarMatriculasPre2($param) {
        extract($param);
		$rs = null;
		$array=array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARSALONES3('$pCodigoCurso','$pCodigoModulo','$pModalidad');";
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
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

    public function CargarSalonesPorSede($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARSALONESPORSEDE($sede);";
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
    
    public function ConsultarDiasCurso($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARDIASCURSO();";
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

    public function ConsultarModulos($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMODULOSPORCURSO($pIdCurso);";
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

    public function ConsultarModulosSinPreprogramacion($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMODULOSNOPREPROGRAMADOS('$pIdMatricula', '$pIdCurso');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
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

    public function CargarModalidades($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARMODALIDAD();";
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

    public function CargarHorarios($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARHORARIOSCURSO();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        // $array = 0;
        echo json_encode($array);
    }

    public function CargarSedes($param) {
        extract($param);
		$rs = null;
        $sql = "CALL SPCARGARSEDES();";
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
    
    public function CargarEntregables($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARENTREGABLES();";
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

    ///***Carga combo de Rutas en Preprogramación***////
     public function CargarRutas($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARRUTAS('$codCurso');";
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
    
    public function CargarTipoCertificacion($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARTIPOCERTIFICACION();";
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

	public function consultarCalendarioPreprogramacion($param) {
        extract($param);
		$rs = null;
        $sql = "CALL SPCONSULTARCALENDARIOPREPROGRAMACION($idPreprogramacion);";
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $diasClase=[];
                foreach ($filas as $fila) {
					$nombreDia=trim($fila['Nombre']);
                    //Generar arrays dias preprogramación
                    switch ($nombreDia) {
                        case "Lunes a Viernes":
                             $diasClase= array("Lunes","Martes","Miercoles","Jueves","Viernes");
                        break;
                        case "Lunes a Sábado":
                             $diasClase= array("Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
                        break;
                        case "Lunes a Miércoles":
                             $diasClase= array("Lunes","Martes","Miercoles");
                        break;
                        case "Jueves a Sábados":
                             $diasClase= array("Jueves","Viernes","Sabado");
                        break;
                        case "Martes y Miércoles": //--
                             $diasClase= array("Martes","Miercoles");
                        break;
						case "Martes a Sábado":
                             $diasClase= array("Martes","Miercoles","Jueves","Viernes","Sabado");
                        break;
                        case "Sábado":
                             $diasClase= array("Sabado");
                        break;
						case "Jueves a Martes":
                             $diasClase= array("Jueves","Viernes","Sabado","Lunes","Martes");
                        break;
						case "Lunes a Jueves":
                             $diasClase= array("Lunes","Martes","Miercoles","Jueves");
                        break;
						case "Lunes, Viernes y Sábado":
                             $diasClase= array("Lunes","Viernes","Sabado");
                        break;
						case "Martes a Viernes":
                             $diasClase= array("Martes","Miercoles","Jueves","Viernes");
                        break;
						case "Martes y Jueves":
                             $diasClase= array("Martes","Miercoles","Jueves");
                        break;
						case "Domingo":
                             $diasClase= array("Domingo");
                        break;
						case "Jueves":
                             $diasClase= array("Jueves");
                        break;
						case "Jueves y Viernes":
                             $diasClase= array("Jueves","Viernes");
                        break; 
						case "Lunes y Martes":
                             $diasClase= array("Lunes","Martes");
                        break;
						case "Lunes, Martes, Jueves y Viernes":
                             $diasClase= array("Lunes","Martes","Jueves","Viernes");
                        break;
						case "Viernes y Sábado":
                             $diasClase= array("Viernes","Sabado");
                        break;
						case "Lunes, Miércoles y Viernes":
                             $diasClase= array("Lunes","Miercoles","Viernes");
                        break;
						case "Lunes y miércoles":
                             $diasClase= array("Lunes","Miercoles");
                        break;
						case "Lunes y viernes":
                             $diasClase= array("Lunes","Viernes");
                        break;
						case "Lunes martes y jueves":
                             $diasClase= array("Lunes","Martes","Jueves");
                        break;
						case "Lunes":
                             $diasClase= array("Lunes");
                        break;
						case "Martes":
                             $diasClase= array("Martes");
                        break;
						case "Miércoles a sábado":
                             $diasClase= array("Miercoles","Jueves","Viernes","Sabado");
                        break;
						case "Miércoles a viernes":
                             $diasClase= array("Miercoles","Jueves","Viernes");
                        break;
						case "Miércoles y jueves":
                             $diasClase= array("Miercoles","Jueves");
                        break;
						case "Miércoles y viernes":
                             $diasClase= array("Miercoles","Viernes");
                        break;
						case "Miércoles":
                             $diasClase= array("Miercoles");
                        break;
						case "Viernes":
                             $diasClase= array("Viernes");
                        break;
						case "Lunes, Jueves, Sábados y Lunes":
                            $diasClase= array("Lunes","Jueves","Sabado");
                        break;
                    }
                        //Array con todas las dias de la semana para ser comparado
                        $dias = array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
                        $fechaFinal= $fila['FechaFinal'];
                        $fechaInicial=$fila['FechaInicial'];
                        $fechamostrar = $fechaInicial;
                        $NoSesion=0;

                        //Recorre desde la dias desde la fecha inicio hasta la fecha fin
                        while(strtotime($fechaFinal) >= strtotime($fechaInicial)){
                            //Devuelve el número del dia al que corresponde la fecha
                            @$fecha = $dias[date('N', strtotime($fechamostrar))];
                            //Busca si ese dia esta en el array de dias de clase
                            $buscar= array_search($fecha, $diasClase); 
                            //Verifica si la busqueda del dia en el array de dias clase sea diferente de false      
                            if(false !== $buscar){
                                //Aumenta el contador de No de Sesiones
                                $NoSesion=$NoSesion+1; 
                            }   
                            //Verifica si el dia que esta recorriendo el while es diferente del dia final para pasar al siguiente
                            if(strtotime($fechaFinal) != strtotime($fechamostrar)){
                                $fechamostrar = date("d-m-Y", strtotime($fechamostrar . " + 1 day"));
                            }else{
                                //Termina el while si ya se termino el rango de fechas
                                break;
                            }

                        }        
                }
                      $NoSesion;
            }
        } else {
            $NoSesion = -1;
        }
		
        return($NoSesion);
    }

    public function cerrarCurso($param){ 
        extract($param);
        $data = array('error'=>"", 'mensaje'=>'', 'html'=>'','parametros'=>'','idModulos'=>'','noModulos'=>'','asistencias'=>'', 'notas'=>'', 'planeacion'=>'');
		$parametros=array();
		$array=array();
		$parametros['idPreprogramacion']=$idPreprogramacion;
		$IdUsuario = $_SESSION['idUsuario'];
        //validaciones para poder cerrar el curso
		
		//----------CONSULTA DE SESIONES
		$numeroSesiones=$this->consultarCalendarioPreprogramacion($param); 
			if($numeroSesiones == -1){
				$data["error"]="No se consulto el numero de sesiones";
			}
				//----------FIN CONSULTA DE SESIONES
		
				//---------- VALIDACION DE ASISTENCIA
			if($numeroSesiones !== -1){
				$conexion->getPDO()->query("SET NAMES 'utf8'");
                $rs=null;
				$sql = "CALL SPCONSULTARTOTALASISTENCIASPORPREPROGRAMACION ($idPreprogramacion,$numeroSesiones);";
				if ($rs = $conexion->getPDO()->query($sql)) {
					$fila = $rs->fetch(PDO::FETCH_ASSOC);
					if ($fila['NumeroAsistencias'] == 0){
						$data["error"]="No se puede cerrar el curso, faltan asistencias por ingresar";
						echo json_encode($data);
						exit;
					}
					else{
						$data['asistencias']="ok";
					}
				}
				else{
					$data["error"]="No se encontraron las asistencias";
					print_r($conexion->getPDO()->errorInfo()); die();
				}	
			}
			
		//---------- FIN VALIDACION DE ASISTENCIA
		
        //---------- VALIDACION DE PLANEACION Y REFRIGERIOS
			if($numeroSesiones !== -1){
				$conexion->getPDO()->query("SET NAMES 'utf8'");
                $rs=null;
				$sql = "CALL SPCONSULTARTOTALPLANEACIONPORPREPROGRAMACION ($idPreprogramacion,$numeroSesiones);";
				if ($rs = $conexion->getPDO()->query($sql)) {
					$fila = $rs->fetch(PDO::FETCH_ASSOC);
					if ($fila['NumeroPlaneaciones'] == 0){
						$data["error"]="No se puede cerrar el curso, faltan planeaciones por ingresar";
						echo json_encode($data);
						exit;
					}
					else{
                        $rs->closeCursor();
                        $conexion->getPDO()->query("SET NAMES 'utf8'");
                        $rs1=null;
                        $sql1 = "CALL SPCONSULTARTOTALREFRIGERIOSPORPREPROGRAMACION($idPreprogramacion,$numeroSesiones);";
                        if ($rs1 = $conexion->getPDO()->query($sql1)) {
                            $fila1 = $rs1->fetch(PDO::FETCH_ASSOC);
                            if ($fila1['NumeroRefrigerios'] == 0){
                                $data["error"]="No se puede cerrar el curso, faltan refrigerios por ingresar";
                                echo json_encode($data);
                                exit;
                            }
                            else{
                                $rs1->closeCursor();
                                $data['planeacion']="ok";
                            }
                        }
                        else{
                            $data["error"]="No se consultaron los refrigerios";
                            print_r($conexion->getPDO()->errorInfo()); die();
                        }
					}
				}
				else{
					$data["error"]="No se consulto la planeación";
					print_r($conexion->getPDO()->errorInfo()); die();
				}	
			}
		
		//---------- FIN VALIDACION DE PLANEACION Y REFRIGERIOS

        //---------- VALIDACION DE EVALUACION
                $conexion->getPDO()->query("SET NAMES 'utf8'");
                $rs=null;
                $sql = "CALL SPVALIDAREVALUACIONESCERRARCURSO($idPreprogramacion);";
                if ($rs = $conexion->getPDO()->query($sql)) {
                    $fila = $rs->fetch(PDO::FETCH_ASSOC);
                    $resultado =strpos($fila['Resultado'], "-");

                    if ($resultado === false) {
                            if ($fila['Resultado'] != 0){
                                   $data['evaluacion']="ok";
                            }
                    }else{
                        $resultado1 = explode("-", $fila['Resultado']);
                        $evaluacionesRealizadas=$resultado1[0];
                        $evaluacionesMinimas=$resultado1[1];

                        $evaluacionesFaltantes=($evaluacionesMinimas-$evaluacionesRealizadas);

                        $data["error"]="Faltan ".$evaluacionesFaltantes." Evaluacion(s) de ".$evaluacionesMinimas." para cerrar el curso";
                        echo json_encode($data);
                        exit;
                    }
                }
							
		//---------- FIN VALIDACION DE EVALUACION
		
		//VALIDACION DE HORAS TOTALES ASISTIDAS
			
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $rs=null;
		$sql = "CALL SPCONSULTARHORASTOTALESMODULOPORPREPROGRAMACION ($idPreprogramacion);";
		if ($rs = $conexion->getPDO()->query($sql)) {
			$fila = $rs->fetch(PDO::FETCH_ASSOC);
			if ($fila['pEncontrados'] == 1){
				$data["error"]="No se puede cerrar el curso, hay alumnos con más horas asistidas de las horas totales del módulo";
				echo json_encode($data);
				exit;
			}
			else{
                    //
                    $conexion->getPDO()->query("SET NAMES 'utf8'");
                    $rs=null;                 
                    $sql = "CALL SPAGREGARPORCENTAJESDEASISTENCIASPORSALON($idPreprogramacion,$IdUsuario);";
                        if ($rs = $conexion->getPDO()->query($sql)) {//validar conexion y consulta porcentajeAsistenciasporsalon
                            $conexion->getPDO()->query("SET NAMES 'utf8'");
                            $rs=null;                       
                            $sql = "CALL SPCALCULARNOTASDEFINITIVAS($idPreprogramacion);";
                                if ($rs = $conexion->getPDO()->query($sql)) { //validar conexion y consulta consultarnotasporsalon   
                                    //validacion1 si un estudiante tiene asistencia > 0 la nota debe ser > 0
                                    $rs=null; 
                                    $array=array();
                                    $sql = "CALL SPCONSULTARASISTENCIAYNOTAPORSALON($idPreprogramacion);";
                                    if ($rs = $conexion->getPDO()->query($sql)) {
                                        if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                foreach ($filas as $fila) {
                                                    $array[] = $fila;
                                                }
                                            }
                                            if (count($array)>0){
                                                $data["error"]="No se pudo cerrar el curso, existen ".count($array)." estudiantes <br>con asistencias > 0 que no tienen notas > 0";
                                                echo json_encode($data);
                                                exit;
                                            }
                                            else{
                                                //validacion2 Si la nota es < 3 debe tener motivo de no asistencia
                                                $rs=null;
                                                unset($array);
                                                $array=array();
                                                $sql = "CALL SPCONSULTARNOTASMOTIVONOASISTENCIAPORSALON($idPreprogramacion);";
                                                if ($rs = $conexion->getPDO()->query($sql)) { 
                                                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                            foreach ($filas as $fila) {
                                                                $array[] = $fila;
                                                            }
                                                    }
                                                    if (count($array)>0){
                                                        $data["error"]="No se pudo cerrar el curso, existen ".count($array)." estudiantes <br>con nota menor a 3 y sin motivo de no asistencia<br>
                                                        (El motivo No Aplica no es válido)";
                                                        echo json_encode($data);
                                                        exit;
                                                    }else{
                                                        //validacion Si hay motivo de no asistencia debe haber observacion
                                                        $rs=null;
                                                        unset($array);
                                                        $array=array();
                                                        $sql = "CALL SPCONSULTARMOTIVONOASISTENCIAOBSERVACIONESPORSALON($idPreprogramacion);";
                                                        if ($rs = $conexion->getPDO()->query($sql)){ 
                                                            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                                foreach ($filas as $fila) {
                                                                    $array[] = $fila;
                                                                }
                                                            }
                                                            if (count($array)>0){
                                                                $data["error"]="No se pudo cerrar el curso, existen ".count($array)." estudiantes<br> con motivo de no asistencia y sin obervación";
                                                                echo json_encode($data);
                                                                exit;
                                                            }else{
                                                                //validacion nota debe ser mayor que 3 si porcentaje de asistencia es mayor 80
                                                                $rs=null;
                                                                unset($array);
                                                                $array=array();
                                                                $sql = "CALL SPCONSULTARNOTASYPORCENTAJESPORSALON($idPreprogramacion);";
                                                                if ($rs = $conexion->getPDO()->query($sql)) { 
                                                                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                                        foreach ($filas as $fila) {
                                                                            $array[] = $fila;
                                                                        }
                                                                    }
                                                                    if (count($array)>0){
                                                                        $data["error"]="No se pudo cerrar el curso, existen ".count($array)." estudiantes<br> con nota >= 3 que no tienen porcentaje de asistencia >= 80%";
                                                                        echo json_encode($data);
                                                                        exit;
                                                                    }else{
                                                                        //validacion porcentaje de asistencia es mayor 80 nota debe ser mayor que 3
                                                                        $rs=null;
                                                                        unset($array);
                                                                        $array=array();
                                                                        $sql = "CALL SPCONSULTARPORCENTAJESYNOTASPORSALON($idPreprogramacion);";
                                                                        if ($rs = $conexion->getPDO()->query($sql)) { 
                                                                            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                                                    foreach ($filas as $fila) {
                                                                                        $array[] = $fila;
                                                                                    }
                                                                            }
                                                                            if (count($array)>0){
                                                                                $data["error"]="No se pudo cerrar el curso, existen ".count($array)." estudiantes<br> con porcentaje de asistencia >= 80% que no tienen<br>nota >= 3";
                                                                                echo json_encode($data);
                                                                                exit;
                                                                            }else{
                                                                                //validacion nota es mayor 0 asistencia debe ser mayor que 0
                                                                                $rs=null;
                                                                                unset($array);
                                                                                $array=array();
                                                                                $sql = "CALL SPCONSULTARNOTAYASISTENCIAPORSALON($idPreprogramacion);";
                                                                                if ($rs = $conexion->getPDO()->query($sql)) { 
                                                                                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                                                            foreach ($filas as $fila) {
                                                                                                $array[] = $fila;
                                                                                            }
                                                                                    }
                                                                                    if (count($array)>0){
                                                                                        $data["error"]="No se pudo cerrar el curso, existen ".count($array)." estudiantes<br>con notas > 0 que no tienen<br>asistencias > 0";
                                                                                        echo json_encode($data);
                                                                                        exit;
                                                                                    }else{
                                                                                        //Cambia los motivos de no asistencia de los aprobados
                                                                                        $rs=null;
                                                                                        unset($array);
                                                                                        $array=array();
                                                                                        $sql = "CALL SPCAMBIARMOTIVOSNOASISTENCIAAPROBADOS($idPreprogramacion);";
                                                                                        if ($rs = $conexion->getPDO()->query($sql)) { 
                                                                                            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun resultado
                                                                                                    foreach ($filas as $fila) {
                                                                                                        $array[] = $fila;
                                                                                                    }
                                                                                            }
                                                                                        $data['horasTotles']="ok";
                                                                                    }
                                                                                }else{
                                                                                    $data["error"]="No se pudo cerrar el curso, no se validaron<br>notas definitivas >0 con asistencias >0";
                                                                                }
                                                                            }
                                                                        }else{
                                                                            $data["error"]="No se pudo cerrar el curso, no se validaron<br>porcentajes de asistencia y notas definitivas";
                                                                        }
                                                                    }
                                                                }else{
                                                                    $data["error"]="No se pudo cerrar el curso, no se validaron<br>notas definitivas y porcentajes de asistencia";
                                                                }
                                                            }
                                                        }else{
                                                            $data["error"]="No se pudo cerrar el curso, no se validaron<br>motivos no asistencia y observaciones";
                                                        }
                                                    }    
                                                }else{
                                                        $data["error"]="No se pudo cerrar el curso no se consultaron<br>notas y motivos no asistencia";
                                                    }
                                            }
                                        }else{ //validar conexion y consulta consultarnotasporsalon
                                                        $data["error"]="No se encontraron las notas por salon";
                                                        print_r($conexion->getPDO()->errorInfo()); die();
                                        }   

                                }else{
                                    $data["error"]="No se pudo cerrar el curso no se<br>consultaron las notas y las asistencias";
                                }               
                        }else{//validar conexion y consulta porcentajeAsistenciasporsalon
                            $data["error"]="No se agrego el porcentaje de asistencia";
                        }

			}
		}
		else{
			$data["error"]="No se encontró el total de horas asistidas";
			print_r($conexion->getPDO()->errorInfo()); die();
		}	
			
			
		//---------- FIN VALIDACION DE HORAS TOTALES ASISTIDAS
        if($data['asistencias']=="ok" and $data['planeacion']=="ok" and $data['evaluacion']=="ok" and $data['horasTotles']=="ok"){//inicio validacion para cerrar
			
		/* --------------------------------------------- */
		/* Inicio modulo siguiente a matricula */
									
		//se consulta en la tabla preprogramacion con el id preprogramacion para traer los datos
		//de matricula curso y salon
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $rs=null;

		$sql = "CALL SPCONSULTARPREPROGRAMACIONPORIDPARACLONAR($idPreprogramacion);";
		if ($rs = $conexion->getPDO()->query($sql)) {//consulta y conexion consutarpreprogramacionporIdClonar
			$fila = $rs->fetch(PDO::FETCH_ASSOC);
			
			$salon = explode('.',$fila['Salon']);
			$parametros['salon']=$fila['Salon']; //salon actual
			$salonMatricula = $salon[0];
			
			$modulo = explode('.',$fila['Modulo']); //modulo actual
			$total_array= count($modulo)-1;
            $cod_mod= $modulo[$total_array];

			$parametros['modulo']=$fila['Modulo'];			   
			
			$matricula = $fila['Matricula'];
			$parametros['matricula']=$matricula; //matricula
			
			$curso =  $fila['Curso'];
			$parametros['curso']=$curso; //curso
											
			//----------------------
			$data['parametros']=$parametros;
			
				//Se consulta en la tabla TCURSO para extraer el id y con este se consulta en la tabla TMODULO siguiente 4.05.T2
				$conexion->getPDO()->query("SET NAMES 'utf8'"); //este devuelve el codigo del modulo 4.05.T2
				 
                $rs=null;
				$sql = "CALL SPCONSULTARSIGUIENTEMODULOPORCURSO('".$curso."', '".$salonMatricula."');"; 
				
				if ($rs = $conexion->getPDO()->query($sql)) 
				{ //Inicio conexion y consulta consultarsiguientemoduloporcurso
					if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { //Validar si hay algun valor consultarsiguiente modulo
						foreach ($filas as $fila) {
							$array[] = $fila;
						}
					}//Validar si hay algun valor consultarsiguiente modulo
					
					if (count($filas)>0){// validar si hay modulosiguienteporcurso
						$data['idModulos']=$array;
						//se arma el div con el formulario para mostrar con los modulos faltantes
						$data[ 'html' ] = "<div>";
						$data[ 'html' ] .= "<br><label class='popup'>Seleccione el modulo siguiente</label><br><br>";
						$data[ 'html' ] .="<div style='width:70%; margin: 0 auto;'>";
						$data[ 'html' ] .="<Select id='SelModulo' name='SelModulo'>";
						$data['html'] .="<option value=''>Seleccione..</option>";
						
						for($i=0;$i<count($array);$i++){//For para recorreo la cantidad de modulossiguientes
								
							//SE CONCATENA EL CODIGO DEL CURSO
								$data['html'].="<option value='".$array[$i]['Id']."-".$array[$i]['Codigo']."-".$array[$i]['Nombre']."'>".$array[$i]['Codigo']." - ".$array[$i]['Nombre']."</option>";
						}	//For para recorreo la cantidad de modulossiguientes
						
						$data[ 'html' ] .="</select>";
						$data[ 'html' ] .="<br><br><button id='btnMatricularSiguienteModulo' class='seleccionar'>Confirmar</button>";
						$data[ 'html' ] .="&nbsp;&nbsp;<button id='btnCerrarModal' class='seleccionar'>Cancelar</button>";
						$data[ 'html' ] .="</div>";
						$data[ 'html' ] .="</div>";
					} // validar si hay modulosiguienteporcurso
					else{											
							//se arma el div con el formulario para mostrar con los modulos faltantes
						$data[ 'html' ] = "<div>";
						$data[ 'html' ] .= "<br><label class='popup'>No se encontraron mas módulos para asignar, Desea continuar cerrando el curso</label><br><br>";
						$data[ 'html' ] .="<div style='width:70%; margin: 0 auto;'>";
						$data[ 'html' ] .="<button id='btnCerrarCursoSinModulos' class='seleccionar'>Confirmar</button>";
						$data[ 'html' ] .="&nbsp;&nbsp;<button id='btnCerrarModal' class='seleccionar'>Cancelar</button>";
						$data[ 'html' ] .="</div>";
						$data[ 'html' ] .="</div>";
						
						//$data["error"]="Curso Cerrado, ";
						$data["noModulos"]="1";													
							
					}
						
					
				} //Inicio conexion y consulta consultarsiguientemoduloporcurso
				else{
					$data["error"]="No se pudo consultar el siguiente módulo";
					print_r($conexion->getPDO()->errorInfo()); die();
				}
	}//consulta y conexion consutarpreprogramacionporIdClonar
	
	/* Fin validacion de consultar siguiente modulo */
	/* ---------------------------------------------------------- */
				
			
	}//fin validacion cerrar curso	
    echo json_encode($data);	
    }
	
    public function cerrarCursoMatriculaTercero($param){	
		extract($param);
		
		$data = array('error'=>"", 'mensaje'=>'', 'html'=>'','parametros'=>'','idModulos'=>'','noModulos'=>'','asistencias'=>'', 'notas'=>'', 'planeacion'=>'');
		$parametros=array();
		$array=array();		
		$IdUsuario = $_SESSION['idUsuario'];		
	    
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCERRARMATRICULA($idPreprogramacion,$IdUsuario);";
            if (!$rs = $conexion->getPDO()->query($sql)) {
                $data["error"]="Error al cerrar la matricula";
            }

        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCERRARCURSO($idPreprogramacion,$IdUsuario);";
            if (!$rs = $conexion->getPDO()->query($sql)) {
                $data["error"]="No se pudo cerrar el curso";
                print_r($conexion->getPDO()->errorInfo()); die();
            }

		//var_dump($data);
		echo json_encode($data);
        
	}

	/*
	*Funcion matricularSiguienteModulo
	*param: recibe el id del modulo a matricular, el salon, idpreprogramcioncion, idPreNuevo, modulo completo
	*return: os si se matricularon los estudiantes
	*/
	function matricularSiguienteModulo($param){
		extract($param);
		$data = array('error'=>"", 'mensaje'=>'', 'html'=>'','Otro_mensaje'=>'');
		$IdUsuario = $_SESSION['idUsuario'];
		//se consulta ese codigo modulo en la tabla preprogramacion
		if ($id != ""){
			//extraer el los parametros
			$saloncompleto=$parametros['matricula'].".".$t;
			$modulocompleto=$codigo;
			$rs = null;
			$conexion->getPDO()->query("SET NAMES 'utf8'"); //este devuelve el codigo del modulo 4.05.T2
			$sql = "CALL SPCONSULTARPREPROGRAMACIONPORSALONSIGUIENTE('".$saloncompleto."');"; 
			//print_r($sql);
			if ($rs = $conexion->getPDO()->query($sql)) {
					$fila = $rs->fetch(PDO::FETCH_ASSOC);
						if($fila != ""){
							$idPreNuevo = $fila['Id'];
							$rs = null;
							$conexion->getPDO()->query("SET NAMES 'utf8'"); //preguntar si ese tercero en ese modulo ya existe no lo inserta
							//en este procedimiento si inserta estudiantes se cambia el estado a 1 a la preprogramacion con el id $idPreNuevo
							$sql = "CALL SPAGREGARESTUDIANTESAPROBADOSPORSALONALSIGUIENTEMODULO($idPreprogramacion,$idPreNuevo,'$modulocompleto',$IdUsuario);";
							if ($rs = $conexion->getPDO()->query($sql)) {
								/*$fila = $rs->fetch(PDO::FETCH_ASSOC);
								$numEstudiantes = $fila['cont'];
								$rs = null;
								$conexion->getPDO()->query("SET NAMES 'utf8'");
								$sql = "CALL SPAGREGARCANTIDADESTUDIANTESSALON($idPreNuevo,$numEstudiantes,$IdUsuario);";
								$rs = $conexion->getPDO()->query($sql);*/
                                //----- Inicio envío correo a todos los estudiantes matriculados -----//
                                $rs1=null;
                                $array1=array();
                                $conexion->getPDO()->query("SET NAMES 'utf8'");
                                $sql = "CALL SPCONSULTARDATOSCORREOMATRICULAPORPREPROGRAMACION($idPreNuevo);";
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
                                    $sql2 = "CALL SPCONSULTARDATOSCORREO();";
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
                                                $estudiante = $array1[$i]['Estudiante'];
                                                $tipoidentificacion = $array1[$i]['TipoIdentificacion'];
                                                $cedula = $array1[$i]['NumeroIdentificacion'];
                                                $correoElectronico = $array1[$i]['CorreoElectronico'];
                                                $salon = $array1[$i]['Salon'];
                                                $curso = $array1[$i]['Curso'];
                                                $ruta = $array1[$i]['Ruta'];
                                                $duracionCurso = $array1[$i]['DuracionCurso'];
                                                $diasCurso = $array1[$i]['DiasCurso'];
                                                $fechaInicial = $array1[$i]['FechaInicial'];
                                                $fechaFinal = $array1[$i]['FechaFinal'];
                                                $horaInicial = $array1[$i]['HoraInicial'];
                                                $horaFinal = $array1[$i]['HoraFinal'];
                                                $modulo = $array1[$i]['Modulo'];
                                                $duracionModulo = $array1[$i]['DuracionModulo'];
                                                $modalidad = $array1[$i]['Modalidad'];
                                                $sede = $array1[$i]['Sede'];
                                                $docente = $array1[$i]['Docente'];
                                                $asunto = "ID DE MATRICULA - ACTUALIZACION";
                                                $correo=$utilidades->enviarCorreoEstudiante($estudiante,$tipoidentificacion,$cedula,$correoElectronico,$salon,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$modalidad,$sede,$docente,$IdMatricula,$usuario,$usuarioe,$correode,$clave,$asunto);
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
                                //----- Fin envío correo a todos los estudiantes matriculados -----//
							}else{
								$data["error"] = "No se agregaron los estudiantes";
								print_r($conexion->getPDO()->errorInfo()); die();
							}
						}else{
							$data["error"]= "No hay preprogramación para el sálon ".$saloncompleto." y módulo ".$modulocompleto." - ".$nombre." o verifique el estado"; 
						}
			}else{
				$data["error"] = "No se realizo la consulta a la preprogramación";
				print_r($conexion->getPDO()->errorInfo()); die();
			}
			//$data["mensaje"] = "Se encontro el modulo siguiente"; 
		}else{
			$data["error"] = "No hay siguiente módulo";
			print_r($conexion->getPDO()->errorInfo()); die();
		}
	echo json_encode($data);
	}

    private function CodificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
        return $aux;
    }
	
	public function CargarCursosPorCodigo($param) {
        extract($param); 
		$rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCURSOSPORCODIGO('$codCurso');";        
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
}
?>