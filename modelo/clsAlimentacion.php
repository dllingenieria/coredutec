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
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
        $sql = "CALL SPAGREGARALIMENTACION('$serializedAlimentacion',$usuario);";
        
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {               
                
                $filas = substr($filas[0]['pIdAlimentacion1'],1);
                $res = explode(",", $filas);
                foreach ($res as $resul) {
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
        $sql = "CALL SPAGREGARALIMENTACIONDETALLE('$serializedalimentacionD', $usuario);";
        if ($rs = $conexion->getPDO()->query($sql)) {
			$array = 1;
        } else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo()); die();
        }
        echo json_encode($array);
    }
	
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
        }
        echo json_encode($resultado);
    }


    // Devuelve los tipos de alimentación para ser cargados en el combo//
    public function cargarTipoAlimentacion($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
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
            } 
        echo json_encode($array);
    }

    //genera informe en archivo excel alimentación
    public function consultarReporteAlimentacion ($param){
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
        
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME AlIMENTACIÓN');
        //Array de Datos Columnas
        $dataColumnasDatos = array('Fecha Solicitud','Fecha Entrega','Sede donde se debe entregar','Número de refrigerios que solicita', 'Tipo de alimentación', 'Código del curso que está orientando actualmente ( Completo)', 'Hora Inicial','Hora Final','Nombre del curso que está dictando.', 'Nombre del módulo que está dictando',  'Nombre del docente que solicita los refrigerios', 'Tipo de Asignación','Observaciones: Reporte novedad sobre su solicitud', 'Número Celular', 'Estado', 'Sesion');                    
        
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
    if ($rs = $conexion->getPDO()->query($sql)) {
        if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
            $data['mensaje'] = 1;
            foreach ($filas as $r =>$fila) {
                $columnRow=0;
                $row = $baseRow + $r;

                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow, $row, $fila['FechaSolicitud']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Fecha']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Sede']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Cantidad']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Refrigerio']);  
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Salon']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['HoraInicial']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['HoraFinal']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Docente']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Convocatoria']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "");
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Estado']);
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Sesion']);
                 
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
         $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        
         $FechaMod=strtotime("now");
         $filename = '../anexos/reportes/reporteAlimentacion_'.$FechaMod.'.xls';
         $objWriter->save(str_replace('.php', '.xls', $filename));
         $data['html']=$filename;

            echo json_encode($data);

    }

    public function ArrayColummns($ini, $fin, $NoSesiones){
            //Array de Datos Columnas 
                    $dataColumnasDatos = array('Id','No', 'Apellidos', 'Nombres', 'Identificacion');         
                    $sesiones=(int)$NoSesiones; 
                    $int=$ini; 
                    $finInt=$fin; 
                    if($sesiones>0){ 
                        for($i=$ini; $i<=$finInt;$i++) { 
                            $sesion= "s".$i; 
                            array_push($dataColumnasDatos, $sesion); 
                            $int++; 
                        } 
                    } 
      
                    //array_push($dataColumnasDatos, 'T/Horas', 'Observaciones', '', 'Motivo no asistencia', '', 'Nota'); 

                return $dataColumnasDatos;

    }

      //Reporte Asistencias en excel//
  public function consultarReporteAlimentacionPorEstudiante($param){
    extract($param); 
    /** Inicializa libreria se copia igual **/
    define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />'); 
    date_default_timezone_set('America/Bogota'); 
    /** PHPExcel_IOFactory */ 
      
    require_once dirname(__FILE__) . '/../includes/PHPExcel/PHPExcel/IOFactory.php'; 
  
    /* 
     * To change this template, choose Tools | Templates 
     * and open the template in the editor. 
     */ 
  
    $cacheMethod = PHPExcel_CachedObjectStorageFactory:: cache_to_phpTemp; 
    $cacheSettings = array('memoryCacheSize ' => '8MB'); 
    PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings); 
  
  
    $sheetname = 'Informe';  
    $objReader = PHPExcel_IOFactory::createReader('Excel5'); 
    $objReader->setLoadSheetsOnly($sheetname); 
    $objReader->setLoadAllSheets(); 
  
  
    extract($param); 
    $data = array('error'=>0,'mensaje'=>'','html'=>''); 
    $sesiones=(int)$NoSesiones; 
  
    $objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateRefrigerios.xls"); 
    $objPHPExcel->setActiveSheetIndex(0); 
    $objPHPExcel->getActiveSheet()->getPageMargins()->setTop(0);  
    $objPHPExcel->getActiveSheet()->getPageMargins()->SetRight(0,4);  
    $objPHPExcel->getActiveSheet()->getPageMargins()->setLeft(0,4);  
    $objPHPExcel->getActiveSheet()->getPageMargins()->setBottom(0); 
    $objPHPExcel->getActiveSheet()->setCellValue('E9', $IdCurso."-".$Curso); 
    $objPHPExcel->getActiveSheet()->setCellValue('T9', $IdModulo."-".$Modulo); 
    $objPHPExcel->getActiveSheet()->setCellValue('E10', $DiasCurso." - ".$Horario); 
    $objPHPExcel->getActiveSheet()->setCellValue('T10', $Sede); 
    $objPHPExcel->getActiveSheet()->setCellValue('E11', $FechaInicial); 
    $objPHPExcel->getActiveSheet()->setCellValue('I11', $FechaFinal); 
    $objPHPExcel->getActiveSheet()->setCellValue('E12', $Salon); 
    $objPHPExcel->getActiveSheet()->setCellValue('L12', $sesiones); 
    $objPHPExcel->getActiveSheet()->setCellValue('R12', $Duracion); 
    $objPHPExcel->getActiveSheet()->setCellValue('T12', $Inscritos); 
    $objPHPExcel->getActiveSheet()->setCellValue('T11', $Docente); 
    $objPHPExcel->getActiveSheet()->setCellValue('H12', $Ruta); 
    $objPHPExcel->getActiveSheet()->setCellValue('V12', $CantidadAsistentes);
    $objPHPExcel->getActiveSheet()->setCellValue('X12', $EstudiantesGanando); 
                 
    $arrayMasSessiones=[];  
    $baseRowDatos = 15; 
    $columnDatos=0; 
    $inis=1;
    $fins=13;

    $dataColumnasDatos=$this->ArrayColummns($inis,$fins,$sesiones);

    foreach($dataColumnasDatos as $dataRow) { 
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);
        $columnDatos++;                     
    }    
             
    $hojaActual=0;   
    $objClonedWorksheet1 =  clone $objPHPExcel->getSheet(0); 
    $hojaActual=$hojaActual+1; 
    $objClonedWorksheet1->setTitle('Informe'.$hojaActual); 
    $objPHPExcel->addSheet($objClonedWorksheet1); 
    $objPHPExcel->setActiveSheetIndex($hojaActual);                       
  
    $baseRow = 16; 
    $columnRow= 0; 
    $rs = null;
    $conexion->getPDO()->query("SET NAMES 'utf8'"); 

    $sql = "CALL SPCONSULTARESTUDIANTESPORSALON1 ($idPreprogramacion);"; 
        if ($rs = $conexion->getPDO()->query($sql)) { 
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
            $data['mensaje'] = 1; 
            $Estudiantes= count($filas); 
            $Estudiantes1=count($filas); 
            $totalEstudiantes=0; 
            $varId=0;

            foreach ($filas as  $r =>$fila) { 
                $varId++;
                $columnRow=0; 
                $row = $baseRow + $totalEstudiantes;    
                
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila['IdTercero']);  
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $varId); 
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Apellidos']); 
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombres']); 
                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Identificacion']);                      
            
                $totalEstudiantes++;     

                if($totalEstudiantes>19){    
                        $hojaActual=$hojaActual+1; 
                        $objClonedWorksheet = clone $objPHPExcel->getSheet(0); 
                        $objClonedWorksheet->setTitle('Informe'.$hojaActual); 
                        $objPHPExcel->addSheet($objClonedWorksheet); 
                        $objPHPExcel->setActiveSheetIndex($hojaActual);      
                        $baseRow = 16; 
                        $columnRow= 0; 
                        $totalEstudiantes=0; 
                } 
            } 
 
                unset($rs); 
  
                $Estudiantes=$Estudiantes+16; 
                $sheetCount = ($objPHPExcel->getSheetCount())-1;
                   
                $typeSession="";
                if($sesiones!==0){ 
                    
                    if($sesiones>13){
                          $typeSession="1";
                          $sesiones=13;
                    } 

                    $ises=1;
                    $sheetCountIni=$sheetCount;

                    for($m=1;$m<=$sheetCount;$m++){ //inicio cantidad sheet 
                        if($typeSession=="1"){
                               $inis=14;
                               $fins=$inis+12;
                               $ahoraHojaActual=1;
                               $ahoraHojaActual= $ises+$sheetCount;
                               $objClonedWorksheet = clone $objPHPExcel->getSheet($m); 
                               $objClonedWorksheet->setTitle('Informe'.$ahoraHojaActual); 
                               $objPHPExcel->addSheet($objClonedWorksheet);                          
                               $dataColumnasDatos=$this->ArrayColummns($inis,$fins, $sesiones);
                               $objPHPExcel->setActiveSheetIndex($ahoraHojaActual); 
                               $baseRowDatos = 15; 
                               $columnDatos=0; 
                               $sheetCountIni= $sheetCountIni+1;
                               $objPHPExcel->getActiveSheet()->setCellValue('V14', $sheetCountIni); 
                               $sheetCountotal=$sheetCount*2;
                               $objPHPExcel->getActiveSheet()->setCellValue('X14', $sheetCountotal); 
                               
                               foreach($dataColumnasDatos as $dataRow) { 
                                       $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);      
                                        $columnDatos++;                     
                                }    
                             $arrayMasSessiones[]= $ahoraHojaActual;
                             $ises++;
                        }

                        if($typeSession=="1"){
                            $sheetCountotal=$sheetCount*2;
                        }else{
                            $sheetCountotal=$sheetCount;
                        }


                        $objPHPExcel->setActiveSheetIndex($m); 
                        $objPHPExcel->getActiveSheet()->setCellValue('V14', $m); 
                        $objPHPExcel->getActiveSheet()->setCellValue('X14', $sheetCountotal); 

                        for($i=16;$i<=35;$i++){     
                            $columnRow=4; 
                            $row = $i; 
                            $idTerceroAsistencia=$objPHPExcel->getActiveSheet()->getCell("A".$i)->getValue(); 
  

                            if($idTerceroAsistencia!=""){
                            //Cargar Asistencias por tercero y preprogramacion   
                            
                            $sql2 = "CALL SPCONSULTARREFRIGERIOSPORTERCERO($idPreprogramacion, $idTerceroAsistencia);"; 
                            if($rs2 = $conexion->getPDO()->query($sql2)){ 
                                if ($filasAsistencia = $rs2->fetchAll(PDO::FETCH_ASSOC)) { 
                                    

                                         $horasAsistidas="NA"; 
                                         for($j=1;$j<=$sesiones;$j++){     
                                             $sesion=0;             
                                                foreach ($filasAsistencia as $s =>$filaasis) {
                                                        if($filaasis['SesionNumero']==$j){ 
                                                                $sesion=1;
                                                                $horasAsistidas=$filaasis['Refrigerio']; 
                                                                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $horasAsistidas); 
                                                        }   

                                                                     
                                                }                                       
                                       
                                       if($sesion==0){
                                                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA"); 
                                        }       

                                         } 
  
                                            $totalSesionesFaltantes=13-$sesiones; 
                                            if($totalSesionesFaltantes>0){
                                                    for($k=1;$k<=$totalSesionesFaltantes;$k++){  
                                                        $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                                                                'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                                                                'startcolor' => array( 
                                                                     'rgb' => '8A7F7D' 
                                                                ) 
                                                            )); 
                                                    } 
                                             }
    
                                    unset($rs2); 
                                }else{ //filaAsistencia 
                                    unset($rs2); 

                                     for($j=1;$j<=$sesiones;$j++){   
                                        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA"); 
                                     } 
                                    


                                            $totalSesionesFaltantes=13-$sesiones; 
                                            //echo "<br>col".$columnRow; 
                                            if($totalSesionesFaltantes>0){
                                                    for($k=1;$k<=$totalSesionesFaltantes;$k++){  
                                                        //cellColor($row.$columnRow+1, 'F28A8C'); 
                                                        $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                                                                'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                                                                'startcolor' => array( 
                                                                     'rgb' => '8A7F7D' 
                                                                ) 
                                                            )); 
                                                    } 
                                             }

                                 $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, 0); 
                                      //echo "<br>ocl".$columnRow;
  
                                }//fin else 
                            }//fin $rs2 
                      
                        } 

                    }
                } 
            }//fin cantidad for countsheet 

     
  
                    }else{ 
                         $data['error']=2; 
                    } 
                    }else { 
                         $data['error'] = 0; 
                         print_r($conexion->getPDO()->errorInfo()); die(); 
                    }  

                            //validar si hay mas de 13 sesiones
            if(count($arrayMasSessiones)>0){
                //$Estudiantes=28;

                $Estudiantes1=$Estudiantes1+16; 
                $counse=count($arrayMasSessiones);
                $x=0;
                while ($x < $counse) { 
                    $arraySes= $arrayMasSessiones[$x];
                    $objPHPExcel->setActiveSheetIndex($arraySes);                   
                    $x++;
                
                        for($i=16;$i<=35;$i++){    
                            $sesion1=(int)$NoSesiones;
                            $totalSesionesFaltantes1=($sesion1-13);
                            $columnRow=4; 
                            $row = $i; 
                            $idTerceroAsistencia=$objPHPExcel->getActiveSheet()->getCell("A".$i)->getValue(); 
  
                            if($idTerceroAsistencia!=""){
                            //Cargar Asistencias por tercero y preprogramacion   
                            $sql2 = "CALL SPCONSULTARREFRIGERIOSPORTERCERO($idPreprogramacion, $idTerceroAsistencia);"; 
                            if($rs2 = $conexion->getPDO()->query($sql2)){ 
                                if ($filasAsistencia = $rs2->fetchAll(PDO::FETCH_ASSOC)) { 
                                       
                                            $horasAsistidas="NA"; 
                                         
                                         for($j=14;$j<=$sesion1;$j++){ 

                                                $sesion=0;  
                                                foreach ($filasAsistencia as $s =>$filaasis) { 
                                                    if($filaasis['SesionNumero']==$j){     
                                                            $sesion=1;
                                                                $horasAsistidas=$filaasis['Refrigerio']; 
                                                                    $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $horasAsistidas); 
                                              
                                                    }                                                
                                                } 
      
      
                                                                                    
                                       if($sesion==0){
                                                $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA"); 
                                               
                                        }       

                                         } 
  
                                           //echo  "totalfal".$totalSesionesFaltantes1=$sesiones-13; 
                                         if($totalSesionesFaltantes1>0){
                                              $totalSesionesFaltantes=13-$totalSesionesFaltantes1;
                                          }else{
                                              $totalSesionesFaltantes=0;
                                          }
                                          
                                            if($totalSesionesFaltantes>0){
                                                    for($k=1;$k<=$totalSesionesFaltantes;$k++){  
                                                        //cellColor($row.$columnRow+1, 'F28A8C'); 
                                                        $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                                                                'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                                                                'startcolor' => array( 
                                                                     'rgb' => '8A7F7D' 
                                                                ) 
                                                            )); 
                                                    } 
                                             }
  
  
                                         
  
                                    unset($rs2); 
                                }else{ //filaAsistencia 
                                      unset($rs2); 
                                      for($j=1;$j<=$totalSesionesFaltantes1;$j++){   
                                        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA"); 
                                     } 
  

                                        $totalSesionesFaltantes=13-$totalSesionesFaltantes1; 
                                            //echo "<br>col".$columnRow; 
                                            if($totalSesionesFaltantes>0){
                                                    for($k=1;$k<=$totalSesionesFaltantes;$k++){  
                                                        //cellColor($row.$columnRow+1, 'F28A8C'); 
                                                        $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                                                                'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                                                                'startcolor' => array( 
                                                                     'rgb' => '8A7F7D' 
                                                                ) 
                                                            )); 
                                                    } 
                                             }


                                   
                                     $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, 0); 
  
                                }//fin else 
                            }//fin $rs2 
                    
                 }

                }

             }

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
                             $sheetIndex = $objPHPExcel->getIndex($objPHPExcel-> getSheetByName('Informe')); 
                            $objPHPExcel->removeSheetByIndex($sheetIndex); 
                            $objPHPExcel->setActiveSheetIndex(0); 

                             $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5'); 
                             
                             $FechaMod=strtotime("now"); 
                             $filename = '../anexos/reportes/reporteAlimentacionEstudiante_'.$FechaMod.'.xls'; 
                             $objWriter->save(str_replace('.php', '.xls', $filename)); 
                             $data['html']=$filename;
  
          echo json_encode($data); 
    }

}
?>