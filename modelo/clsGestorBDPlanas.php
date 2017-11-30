<?php
require("../controlador/session.php");	
set_time_limit(0);

include 'clsPersona.php';

class clsGestorBDPlanas {
    

    public function testCargarArchivoPlano(){
        $response = '<div id="men_err">';
        include_once './clsParticipante.php';
        $participante = new clsParticipante();
        $inf_arc = $this->LeerArchivoPlano('BDmuestraTRI.csv');
        //print_r($inf_arc);
        $err_arc = $this->ValidarArchivo($inf_arc);
        $con = 0;
        $numInserciones = 0;
        if (strlen($err_arc) === 0) {
            foreach ($inf_arc as $lin_txt) {
//                $numInserciones += $participante->InscribirParticipante($lin_txt, $conexion);
                $numInserciones += $participante->InscribirParticipante($lin_txt);
                $con++;
            }
            $response .= $con . " registros guardados satisfactoriamente y ".$numInserciones ." número de inserciones";
        } else {
//            $aux_rut = explode("/",$rut_arc);
//            $aux_nom_arc = explode(".",$aux_rut[count($aux_rut)-1])[0];
//            $nom_arc = $aux_nom_arc.'.txt';
//            $res_gua = $this->GuardarArchivoDeLogs($err_arc,$nom_arc);
            $response .= 'No ha sido posible cargar los registros del archivo por que éste contiene errores, corríjalos en intentelo de nuevo. 
            Se ha generado un archivo con los errores encontrados.<br><br>'; 
//            $response .= 'No ha sido posible cargar los registros del archivo por que éste contiene errores, corríjalos en intentelo de nuevo. 
//            Se ha generado un archivo con los errores encontrados.<br><br>' . $res_gua;
        }
        $response .= '</div>';
        echo $response;
    }
    
    public function CargarArchivoPlanoFuenteEscaneado($param) {
        $response = '<div id="men_err">';
        extract($param);
        include_once 'clsCarga.php';
        $carga = new clsCarga();
        $inf_arc = $this->LeerArchivoPlano(str_replace('"', "", $archivo),$ubicacionFuente);
        $err_arc = $this->ValidarArchivo($inf_arc, $selCarga);
        $con = 0;
        $numInsercion = 0;
        $aux = '';
        $idDetalleTabla=1;

        if (strlen($err_arc) === 0) {
            foreach ($inf_arc as $lin_txt) {
                if(strlen(trim($lin_txt))>0){

                    $aux .= "numInsercion,lin_txt : ".$numInsercion.' -- '.$lin_txt.PHP_EOL;
					
                    if($selCarga==2){
                        $idDetalleTabla= $carga->InscribirSoporteMatricula($numInsercion,$lin_txt, $conexion,$idTablaGeneral);

                        $identificardorArchivo=$lin_txt[0];

                        if($idDetalleTabla!=""){
                        $validarEscaneado= $this->validarEscaneado($identificardorArchivo, $archivoEscaneado, $idDetalleTabla, $idTablaGeneral, $nombreCorto, $ubicacionEscaneado, $conexion);
                        }

                    }else if($selCarga==3){
                        $idDetalleTabla= $carga->InscribirSoporteFirma($numInsercion,$lin_txt, $conexion,$idTablaGeneral);

                        $identificardorArchivo=$lin_txt[0];

                        if($idDetalleTabla!=""){
                        $validarEscaneado= $this->validarEscaneado($identificardorArchivo, $archivoEscaneado, $idDetalleTabla, $idTablaGeneral, $nombreCorto, $ubicacionEscaneado, $conexion);
                        }

                    }else if($selCarga==5){
                        $idDetalleTabla= $carga->InscribirSoporteRefrigerio($numInsercion,$lin_txt, $conexion,$idTablaGeneral);

                        $identificardorArchivo=$lin_txt[0];

                        if($idDetalleTabla!=""){
                        $validarEscaneado= $this->validarEscaneado($identificardorArchivo, $archivoEscaneado, $idDetalleTabla, $idTablaGeneral, $nombreCorto, $ubicacionEscaneado, $conexion);
                        }

                    }
                   
                   
                        
                    $numInsercion ++;
                }
                
            }
            $archivoEscaneado=str_replace('"','',$archivoEscaneado);
            $this->removeDirectory("../tmp/".$archivoEscaneado);
            //rmdir("../tmp/".$archivoEscaneado);
            $response .= $numInsercion . " registros guardados satisfactoriamente.";
            $res_gua = $this->GuardarArchivoDeLogs($aux,'LogPlanoFuente.txt');
            $response .= 'Archivo de logs líneas leídas.<br><br>' . $res_gua;

            $archivo=str_replace("../", "", $archivo);
            $carga->RegistrarArchivoFuente($idTablaGeneral,301,$archivo, $conexion);

        } else {
            $aux_rut = explode("/",$nom_arc);
            $aux_nom_arc = explode(".",$nom_arc);
            $nom_arc = $aux_nom_arc[0].'.txt';
            $res_gua = $this->GuardarArchivoDeLogs($err_arc,$nom_arc);
            $response .= 'No ha sido posible cargar los registros del archivo por que éste contiene errores, corríjalos en intentelo de nuevo. 
            Se ha generado un archivo con los errores encontrados.<br><br>' . $res_gua;
        }
        $response .= '</div>';



        echo $response;
    }


