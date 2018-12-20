<?php
//Conexion local
$servername = "localhost";
$username = "sirex";
$database = "SINFOMPC";
$password = "x0uJcss2";

//Conexion remota
/*$servername = '201.217.194.205';
$username = 'DLL-Ingenieria';
$database = 'SINFOMPC'; 
$password = 'd09;LU>l';*/

//  Create a new connection to the MySQL database using PDO
$pdo = new PDO('mysql:host='.$servername.';dbname='.$database.'', $username, $password);


if ($pdo->connect_error) {
    die("Conexion no realizada: " . $pdo->connect_error);
}else{
	$sql = "CALL SPACTUALIZARESTADOSALONESPORFECHAINICIO()";
	$pdo->query($sql);
	$pdo = null;
	echo "Conexion y actualizacion satisfactoria";
}
?>