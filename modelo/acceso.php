<?php
require("../controlador/session.php");
set_time_limit(0);

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of acceso
 *
 * @author ADMIN
 */
class acceso {

    //put your code here
    function login($param) {
        extract($param);
		$rs = null;
        $sql = "CALL LOGIN('$usuario','$contrasena');";
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

    function registrarTercero($param) {
        extract($param);
		$rs = null;
        $sql = "CALL AGREGAR_TERCERO('$nombre','$apellido',$cedula,'$usuario','$contrasena');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                $array = 1;
            }
        } else {
            $array = 0;
        }

        echo json_encode($array);
    }

    function buscarCedula($param) {
        extract($param);
		$rs = null;
        $sql = "CALL CONSULTAR_CEDULA($identificacion);";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
                foreach ($filas as $fila) {
                    $array[] = $this->codificarEnUtf8($fila);
                }
            }
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function codificarEnUtf8($fila) {
        $aux;
        foreach ($fila as $value) {
            $aux[] = utf8_encode($value);
        }
        return $aux;
    }

    function buscarDocumento($param) {
        extract($param);
		$rs = null;
        $sql = "CALL CONSULTAR_DOCUMENTO1($identificacion);";
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

    function imprimirMatricula($param) {
        extract($param);
		$rs = null;
        $identificacion = $_SESSION['identificacion'];
        $sql = "CALL CONSULTAR_DOCUMENTO1($identificacion);";
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

    function actualizarTercero($param) {
        extract($param);
		$rs = null;
        $sql = "CALL AGREGAR_OBSERVACIONES('$cedula','$observacion');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            $array = 1;
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function insertarT($param) {
        extract($param);
        $cedula = 1;
        $observacion = 'Neira';
		$rs = null;
        $sql = "CALL AGREGAR_PARTICIPANTE_40(4,75290925,'manizales','juan pablo','cardona naranjo',6,'1979-09-06',8,'1','2','3',18,'cor@gmail.com','direccion resi','barrio',29,'A','dasdad','dadadad','2016-01-01','lajfljsañljdf',42,'dadad',  'dadafdada');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            $array = 1;
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    function insertarMunicipio($param) {
        extract($param);
        $cedula = 1;
        $observacion = 'Neira';
		$rs = null;
        $sql = "CALL AGREGAR_MUNICIPIO('$cedula','$observacion');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            $array = 1;
        } else {
            $array = 0;
        }
        echo json_encode($array);
    }

    public function inscribirParticipante($nit, $tip_nit, $lug_exp, $nom_com, $ape_com, $gen_par, $est_civ, $tel1, $tel2, $tel3, $gra_esc, $fec_nac, $cor_ele, $dir_res, $bar, $cod_loc, $nom_loc, $ciu, $cod_cur, $des_rut, $con, $fec_rem, $nov, $age, $mod_tic, $sed_cap, $param) {
//        extract($param);
//        echo "prueba";
        $conexion = new PDO('mysql:host=190.0.49.18;dbname=CET;charset=utf8', 'dit', 'o4Dv5HoM');
        $response = ''; //        $sql = "CALL AGREGAR_PARTICIPANTE_40($nit, $tip_nit, $lug_exp, $nom_com, $ape_com, $gen_par, $est_civ, $tel1, $tel2, $tel3, $gra_esc, $fec_nac, $cor_ele, $dir_res, $bar, $cod_loc, $nom_loc, $ciu, $cod_cur, $des_rut, $con, $fec_rem, $nov, $age, $mod_tic, $sed_cap);";
        $sql = "INSERT INTO CET.tbl_municipio('departamento','nombre') VALUES('manizales' ,'33');";

//        if ($rs = $conexion->getPDO()->query($sql)) {
        $conexion->exec($sql);
//        if ($rs = $conexion->exec($sql)) {
//            echo "conexion : " . $conexion;
//            if ($filas = $rs->fetchAll(PDO::FETCH_ASSOC)) {
//                $array = 1;
//                $response = 'Registros guardados satisfactoriamente';
//            }
//        } else {
//            $array = 0;
//            $response = 'hubo problemas con la bd';
//        }
//        echo $response;
    }

}

?>