   public function removeDiresctory($path)
    {
        $path = rtrim( strval( $path ), '/' ) ;
        
        $d = dir( $path );
        
        if( ! $d )
            return false;
        
        while ( false !== ($current = $d->read()) )
        {
            if( $current === '.' || $current === '..')
                continue;
            
            $file = $d->path . '/' . $current;
            
            if( is_dir($file) )
                $this->removeDirectory($file);
            
            if( is_file($file) )
                unlink($file);
        }
        
        rmdir( $d->path );
        $d->close();
        return true;
    }


    public function CargarArchivoPlanoFuenteAutorizacion($param) {
        $response = '<div id="men_err">';
        extract($param);
        include_once 'clsCarga.php';
        $carga = new clsCarga();
        $inf_arc = $this->LeerArchivoPlano(str_replace('"', "", $archivo),$ubicacionFuente);
        $err_arc = $this->ValidarArchivo($inf_arc, $selCarga);
        $con = 0;
        $numInsercion = 0;
        $aux = '';
        $idDetalleTabla=1;
        
        if (strlen($err_arc) === 0) {
            foreach ($inf_arc as $lin_txt) {
                if(strlen(trim($lin_txt))>0){
                    $aux .= "numInsercion,lin_txt : ".$numInsercion.' -- '.$lin_txt.PHP_EOL;
                    if($selCarga==4){
                        $carga->InscribirSoporteEstado($numInsercion,$lin_txt, $conexion,$idTablaGeneral);

                        $identificardorArchivo=$lin_txt[0];
                    }
                   
                    $numInsercion ++;
                }
            }
           
            $response .= $numInsercion . " registros guardados satisfactoriamente.";
            $res_gua = $this->GuardarArchivoDeLogs($aux,'LogPlanoFuente.txt');
            $response .= 'Archivo de logs líneas leídas.<br><br>' . $res_gua;
            $archivo=str_replace("../", "", $archivo);
            $archivoAutorizacion= str_replace("../", "", $archivoAutorizacion);

            $carga->RegistrarArchivoFuente($idTablaGeneral,301,$archivo, $conexion);
            $carga->RegistrarArchivoFuente($idTablaGeneral,300,$archivoAutorizacion, $conexion);


        } else {
            $aux_rut = explode("/",$nom_arc);
            $aux_nom_arc = explode(".",$nom_arc);
            $nom_arc = $aux_nom_arc[0].'.txt';
            $res_gua = $this->GuardarArchivoDeLogs($err_arc,$nom_arc);
            $response .= 'No ha sido posible cargar los registros del archivo por que éste contiene errores, corríjalos en intentelo de nuevo. 
            Se ha generado un archivo con los errores encontrados.<br><br>' . $res_gua;
        }
        $response .= '</div>';

        echo $response;
    }

