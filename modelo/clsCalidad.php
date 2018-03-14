<?php
require("../controlador/session.php");	
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

class clsCalidad {

    public function ConsultarEvaluacionesPorCedula($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        
        // $sql = "CALL SPCONSULTAREVALUACIONESPORCEDULA($cedula);";
        $sql = "CALL SPCONSULTAREVALUACIONESPORPREPROGRAMACION($IdPreprogramacion);";
	
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
			// print_r($sql);
			// print_r($filas);
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

    /**
	 * Metodo cargarDetallePlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPplaneacion
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No ingrese los datos en la db
	 */	
    public function cargarDetalleEvaluacion($param) { 
    	extract($param); 
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDETALLEEVALUACION($IdEvaluacion);";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
			print_r($conexion->getPDO()->errorInfo()); 
			$array = 0;
        }
        echo json_encode($array);
	}

    public function consultarEvaluacionTabulada($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPREPORTEEVALUACIONESGENERAL('$fechai','$fechaf',$bandera);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }else {
                $array = 0;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }	

     //genera informe en archivo excel calidad evaluación tabulada
    public function consultarEvaluacionTabuladaDetalle ($param){
        define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
        date_default_timezone_set('America/Bogota');
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
        
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME EVALUACIONES TABULADAS DETALLE');
        //Array de Datos Columnas
        $dataColumnasDatos = array('Estudiante','Ruta', 'Cód Curso', 'Curso', 'Cód Módulo', 'Módulo', 'Salón', 'Modalidad', 'Fecha Inicial', 'Fecha Fin', 'Docente', 'Satisfacción', 'Descripción Satisfacción', 'Claridad', 'Metodología', 'Contenidos', 'Material', 'Instalaciones', 'Objetivos', 'Tiempos', 'Descripción Servicio', 'Aspectos Positivos', 'Aspectos para Mejorar');                    
        
        $baseRowDatos = 5;
        $columnDatos=0;
        foreach($dataColumnasDatos as $dataRow) {
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
            $columnDatos++;                    
        }   

    $baseRow = 6;
    $columnRow= 0;

    $conexion->getPDO()->query("SET NAMES 'utf8'");
    $sql = "CALL SPREPORTEEVALUACIONESDETALLE('$fechai','$fechaf');";
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
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Estudiante']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['ModuloNombre']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Salon']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modalidad']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaInicial']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaFinal']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Docente']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Satisfaccion']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['DescripcionSatisfaccion']);    
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Claridad']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Metodologia']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Contenidos']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Material']);
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Instalaciones']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Objetivos']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Tiempos']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['DescripcionServicio']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['AspectosPositivos']);  
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['AspectosParaMejorar']);    
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
         //$objPHPExcel->getActiveSheet()->removeRow($baseRow-1,1);
         $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        
         $FechaMod=strtotime("now");
         $filename = '../anexos/reportes/reporteEvaluacionTabuladaDetalle_'.$FechaMod.'.xls';
         $objWriter->save(str_replace('.php', '.xls', $filename));
         $data['html']=$filename;

            echo json_encode($data);

    }   
}
?>