<?php
require("../controlador/session.php");
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);


class clsReporte {
    public function consultarReporte($param){
		
	define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
	date_default_timezone_set('America/Lima');
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
		switch ($solicitarReporte) {
		case 9:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateReporte.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME PREPROGRAMACIÓN A LA FECHA');
				//Array de Datos Columnas
				$dataColumnasDatos = array('Id', 'Salón','Convocatoría', 'Ruta', 'Código Curso', 'Curso', 'Código Módulo',	'Módulo', 'Duración Curso',	'Duración Módulo', 'Dias Curso', 'Hora Inicial', 'Hora Final', 'Modalidad',	'Sede', 'Fecha Inicial', 'Fecha Final', 'Docente', 'Tipo Certificación', 'Estado', 'Cantidad Matriculados', 'Intensidad Horaria', 'Capacidad Salón', 'Cantidad de Sesiones', 'Observaciones');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				$baseRowDatos = 5;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	

			$baseRow = 6;
			$columnRow= 0;
	
			$conexion->getPDO()->query("SET NAMES 'utf8'");
			$sql = "CALL SPREPORTEPREPROGRAMACIONESALAFECHA();";
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
							$row = $baseRow	+ $r;
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Id']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Salon']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CodigoCurso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CodigoModulo']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['DuracionCurso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['DuracionModulo']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['DiasCurso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['HoraInicial']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['HoraFinal']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modalidad']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Sede']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaInicial']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaFinal']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Docente']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoCertificacion']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Estado']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CantidadMatriculados']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['IntensidadHorariaDiaria']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CapacidadSalon']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CantidadSesiones']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Observaciones']);
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
							 $filename = '../anexos/reportes/reportePreprogramacionFecha_'.$FechaMod.'.xls';
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							 $data['html']=$filename;
							
		break;
		case 10:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateReporte.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME MATRICULAS DESDE '.$fechaInicial);
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('Id', 'Número Identificación','Nombres', 'Apellidos', 'Teléfono 1', 'Teléfono2', 'Teléfono 3',	'Correo Electrónico', 'Convocatoria','Fecha', 'Hora', 'Ruta', 'Código Curso', 'Curso',	'Código Modulo', 'Módulo', 'Salón', 'Matriculado Por');					

				$baseRowDatos = 5;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	

			$baseRow = 6;
			$columnRow= 0;
			$cont=0;
			$index=0;
			$bandera=0;
			$conexion->getPDO()->query("SET NAMES 'utf8'");
			$sql = "CALL SPREPORTEMATRICULASALAFECHA('".$fechaInicial."');";
			$rs=null;
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			if ($rs = $conexion->getPDO()->query($sql)) {
					if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						//$id=0;
						foreach ($filas as  $r =>$fila) {
							//$array[] = $fila;
							$columnRow=0;
							// $row = $baseRow	+ $r;
							$row = $baseRow	+ $cont;
							//$id=$id+1;
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['id']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['NumeroIdentificacion']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono3']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Fecha']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Hora']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CodigoCurso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CodigoModulo']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Salon']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['MatriculadoPor']);						
							
								if (($cont % 65530) == 0 and $cont > 0 )
								{
									//es el numero de hoja 
									$index++;
									$cont=0;
									$baseRow=1;
									//se crea la nueva hoja
									$nueva_hoja = $objPHPExcel->createSheet();
									//se activa la nueva hoja
									$objPHPExcel->setActiveSheetIndex($index); // marcar como activa la nueva hoja
									$nueva_hoja->setTitle('Nueva Hoja informe'); // definimos el titulo
									$dataColumnasDatos = array('Id', 'Número Identificación','Nombres', 'Apellidos', 'Teléfono 1', 'Teléfono2', 'Teléfono 3',	'Correo Electrónico', 'Convocatoria','Fecha', 'Hora', 'Ruta', 'Código Curso', 'Curso',	'Código Modulo', 'Módulo', 'Salón', 'Matriculado Por');					



									$baseRowDatos = 1;
									$columnDatos=0;

						
 
									  //$excel->getDefaultStyle()->applyFromArray($styleArray);
		
									foreach($dataColumnasDatos as $dataRow) {
										$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
										$columnDatos++;  


									}	
		
										$objPHPExcel->getActiveSheet()
										    ->getStyle('A1:S1')
										    ->getFill()
										    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
										    ->getStartColor()
										    ->setARGB('FFFFFF00');

										    
										 
										 $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(12);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(22);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(24);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('N')->setWidth(28);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('O')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('P')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('Q')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('R')->setWidth(20);
										 $objPHPExcel->getActiveSheet()->getColumnDimension('S')->setWidth(20);


								}
								$cont++;
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
							 $filename = '../anexos/reportes/reporteMatriculadosFecha_'.$FechaMod.'.xls';
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							 $data['html']=$filename;
							
				
        break;
		case 2:
				
        break;
		case 3:
				
				
		break;
		case 4:
			
			
        break;
		case 5:
				
        break;
		case 6:
				
        break;
		case 7:
				
        break;
	}
		
        echo json_encode($data);
  }
	
    
}

?>