     public function validarEscaneado($identificardorArchivo,$archivoEscaneado, $idDetalleTabla, $idTablaGeneral,$nombreCorto,$ubicacionEscaneado,$conexion) {
        include_once 'clsCarga.php';
        $carga = new clsCarga();
        $archivoEscaneado=str_replace('"','',$archivoEscaneado);

        $identificardorArchivo=$identificardorArchivo.".pdf";
        //$archivoEscaneado."<br>";
        
        $ubicacionOriginalEscaneado = "../tmp/".$archivoEscaneado."/".$identificardorArchivo;
        
        $nuevoNombre="../".$ubicacionEscaneado.$nombreCorto."_".$idTablaGeneral."_".$idDetalleTabla.".pdf";
        
        $nombreRuta=$ubicacionEscaneado.$nombreCorto."_".$idTablaGeneral."_".$idDetalleTabla.".pdf";

        if (file_exists($ubicacionOriginalEscaneado)) {
            copy($ubicacionOriginalEscaneado, $nuevoNombre);
            unlink($ubicacionOriginalEscaneado); 
            $carga->GuardarArchivoEscaneado($idTablaGeneral,$idDetalleTabla, $nombreRuta,$conexion);

         }
       
    }


    public function CargarArchivoPlano($param) {
        $response = '<div id="men_err">';
        extract($param);
        include_once 'clsParticipante.php';
        $participante = new clsParticipante();
        include_once 'clsCarga.php';
        $carga = new clsCarga();
        $inf_arc = $this->LeerArchivoPlano(str_replace('"', "", $archivo), $ubicacionFuente);
        $err_arc = $this->ValidarArchivo($inf_arc, $selCarga);
        $con = 0;
        $numInsercion = 1;
        $aux = '';
            if (strlen($err_arc) === 0) {
            foreach ($inf_arc as $lin_txt) {
                if(strlen(trim($lin_txt))>0){
                    $aux .= "numInsercion,lin_txt : ".$numInsercion.' -- '.$lin_txt.PHP_EOL;
                    //se agrega parametro $actualizarTercero
                    $con = $con + $participante->InscribirParticipante($numInsercion,$lin_txt, $conexion,$idTablaGeneral,$actualizarTercero);
                    $numInsercion ++;
                }
                
            }

            $archivo=str_replace("../", "", $archivo);
            $archivoAutorizacion= str_replace("../", "", $archivoAutorizacion);

            $carga->RegistrarArchivoFuente($idTablaGeneral,301,$archivo, $conexion);
            $carga->RegistrarArchivoFuente($idTablaGeneral,300,$archivoAutorizacion, $conexion);

            $response .= $con . " registros guardados satisfactoriamente.";
            $res_gua = $this->GuardarArchivoDeLogs($aux,'LogPlano.txt');
            $response .= 'Archivo de logs líneas leídas.<br><br>' . $res_gua;
        } else {
            $aux_rut = explode("/",$nom_arc);
            $aux_nom_arc = explode(".",$nom_arc);
            $nom_arc = $aux_nom_arc[0].'.txt';
            $res_gua = $this->GuardarArchivoDeLogs($err_arc,$nom_arc);
            $response .= 'No ha sido posible cargar los registros del archivo por que éste contiene errores, corríjalos en intentelo de nuevo. 
            Se ha generado un archivo con los errores encontrados.<br><br>' . $res_gua;
        }
        $response .= '</div>';
        echo $response;
    }


