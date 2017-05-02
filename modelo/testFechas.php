<?php


    function ConvertirFecha($pFecha){
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


    $f1 = "02/07/2010";
    $f2 = "02-07-2010";
    $f3 = "2010-07-02";
    $f4 = "2010/07/02";

    echo ConvertirFecha($f4);
?>