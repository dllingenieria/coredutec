<?php
require("../controlador/session.php");
set_time_limit(0);
/**
 * Clase para procedimientos que se pueden usar en toda la aplicacion
 *
 * @author John James Granados Restrepo
 */
class clsAsignacion {
    
   //----- Función para buscar si un curso ya fue asignado a un oferente, de lo contrario carga toda la info -----//
   public function CargarCursosPorCodigo($param) {
        extract($param);
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPCONSULTARCURSOSPORCODIGOASIGNACION($pCodigoCurso,$pTipoIdentificacion,$pNumeroIdentificacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            }
        } else {
            $array = 0;
        }
        $rs->closeCursor();
        echo json_encode($array);
    }

}
?>
