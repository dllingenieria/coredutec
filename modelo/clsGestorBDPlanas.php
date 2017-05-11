<?php

/**
 * Description of clsGestorBDPlanas
 * @author Wilmer Andres Escobar Naranjo
 * wilesna25@gmail.com
 */
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
    
    public function CargarArchivoPlano($param) {
        $response = '<div id="men_err">';
        extract($param);
        include_once './clsParticipante.php';
        $participante = new clsParticipante();
        $inf_arc = $this->LeerArchivoPlano(str_replace('"', "", $nom_arc));
        $err_arc = $this->ValidarArchivo($inf_arc);
        $con = 0;
        $numInsercion = 1;
        $aux = ''; print_r($err_arc);
        if (strlen($err_arc) === 0) {
            foreach ($inf_arc as $lin_txt) {
                if(strlen(trim($lin_txt))>0){
                    $aux .= "numInsercion,lin_txt : ".$numInsercion.' -- '.$lin_txt.PHP_EOL;
					//se agrega parametro $actualizarTercero
                    $con = $con + $participante->InscribirParticipante($numInsercion,$lin_txt, $conexion,$pIdJornada,$actualizarTercero);
                    $numInsercion ++;
                }
                
            }
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

    public function ValidarArchivo($inf_arc) {
        $men_err = '';
        $num_reg = 1;
        $flag = true;
		array_pop($inf_arc);
        foreach ($inf_arc as $lin_txt) {
            $res_eva = $this->EvaluarRegistro($lin_txt);
            if (strlen($res_eva) > 0) {
                $men_err .= 'Error registro ' . $num_reg . ' - ' . $res_eva . "\n".PHP_EOL;
                $flag = false;
            }
            $num_reg++;
        }
        return $men_err;
    }

    private function EvaluarRegistro($lin_txt) { 
        $persona = new clsPersona();
        $participante = new clsParticipante();
        $aux_lin = explode(';', $lin_txt);
        $men_err = '';
        $men_err .= $this->EsEntero($aux_lin[0],0);
        $men_err .= $this->EsEntero($aux_lin[1],1);
        $men_err .= $this->EsEntero($aux_lin[4],4);
        $men_err .= $this->EsEntero($aux_lin[5],5);
        $men_err .= $this->EsEntero($aux_lin[6],6);
        $men_err .= $this->EsEntero($aux_lin[7],7);
        $men_err .= $this->EsEntero($aux_lin[8],8);
        $men_err .= $this->EsCorreoValido($aux_lin[9],9);
        $men_err .= $this->EsFechaValida($aux_lin[10],10);
        $men_err .= $this->EsEntero($aux_lin[11],11);
        $men_err .= $this->EsEntero($aux_lin[12],12);
        $men_err .= $this->EsEntero($aux_lin[13],13);
        $men_err .= $this->esFechaValida($aux_lin[14],14);
        $men_err .= $this->EsEntero($aux_lin[15],15);
        $men_err .= $this->EsEntero($aux_lin[16],16);
        $men_err .= $this->EsEntero($aux_lin[17],17);
        $men_err .= $this->EsEntero($aux_lin[18],18);
        $men_err .= $this->EsEntero($aux_lin[19],19);
        $men_err .= $this->EsEntero($aux_lin[20],20);
        $men_err .= $this->EsEntero($aux_lin[21],21);
        $men_err .= $this->EsEntero($aux_lin[22],22);
        $men_err .= $this->EsEntero($aux_lin[23],23);
        $men_err .= $this->EsEntero($aux_lin[24],24);
		
        return $men_err;
    }

    public function LeerArchivoPlano($archivoPlano) {
        $tex_arc = array();
        header('Content-Type: text/html; charset=utf-8'); 
        $rutaArchivo = "../anexos/Formatos/".$archivoPlano;
        if (file_exists($rutaArchivo)) {
            $arc_pla = @fopen($rutaArchivo, "r") or exit("No pudo leer el archivo, verifique el nombre y la ruta ../anexos/Formatos/".$rutaArchivo);
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
        $sql = "CALL SPCARGARLISTACARGAMASIVAS();";        
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



