<?php
/**
 *  Clase que realiza el crud para Planeacion y seguimiento de clases y chequeo de recursos.
 *  DimensionIt 
 */

class clsPlaneacion {
	

	 /**
	 * Metodo guardarPlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPreprogramacion,'$sesionPla', $fecha, $unidTema, $estrDesa, $tecn, $segu, $cant, $desc, $reci, $obse
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No ingrese los datos en la db
	 */
    
	 public function guardarPlaneacion($param) { 
		extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
        
		
		$cont=0;
		foreach ($listaRecursos as $valor){
			
			$nuevaLista[$cont]['cantidad'] = $valor['cantidad'];
			$nuevaLista[$cont]['recursos'] = $valor['recursos'];
			$cont++;
		}
		
		
		$listaRecursos = $nuevaLista;
		
		
        $sql = "CALL SPAGREGARPLANEACION($idPreprogramacion,'$sesionPla', '$fecha', '$unidTema', '$estrDesa', '$tecn', '$segu', '$reci', '$obse', $usuario);";
		 
		 if ($rs = $conexion->getPDO()->query($sql)) {          
			if ($filas = $rs->fetchAll()) {
					foreach ($filas as $fila) {
                    $array[] = $fila;
					} 
			}
			
			unset($rs);
			// print_r("hola");
			// print_r(count($listaRecursos)); die();
			//print_r($listaRecursos);
				//SPAGREGARRECURSO  procedimiento para ingresar recursos  
					for ($i=0; $i<count($listaRecursos);$i++){
						
						if ($listaRecursosId[$i]['eliminar'] == 1){
						$sql = "CALL SPAGREGARRECURSO(".$array[0]['pIdPlaneacion'].", ".$listaRecursos[$i]['cantidad'].", '".$listaRecursos[$i]['recursos']."', '".$listaRecursosId[$i]['eliminar']."',$usuario);";
								// print_r($sql); die();
								if ($rs =$conexion->getPDO()->query($sql)) {    
									foreach ($filasR as $filaR) {
									$array[] = $filaR;
									}
									unset($rs);
								}
								else{
									print_r($conexion->getPDO()->errorInfo()); die();
								}
						}		
					}
			} else { print_r($array);
				$array = 0;
				print_r($conexion->getPDO()->errorInfo()); die();
				// print_r($conexion->getPDO()->errorCode()); die();
			}
			
        echo json_encode($array);
    }

     /**
	 * Metodo ListarPlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPreprogramacion, idDocente
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No consulta de datos a la db
	 */

