<?php 
// session_start();
// if (empty($_SESSION["user"]) || empty($_SESSION["pass"])) {
// 	session_unset(); 
// 	session_destroy(); 
// 	header("Location: ../");
// }
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
	<link href="../crud.css" rel="stylesheet">
	<!-- Jquery CDN -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<!-- Latest compiled and minified Bootstrap JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
</head>

<body>
<nav class="navbar navbar-default navbar-static-top">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">Administrador</a>
			</div>
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<!-- <li><a href="../slider">Slider</a></li>
					<li><a href="../lineas">Lineas</a></li>
					<li><a href="../trabajos">Trabajos</a></li>
					<li><a href="../clientes">Clientes</a></li>
					<li class="active"><a href="../nosotros">Nosotros</a></li>
					<li><a href="../aliados">Aliados</a></li> -->
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><a href="../index.php?logout=yes">Salir</a></li>
				</ul>
			</div><!--/.nav-collapse -->
		</div>
	</nav>
	<div class="container">
		<div class="row">
			<h3>Gestión de Cursos</h3>
		</div>
		<div class="row">
			<p>
				<a href="create.php" class="btn btn-success">Agregar</a>
			</p>
			<table class="table table-striped table-bordered">
				<thead>
					<tr>
						<th>ID</th>
						<th>CÓDIGO</th>
						<th>NOMBRE</th>
						<th>DURACIÓN</th>
						<th>RUTA</th>
						<th>ESTADO</th>
						<th>ACCIÓN</th>
					</tr>
				</thead>
				<tbody>
					<?php
					include dirname(__FILE__) . '/../../BD/conexionBD.php';
					$bd = new conexionBD();   
					$rows = $bd -> select("SELECT * FROM `TCURSO`");
					foreach ($rows as $row) {
						echo '<tr>';
						echo '<td>'. $row['Id'] . '</td>';
						echo '<td>'. $row['Codigo'] . '</td>';
						echo '<td>'. $row['Nombre'] . '</td>';
						echo '<td>'. $row['Duracion'] . '</td>';
						echo '<td>'. $row['Ruta'] . '</td>';
						echo '<td>'. $row['Estado'] . '</td>';
						echo '<td width=250>';
						echo '<a class="btn btn-success" href="update.php?id='.$row['Id'].'">Modificar</a>';
						echo ' ';
						echo '<a class="btn btn-danger" href="delete.php?id='.$row['Id'].'">Eliminar</a>';
						echo '</td>';
						echo '</tr>';
					}
					?>
				</tbody>
			</table>
		</div>
	</div>
</body>
</html>