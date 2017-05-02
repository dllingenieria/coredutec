<?php

include("MPDF/mpdf.php");

function Ver_pdf($contenido, $nombre_archivo) {
    $mpdf = new mPDF();
    $mpdf->charset_in = 'UTF-8';
    $body = obtenerBody($contenido);
    $stylesheet = file_get_contents('../libs/css/facturaPDF.css');
//    $stylesheet = file_get_contents('factura.css');
    $mpdf->WriteHTML($stylesheet, 1);
    $mpdf->WriteHTML($body);
    $ext = strtoupper(substr($nombre_archivo, -4));
    $nombre = ($ext == ".PDF") ? $nombre_archivo : $nombre_archivo.='.pdf';
    $mpdf->Output($nombre, 'F');
    exit;
}

function obtenerCSS($html) {
    @ $auxHead = explode('<head>', $html);
    @ $auxHead2 = explode("</head>", $auxHead[1]);
    @ $head = str_replace("<", "|", $auxHead2[0]);
    @$elements = explode(">", $head); //Tags que se encuentran dentro del header
    for ($i = 0; $i < count($elements); $i++) {
        if (strpos($elements[$i], 'link') != false) { //Elementos del head que empiezan por <link
            if (strpos($elements[$i], 'type="text/css"') != false) { //Valida que sea css
                $css_aux = explode('"', substr($elements[$i], strpos($elements[$i], 'href=')));
                $css[] = "'" . $css_aux[1] . "'";
            }
        }
    }
    return $css;
}

function obtenerBody($html){
    @$auxBody = explode("<body>", $html);
    @$auxBody2 = explode("</body>", $auxBody[1]);
    @$body = $auxBody2[0];
//    $body2 = str_replace('style="width:100%"', 'style="width:21cm"', $$body1);
//    $body3 = str_replace('style="width:21cm', 'style="width:21cm"', $$body2);
    return str_replace('style="width:100%"', 'style="width:21cm"', $body);
}

function CopiarLogo($nit_empresa) {
    $ruta_destino = '../../clauserp/logos/';
    $ruta_emp_img = file_get_contents('http://localhost/cgi-bin/clauspro/WWCO000A.PHP?empre=' . $nit_empresa) . 'FORMATO/';
    $logoOrigen = $ruta_emp_img . $nit_empresa . '.jpg';
    $logoDestino = $ruta_destino . $nit_empresa . '.jpg';
    if (!file_exists($logoDestino)) {
        copy($logoOrigen, $logoDestino);
    }
}

?>