	 public function ListarPlaneacion($param) {
	 	 extract($param); 
        $resultado = array();
        $registro = array();
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARPLANEACIONPREPROGRAMACION($IdPreprogramacion);";
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

	 /**
	 * Metodo editarPlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPreprogramacion,'$sesionPla', $fecha, $unidTema, $estrDesa, $tecn, $segu, $cant, $desc, $reci, $obse
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No ingrese los datos en la db
	 */

	 public function editarPlaneacion($param) { 
        extract($param);
		//listaRecursos falta procedimiento para actualizar recursos
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
		
		$cont=0;
		foreach ($listaRecursos as $valor){
			
			$nuevaLista[$cont]['cantidad'] = $valor['cantidad'];
			$nuevaLista[$cont]['recursos'] = $valor['recursos'];
			$cont++;
		}
		
		
		$listaRecursos = $nuevaLista;
		 
        //print_r($listaRecursos);
        $sql = "CALL SPMODIFICARPLANEACION($idPlaneacion, $idPreprogramacion,'$sesionPla', '$fecha', '$unidTema', '$estrDesa', '$tecn', '$segu', '$reci', '$obse', $usuario);";
        if ($rs = $conexion->getPDO()->query($sql)) {
                    $data = 0;
					
					unset($rs);
			
			
				//SPAGREGARRECURSO  procedimiento para ingresar recursos  
					for ($i=0; $i<count($listaRecursos);$i++){
						  
						  if ($listaRecursosId[$i]['id'] != ""){
							$sql = "CALL SPMODIFICARRECURSO(".$listaRecursosId[$i]['id'].", ".$listaRecursos[$i]['cantidad'].", '".$listaRecursos[$i]['recursos']."', '".$listaRecursosId[$i]['eliminar']."', $usuario);";
								//print_r($sql); 
								if ($rs =$conexion->getPDO()->query($sql)) {    
									foreach ($filasR as $filaR) {
									$array[] = $filaR;
									}
									unset($rs);
									$data = 0;
								}
								else{
									print_r($conexion->getPDO()->errorInfo()); die();
									$data=1;
								}
							}
							else if($listaRecursosId[$i]['id'] == "" &&  $listaRecursosId[$i]['eliminar'] == 2){
								
							}
							else if($listaRecursosId[$i]['id'] == "" &&  $listaRecursosId[$i]['eliminar'] == 1){ //cuando es un recurso nuevo
								$sql = "CALL SPAGREGARRECURSO(".$idPlaneacion.", ".$listaRecursos[$i]['cantidad'].", '".$listaRecursos[$i]['recursos']."', '".$listaRecursosId[$i]['eliminar']."', $usuario);";
								// print_r($sql); 
								if ($rs =$conexion->getPDO()->query($sql)) {    
									foreach ($filasR as $filaR) {
									$array[] = $filaR;
									}
									unset($rs);
								}
								else{
									print_r($conexion->getPDO()->errorInfo()); die();
								}
								
							}
					}
        }else{
			$data=1;
			print_r($conexion->getPDO()->errorInfo()); die();
		}

        echo json_encode($data);
    }

    //devuelve todo
/**
	 * Metodo cargarDetallePlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPplaneacion
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No ingrese los datos en la db
	 */	
    public function cargarDetallePlaneacion($param) { 
    	extract($param); 
        
		$data = array('error'=>0, 'mensaje'=>'', 'html'=>'', 'recursos'=>'');
		
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARDETALLEPLANEACION($idPlaneacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
				unset($rs);
				//se llama al procedimiento que trae el detalle de los recursos
				$sql = "CALL SPCONSULTARDETALLERECURSO($idPlaneacion);";
				if ($rs = $conexion->getPDO()->query($sql)) {
					if ($filasR = $rs->fetchAll(PDO::FETCH_ASSOC)) {
						$data[ 'recursos' ]='';
						$cont=0;
						$data[ 'recursos' ].='<table id="div_adicionados"><tr>';
							$data[ 'recursos' ].='
						<tr>
							<td class="titulo azul cantidad">Cantidad</td><td class="titulo azul descripcion">Descripción</td><td width="100px"></td>
						</tr>';
						foreach ($filasR as $filaR) {
						$arrayR[] = $filaR;
						
							$data[ 'recursos' ].='<input type="hidden" id="txtHidId'.$cont.'" name="recurso" value="'.$filaR['Id'].'" class=""/>
								<td><input type="text" id="txtCant'.$cont.'" name="recurso" class="Txt1 number" value="'.$filaR['Cantidad'].'" size="6"/></td><td><input type="text" id="txtDesc'.$cont.'" name="recurso" class="Txt2" value="'.$filaR['Descripcion'].'"/></td>';
							if ($cont != 0){
								$data['recursos' ].='<td><button id="btnEliminar'.$cont.'" type="button" class="boton final" onclick="" >Eliminar</button></td>';	
							}
							// else{
								// $data['recursos' ].='<td></td>';
							// }
							$data['recursos'].='</tr>';
							// $data['recursos'].='</table>';
							$cont++;
						}
						$data[ 'recursos' ].='</table>';
						
						//se arma el html para mandar al js
						$data[ 'html' ] ='<form id="formPlaneacion">
					<label class="titulo">PLANEACIÓN ACADÉMICA</label>
					<br><br>
					<input type="hidden" id="txtIdPlaneacion" name="txtIdPlaneacion" value="'.$array[0]['id'].'" class=""/>
					<div class="PanelIzquierdo" style="width=45%">
							<div class="LblAzul">N° Sesión</div>
							<input type="text" id="txtSesion" value="'.$array[0]['NumeroSesion'].'" class="Txt number"/>
					</div>

					<div class="PanelDerecho" style="width=45%">
							<div class="LblAzul">Fecha</div>
							<input type="text" id="txtFecha" value="'.$array[0]['Fecha'].'" class="Txt" readonly />
					</div>
							
					</br></br>
								
					<label class="titulo azul">Unidad Tematica</label>
					<br><br>
					<div ><textarea class="TextArea" name="descripcion" id="txtUnidadTematica" placeholder="(Anote los temas a tratar en la sesión)" >'.$array[0]['UnidadTematica'].'</textarea></div>
					<br>
					<label class="titulo azul">Estrategias a Desarrollar</label>
					<br><br>
					<div ><textarea class="TextArea" name="descripcion" id="txtEstrategiasDesarrollar" placeholder="(Anote sus estratégias a desarrollar en esta sesión)">'.$array[0]['Estrategia'].'</textarea></div>
					<br>
					<label class="titulo azul">Técnica e Instrumento De Evaluación</label>
					<br><br>
					<div ><textarea class="TextArea" name="descripcion" id="txtTecnicaInstrumento" placeholder="(Anote sus técnicas e instrumentos a desarrollar en esta sesión)">'.$array[0]['TecnicaEvaluacion'].'</textarea></div>
					<br><br>
					<label class="titulo">SEGUMIENTO DEL PROCESO</label>
					<br><br>
					<div ><textarea class="TextArea" name="descripcion" id="txtSeguimiento" placeholder="(Anote el seguimiento que ha realizado en el proceso)">'.$array[0]['Seguimiento'].'</textarea></div>
					<br><br>
					<label class="titulo">PLANEACIÓN DE RECURSOS</label>
					<br><br>
					<label class="titulo azul">Materiales y equipos</label>
					<br><br>';
					//$data[ 'html' ].='<table border="0">';
					// $data[ 'html' ].='
			        // <tr>
						// <td class="titulo azul cantidad">Cantidad</td><td class="titulo azul descripcion">Descripción</td>
					// </tr>';
							
					$data[ 'html' ] .= $data['recursos'];
					// $data[ 'html' ] .='<table border="0">
						// <tr>
							// <td class="">Cantidad</td><td class="">Descripción</td>
						// </tr>
						// <tr>
							// <input type="hidden" id="txtHidId1" name="txtHidId1" value="'.$arrayR[0]['Id'].'" class=""/>
							// <td><input type="text" id="txtCant1" name="recurso" class="Txt number" value="'.$arrayR[0]['Cantidad'].'" size="6"/></td><td><input type="text" id="txtDesc1" name="recurso" class="Txt" value="'.$arrayR[0]['Descripcion'].'"/></td>
						// </tr>
						// <tr>
							// <input type="hidden" id="txtHidId2" name="txtHidId2" value="'.$arrayR[1]['Id'].'" class=""/>
							// <td><input type="text" id="txtCant2" name="recurso" class="Txt number" value="'.$arrayR[1]['Cantidad'].'"/></td><td><input type="text" id="txtDesc2" name="recurso" class="Txt" value="'.$arrayR[1]['Descripcion'].'"/></td>
						// </tr>
						// <tr>
							// <input type="hidden" id="txtHidId3" name="txtHidId3" value="'.$arrayR[2]['Id'].'" class=""/>
							// <td><input type="text" id="txtCant3" name="recurso" class="Txt number" value="'.$arrayR[2]['Cantidad'].'"/></td><td><input type="text" id="txtDesc3" name="recurso" class="Txt" value="'.$arrayR[2]['Descripcion'].'"/></td>
						// </tr>

					// </table>';
					
					// $data['html'].='<table id="div_adicionados" class="">
					
					// </table>';
					$data['html'].='<div id="divAdicionarRecurso" class="">
					
					</div>';
					
					$data[ 'html' ] .='<br><br>
					<label class="titulo">EJECUCIÓN</label>
					<br><br>
					<label class="titulo azul">Chequeo ok o especifique</label>
					<br><br>
					<div id=""><textarea class="TextArea" name="descripcion" id="txtObservaciones" placeholder="(Anote firma recibido de recursos a satisfaccíon)">'.$array[0]['Observaciones'].'</textarea></div>
					<br><br>
					<label class="titulo azul">Firma de recibido de recursos a satisfacción</label>
					<br><br>
					<div id=""><textarea class="TextArea" name="descripcion" id="txtRecibido" placeholder="(Anote chequeo ok o especifique)">'.$array[0]['Recibido'].'</textarea></div>
				</form>';
								
				
					}
				}
				else{
					print_r($conexion->getPDO()->errorInfo()); die();
					$array = 0;
				}
				
				// var_dump($array); die();
            }
        } else {
			print_r($conexion->getPDO()->errorInfo()); die();
			$array = 0;
			// $array = $sql;
        }
        echo json_encode($data);
		
	}	

    
    /**
	 * Metodo eliminaPlaneacion
	 * 
	 * param Recibe los parametros ingresados en la vista $idPreprogramacion, idPlaneacion
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No poder hacer la actualizacion en la db
	 */

