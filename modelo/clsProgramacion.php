<?php
require("../controlador/session.php");
require("clsUtilidades.php");
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsProgramacion
 *
 * @author wandres
 */
class clsProgramacion {

    public function actualizarProgramacion($param){
        extract($param);
        foreach ($datos as $dato) {
            echo $dato[0];
        }
        /*$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARDOCENTES();";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }*/
        //echo json_encode($array);
    }

    public function CargarEstados($param) {
        extract($param);
        $rs=null;
        $sql = "CALL SPCARGARESTADOSPREPROGRAMACION($pBandera);";
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

    public function AgregarPreprogramacion($param) {
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARPREPROGRAMACION('$cod_mat', '$cod_sal',$tip_ser, $rut_for, '$cur_cod', $cur_dia,
            $hra_ini,$hra_fin, '$cod_mod',$mod_pre, $id_sed, $id_doc, '$fec_ini', '$fec_fin', $pro_ent, 
            $tip_cer,".$IdUsuario.",$pre_est,'$canSesiones','$capSalon','$inteHoraria',$convenio,'$observacion');";
        $rs=null;
        $buscar=array(chr(13).chr(10), "\r\n", "\n", "\r");
        $reemplazar=array("", "", "", "");
        $sql=str_ireplace($buscar,$reemplazar,$sql);
         if ($rs = $conexion->getPDO()->query($sql)) { 
				if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                    $IdPreprogramacion = $filas[0]['pIdTabla']; 
				    $array1 = $filas[0]['pIdTabla']; 
				    if ( count($array1) > 0){ 
				    unset($rs);
				    $sql = "CALL SPAGREGARSERIE($tip_ser,$IdUsuario,$matriculaExistente);";
					$rs=null;
						if ($rs = $conexion->getPDO()->query($sql)) {  
							$array = 1;	
						}
						else{
							print_r($conexion->getPDO()->errorInfo()); die();
							$array = 0;
						}
					}
				} 
                //----- Inicio envío correo al docente involucrado -----//
                $rs1=null;
                $array1=array();
                $conexion->getPDO()->query("SET NAMES 'utf8'");
                $sql = "CALL SPCONSULTARDATOSCORREOMATRICULAPORPREPROGRAMACIONDOCENTE($IdPreprogramacion);";
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
                    $conexion->getPDO()->query("SET NAMES 'utf8'");
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
                        $conexion->getPDO()->query("SET NAMES 'utf8'");
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
                            $docente = $array1[0]['Docente'];
                            $correoElectronico = $array1[0]['CorreoElectronico'];
                            $salon = $array1[0]['Salon'];
                            $codigocurso = $array1[0]['CodigoCurso'];
                            $curso = $array1[0]['Curso'];
                            $ruta = $array1[0]['Ruta'];
                            $duracionCurso = $array1[0]['DuracionCurso'];
                            $diasCurso = $array1[0]['DiasCurso'];
                            $fechaInicial = $array1[0]['FechaInicial'];
                            $fechaFinal = $array1[0]['FechaFinal'];
                            $horaInicial = $array1[0]['HoraInicial'];
                            $horaFinal = $array1[0]['HoraFinal'];
                            $modulo = $array1[0]['Modulo'];
                            $duracionModulo = $array1[0]['DuracionModulo'];
                            $intensidadhoraria = $array1[0]['IntensidadHoraria'];
                            $cantidadsesiones = $array1[0]['CantidadSesiones'];
                            $modalidad = $array1[0]['Modalidad'];
                            $sede = $array1[0]['Sede'];
                            $observaciones = $array1[0]['Observaciones'];
                            $estado = $array1[0]['Estado'];
                            $asunto = "PREPROGRAMACION ASIGNADA";
                            $correo=$utilidades->enviarCorreoDocente($docente,$correoElectronico,$salon,$codigocurso,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$intensidadhoraria,$cantidadsesiones,$modalidad,$sede,$observaciones,$estado,$usuario,$usuarioe,$correode,$clave,$asunto);
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
			}else {    
				print_r($conexion->getPDO()->errorInfo()); die();
				$array = 0;
			}
        echo json_encode($array);
    }