    public function ValidarArchivo($inf_arc, $selCarga) {
        $men_err = '';
        $num_reg = 1;
        $flag = true;
		array_pop($inf_arc);
        foreach ($inf_arc as $lin_txt) {
            if($selCarga==1){ //valida si es asignaciones

               $res_eva = $this->EvaluarRegistro($lin_txt);
            }
            if($selCarga==2){ //valida si es soporte de matriculas
                $res_eva = $this->EvaluarRegistroMatricula($lin_txt);
            }

            if($selCarga==3){ //valida si es soporte de matriculas
                $res_eva = $this->EvaluarRegistroFirma($lin_txt);
            }

            if($selCarga==4){
                $res_eva = $this->EvaluarRegistroEstado($lin_txt);
            }

            if($selCarga==5){
                $res_eva = $this->EvaluarRegistroRefrigerios($lin_txt);
            }

            if (strlen($res_eva) > 0) {
                $men_err .= 'Error registro ' . $num_reg . ' - ' . $res_eva . "\n".PHP_EOL;
                $flag = false;
            }
            $num_reg++;
        }
        return $men_err;
    }


     private function EvaluarRegistroMatricula($lin_txt) {
        $aux_lin = explode(';', $lin_txt);
        $men_err = '';
        $men_err .= $this->EsEntero($aux_lin[0],0); //IdMatricula
        $men_err .= $this->EsEntero($aux_lin[1],1); //IdTercero
        return $men_err;
    }

     private function EvaluarRegistroFirma($lin_txt) {
        $aux_lin = explode(';', $lin_txt);
        $men_err = '';
        $men_err .= $this->EsEntero($aux_lin[0],0); //IdPreprogramacion
        return $men_err;
    }

    private function EvaluarRegistroRefrigerios($lin_txt) {
        $aux_lin = explode(';', $lin_txt);
        $men_err = '';
        $men_err .= $this->EsEntero($aux_lin[0],0); //IdPreprogramacion
        return $men_err;
    }

     private function EvaluarRegistroEstado($lin_txt) {
        $aux_lin = explode(';', $lin_txt);
        $men_err = '';
        $men_err .= $this->EsEntero($aux_lin[0],0); //IdTercero
        $men_err .= $this->EsEntero($aux_lin[1],1); //EstadoAnterior    
        $men_err .= $this->EsEntero($aux_lin[2],2); //EstadoNuevo
        return $men_err;
    }

     function EvaluarRegistro($lin_txt) {
        $persona = new clsPersona();
        $participante = new clsParticipante();
        $aux_lin = explode(';', $lin_txt);
       
        $men_err = '';
        $men_err .= $this->EsEntero($aux_lin[0],0); //pNumeroIdentificacion
        $men_err .= $this->EsEntero($aux_lin[1],1); //pTipoIdentificacion
        $men_err .= $this->EsEntero($aux_lin[4],4); //pLugarExpedicion
        $men_err .= $this->EsEntero($aux_lin[5],5); //pSexo
        $men_err .= $this->EsEntero($aux_lin[6],6); //pTelefono1
        $men_err .= $this->EsEntero($aux_lin[7],7); //pTelefono2
        $men_err .= $this->EsEntero($aux_lin[8],8); //pTelefono3
        $men_err .= $this->EsCorreoValido($aux_lin[9],9); //pCorreoElectronico
        $men_err .= $this->EsFechaValida($aux_lin[10],10); //pFechaNacimiento
        $men_err .= $this->EsEntero($aux_lin[11],11); //pGradoEscolaridad
        $men_err .= $this->EsEntero($aux_lin[12],12); //pCiudadResidencia
        $men_err .= $this->EsEntero($aux_lin[13],13); //pLocalidad
        $men_err .= $this->esFechaValida($aux_lin[14],14); //pFechaAsignacion
        $men_err .= $this->EsEntero($aux_lin[15],15); //pAgenciaEmpleo
        $men_err .= $this->EsEntero($aux_lin[16],16); //pServicio
        $men_err .= $this->EsEntero($aux_lin[17],17); //pConvocatoria
        $men_err .= $this->EsEntero($aux_lin[18],18); //pInstitutoCapacitacion
        $men_err .= $this->EsEntero($aux_lin[19],19); //pMunicipioCapacitacion
        $men_err .= $this->EsEntero($aux_lin[20],20); //pRuta
        $men_err .= $this->EsEntero($aux_lin[21],21); //pCurso
        $men_err .= $this->EsEntero($aux_lin[22],22); //pModulo
        $men_err .= $this->EsEntero($aux_lin[23],23); //pEstadoParticipante
        return $men_err;
    }


