<?php
require("../controlador/session.php");	
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

class clsAlimentacion {

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

  public function agregarAlimentacioGeneral($param) 
    {  
        extract($param);
		$array = array();
		$rs = null;		
        // print_r($serializedAsistencia);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
        // $fecha = date('Y-m-d');
        // $sql = "CALL SPAGREGARASISTENCIA($idPreprogramacion,'$fecha', $sesion,$usuario);";
        $sql = "CALL SPAGREGARALIMENTACION('$serializedAlimentacion',$usuario);";
        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {               
                
                $filas = substr($filas[0]['pIdAlimentacion1'],1);
                $res = explode(",", $filas);
                //var_dump($res);
                foreach ($res as $resul) {
                	//var_dump($resul);
                    $array[] = array('IdAlimentacion' => $resul);

                }
             }
        } else {
            $array = 0;
            print_r($conexion->getPDO()->errorInfo()); die();
            
       }
        	
			 
            echo json_encode($array);
    }

    public function agregarAlimentacionDetalle($param) {
        extract($param);
        $array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario = $_SESSION['idUsuario'];
        $rs = null;
        // $sql = "CALL SPAGREGARASISTENCIADETALLE($idAsistencia, $idTercero, $valorAsistencia,  $idAsistenciaDetalle, $usuario);";
        $sql = "CALL SPAGREGARALIMENTACIONDETALLE('$serializedalimentacionD', $usuario);";
        //print_r($sql);
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
	
	   

    // public function consultarAsistenciaEstudiantes($param) {
        // extract($param);
        // $resultado = array();
        // $registro = array();
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
        // $sql = "CALL SPCONSULTARASISTENCIAPORSALON($idPreprogramacion,$sesion);";
        // if ($rs = $conexion->getPDO()->query($sql)) {
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                // foreach ($filas as $fila) {
                    // foreach ($fila as $key => $value) {
                        // array_push($registro, $value);
                    // }
                    // array_push($resultado, $registro);
                    // $registro = array();
                // }
            // }
        // } else {
            // $registro = 0;
        // }
        // echo json_encode($resultado);
    // }
	
	/*
	*Funcion consultarAsistenciasPorSalon
	*params: IdPreprogramacion
	*return: array con IdTercero y horas asistidas
	*/
	// public function consultarAsistenciasPorSalon($param) {
        // extract($param);
        // $resultado = array();
        // $registro = array();
        // $conexion->getPDO()->query("SET NAMES 'utf8'");
		// for ($i=0; $i<=$registros;$i++){
			// $sql = "CALL SPCONSULTARASISTENCIASPORSALON($idPreprogramacion);";
			// if ($rs = $conexion->getPDO()->query($sql)) {
				// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
					// foreach ($filas as $fila) {
						// foreach ($fila as $key => $value) {
							// array_push($registro, $value);
						// }
						// array_push($resultado, $registro);
						// $registro = array();
					// }
				// }
			// } else {
				// $registro = 0;
			// } //print_r($resultado); die();
		// }
        // echo json_encode($resultado);
    // }
	
	/*
	*Funcion consultaralimentacionPorPreprogramacion
	*params: IdPreprogramacion
	*return: array los datos de asistencias
	*/
	public function consultaralimentacionPorPreprogramacion($param) {
        extract($param);
		$array = array();
        //print_r("llego");
        $conexion->getPDO()->query("SET NAMES 'utf8'");
			$sql = "CALL SPCONSULTARALIMENTACIONPORPREPROGRAMACION($idPreprogramacion);";
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
	
	public function consultarReporteAlimentacionPorPreprogramacion($param) {
		extract($param); 
        $array=array();
		$resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPREPORTEALIMENTACIONGENERAL('$fechai','$fechaf');";
		
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
        }else {
            $resultado = 0;
			print_r($conexion->getPDO()->errorInfo());
        } //print_r($array); die();
        echo json_encode($resultado);
    }


    // Devuelve los tipos de alimentación para ser cargados en el combo//
    public function cargarTipoAlimentacion($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
    //for ($i=0; $i<count($idTerceroHorasTotales);$i++){
            $sql = "CALL SPCARGARTIPOREFRIGERIO();";
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
            } //print_r($array);
        //}
        echo json_encode($array);
    }

    //genera informe en archivo excel alimentación
    public function consultarReporteAlimentacion ($param){
        define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
<<<<<<< HEAD
        date_default_timezone_set('Europe/London');
=======
        date_default_timezone_set('America/Bogota');
>>>>>>> 24f2e6a1282d5e08b867d4b55aaf5c4c271a9b84
        /** PHPExcel_IOFactory */
         
        require_once dirname(__FILE__) . '/../includes/PHPExcel/PHPExcel/IOFactory.php';

        /*
         * To change this template, choose Tools | Templates
         * and open the template in the editor.
         */

        $cacheMethod = PHPExcel_CachedObjectStorageFactory:: cache_to_phpTemp;
        $cacheSettings = array('memoryCacheSize ' => '256MB');
        PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);

        $sheetname = 'Informe'; 
        $objReader = PHPExcel_IOFactory::createReader('Excel5');
        $objReader->setLoadSheetsOnly($sheetname);
        //$objReader->setLoadAllSheets();
        $objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/template.xls");
        
        extract($param);
        $data = array('error'=>0,'mensaje'=>'','html'=>'');

        $objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateReporte.xls");
        $objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
        
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME AlIMENTACIÓN');
        //Array de Datos Columnas
        $dataColumnasDatos = array('Salón','Curso', 'Modulo', 'Estado', 'Sesion', 'Fecha',  'Cantidad', 'Refrigerio');                    
        
        $baseRowDatos = 5;
        $columnDatos=0;
        foreach($dataColumnasDatos as $dataRow) {
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
            $columnDatos++;                    
        }   

    $baseRow = 6;
    $columnRow= 0;

    $conexion->getPDO()->query("SET NAMES 'utf8'");
    $sql = "CALL SPREPORTEALIMENTACIONGENERAL('$fechai','$fechaf');";
    $rs=null;
    // $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
    // //print_r($sql);
    if ($rs = $conexion->getPDO()->query($sql)) {
    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
    $data['mensaje'] = 1;
    //print_r($filas);
    foreach ($filas as  $r =>$fila) {
        //$array[] = $fila;
        $columnRow=0;
        $row = $baseRow + $r;
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Salon']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Estado']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Sesion']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Fecha']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Cantidad']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Refrigerio']);    
        }
        }else{
             $data['error']=2;
        }
        }else {
             $data['error'] = 0;
             print_r($conexion->getPDO()->errorInfo()); die();
        } 
            
        
        $styleArray = array(
              'borders' => array(
                  'allborders' => array(
                      'style' => PHPExcel_Style_Border::BORDER_THIN
                  )
              )
          );
         $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
        
        //foreach externo
<<<<<<< HEAD
         //$objPHPExcel->getActiveSheet()->removeRow($baseRow-1,1);
         $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        
         $FechaMod=strtotime("now");
         $filename = '../tmp/reporteAlimentacion/reporteAlimentacion_'.$FechaMod.'.xls';
=======
         $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        
         $FechaMod=strtotime("now");
         $filename = '../anexos/reportes/reporteAlimentacion_'.$FechaMod.'.xls';
>>>>>>> 24f2e6a1282d5e08b867d4b55aaf5c4c271a9b84
         $objWriter->save(str_replace('.php', '.xls', $filename));
         $data['html']=$filename;

            echo json_encode($data);

    }

}
?>