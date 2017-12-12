<?php
require("../controlador/session.php");	
set_time_limit(0);
/**
 * @author wandres
 */
class clsCarga {


    public function AgregarGestion($param) {
        // session_start();
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARGESTIONCARGA($IdCarga,$IdTipificacion,'".$Observaciones."',1);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function modificarAsistenciaConvocatoria($param) {
        // session_start();
        extract($param);
		$rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARASISTENCIACONVOCATORIA ('$idCarga', ".$IdUsuario.");";
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
    
    public function consultarCargaPorCedula($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCARGAPORCEDULA('$cedula');";
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

    public function CargarJornadasConvocatorias($param) {
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARJORNADASCONVOCATORIAS();";
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
    
    public function CargarTipificacion($param){
        extract($param);
		$rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARTIPIFICACION();";
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


     public function ValidarArchivosFuente($arrayJson, $tipoCarga, $conexion){
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if($tipoCarga==3){
            $carga=1;
        }elseif($tipoCarga==5){
             $carga=2;
        }elseif($tipoCarga==2){
             $carga=3;
        }

       echo $sql = "CALL SPVERIFICARCARGA('$arrayJson',$carga);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                     $array = $fila['pResultado'];
                }
            }
        } else {
            $array = 0;
        }
        
        echo json_encode($array);
    }

    public function ConsultarCargaPorIdJornada($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCARGAPORIDJORNADA2($IdJornada);";
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

public function ReporteCallcenterGestionados($param){
        
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
                
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME CALLCENTER JORNADA GESTIONADOS');
                //Array de Datos Columnas
                //echo date('H:i:s') , " Add new data to the template" , EOL;
        $dataColumnasDatos = array('Número Identificación','Nombres', 'Teléfono 1', 'Teléfono2', 'Teléfono 3', 'Correo Electrónico', 'Curso', 'Modulo',  'Gestión', 'Observaciones', 'Jornada');                 

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

            $sql = "CALL SPREPORTEGESTIONCONVOCATORIACALLCENTER('".$IdJornada."');";
            $rs=null;
          
            if ($rs = $conexion->getPDO()->query($sql)) {
                    if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                        $data['mensaje'] = 1;
                        //$id=0;
                        foreach ($filas as  $r =>$fila) {
                            $columnRow=0;
                            $row = $baseRow + $cont;
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow, $row, $fila['NumeroIdentificacion']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Nombre']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono1']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono2']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Telefono3']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['CorreoElectronico']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Gestion']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Observaciones']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Jornada']);                     
                            
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
                                    $dataColumnasDatos = array('Número Identificación','Nombre',  'Telefono 1', 'Telefono2', 'Telefono 3', 'Correo Electrónico', 'Curso', 'Modulo',  'Gestion', 'Observaciones', 'Jornada');       

                                    $baseRowDatos = 1;
                                    $columnDatos=0;

                                    foreach($dataColumnasDatos as $dataRow) {
                                        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnDatos, $baseRowDatos, $dataRow);     
                                        $columnDatos++;  
                                    }   
        
                                        $objPHPExcel->getActiveSheet()
                                            ->getStyle('A1:k1')
                                            ->getFill()
                                            ->setFillType(PHPExcel_Style_Fill::FILL_SOLID)
                                            ->getStartColor()
                                            ->setARGB('FFFFFF00');
                                         
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(12);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(40);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(20);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(40);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(40);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(20);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(20);
                                         $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(20);
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
                             $filename = '../tmp/reporteCallcenter/reporteCallcenterJornadaGestionados'.$FechaMod.'.xls';
                             $objWriter->save(str_replace('.php', '.xls', $filename));
                             $data['html']=$filename;

            echo json_encode($data);
        }

    /// Guarda La carga general al seleccionar un TipoCarga TCARGAGENERAL
    function AgregarCargaGeneral($param){
        extract($param);
        $rs = null;
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $fechaActual= date('Y-m-d');
        $sql = "CALL SPAGREGARCARGAMASIVAGENERAL($tipoCarga, '$fechaActual' ,'$Observaciones','$IdUsuario');";
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


       /// Guarda La carga general al seleccionar un TipoCarga TCARGAGENERAL
    public function InscribirSoporteMatricula($numInsercion,$lin_inf, $conexion,$idTablaGeneral) { 
        header("Content-Type: text/html;charset=utf-8");  
        $IdUsuario = $_SESSION['idUsuario'];  
        $registro = explode(";", $lin_inf);
       
        $sql = "CALL SPAGREGARCARGAMASIVADETALLESM($idTablaGeneral,$registro[0],$registro[1]);";
        $resultado=1;
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                 foreach ($filas as $fila) {
                    $array[] = $fila['pIdTabla'];
                }
            }
        } 
        return $array;
    }