	 public function eliminarPlaneacion($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
                
        $sql = "CALL SPDESACTIVARPLANEACION($idPlaneacion, $usuario);";
        if ($rs = $conexion->getPDO()->query($sql)) {
                    $data = 0;
        }else{
			$data=1;
		}

        echo json_encode($data);
    }
	
	
	/**
	 * Metodo adicionarFilaRecurso
	 * 
	 * param Recibe los parametros para crear la nueva fila de recurso
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No poder hacer la actualizacion en la db
	 */
	 public function adicionarFilaRecurso($param) {
       extract($param);
       $data = array('error'=>0, 'mensaje'=>'', 'html'=>'');
	   $nuevoId=$res+1;
	
	$data[ 'html' ] = "";
		//$data[ 'html' ] .= "<table WIDTH='100%' >";
			$data[ 'html' ] .= "<tr>";
			$data[ 'html' ] .='<input type="hidden" id="txtHidId'.$nuevoId.'" name="recurso" value="" class=""/>';
			$data[ 'html' ] .= "<td ><input type='text' name ='recurso' id='txtCant".$nuevoId."' class='Txt1 number' size='6'></td>";
			$data[ 'html' ] .= "<td ><input type='text' name ='recurso' id='txtDesc".$nuevoId."' class='Txt2'></td>";
			$data[ 'html' ] .= "<td ><button id='btnEliminar".$nuevoId."' type='button' class='boton final' onclick='' >Eliminar</button></td>";
			//$data[ 'html' ] .= "<td ><input type='image' id='btnEliminar".$nuevoId."' src='../../vista/images/delete1.png' width='25' height='15' onclick='' ></td>";
			$data[ 'html' ] .= "</tr>";
		//$data[ 'html' ] .= "</table>";
		
		$data['cont']=$nuevoId;
	 
	echo json_encode( $data );
	return;
    }
	
	/**
	 * Metodo consultarNumeroSesiones
	 * 
	 * param Recibe los parametros ingresados en la vista $idPreprogramacion
	 * return Retorna el array $data
	 * author : DimensionIt
	 * exception : No poder hacer la actualizacion en la db
	 */
	public function consultarNumeroSesiones($param){
		extract($param);
		
		$conexion->getPDO()->query("SET NAMES 'utf8'");
        $usuario =  $_SESSION['idUsuario'];
               
        $sql = "CALL SPCONSULTARNUMEROSESIONES($IdPreprogramacion);";
		
        if ($rs = $conexion->getPDO()->query($sql)) {
        	if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    if ($fila["HoraFinal"]== 133){
						$numSesiones =10;
					}
					else{
						$numSesiones =13;
					}
                }
            }
					
        }else{
			print_r($conexion->getPDO()->errorInfo()); die();
			$numSesiones=0;
		}

        echo json_encode($numSesiones);
		
	}

}//cierra clase

?>