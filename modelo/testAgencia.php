<?php
require("../controlador/session.php");
set_time_limit(0);
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

include 'clsGestorBDPlanas.php';

$gestor = new clsGestorBDPlanas();
echo $gestor->cargarDesdeAgencia('../anexos/Formatos/ingresoAgencia.txt');

?>
