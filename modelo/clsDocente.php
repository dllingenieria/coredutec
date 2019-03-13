<?php
require("../controlador/session.php");
set_time_limit(0);
class clsDocente {
    public function actualizarDocentes($param){
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $resp = 'ok';
        //sleep(2);
        foreach ($datos as $d) {
            if($d[0] != ''){
                $conexion->getPDO()->query("SET NAMES 'utf8'"); 
                   
                $sql = "CALL SPMODIFICARDOCENTE($d[0],'$d[1]',$d[2],$d[3],$d[4],$d[5],$d[6],'$d[7]','$d[8]','$d[9]',$d[10],
                                               $d[11],$d[12],$d[13],$d[14],$d[15],'$d[16]','$d[17]',$d[18],'$d[19]',
                                               '$d[20]',$IdUsuario);";
                //echo $sql;
                if (!$rs = $conexion->getPDO()->query($sql)){
                    $resp = 'fail';
                }
            }
            
        }
        echo json_encode($resp);
    }

    public function consultarDocentes($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        // $sql = "CALL SPCARGARDOCENTES();"; 
        $sql = "CALL SPCARGARDOCENTES('$codModuSel');"; 
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)){
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function CargarInformacionCompletaDocente($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARDOCENTES1();";        
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

    public function consultarDocentesEntreFechas($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDOCENTESPORHORARIOCURSO ($idHorarioCurso, '$fechaInicial','$fechaFinal');";
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

    public function cargarModulosDisponibles($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARMODULOSDISPONIBLES($IdDocente);";        
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

    public function cargarModulosAsignados($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARMODULOSASIGNADOS($IdDocente);";        
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

    public function actualizarDocenteDicta($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPACTUALIZARDOCENTEDICTA('$CodigoModulo',$IdDocente,$Bandera);";
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

    public function ConsultarModulosPorDocente($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMODULOSPORDOCENTE2($IdDocente,'$Anio');";
	
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
				// foreach ($filas as $fila) {
                    // $array[] = $fila;
                // }
            }
        } else {
            $registro = 0; print_r($conexion->getPDO()->errorInfo()); die();
        }
		
		//print_r($filas);
        echo json_encode($resultado);
    }

    //----- Trae la lista de los modulos finalizados, por certificar y certificados por Docente -----//
    public function ConsultarModulosPorDocenteCerrados($param) {
        extract($param);
        $rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARMODULOSCERRADOSPORDOCENTE($IdDocente,'$Anio');";
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
                            $fecha = $dias[date('N', strtotime($fechamostrar))];
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
                      $array[] = $NoSesion;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function agregarEvaluacion($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
		// $descripcionSatisfaccion = utf8_encode($descripcionSatisfaccion);
		// $descripcionServicio = utf8_encode($descripcionServicio);
		// $aspectosPositivos = utf8_encode($aspectosPositivos);
		// $aspectosParaMejorar = utf8_encode($aspectosParaMejorar);
        $sql = "CALL SPAGREGAREVALUACION($docente,'$satisfaccion', '$descripcionSatisfaccion', '$descripcionServicio',
        '$aspectosPositivos', '$aspectosParaMejorar', '$claridad',
        '$metodologia', '$contenidos', '$material',
        '$instalaciones', '$objetivos', '$tiempos','$codigo', $idTercero);";
        // push($array, $sql); si se devuelve >0 si inserto
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo()); die();
        }
        // echo $sql;
        // $arrayName = array('sql' => $sql);
        echo json_encode($array);
    }
	
	function codificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
        return $aux;
    }

    public function ConsultarPreprogramacionesActivas($param) {
       extract($param);
       $resultado = array();
       $registro = array();
       $conexion->getPDO()->query("SET NAMES 'utf8'");
       $sql = "CALL SPCONSULTARMODULOSACTIVOSHOY()";
       //$sql = "CALL SPCONSULTARMODULOSPORDOCENTE2($IdDocente, '$salon');";
   
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
               // foreach ($filas as $fila) {
                   // $array[] = $fila;
               // }
           }
       } else {
           $registro = 0; print_r($conexion->getPDO()->errorInfo()); die();
       }
       
       //print_r($filas);
       echo json_encode($resultado);
   }

   //----- Consulta los refrigerio por Salon -----//
    public function consultarReporteAlimentacionPorSalon($param) {
        extract($param);
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPREPORTEALIMENTACIONPORPREPROGRAMACION($idpreprogramacion)";
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

    //----- Reporte Notas y Estados por Salon Cerrado//
    public function consultarReporteNotasyEstadosporSalon($param){
      extract($param); 
      define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />'); 
      date_default_timezone_set('America/Bogota'); 
      require_once dirname(__FILE__) . '/../includes/PHPExcel/PHPExcel/IOFactory.php'; 
      $cacheMethod = PHPExcel_CachedObjectStorageFactory:: cache_to_phpTemp; 
      $cacheSettings = array('memoryCacheSize ' => '8MB'); 
      PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings); 
      $sheetname = 'Reporte Notas y Estado';  
      $objReader = PHPExcel_IOFactory::createReader('Excel5'); 
      $objReader->setLoadSheetsOnly($sheetname); 
      $objReader->setLoadAllSheets(); 
      extract($param); 
      $data = array('error'=>0,'mensaje'=>'','html'=>''); 
      $sesiones=(int)$NoSesiones; 
      $objPHPExcel = $objReader->load("../includes/PHPExcel/PHPExcel/Templates/templateEstadosyNotas.xls"); 
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
      $objPHPExcel->getActiveSheet()->setCellValue('L12', $NoSesiones); 
      $objPHPExcel->getActiveSheet()->setCellValue('R12', $Duracion); 
      $objPHPExcel->getActiveSheet()->setCellValue('T12', $Inscritos); 
      $objPHPExcel->getActiveSheet()->setCellValue('T11', $Docente); 
      $objPHPExcel->getActiveSheet()->setCellValue('H12', $Ruta); 
      $objPHPExcel->getActiveSheet()->setCellValue('V12', $CantidadAsistentes);
      $objPHPExcel->getActiveSheet()->setCellValue('X12', $EstudiantesGanando);
      $objPHPExcel->getActiveSheet()->setCellValue('I15', 'Nota Definitiva');
      $arrayMasSessiones=[];  
      $baseRowDatos = 15; 
      $columnDatos=0; 
      $inis=1;
      $fins=13;
      $dataColumnasDatos=$this->ArrayColummns($inis,$fins);
      foreach($dataColumnasDatos as $dataRow) { 
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);
        $columnDatos++;                     
      }   
      $hojaActual=0;   
      $objClonedWorksheet1 =  clone $objPHPExcel->getSheet(0); 
      $hojaActual=$hojaActual+1; 
      $objClonedWorksheet1->setTitle('Reporte Notas y Estado'.$hojaActual); 
      $objPHPExcel->addSheet($objClonedWorksheet1); 
      $objPHPExcel->setActiveSheetIndex($hojaActual);
      $baseRow = 16; 
      $columnRow= 0; 
      $rs = null;
      $conexion->getPDO()->query("SET NAMES 'utf8'");
      $sql = "CALL SPCONSULTARESTUDIANTESPORSALON1 ($idPreprogramacion);"; 
      if ($rs = $conexion->getPDO()->query($sql)) { 
        if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)){ 
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
              $objClonedWorksheet->setTitle('Reporte Notas y Estado'.$hojaActual); 
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
            if($NoSesiones!==0){
              if($NoSesiones>13){
                $typeSession="1";
                $NoSesiones=13;
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
                  $objClonedWorksheet->setTitle('Reporte Notas y Estado'.$ahoraHojaActual);
                  $objPHPExcel->addSheet($objClonedWorksheet);                          
                  $dataColumnasDatos=$this->ArrayColummns($inis,$fins, $NoSesiones);
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
                $totalEstudiantes=0;
                for($i=16;$i<=35;$i++){ 
                  $columnRow=4; 
                  $row = $i; 
                  $idTercero=$objPHPExcel->getActiveSheet()->getCell("A".$i)->getValue(); 
                  if($idTercero!=""){
                    //Cargar notas definitivas y estados por tercero y preprogramacion   
                    $sql3 = "CALL SPCONSULTARNOTASYESTADOSPORTERCEROYSALON($idPreprogramacion, $idTercero);"; 
                    if($rs3 = $conexion->getPDO()->query($sql3)){ 
                      if ($filas1 = $rs3->fetchAll(PDO::FETCH_ASSOC)){
                        $Estudiantes= count($filas1); 
                        $Estudiantes1=count($filas1); 
                        $row = $baseRow + $totalEstudiantes;
                        foreach ($filas1 as  $r =>$fila1) {
                          $columnRow=5; 
                          $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow,   $row, $fila1['Estado']);  
                          $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+3, $row, $fila1['NotaDefinitiva']); 
                          $totalEstudiantes++;
                          if($totalEstudiantes>19){    
                            $hojaActual=$hojaActual+1; 
                            $objClonedWorksheet = clone $objPHPExcel->getSheet(0); 
                            $objClonedWorksheet->setTitle('Reporte Notas y Estado'.$hojaActual); 
                            $objPHPExcel->addSheet($objClonedWorksheet); 
                            $objPHPExcel->setActiveSheetIndex($hojaActual);      
                            $baseRow = 16; 
                            $columnRow= 0; 
                            $totalEstudiantes=0;
                          }
                        }
                        $totalSesionesFaltantes=13-$NoSesiones; 
                        if($totalSesionesFaltantes>0){
                          for($k=1;$k<=$totalSesionesFaltantes;$k++){  
                            $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                            'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                            'startcolor' => array('rgb' => '8A7F7D'))); 
                          } 
                        }
                        unset($rs3); 
                      }else{ //filaAsistencia 
                        unset($rs3); 
                        for($j=1;$j<=$NoSesiones;$j++){   
                          $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA"); 
                        }
                        $totalSesionesFaltantes=13-$NoSesiones;
                        if($totalSesionesFaltantes>0){
                          for($k=1;$k<=$totalSesionesFaltantes;$k++){ 
                            $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                            'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                            'startcolor' => array( 'rgb' => '8A7F7D'))); 
                          } 
                        }
                        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, 0); 
                      }//fin else 
                    }//fin $rs2 
                  } 
                }
              }//fin cantidad for countsheet 
            //}
        }else{ 
          $data['error']=2; 
        }
      }else{ 
        $data['error'] = 0; 
        print_r($conexion->getPDO()->errorInfo()); die(); 
      } 
        //validar si hay mas de 13 sesiones
        if(count($arrayMasSessiones)>0){
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
              $idTercero=$objPHPExcel->getActiveSheet()->getCell("A".$i)->getValue(); 
              if($idTercero!=""){
                //Cargar Asistencias por tercero y preprogramacion   
                $sql3 = "CALL SPCONSULTARNOTASYESTADOSPORTERCEROYSALON($idPreprogramacion, $idTercero);"; 
                if($rs3 = $conexion->getPDO()->query($sql3)){ 
                    if ($filas1 = $rs3->fetchAll(PDO::FETCH_ASSOC)){
                      foreach ($filas1 as $s =>$fila1) { 
                        $horasAsistidas=$fila1['Estado'];
                        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $horasAsistidas);
                      }
                      if($totalSesionesFaltantes1>0){
                        $totalSesionesFaltantes=13-$totalSesionesFaltantes1;
                      }else{
                        $totalSesionesFaltantes=0;
                      }        
                      if($totalSesionesFaltantes>0){
                        for($k=1;$k<=$totalSesionesFaltantes;$k++){
                          $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                          'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                          'startcolor' => array('rgb' => '8A7F7D'))); 
                        } 
                      }
                      unset($rs3); 
                    }else{ //filaAsistencia 
                      unset($rs3); 
                      for($j=1;$j<=$totalSesionesFaltantes1;$j++){   
                        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, "NA"); 
                      }
                      $totalSesionesFaltantes=13-$totalSesionesFaltantes1; 
                      if($totalSesionesFaltantes>0){
                        for($k=1;$k<=$totalSesionesFaltantes;$k++){
                          $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($columnRow=$columnRow+1, $row)->getFill()->applyFromArray(array( 
                          'type' => PHPExcel_Style_Fill::FILL_SOLID, 
                          'startcolor' => array('rgb' => '8A7F7D'))); 
                        } 
                      }
                      $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, 0); 
                    }//fin else 
                }//fin $rs2 
              }
            }
          }
        }
        $styleArray = array('borders' => array('allborders' => array('style' => PHPExcel_Style_Border::BORDER_THIN))); 
        $objPHPExcel->getDefaultStyle()->applyFromArray($styleArray); 
        //foreach externo 
        $sheetIndex = $objPHPExcel->getIndex($objPHPExcel-> getSheetByName('Informe'));
        $objPHPExcel->removeSheetByIndex($sheetIndex); 
        $objPHPExcel->setActiveSheetIndex(0); 
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5'); 
        $FechaMod=strtotime("now"); 
        $filename = '../anexos/reportes/reporteNotasyEstados_'.$FechaMod.'.xls'; 
        $objWriter->save(str_replace('.php', '.xls', $filename)); 
        $data['html']=$filename;
        echo json_encode($data);
      }
    }

    //----- Coloca los nombres a las columnas -----//
    public function ArrayColummns($ini, $fin){
        $dataColumnasDatos = array('Id','No', 'Apellidos', 'Nombres', 'Identificacion','Estado');
        array_push($dataColumnasDatos); 
        return $dataColumnasDatos;
    }
}
?>