<?php
require("../controlador/session.php");
set_time_limit(0);
class clsSede {

    public function consultarSedes($param) {
        extract($param);
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCARGARSEDES();";
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
}
?>