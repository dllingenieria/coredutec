<?php
require("../controlador/session.php");
ini_set('memory_limit', '4024M');
set_time_limit(0);
/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);



class clsFacturacion {
    public function consultarReporte($param){
		
	define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
	date_default_timezone_set('Europe/London');
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
	$objReader->setLoadAllSheets();
	$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/template.xls");
	
        extract($param);
		$data = array('error'=>0,'mensaje'=>'','html'=>'');
		switch ($solicitarReporte) {
		case 1:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateDefault.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe Programa 40 Mil Primeros Empleos Detallado');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('CONSECUTIVO', 'NÚMERO IDENTIFICACIÓN', 'APELLIDOS COMPLETOS', 'NOMBRES COMPLETOS', 'FECHA MATRICULA', 'MES ASIGNACIÓN', 'TIPO DE IDENTIFICACIÓN', 'LUGAR DE EXPEDICIÓN', 'SEXO', 'ESTADO CIVIL', 'TELÉFONO 1', 'TELÉFONO 2', 'CORREO ELECTRÓNICO', 'EDAD (AÑOS)', 'GRADO DE ESCOLARIDAD', 'LOCALIDAD', 'AGENCIA EMPLEO REMITENTE','TIPO DE ASIGNACIÓN', 'TIPO DE FORMACIÓN', 'ÁREA OCUPACIONAL', 'CÓDIGO DEL SERVICIO FOSFEC', 'FOLIO', 'TICS', 'RUTA DE FORMACIÓN AGENCIA', 'NOMBRE CURSO INICIAL AGENCIA', 'RUTA CET N°', 'NOMBRE CURSO MATRICULADO CET' ,'* NOVEDADES *', 'DURACIÓN CURSO (TOTAL HORAS)', 'NOTA MÓDULO (PV)', 'NOTA MÓDULO (CO)','NOTA MÓDULO (SC)', 'NOTA MÓDULO (TIC)', 'TOTAL HORAS ASISTIDAS','PORCENTAJE ASISTENCIA TOTAL');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AI6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('A9F5A9');

				$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);

				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	


				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/40milDetalle_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
		case 2:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateDefault.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe Agencias Detallado');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				
				/*
				$dataColumnasDatos = array('Consecutivo', 'Agencia de Gestión y Colocación', 'Nombre del Curso', 'Código Módulo', 'Nombre del Módulo', 'Tipo de Formación', 'Institución que ofrece el curso de capacitación', 'Área de Desempeño', 'Duración total en horas', 'Área de Desempeño', 'Duración total en horas', 'Fecha de inicio del curso', 'Fecha de finalización del curso', 'Número Beneficiarios del seguro de desempleo inscritos en el curso', 'Numero de desempleados que no accedieron al subsidio de desempleo y se incribieron a este curso', 'Total Personas incritas', 'Número de Personas que finalizan','Certificación Emitida', 'Costo Total en matrícula de este curso', 'Costo Total en matrícula de este curso', 'Costo Total de este Curso de Capacitación');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				*/

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AH6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('81BEF7');

				//$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);
				//$objPHPExcel->getActiveSheet()->getRowDimension('6')->setRowHeight(40);

				/*
				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	
				*/

				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/informeAgenciasDetalle_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
		case 3:
				
				$objPHPExcel->getActiveSheet()->setCellValue('D3', PHPExcel_Shared_Date::PHPToExcel(time()));

				///Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatosPersonales = array('CONSECUTIVO CET', 'NÚMERO IDENTIFICACIÓN', 'MES ASIGNACIÓN',	'TIPO DE ASIGNACIÓN', 'AGENCIA', 'TIPO DE IDENTIFICACIÓN', 'LUGAR DE EXPEDICIÓN', 'APELLIDOS COMPLETOS', 'NOMBRES COMPLETOS', 'PHONE 1', 'PHONE 2', 'E-MAIL', 'RUTA DE FORMACIÓN', 'CÓDIGO RUTA-CURSO', 'NOMBRE DE CURSO', 'FECHA MATRÍCULA');
				$dataColumnasMeses = array('Mes 1',	'Mes 2',	'Mes 3',	'Mes 4',	'Mes 5',	'Mes 6',	'Mes 7',	'Mes 8',	'Mes 9',	'Mes 10',	'Mes 11',	'Mes 12',	'Mes 13',	'Mes 14',	'Mes 15',	'Mes 16',	'Mes 17',	'Mes 18',	'Mes 19',	'Mes 20',	'Mes 21',	'Mes 22',	'Mes 23',	'Mes 24',	'Mes 25',	'Mes 26',	'Mes 27','Mes 28','Mes 29','Mes 30','Mes 31','Mes 32','Mes 33','Mes 34','Mes 35','Mes 36','Estado Actual', 'Observaciones');	
							
				$baseRowDatosPersonales = 5;
				$columnDatosPersonales=0;
				foreach($dataColumnasDatosPersonales as $dataRow) {
					//$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatosPersonales, $baseRowDatosPersonales, $dataRow);     
					$columnDatosPersonales++;                    
				}	

				$baseRowMeses = 5;
				$columnMeses=16;
				foreach($dataColumnasMeses as $dataRow) {
					//$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					$columnMeses++;                    
				}
					
				$baseRow = 6;
				$columnRow=0;
			$rs = null;
			$conexion->getPDO()->query("SET NAMES 'utf8'");
			//$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			//print_r($sql);
			if ($rs = $conexion->getPDO()->query($sql)) {
					if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						foreach ($filas as  $r =>$fila) {
							//$array[] = $fila;
							$columnRow=0;
							$row = $baseRow	+ $r;
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							//$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							//---

											
							$styleArray = array(
											      'borders' => array(
											          'allborders' => array(
											              'style' => PHPExcel_Style_Border::BORDER_THIN
											          )
											      )
											  );
							$objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							////////////////////////////////////////	
							$rs = null;
							$conexion->getPDO()->query("SET NAMES 'utf8'");
							$sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							//print_r($sql);
							if ($rs = $conexion->getPDO()->query($sql)) {
								if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									$ultimoEstado="";
									$columnRowMes=16;
									if(count($dataMeses)>0){
										//$columnRowMes=16;
										foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											$ultimoEstado=$dataRowMes['Nombre'];
											$objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											$columnRowMes++;

											$styleArray = array(
											      'borders' => array(
											          'allborders' => array(
											              'style' => PHPExcel_Style_Border::BORDER_THIN
											          )
											      )
											  );
											$objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										}
									}
									else{
										$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										$styleArray = array(
									      'borders' => array(
									          'allborders' => array(
									              'style' => PHPExcel_Style_Border::BORDER_THIN
									          )
									      )
									  );
										$objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									}
								}
							} else {
								$data['error'] = 0;
								print_r($conexion->getPDO()->errorInfo()); die();
							}	
							//--				
						}	

							
							
