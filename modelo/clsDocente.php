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
                if (!$rs = $conexion->getPDO()->query($sql)) {
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

    public function ConsultarModulosPorDocente($param) {
        extract($param);
		$rs = null;
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        // $sql = "CALL SPCONSULTARMODULOSPORDOCENTE1($IdDocente);";
        // $sql = "CALL SPCONSULTARMODULOSPORDOCENTE2($IdDocente, '$salon');";
        $sql = "CALL SPCONSULTARMODULOSPORDOCENTE2($IdDocente);";
	
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



       /* extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPREPORTEALIMENTACIONPORPREPROGRAMACION($IdPreprogramacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);*/
    }

}


?>