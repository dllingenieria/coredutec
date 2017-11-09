<?php
require("../controlador/session.php");	
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

class clsAcademico {

    public function consultarEstudiantesAsistieronConvocatoria($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARESTUADIANTESASISTIERONCONVOCATORIA($jornada, $ruta, '$fecha', $usuario);";
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

    public function consultarUsuariosRegistraronAsistencia($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARUSUARIOSREGISTRARONASISTENCIA($jornada, $ruta, '$fecha');";
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

    public function consultarAsistenciaPorSalon($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARASISTENCIAPORSALON($idSalon,$sesion);";
        //echo $sql; die();
		if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[$fila['IdTercero']] = $fila['HorasAsistidas'];
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function consultarUltimaSesionPorSalon($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARULTIMASESION($idSalon);";
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


  public function agregarAcademicoGeneral($param) 
    {
        
        extract($param);
		$array = array();
		$rs = null;		
        // print_r($serializedAsistencia);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
        // $fecha = date('Y-m-d');
        // $sql = "CALL SPAGREGARASISTENCIA($idPreprogramacion,'$fecha', $sesion,$usuario);";
        $sql = "CALL SPAGREGARSEGUIMIENTOACADEMICO('$serializedAcademico',$usuario);";
        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {               
                
                $filas = substr($filas[0]['pIdSeguimientos'],1);
                $res = explode(",", $filas);
                //var_dump($res);
                foreach ($res as $resul) {
                	//var_dump($resul);
                    $array[] = array('IdAcademico' => $resul);

                }
             }
        } else {
            $array = 0;
            print_r($conexion->getPDO()->errorInfo()); die();
            
       }
            echo json_encode($array);
    }

	
    public function agregarAcademicoDetalle($param) {
        extract($param);
        $array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario = $_SESSION['idUsuario'];
        $rs = null;
        // $sql = "CALL SPAGREGARASISTENCIADETALLE($idAsistencia, $idTercero, $valorAsistencia,  $idAsistenciaDetalle, $usuario);";
        $sql = "CALL SPAGREGARSEGUIMIENTOACADEMICODETALLE('$serializedacademicoD', $usuario);";
        
        if ($rs = $conexion->getPDO()->query($sql)) {
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                // foreach ($filas as $fila) {
                    // $array[] = $fila;
                // }
            // }
			$array = 1;
        } else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo()); die();
        }
		//print_r($array);
        echo json_encode($array);
    }
	
	   // public function agregarAsistenciaObservacion($param) {
        // extract($param);
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
        // $usuario = $_SESSION['idUsuario'];
        // // $sql = "CALL SPAGREGARASISTENCIAOBSERVACION($idAsistencia, $idTercero, '$observacion',$idPreprogramacion, $usuario);";
        // $sql = "CALL SPAGREGARASISTENCIAOBSERVACION1('$serializedAsistenciaO', $usuario);";
        
        // //print_r($sql);
        // if ($rs = $conexion->getPDO()->query($sql)) {
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                // foreach ($filas as $fila) {
                    // $array[] = $fila;
                // }
            // }
        // } else {
            // $array = 0;
			// print_r($conexion->getPDO()->errorInfo()); die();
        // }
		// // $array = 0;
        // echo json_encode($array);
    // }

    public function consultarAsistenciaEstudiantes($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARASISTENCIAPORSALON($idPreprogramacion,$sesion);";
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
	
	/*
	*Funcion consultarAcademicoPorSalon
	*params: IdPreprogramacion
	*return: array con IdTercero y horas asistidas
	*/
	public function consultarAcademicoPorSalon($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
		for ($i=0; $i<=$registros;$i++){
			$sql = "CALL SPCONSULTARASISTENCIASPORSALON($idPreprogramacion);";
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
			} //print_r($resultado); die();
		}
        echo json_encode($resultado);
    }
	
	/*
	*Funcion consultaracademicoPorPreprogramacion
	*params: IdPreprogramacion
	*return: array los datos de asistencias
	*/
	public function consultarAcademicoPorPreprogramacion($param) {
        extract($param);
		$array = array();
        //print_r("llego");
        $conexion->getPDO()->query("SET NAMES 'utf8'");
			$sql = "CALL SPCONSULTARacademicoPORPREPROGRAMACION($idPreprogramacion);";
			//print_r($sql);
			if ($rs = $conexion->getPDO()->query($sql)) {
				if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					foreach ($filas as $fila) {
						$array[] = $fila;
					}
				}
			} else {
				$array = 0;
				print_r($conexion->getPDO()->errorInfo()); 
			} //print_r($array);
			//print_r($array);
        echo json_encode($array);
    }
	
/*
	*Funcion consultarSeguimientoPorTercero
	*params: IdPreprogramacion
	*return: array los datos de las observaciones por tercero
	*/
	public function consultarSeguimientoPorPreprogramacion($param) {
        extract($param);
		$rs = null;
        $array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
	//for ($i=0; $i<count($idTerceroHorasTotales);$i++){
			$sql = "CALL SPCONSULTARSEGUIMIENTOPORPREPROGRAMACION($idPreprogramacion);";
			if ($rs = $conexion->getPDO()->query($sql)) {
				if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					foreach ($filas as $fila) {
						$array[] = $fila;
					}
					unset($rs);
				}
			} else {
				$array = 0;
				print_r($conexion->getPDO()->errorInfo()); die();
			} //print_r($array); die();
		//}
        echo json_encode($array);
    }
	

	
	/*
	*Funcion CargarMotivosNoAsistencia
	*params: Ninguno
	*return: array los motivos de las no asistencias
	*/
	// public function CargarMotivosNoAsistencia($param) {
        // extract($param);
        
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
	// //for ($i=0; $i<count($idTerceroHorasTotales);$i++){
			// $sql = "CALL SPCARGARMOTIVOSNOASISTENCIA();";
			// if ($rs = $conexion->getPDO()->query($sql)) {
				// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					// foreach ($filas as $fila) {
						// $array[] = $fila;
					// }
					// unset($rs);
				// }
			// } else {
				// $array = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } //print_r($array);
		// //}
        // echo json_encode($array);
    // }
	
	/*
	*Funcion agregarMotivoNoAsistencia
	*params: $idAsistencia, $idTercero, '$motivo',$idPreprogramacion, $usuario
	*return: array si inserto los datos
	*/
	 // public function agregarMotivoNoAsistencia($param) {
        // extract($param);
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
        // $usuario = $_SESSION['idUsuario']; //FALTA EL NOMBRE
        // // $sql = "CALL SPAGREGARMOTIVONOASISTENCIA($idAsistencia, $idTercero, '$motivo',$idPreprogramacion, $usuario);";
        // $sql = "CALL SPAGREGARMOTIVONOASISTENCIA1('$serializedAsistenciaM', $usuario);";
        // //print_r($sql);
        // if ($rs = $conexion->getPDO()->query($sql)) {
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                // foreach ($filas as $fila) {
                    // $array[] = $fila;
                // }
            // }
        // } else {
            // $array = 0;
			// print_r($conexion->getPDO()->errorInfo()); die();
        // }
		// // $array = 0;
        // echo json_encode($array);
    // }
	
	/*
	*Funcion consultarMotivosNoAsistenciaPorTercero
	*params: $idPreprogramacion, $idTerceroHorasTotales
	*return: array los datos de los motivos no asistencia por tercero
	*/
	// public function consultarMotivosNoAsistenciaPorTercero($param) {
        // extract($param);
        // $array = array();
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
	// //for ($i=0; $i<count($idTerceroHorasTotales);$i++){
			// $sql = "CALL SPCONSULTARMOTIVOSNOASISTENCIAPORTERCERO($idPreprogramacion, $idTerceroHorasTotales);";
			// if ($rs = $conexion->getPDO()->query($sql)) {
				// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					// foreach ($filas as $fila) {
						// $array[] = $fila;
					// }
					// unset($rs);
				// }
			// } else {
				// $array = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } //print_r($array);
		// //}
        // echo json_encode($array);
    // }
	
	/*
	*Funcion consultarNotasPorTercero
	*params: IdPreprogramacion, idTercero
	*return: array los datos de la nota por tercero
	*/
	// public function consultarNotasPorTercero($param) {
        // extract($param);
		
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
	// //for ($i=0; $i<count($idTerceroHorasTotales);$i++){
			// $sql = "CALL SPCONSULTARNOTASPARAASISTENCIAS($idPreprogramacion, ".$idTerceroHorasTotales[0].");";
			// // $sql = "CALL SPCONSULTARNOTASPORSALON($idPreprogramacion);";
			// if ($rs = $conexion->getPDO()->query($sql)) {
				// $count=0;
				// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					// foreach ($filas as $fila) {
									// $idTercero = $fila['IdTercero'];
									// $notaHacer = explode(',',$fila['NotaHacer']);
									// $notaSaber = explode(',',$fila['NotaSaber']);
									// $notaSer = explode(',',$fila['NotaSer']);
									
									// $totalNotas[] =  $notaHacer[0];
									// $totalNotas[] =  $notaHacer[1];
									// $totalNotas[] =  $notaHacer[2];
									// $totalNotas[] =  $notaSaber[0];
									// $totalNotas[] =  $notaSaber[1];
									// $totalNotas[] =  $notaSaber[2];
									// $totalNotas[] =  $notaSer[0];
									// $totalNotas[] =  $notaSer[1];
									// $totalNotas[] =  $notaSer[2];
									// //echo json_encode($totalNotas);
									// //print_r($totalNotas);
									// $numeroNotas ="";
									// foreach ($totalNotas as $nota) {
										// if($nota != ''){
											// $numeroNotas = $numeroNotas + 1;
										// }
									// }
									// $notaDef = 0;
									// $notaDef = number_format($notaDef, 2);
									// if ($numeroNotas != 0 || $numeroNotas != ""){
									// //echo json_encode($numeroNotas);
										// $notaDef =  ($notaHacer[0]+$notaHacer[1]+$notaHacer[2]+
													// $notaSaber[0]+$notaSaber[1]+$notaSaber[2]+
													// $notaSer[0]+$notaSer[1]+$notaSer[2]) / $numeroNotas;
										// $notaDef = number_format($notaDef, 2);
									// }
						// $array[$count]['Nota']=$notaDef;
						// $array[$count]['IdTercero']=$idTercero;
						// $count++;
						
						// $numeroNotas = 0;
						// $totalNotas = [];
						// $notaDef = 0;
					// }
					// //unset($rs);
				// }
			// } else {
				// $array = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } //print_r($array); die();
		// //} 
		
		// //$array[0]= 1.5; 
        // echo json_encode($array);
    // }

    //Reporte Asistencias en excel//
  // public function consultarReporte($param){
	// extract($param);
	// //var_dump($param);

	// define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
	// date_default_timezone_set('Europe/London');
	// /** PHPExcel_IOFactory */
	 
	// require_once dirname(__FILE__) . '/../includes/PHPExcel/PHPExcel/IOFactory.php';

	// /*
	 // * To change this template, choose Tools | Templates
	 // * and open the template in the editor.
	 // */

	// $cacheMethod = PHPExcel_CachedObjectStorageFactory:: cache_to_phpTemp;
	// $cacheSettings = array('memoryCacheSize ' => '256MB');
	// PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);

	// $sheetname = 'Informe'; 
	// $objReader = PHPExcel_IOFactory::createReader('Excel5');
	// $objReader->setLoadSheetsOnly($sheetname);
	// //$objReader->setLoadAllSheets();
	// $objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/template.xls");
	
        // extract($param);
		// $data = array('error'=>0,'mensaje'=>'','html'=>'');

				// $objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateReporte.xls");
				// $objPHPExcel->getActiveSheet()->setCellValue('C1', 'Nombre del Servicio educativo');
				// $objPHPExcel->getActiveSheet()->setCellValue('D1', $Curso." - ".$Modulo);
				// $objPHPExcel->getActiveSheet()->setCellValue('C2', 'Centro/Sede/Lugar de Servicio');
				// $objPHPExcel->getActiveSheet()->setCellValue('D2', $Sede." - ".$Salon);
				// $objPHPExcel->getActiveSheet()->setCellValue('C3', 'Fecha de Inicio');
				// $objPHPExcel->getActiveSheet()->setCellValue('D3', $FechaInicial);
				// $objPHPExcel->getActiveSheet()->setCellValue('G2', 'Horario');
				// $objPHPExcel->getActiveSheet()->setCellValue('H2', $Horario);
				// $objPHPExcel->getActiveSheet()->setCellValue('G3', 'Código');
				// $objPHPExcel->getActiveSheet()->setCellValue('H3', $IdCurso." - ".$IdModulo);
				// $objPHPExcel->getActiveSheet()->setCellValue('I1', 'Inscritos');
				// $objPHPExcel->getActiveSheet()->setCellValue('J1', $Inscritos);
				// $objPHPExcel->getActiveSheet()->setCellValue('I2', 'Fecha de Finalización');
				// $objPHPExcel->getActiveSheet()->setCellValue('J2', $FechaFinal);
				// $objPHPExcel->getActiveSheet()->setCellValue('I3', 'Duración del Módulo');
				// $objPHPExcel->getActiveSheet()->setCellValue('J3', $Duracion);

				// //Array de Datos Columnas
				// $dataColumnasDatos = array('No', 'Estudiante', 'Identificación', 'Telefono');		
				// $sesiones=(int)$NoSesiones;
				// $int=1;
				// if($sesiones!==0){
					// for($i=1; $i<=$sesiones;$i++) {
						// $sesion= "Sesion ".$int;
						// array_push($dataColumnasDatos, $sesion);
						// $int++;
					// }
				// }
				// array_push($dataColumnasDatos, 'Total Horas', 'Observaciones', 'Motivo no asistencia', 'Nota');

				// $baseRowDatos = 5;
				// $columnDatos=0;
			// foreach($dataColumnasDatos as $dataRow) {
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					// $columnDatos++;                    
				// }	

			// $baseRow = 6;
			// $columnRow= 0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// $sql = "CALL SPCONSULTARESTUDIANTESPORSALON1($idPreprogramacion);";
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						// $data['mensaje'] = 1;
						// $Estudiantes= count($filas);
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['IdTercero']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']." ".$fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Identificacion']);						
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);	

						// }

							// unset($rs);

						// $Estudiantes=$Estudiantes+5;
					
					// if($sesiones!==0){
						// for($i=6;$i<=$Estudiantes;$i++){	
							// $columnRow=3;
							// $row = $i;
							// $idTerceroAsistencia=$objPHPExcel->getActiveSheet()->getCell("A".$i)->getValue();

							// //Cargar Asistencias por tercero y preprogramacion  
							// $sql2 = "CALL SPCONSULTARASISTENCIASPORTERCERO($idPreprogramacion, $idTerceroAsistencia);";
							// if($rs2 = $conexion->getPDO()->query($sql2)){
								// if ($filasAsistencia = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
										 	// $sum=0;
										 	// $horasAsistidas="NA";
										 // for($j=1;$j<=$sesiones;$j++){ 	
											// foreach ($filasAsistencia as $s =>$filaasis) {
												// if($filaasis['SesionNumero']==$j){
														// $horasAsistidas=$filaasis['HorasAsistidas'];
												// }												
											// }

											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $horasAsistidas);
												// $sum=$sum+$horasAsistidas;
												// $horasAsistidas="NA";
										 // }
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $sum);
									// unset($rs2);
								// }else{
									 // for($j=1;$j<=$sesiones;$j++){ 	
									 	// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA");
									 // }

									 // $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, 0);

								// }
							// }

							// //Cargar Observaciones por tercero y preprogramacion
							// $sql3 = "CALL SPCONSULTAROBSERVACIONESPORTERCERO($idPreprogramacion, $idTerceroAsistencia);";
								// if($rs3 = $conexion->getPDO()->query($sql3)){
									// if ($filasObservaciones = $rs3->fetchAll(PDO::FETCH_ASSOC)) {
											// foreach ($filasObservaciones as $s =>$filaob) {
												// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $filaob['Observacion']);
											// }
									// }else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, '');
									// }

									// unset($rs3);
								// }

							// //Cargar Motivos asistencia por tercero y preprogramacion
							// $sql4 = "CALL SPCONSULTARMOTIVOSNOASISTENCIAPORTERCERO($idPreprogramacion, $idTerceroAsistencia);";
							// if($rs4 = $conexion->getPDO()->query($sql4)){
									// if ($filasMotivoAsistencia = $rs4->fetchAll(PDO::FETCH_ASSOC)) {
											// foreach ($filasMotivoAsistencia as $s =>$filamot) {
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $filamot['Nombre']);
											// }
									// }else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, '');
									// }

									// unset($rs4);
								// }

						   // //Cargar notas por tercero y preprogramacion
						   // $sql5 = "CALL SPCONSULTARNOTASPARAASISTENCIASTERCERO($idPreprogramacion, $idTerceroAsistencia);";
						   // if ($rs5 = $conexion->getPDO()->query($sql5)) {
							// $count=0;
								// if ($filasNotas = $rs5->fetchAll(PDO::FETCH_ASSOC)) {
										// foreach ($filasNotas as $filanot) {

											// $idTercero = $filanot['IdTercero'];
											// $notaHacer = explode(',',$filanot['NotaHacer']);
											// $notaSaber = explode(',',$filanot['NotaSaber']);
											// $notaSer = explode(',',$filanot['NotaSer']);
											
										
											// $totalNotas[] =  $notaHacer[0];
											// $totalNotas[] =  $notaHacer[1];
											// $totalNotas[] =  $notaHacer[2];
											// $totalNotas[] =  $notaSaber[0];
											// $totalNotas[] =  $notaSaber[1];
											// $totalNotas[] =  $notaSaber[2];
											// $totalNotas[] =  $notaSer[0];
											// $totalNotas[] =  $notaSer[1];
											// $totalNotas[] =  $notaSer[2];
											// //echo json_encode($totalNotas);
											// //print_r($totalNotas);
											// $numeroNotas ="";
											// foreach ($totalNotas as $nota) {
												// if($nota != ''){
													// $numeroNotas = $numeroNotas + 1;
												// }
											// }
									// $notaDef = 0;
									// $notaDef = number_format($notaDef, 2);
									
									// if ($numeroNotas != 0 || $numeroNotas != ""){
									// //echo json_encode($numeroNotas);
										// $notaDef =  ($notaHacer[0]+$notaHacer[1]+$notaHacer[2]+
													// $notaSaber[0]+$notaSaber[1]+$notaSaber[2]+
													// $notaSer[0]+$notaSer[1]+$notaSer[2]) / $numeroNotas;
										// $notaDef = number_format($notaDef, 2);
									// }
										
										// //$count++;
										
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $notaDef);
										// $numeroNotas = 0;
										// $totalNotas = [];
										// $notaDef = 0;	
										
								// }
										
								// }else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, '');
									// }

								// unset($rs5);
									
						// }				
					// }
				// }
					

					// }else{
						 // $data['error']=2;
					// }
					// }else {
						 // $data['error'] = 0;
						 // print_r($conexion->getPDO()->errorInfo()); die();
					// } 
								
							
							// $styleArray = array(
								  // 'borders' => array(
									  // 'allborders' => array(
										  // 'style' => PHPExcel_Style_Border::BORDER_THIN
									  // )
								  // )
							  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
							
							// //foreach externo
							 // //$objPHPExcel->getActiveSheet()->removeRow($baseRow-1,1);
							 // $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
							
							 // $FechaMod=strtotime("now");
							 // $filename = '../tmp/reporteAsistencias/reporteAsistencias_'.$FechaMod.'.xls';
							 // $objWriter->save(str_replace('.php', '.xls', $filename));
							 // $data['html']=$filename;

		  // echo json_encode($data);
	// }


}
?>