							//foreach externo
							//$objPHPExcel->getActiveSheet()->removeRow($baseRow-1,1);
							$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
							
							$FechaMod=strtotime("now");
							$filename = '../tmp/reporteAsistencias/asistencias_'.$FechaMod.'.xls';
							$objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							
					}
					else{
						$data['error']=2;
					}
			} else {
				$data['error'] = 0;
				print_r($conexion->getPDO()->errorInfo()); die();
			}
		break;
		case 4:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateFacturacion.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe de Facturación Detallado');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('CONSECUTIVO', 'NÚMERO IDENTIFICACIÓN', 'APELLIDOS COMPLETOS', 'NOMBRES COMPLETOS', 'MES FACTURACIÓN', 'AGENCIA DE GESTIÓN Y COLOCACIÓN', 'FOLIO MATRÍCULAS / ASISTENCIAS', 'FECHA ASIGNACIÓN','RUTA DE FORMACIÓN', 'CÓDIGO DEL CURSO', 'CAPACITACIÓN', 'CÓDIGO MÓDULO', 'MÓDULO','HORAS ASISTIDAS', 'NOTA FINAL MÓDULO/CURSO', 'FINALIZADOS / NO FINALIZADOS', 'CÓDIGO MATRICULADO', 'CÓDIGO FACTURACIÓN', 'SALÓN', 'SEDE EJECUCIÓN','FECHA INICIO', 'FECHA FINALIZACIÓN', 'VALIDACIÓN COBRO', 'TIPO FACTURACIÓN');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);

				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	
					
				$baseRow = 7;
				$columnRow=0;
			$rs = null;
			$conexion->getPDO()->query("SET NAMES 'utf8'");
			$sql = "CALL SPREPORTEFACTURACIONDETALLE('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			if ($rs = $conexion->getPDO()->query($sql)) {
					if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
							foreach ($filas as  $r =>$fila) {
								$array[] = $fila;
								$columnRow=0;
								$row = $baseRow	+ $r;
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['ModuloNombre']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "0");
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['NotaDefinitiva']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Estado']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "");
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "");
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Salon']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Sede']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaInicial']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaFinal']);
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "");
								$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['MatriculadoEn']);
						
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
							 $filename = '../tmp/reporteAsistencias/facturacionDetalle_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
			
        break;
		case 5:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateDefault.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe 057');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('Consecutivo', 'Agencia de Gestión y Colocación', 'Código del Curso', 'Nombre del Curso', 'Código Módulo', 'Nombre del Módulo', 'Tipo de Formación', 'Institución que ofrece el curso de capacitación', 'Área de Desempeño', 'Duración total en horas', 'Fecha de inicio del curso', 'Fecha de finalización del curso', 'Número Beneficiarios del seguro de desempleo inscritos en el curso', 'Numero de desempleados que no accedieron al subsidio de desempleo y se incribieron a este curso', 'Total Personas incritas', 'Número de Personas que finalizan','Certificación Emitida', 'Costo Total en matrícula de este curso', 'Otros Costos asociados al curso de Capacitación