    public function AgregarPreprogramacion2($param) {
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $sql = "CALL SPAGREGARPREPROGRAMACION2('$cod_mat', '$cod_sal',$tip_ser, $rut_for, '$cur_cod', $cur_dia,
            $hra_ini,$hra_fin, '$cod_mod',$mod_pre, $id_sed, $id_doc, '$fec_ini', '$fec_fin', $pro_ent, 
            $tip_cer,$mat_num, $salon, $horarioCurso, ".$IdUsuario.");";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {          
            $array = 1;
        } else {    
            $array = 0;
        }
        echo json_encode($array);
    }

    public function obtenerUltimaMatricula($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARULTIMAMATRICULA();";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    if($filas['mat_num'] === null){
                        $filas['mat_num'] = 0;
                    }
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function CargarPreprogramaciones($param) {
        extract($param);
		$resultado = array();
        $registro = array();
        $sql = "CALL SPCONSULTARPREPROGRAMACIONES('$Anio');";
		$rs=null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) { 
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) { 
                foreach ($filas as $fila) {
					foreach ($fila as $key => $value){
						array_push($registro, $value);
					}
					array_push($resultado, $registro);
                    $registro = array(); 
                }
            } //print_r($resultado);
        } else {
            $array = 0;
        }
        echo json_encode($resultado);
    } 

    public function consultarPreprogramacionDesdeFecha($param) {
        extract($param);
        $sql = "CALL SPCONSULTARPREPROGRAMACIONFECHAINICIO('2016-01-01');";
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

    public function consultarMatriculaPorCodigo($param) {
        extract($param);
		$array = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPBUSCARPREPROGRAMACIONPORMATRICULA('$mat_cod');";
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

     public function consultarCalendarioPreprogramacion($param) {
        extract($param); 
		$array = array();
        $sql = "CALL SPCONSULTARCALENDARIOPREPROGRAMACION($idPreprogramacion);";
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
			print_r($conexion->getPDO()->errorInfo()); 
        }
		// print_r($array);
        echo json_encode($array);
    }

    public function CargarDatosPreProgramacion($param) {
        extract($param);
        $sql = "CALL SPCONSULTARDATOSSALON($pId);";
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

    public function CargarPreprogramacionPorId($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARPREPROGRAMACIONPORID($pIdPreprogramacion);";
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

    public function eliminarPreprogramacion($param) {
        $res = '';
        extract($param);
        $sql = "CALL ELIMINAR_PREPROGRAMACION('$cod_mat');";
		$rs=null;
        if ($rs = $conexion->getPDO()->query($sql)) {
            $res = "Eliminado satisfactoriamente $cod_mat";
        } else {
            $res = 'Hubo un error, no se pudo eliminar';
        }
        echo json_encode($res);
    }
    
    public function ActualizarPreprogramacion($param) {
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPMODIFICARPREPROGRAMACION($pre_id, $tip_ser, $rut_for, '$cur_cod', $cur_dia,
            $hra_ini,$hra_fin,'$cod_mod',$mod_pre, $id_sed, $id_doc, '$fec_ini', '$fec_fin', $pro_ent, 
            $tip_cer,$pre_est,".$IdUsuario.",'$canSesiones','$capSalon','$inteHoraria','$observacion','$codSalon',$convenio);";
        $rs=null;
		// echo json_encode(array($sql));
        if ($rs = $conexion->getPDO()->query($sql)) {
            $array = 1;
            // if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
            //     foreach ($filas as $fila) {
            //         $array[] = $fila; 
            //     }
            // }
            //----- Inicio envío correo al docente involucrado -----//
            $rs1=null;
            $array1=array();
            $conexion->getPDO()->query("SET NAMES 'utf8'");
            $sql = "CALL SPCONSULTARDATOSCORREOMATRICULAPORPREPROGRAMACIONDOCENTE($pre_id);";
            if ($rs1 = $conexion->getPDO()->query($sql)){ 
                if($filas1 = $rs1->fetchAll(PDO::FETCH_ASSOC)){
                    foreach ($filas1 as $fila1){
                        $array1[] = $fila1; 
                    }
                }
                $rs1->closeCursor();
                $utilidades = new clsUtilidades();
                $rs2=null;
                $array2=array();
                $IdTercero = $array1[0][Id];
                $conexion->getPDO()->query("SET NAMES 'utf8'");
                $sql2 = "CALL SPCONSULTARDATOSCORREO();";
                if ($rs2 = $conexion->getPDO()->query($sql2)){
                    if ($filas2 = $rs2->fetchAll(PDO::FETCH_ASSOC)) {
                        foreach ($filas2 as $fila2) {
                            $array2[] = $fila2; 
                        }
                    }
                    $rs2->closeCursor();
                    $correode = $array2[0]['Parametro'];
                    $clave = $array2[1]['Parametro'];
                    $rs3=null;
                    $array3=array();
                    $conexion->getPDO()->query("SET NAMES 'utf8'");
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
                        $docente = $array1[0]['Docente'];
                        $correoElectronico = $array1[0]['CorreoElectronico'];
                        $salon = $array1[0]['Salon'];
                        $codigocurso = $array1[0]['CodigoCurso'];
                        $curso = $array1[0]['Curso'];
                        $ruta = $array1[0]['Ruta'];
                        $duracionCurso = $array1[0]['DuracionCurso'];
                        $diasCurso = $array1[0]['DiasCurso'];
                        $fechaInicial = $array1[0]['FechaInicial'];
                        $fechaFinal = $array1[0]['FechaFinal'];
                        $horaInicial = $array1[0]['HoraInicial'];
                        $horaFinal = $array1[0]['HoraFinal'];
                        $modulo = $array1[0]['Modulo'];
                        $duracionModulo = $array1[0]['DuracionModulo'];
                        $intensidadhoraria = $array1[0]['IntensidadHoraria'];
                        $cantidadsesiones = $array1[0]['CantidadSesiones'];
                        $modalidad = $array1[0]['Modalidad'];
                        $sede = $array1[0]['Sede'];
                        $observaciones = $array1[0]['Observaciones'];
                        $estado = $array1[0]['Estado'];
                        $asunto = "PREPROGRAMACION MODIFICADA";
                        $correo=$utilidades->enviarCorreoDocente($docente,$correoElectronico,$salon,$codigocurso,$curso,$ruta,$duracionCurso,$diasCurso,$fechaInicial,$fechaFinal,$horaInicial,$horaFinal,$modulo,$duracionModulo,$intensidadhoraria,$cantidadsesiones,$modalidad,$sede,$observaciones,$estado,$usuario,$usuarioe,$correode,$clave,$asunto);
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
        }else {
            $array = 0;
			print_r($conexion->getPDO()->errorInfo()); 
        }
        echo json_encode($array);
    }

    public function ActualizarPreprogramacion2($param) {
        $arr = array("test");

        echo json_encode($arr);
    }
	
	public function cargarCuposFaltantes($param) {
        extract($param); 
        $sql = "CALL SPCONSULTARCUPOSFALTANTES ($preprogramacion);";
		$rs=null;
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = "";
        }
		// print_r($array);
        echo json_encode($array);
    }
	
	public function consultarCupos($param) {
        extract($param); 
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARCUPOS();";
		$rs=null;

        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = "";
        }
		
        echo json_encode($array);
	}

    public function consultarGestionPreprogramacion($param) {
       extract($param); 
        $sql = "CALL SPCONSULTARGESTIONPREPROGRAMACION($IdPreprogramacion);";
       $conexion->getPDO()->query("SET NAMES 'utf8'");
       if ($rs = $conexion->getPDO()->query($sql)) {
           if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
               foreach ($filas as $fila) {
                   $array[] = $fila;
               }
           }
       } else {
           $array = "";
       }
       echo json_encode($array);
    }

    public function AgregarGestionPreprogramacion($param) {
       extract($param);
       $fechaHoy=date("Y-m-d");
       $IdUsuario = $_SESSION['idUsuario'];
       $conexion->getPDO()->query("SET NAMES 'utf8'");
       $sql = "CALL SPAGREGARGESTIONPREPROGRAMACION($IdPreprogramacion,$IdTercero,'".$IdTipificacion."','".$Observaciones."', $NoSesion, '".$fechaHoy."', $IdAsistenciaDetalle, $IdUsuario);";
       if ($rs = $conexion->getPDO()->query($sql)) {
           if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
               $array = 1;
           }
       } else {
           $array = 0;
       }
       echo json_encode($array);
    }

    //----- Función para la lista de convenios -----//
    public function CargarConvenio($param) {
        extract($param);
        $rs = null;
        $sql = "CALL SPCARGARCONVENIOS();";
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

    //----- Función para guardar los datos de un convenio -----//
    public function guardarConvenio($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARCONVENIO($IdConvenio,'$pNombre',$pModulo,$pEstado,".$IdUsuario.");";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para agregar la ruta del logo de un convenio -----//
    public function guardarRutaLogoConvenio($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARRUTALOGOCONVENIO($IdConvenio,'$pRuta',".$IdUsuario.");";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para buscar un Convenio por Id -----//
    public function consultarConvenio($param){
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARCONVENIO($pIdConvenio)";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }else{
                $array = -1;
            }
        }else{
            $array = 0;
        }
        echo json_encode($array);
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
                
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'INFORME CALLCENTER PREPROGRAMACIÓN GESTIONADOS');
                //Array de Datos Columnas
                //echo date('H:i:s') , " Add new data to the template" , EOL;
        $dataColumnasDatos = array('Número Identificación','Nombre', 'Teléfono 1', 'Teléfono2', 'Teléfono 3', 'Correo Electrónico', 'Docente', 'Salón',  'Curso', 'Modulo', 'Gestión', 'Observaciones', 'Fecha Gestión');                 

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

            $sql = "CALL SPREPORTEGESTIONSEGUIMIENTOCALLCENTER('".$FechaInicial."','".$FechaFinal."');";
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
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Docente']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Salon']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Curso']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Modulo']);
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Gestion']);   
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['Observaciones']);       
                            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($columnRow=$columnRow+1, $row, $fila['FechaGestion']);                     
                            
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
                                    $dataColumnasDatos = array('Número Identificación','Nombre', 'Teléfono 1', 'Teléfono2', 'Teléfono 3', 'Correo Electrónico', 'Docente', 'Salón',  'Curso', 'Modulo', 'Gestión', 'Observaciones', 'Fecha Gestión');           

                                    $baseRowDatos = 1;
                                    $columnDatos=0;

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
                             $filename = '../anexos/reportes/reporteCallcenterPreprogramacionGestionados'.$FechaMod.'.xls';
                             $objWriter->save(str_replace('.php', '.xls', $filename));
                             $data['html']=$filename;

            echo json_encode($data);
        }

}
?>