    public function LeerArchivoPlano($archivoPlano, $ubicacion) {
        $tex_arc = array();
        header('Content-Type: text/html; charset=utf-8'); 
        $rutaArchivo = $archivoPlano;
        if (file_exists($rutaArchivo)) {
            $arc_pla = @fopen($rutaArchivo, "r") or exit("No pudo leer el archivo, verifique el nombre y la ruta ".$rutaArchivo);
            $i = 0;
            while (!feof($arc_pla)) {
                $tex_arc[$i] = trim(utf8_encode(fgets($arc_pla)));
                $i++;
            }
            @fclose($rutaArchivo);
        }
    
        return $tex_arc;
    }

    public function GuardarArchivoDeLogs($err_log,$nom_arc) {
        include_once 'clsArchivo.php';
        $url_des_log = '../tmp/';
        $cls_arc  = new clsArchivo();
        $res_cre_arc = $cls_arc->CrearArchivoenServer($nom_arc, $err_log, $url_des_log);
        return $res_cre_arc;
    }
    
     private function EsEntero($pNum,$columna){
        $men_err = '';
        $options = array(
            'options' => array('min_range' => 0)
        );

       
        if (!is_numeric(trim($pNum))) {
            $men_err = "Columna : ".$columna." , (" . $pNum . ") no es un número.";
       }
        return $men_err;
    } 
    
    private function EsCorreoValido($pCorreo,$columna) {
        $men_err = '';
        if (!filter_var(trim($pCorreo), FILTER_VALIDATE_EMAIL)) {
            $men_err = "Columna : ".$columna." , correo (" . $pCorreo . ") no  válido.";
        }
        return $men_err;
    }
 
    private function EsFechaValida($pFechaP,$columna) {
        $men_err = '';
        $pFecha = $this->ConvertirFecha($pFechaP);
        if (preg_match("^[0-9]{4}-[01][0-9]-[0-3][0-9]$^", $pFecha)) {
            list( $ano, $mes, $dia ) = explode('-', $pFecha);
            if (!checkdate($mes, $dia, $ano)) {
                $men_err = "Columna : ".$columna.", fecha " . $pFecha . " no válida. ";
            }
        } else {
            $men_err = "Columna : ".$columna." Fecha " . $pFecha . " no válida. ";
        }
        return $men_err;
    }
    
    public function ConvertirFecha($pFecha){
    $nuevaFecha = "";
    if (strpos($pFecha, '-') !== false){
        $aux = explode("-",$pFecha);
        if(strlen($aux[0])>3){
             $nuevaFecha = $pFecha;
        }else{
             list( $dia , $mes, $ano) = explode('-', $pFecha);
            $nuevaFecha = $ano.'-'.$mes.'-'.$dia;
        }
    }else if (strpos($pFecha, '/') !== false){
        $aux = explode("/",$pFecha);
        if(strlen($aux[0])>3){
            list( $ano , $mes, $dia) = explode('/', $pFecha);
            $nuevaFecha = $ano.'-'.$mes.'-'.$dia;
        }else{
             list( $ano , $mes,$dia ) = explode('/', $pFecha);
            $nuevaFecha = $dia.'-'.$mes.'-'.$ano;
        }
    }
    return $nuevaFecha;
   }
    
    
    public function ImprimirArreglo($arr) {
        $i = 0;
        foreach ($arr as $var) {
            echo '$array[' . $i . '] : ' . $var . '<br>';
            $i++;
        }
    }
	
	public function CargarListaCargasMasivas($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARTIPOCARGAMASIVA();";        
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

	public function cargarOpcionesArchivos($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTAROPCIONESARCHIVOS($valor);"; 
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
}

?>