(Dotaciones, refrigerios, etc)', 'Costo Total de este Curso de Capacitación');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AH6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('D8F781');

				$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);
				$objPHPExcel->getActiveSheet()->getRowDimension('6')->setRowHeight(40);

				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	


				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/informe057_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
		case 6:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateDefault.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe Resolución 4547');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('Radicado', 'Tipo de Dato Novedad o Correción', 'Tipo de Identificación', 'Número de Identificación del Cesante', 'Apellidos Completos', 'Nombres Completos', 'Sexo', 'Curso de Capacitación', 'Tipo de Capacitación al que Asiste o Asistió el Cesante', 'Nombre del Curso de Capacitación al que Asiste o Asistió el Cesante (*información cet)', 'Fecha de Inicio del Curso de Capacitación', 'Fecha de Finalización del Curso de Capacitación', 'Duración de Curso de Capacitación', 'Estado de Asistencia al Curso de Capacitación', 'Institución Curso de Capacitación', 'Asistencia a Servicios de Gestión de la Agencia de Empleo', 'Remisión a Vacante','Colocación');
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AH6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('F7BE81');

				$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);
				$objPHPExcel->getActiveSheet()->getRowDimension('6')->setRowHeight(40);

				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	


				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/InformeResolucion4547_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
		case 7:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateDefault.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe Registro de Detalle Capacitación');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('Nivel de Registro', 'Tipo de identificación del beneficiario', 'Número de identificación del beneficiario', 'Inscripción Capacitación', 'Descartó o no Culminó Formación', 'No Asistió 80%', 'Fecha Terminación Capacitación');
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AH6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('81F7D8');

				$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);
				//$objPHPExcel->getActiveSheet()->getRowDimension('6')->setRowHeight(40);

				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	


				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/InformeSAP_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
	}
		
        echo json_encode($data);
  }
	
	public function consultarReporteConsolidado($param){
		
		define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
		date_default_timezone_set('Europe/London');
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
		$objReader->setLoadAllSheets();
		$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateAsistenteConsolidado.xls");
		

		extract($param);
		$data = array('error'=>0,'mensaje'=>'','html'=>'');	
		switch ($solicitarReporte) {
		case 1:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateMilConsolidado.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe Programa 40 Mil Primeros Empleos Consolidado');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				/*$dataColumnasDatos = array('CONSECUTIVO', 'NÚMERO IDENTIFICACIÓN', 'APELLIDOS COMPLETOS', 'NOMBRES COMPLETOS', 'FECHA MATRICULA', 'MES ASIGNACIÓN', 'TIPO DE IDENTIFICACIÓN', 'LUGAR DE EXPEDICIÓN', 'SEXO', 'ESTADO CIVIL', 'TELÉFONO 1', 'TELÉFONO 2', 'CORREO ELECTRÓNICO', 'EDAD (AÑOS)', 'GRADO DE ESCOLARIDAD', 'LOCALIDAD', 'AGENCIA EMPLEO REMITENTE','TIPO DE ASIGNACIÓN', 'TIPO DE FORMACIÓN', 'ÁREA OCUPACIONAL', 'CÓDIGO DEL SERVICIO FOSFEC', 'FOLIO', 'TICS', 'RUTA DE FORMACIÓN AGENCIA','RUTA CET N°', 'NOMBRE CURSO MATRICULADO CET', '* NOVEDADES *', 'DURACIÓN CURSO (TOTAL HORAS)', 'NOTA MÓDULO (PV)', 'NOTA MÓDULO (CO)','NOTA MÓDULO (SC)', 'NOTA MÓDULO (SC)', 'TOTAL HORAS ASISTIDAS','PORCENTAJE ASISTENCIA TOTAL');		
				*/			
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AH6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('F2F2F2');

				$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);

				/*
				$baseRowDatos = 6;
				$columnDatos=0;
				
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	
				*/

				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/40milConsolidado_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
		case 2:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateDefault.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe Agencias Consolidado');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				
				/*
				$dataColumnasDatos = array('Consecutivo', 'Agencia de Gestión y Colocación', 'Nombre del Curso', 'Código Módulo', 'Nombre del Módulo', 'Tipo de Formación', 'Institución que ofrece el curso de capacitación', 'Área de Desempeño', 'Duración total en horas', 'Área de Desempeño', 'Duración total en horas', 'Fecha de inicio del curso', 'Fecha de finalización del curso', 'Número Beneficiarios del seguro de desempleo inscritos en el curso', 'Numero de desempleados que no accedieron al subsidio de desempleo y se incribieron a este curso', 'Total Personas incritas', 'Número de Personas que finalizan','Certificación Emitida', 'Costo Total en matrícula de este curso', 'Costo Total en matrícula de este curso', 'Costo Total de este Curso de Capacitación');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
				}

				*/

				$objPHPExcel->getActiveSheet()
						    ->getStyle('A6:AH6')
						    ->getFill()
						    ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
						    ->getStartColor()
						    ->setARGB('DCE6F1');


				//$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);
				//$objPHPExcel->getActiveSheet()->getRowDimension('6')->setRowHeight(40);

				/*
				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	
				*/

				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/informeAgenciasConsolidado_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
							
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
        break;
		case 3:
					$fecha= explode("-", $fechaInicial);
					$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}
					
					
					$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre', '13'=>'Acumulado');
					$objPHPExcel->getActiveSheet()->setCellValue('D4', PHPExcel_Shared_Date::PHPToExcel(time()));
					
					//se busca el mes en el array para ponerlo en el encabezado
					if (array_key_exists($mes, $meses)) {
						$dataColumnasDatosMeses = array($meses[$mes]);
					}
					
					$dataColumnasDatosTotalMatriculas = array();
					//$dataMesesConsolidados= array('6','7','8','9','10','11','12', 'Acumulado');
							
					$baseRowMeses = 6;
					$columnMeses=1;
					foreach($dataColumnasDatosMeses as $dataRow) {
						//$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
						$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
						$columnMeses++;                    
					}	
					
					$baseRowDatos = 6;
					$columnDatos=1;
					
					/*foreach($dataColumnasDatosTotalMatriculas as $dataRow) {
						//$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
						$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
						$columnDatos++;                    
					}*/
						
					$baseRowDatos = 7;
					$columnDatos=0;
					$acumulado=0;
					for ($i=$mes-1; $i<=count($meses); $i++){
						$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $meses[$i]); 
						$baseRowDatos++;
						$acumulado++;
					}
					$acumulado=$acumulado+6;
					$acumuladoTotal=$acumulado-1;
					$objPHPExcel->getActiveSheet()->setCellValue('B'.$acumulado, '=SUM(B8:B'.$acumuladoTotal.')');
					
					$row = 7;
					$columnRow=1;
				$rs = null;
				 $conexion->getPDO()->query("SET NAMES 'utf8'");

				$sql = "CALL SPREPORTEASISTENCIACONSOLIDADO('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
				 //print_r($sql);
				if ($rs = $conexion->getPDO()->query($sql)) {
						 if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
							 $data['mensaje'] = 1;
							foreach ($filas as  $r =>$fila) {
									// //$array[] = $fila;
									// $columnRow=0;
									//$row = $baseRow	+ $r;
									$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, $fila['Cantidad']);
									$row++;
							}
						 }
						else{
						$data['error']=2;
						}
				}
				else {
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
								$filename = '../tmp/reporteAsistencias/asistenciasConsolidado_'.$FechaMod.'.xls';
								//chmod($filename, 0777);
								$objWriter->save(str_replace('.php', '.xls', $filename));
								$data['html']=$filename;
								
			break;
		case 4:
				$objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateFacturacion.xls");
				$objPHPExcel->getActiveSheet()->setCellValue('D2', PHPExcel_Shared_Date::PHPToExcel(time()));
				
				$fecha= explode("-", $fechaInicial);
				$mes=$fecha[1];
					if ($mes < 10){
						$mes= substr($mes,1);
					}

				$objPHPExcel->getActiveSheet()->setCellValue('C1', 'Informe de Facturación Consolidado');
				//Array de Datos Columnas
				//echo date('H:i:s') , " Add new data to the template" , EOL;
				$dataColumnasDatos = array('CONSECUTIVO','GRUPO A FACTURAR', '# OFERENTES', 'RUTA DE FORMACIÓN', 'SOPORTE ENTREGADO', 'CRITERIO FACTURACIÓN', 'CÓDIGO CURSO (SISTEMA)', 'VALOR INICIAL', 'VALOR TOTAL');					
				$meses = array('1'=>'Enero','2'=>'Febrero','3'=>'Marzo','4'=>'Abril','5'=>'Mayo','6'=>'Junio','7'=>'Julio','8'=>'Agosto','9'=>'Septiembre','10'=>'Octubre','11'=>'Noviembre','12'=>'Diciembre');

				if (array_key_exists($mes, $meses)) {
						$dataColumnasDastosMeses = array($meses[$mes]);
				}

				//$objPHPExcel->getActiveSheet()->setCellValue('D3', $dataColumnasDatosMeses[0]);
				$objPHPExcel->getActiveSheet()->setCellValue('D4', $convocatoria);

				$baseRowDatos = 6;
				$columnDatos=0;
				foreach($dataColumnasDatos as $dataRow) {
					$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
					$columnDatos++;                    
				}	

				// $baseRowMeses = 5;
				// $columnMeses=16;
				// foreach($dataColumnasMeses as $dataRow) {
					// //$objPHPExcel->getActiveSheet()->insertNewRowBefore($dataRow,1);
					// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnMeses, $baseRowMeses, $dataRow);     
					// $columnMeses++;                    
				// }
					
				// $baseRow = 7;
				// $columnRow=0;
	
			// $conexion->getPDO()->query("SET NAMES 'utf8'");
			// //$sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."');";
			// $sql = "CALL SPREPORTEASISTENCIADETALLE1('".$fechaInicial."','".$fechaFinal."',".$convocatoria.");";
			// //print_r($sql);
			// if ($rs = $conexion->getPDO()->query($sql)) {
					// if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data['mensaje'] = 1;
						// foreach ($filas as  $r =>$fila) {
							// //$array[] = $fila;
							// $columnRow=0;
							// $row = $baseRow	+ $r;
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['Matricula']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['numeroIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaAsignacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Agencia']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['TipoIdentificacion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['LugarExpedicion']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Ruta']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CursoNombre']);
							// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaMatricula']);
							// //$objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow, $row, '=C'.$row.'*D'.$row);
							// //---

											
							// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
							// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

							// ////////////////////////////////////////	

							// $conexion->getPDO()->query("SET NAMES 'utf8'");
							// $sql = "CALL SPREPORTEASISTENCIADETALLE2(".$fila['Id'].");";
							// //print_r($sql);
							// if ($rs = $conexion->getPDO()->query($sql)) {
								// if ($dataMeses = $rs->fetchAll(PDO::FETCH_ASSOC)) {
									// $ultimoEstado="";
									// $columnRowMes=16;
									// if(count($dataMeses)>0){
										// //$columnRowMes=16;
										// foreach($dataMeses as $s =>$dataRowMes) { //print_r($dataRowMes);
											// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, $dataRowMes['Nombre']);
											// $ultimoEstado=$dataRowMes['Nombre'];
											// $objPHPExcel->getActiveSheet()->setCellValue('BA' . $row, $ultimoEstado);
											// $columnRowMes++;

											// $styleArray = array(
											      // 'borders' => array(
											          // 'allborders' => array(
											              // 'style' => PHPExcel_Style_Border::BORDER_THIN
											          // )
											      // )
											  // );
											// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);
										// }
									// }
									// else{
										// $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRowMes=$columnRowMes, $row, 'NA');
										// $styleArray = array(
									      // 'borders' => array(
									          // 'allborders' => array(
									              // 'style' => PHPExcel_Style_Border::BORDER_THIN
									          // )
									      // )
									  // );
										// $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray);

									// }
								// }
							// } else {
								// $data['error'] = 0;
								// print_r($conexion->getPDO()->errorInfo()); die();
							// }	
							// //--				
						// }	

							
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
							 $filename = '../tmp/reporteAsistencias/facturacionConsolidado_'.$FechaMod.'.xls';
							//chmod($filename, 0777);
							 $objWriter->save(str_replace('.php', '.xls', $filename));
							$data['html']=$filename;
							//$data['html']="hola";
					// }
					// else{
						// $data['error']=2;
					// }
			// } else {
				// $data['error'] = 0;
				// print_r($conexion->getPDO()->errorInfo()); die();
			// } 
			break;
		case 5:
			$data['mensaje'] = 1;
			$data['html']="hola";
		break;
		case 6:
			$data['mensaje'] = 1;
			$data['html']="hola";
        break;
		case 7:
			$data['mensaje'] = 1;
			$data['html']="hola";
        break;
		}
		
        echo json_encode($data);
    }    
    
}

?>