<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of clsControlador_Sesion
 *
 * @author user
 */
class clsControlador_Sesion {

    function __construct() {
		if(isset($_SESSION['idTercero'] ))
		{
        	// session_start();
			// print_r("hay sesion");
			// print_r($_SESSION['idTercero']);
		}
		else{
			// print_r("no hay sesion");
			session_start();
			
			
		}
    }

    public function iniciarSesion($nom_com, $id_tercero, $id_usu_real, $roles) {
		
		
        $_SESSION['idTercero'] = $id_tercero;
        $_SESSION['idUsuario'] = $id_usu_real;
        $_SESSION['nombreUsuario'] = $nom_com;
        $rolesUsuario = explode (",",$roles);
        $esAdministrador = strcmp($rolesUsuario[0], "1") === 0;
        $esDocente = strcmp($rolesUsuario[1], "1") === 0;
        $esMatriculador = strcmp($rolesUsuario[2], "1") === 0;
        $esCallCenter = strcmp($rolesUsuario[3], "1") === 0;
        $_SESSION['esAdministrador'] = $esAdministrador;
        $_SESSION['esDocente'] = $esDocente;
        $_SESSION['esMatriculador'] = $esMatriculador;
        $_SESSION['esCallCenter'] = $esCallCenter;
        $_SESSION['ult_mov'] = '';
		
		// print_r($_SESSION);
    }
 
    public function destruirSesion() {
        $parametros_cookies = session_get_cookie_params();
        setcookie(session_name(), 0, 1, $parametros_cookies["path"]);
        session_destroy();
    }

}

?>
