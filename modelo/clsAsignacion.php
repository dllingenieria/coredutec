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
            $rs->closeCursor();
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para guardar la informacion de un oferente -----//
   public function guardarOferente($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGAROFERENTE($pTipoIdentificacion,$pNumeroIdentificacion,$pExpedicion,'$pNombres','$pApellidos','$pFechaN',$pSexo,$pEstadoCivil,$pGradoEscolaridad,$pTelefono1,$pTelefono3,$pTelefono3,'$pDireccion','$pEmail1','$pEmail2',$pLocalidad,$pCiudad,".$IdUsuario.");";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    //----- Función para guardar la nueva asignacion -----//
   public function guardarAsignacion($param){
        extract($param);
        $IdUsuario = $_SESSION['idUsuario'];
        $rs = null;
        $conexion->getPDO()->query("SET NAMES 'utf8'");
        $sql = "CALL SPAGREGARASIGNACION($pIdTablaGeneral,'$pArchivo','$pFechaAsignacion',$pAgenciaEmpleo,$pServicioCapacitacion,$pConvocatoria,$pInstitutoCapacitacion,$pMunicipioCapacitacion,$pRuta,'$pCodigoCurso','$pCodigoModulo',$pEstadoParticipante,'$pNovedadEstado',$pTipoIdentificacion,$pNumeroIdentificacion,".$IdUsuario.");";
        //print_r($sql);
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $fila;
                }
            $rs->closeCursor();
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }
}
?>