     /// Guarda La carga general al seleccionar un TipoCarga TCARGAGENERAL
    public function InscribirSoporteFirma($numInsercion,$lin_inf, $conexion,$idTablaGeneral) { 
        header("Content-Type: text/html;charset=utf-8");  
        $IdUsuario = $_SESSION['idUsuario'];  
        $registro = explode(";", $lin_inf);
       
        $sql = "CALL SPAGREGARCARGAMASIVADETALLESF($idTablaGeneral,'$registro[0]');";
        $resultado=1;
        $rs=null;
        $array="";
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                 foreach ($filas as $fila) {
                    $array = $fila['pIdTabla'];
                }
            }else{
                $array="error";
            }
        } else{

            $array="error";
        }
        return $array;
    }


           /// Guarda La carga general al seleccionar un TipoCarga TCARGAGENERAL
    public function InscribirSoporteEstado($numInsercion,$lin_inf, $conexion,$idTablaGeneral) { 
        header("Content-Type: text/html;charset=utf-8");  
        $IdUsuario = $_SESSION['idUsuario'];  
        $registro = explode(";", $lin_inf);
       
        $sql = "CALL SPAGREGARCARGAMASIVADETALLECE($idTablaGeneral,$registro[0],$registro[1],$registro[2]);";
        $resultado=1;
        $rs=null;
        $array="";
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                 foreach ($filas as $fila) {
                    $array = $fila['pIdTabla'];
                }
            }
        } 
         return $array;
    }



           /// Guarda La carga general al seleccionar un TipoCarga TCARGAGENERAL
    public function InscribirSoporteRefrigerio($numInsercion,$lin_inf, $conexion,$idTablaGeneral) { 
        header("Content-Type: text/html;charset=utf-8");  
        $IdUsuario = $_SESSION['idUsuario'];  
        $registro = explode(";", $lin_inf);
       
        $sql = "CALL SPAGREGARCARGAMASIVADETALLESR($idTablaGeneral,'$registro[0]');";
        $resultado=1;
        $rs=null;
        $array="";
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                 foreach ($filas as $fila) {
                    $array = $fila['pIdTabla'];
                }
            }
        } 
         return $array;
    }

       /// Guarda La La ruta del archivo fuente TAUTORIZACIONYFUENTE
 public function RegistrarArchivoFuente($idTablaGeneral,$selCarga,$archivo,$conexion) { 
        header("Content-Type: text/html;charset=utf-8");  
        $sql = "CALL SPAGREGARAUTORIZACIONYFUENTE($idTablaGeneral,$selCarga,'$archivo');";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $inserto = 1;
                }
            }
        } 
        return $inserto;
    }


           /// Guarda La La ruta del ruta archivo escaneado en TARCHIVOESCANEADO
    public function GuardarArchivoEscaneado($idTablaGeneral,$idDetalleTabla, $nombreRuta, $conexion)  {
        header("Content-Type: text/html;charset=utf-8");   

        $sql = "CALL SPAGREGARARCHIVOESCANEADO($idTablaGeneral,$idDetalleTabla,'$nombreRuta');";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                   // $resultado = $fila['resultado'];
                    $inserto = 1;
                }
            }else{
            }
        } 
        return $inserto;
    }


    /// Listado de archivos subido en asignaciones
    public function ConsultarAsignaciones($param)  {
        extract($param);
        $resultado = array();
        $registro = array();
         $sql = "CALL SPCONSULTARCARGAMASIVA($busqueda);";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $inserto = 0;
          if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                         $ruta= "<a href='".$host."/".$fila['Ruta']."'>Descargar Archivo</a>";
                          array_push($registro, $fila['NumeroIdentificacion'],$fila['Nombres'],$fila['Fecha'],$fila['Modulo'],$fila['TipoArchivo'], $ruta ,$value);
                        
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

    /// Listado de archivos subido en asignaciones
    public function ConsultarCambioEstados($param)  {
        extract($param);
         $resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARCARGAMASIVACE($busqueda);";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $host= $_SERVER["HTTP_HOST"];
         if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                         $ruta= "<a href='".$host."/".$fila['Ruta']."'>Descargar Archivo</a>";
                          array_push($registro, $fila['NumeroIdentificacion'],$fila['Nombres'],$fila['Fecha'],$fila['EstadoAnterior'],$fila['EstadoNuevo'],$fila['TipoArchivo'], $ruta ,$value);
                        
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


        /// Listado de archivos subido en asignaciones
    public function ConsultarSoporteFirmas($param)  {
        extract($param);
         $resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARCARGAMASIVASF('$busqueda');";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $host= $_SERVER["HTTP_HOST"];
         if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                         $rutaFuente= "<a href='".$host."/".$fila['RutaAutorizacion']."'>Descargar Archivo</a>";
                         $rutaSoporte= "<a href='".$host."/".$fila['RutaSoporte']."'>Descargar Archivo</a>";

                          array_push($registro, $fila['Salon'],$fila['Fecha'],$rutaFuente, $rutaSoporte ,$value);
                        
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

            /// Listado de archivos subido en asignaciones
    public function ConsultarSoporteMatricula($param)  {
        extract($param);
         $resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARCARGAMASIVASM('$busqueda');";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $host= $_SERVER["HTTP_HOST"];
         if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                         $rutaFuente= "<a href='".$host."/".$fila['RutaFuente']."'>Descargar Archivo Fuente</a>";
                         $rutaEscaneado= "<a href='".$host."/".$fila['RutaSoporte']."'>Descargar Archivo Soporte</a>";
                          array_push($registro, $fila['NumeroIdentificacion'],$fila['Nombres'],$fila['Fecha'],$fila['IdMatricula'],$rutaFuente, $rutaEscaneado ,$value);
                        
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

                /// Listado de archivos subido en asignaciones
    public function ConsultarSoporteRefrigerios($param)  {
        extract($param);
         $resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARCARGAMASIVASR('$busqueda');";
        $rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $host= $_SERVER["HTTP_HOST"];
         if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    foreach ($fila as $key => $value) {
                         $rutaFuente= "<a href='".$host."/".$fila['RutaAutorizacion']."'>Descargar Archivo Fuente</a>";
                         $rutaEscaneado= "<a href='".$host."/".$fila['RutaSoporte']."'>Descargar Archivo Soporte</a>";
                          array_push($registro, $fila['Salon'],$fila['Fecha'],$rutaFuente, $rutaEscaneado ,$value);
                            
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

}


?>
