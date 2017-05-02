<?php 
include dirname(__FILE__) . '/../../BD/conexionBD.php';

if ( !empty($_POST)) {
	$bd = new conexionBD();   
	$Codigo = (!empty($_POST['Codigo']))?$_POST['Codigo']:"";
	$Nombre = (!empty($_POST['Nombre']))?$_POST['Nombre']:"";
	$Duracion = (!empty($_POST['Duracion']))?$_POST['Duracion']:0;
	$Ruta = (!empty($_POST['Ruta']))?$_POST['Ruta']:0;
	$Estado = (!empty($_POST['Estado']))?$_POST['Estado']:0;
	$bd -> query("INSERT INTO `TCURSO` (`Codigo`,`Nombre`,`Duracion`,`Ruta`,`Estado`) 
		VALUES (" . $bd->quote($Codigo) .",
		" . $bd->quote($Nombre) .",
		" . $bd->quote($Duracion) .",
		" . $bd->quote($Ruta) .",
		" . $bd->quote($Estado) .")");
	header("Location: index.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
	<link href="../crud.css" rel="stylesheet" type="text/css">
	<!-- Jquery CDN -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<!-- Latest compiled and minified Bootstrap JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
</head>

<body>
	<div class="container">
		<div class="span10 offset1">
			<div class="row">
				<h3>Agregar Curso</h3>
			</div>
			<form class="form-horizontal" action="create.php" method="post">
				<div class="control-group">
					<label class="control-label">Codigo</label>
					<div class="controls">
						<input required name="Codigo" class="inputText" type="text" value="<?php echo !empty($Codigo)?$Codigo:'';?>">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Nombre</label>
					<div class="controls">
						<input required name="Nombre" class="inputText" type="text" value="<?php echo !empty($Nombre)?$Nombre:'';?>">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Duracion</label>
					<div class="controls">
						<input required name="Duracion" class="inputText" type="number" value="<?php echo !empty($Duracion)?$Duracion:'';?>">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Ruta</label>
					<div class="controls">
						<input required name="Ruta" class="inputText" type="number" value="<?php echo !empty($Ruta)?$Ruta:'';?>">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Estado</label>
					<div class="controls">
						<input required name="Estado" class="inputText" type="number" value="<?php echo !empty($Estado)?$Estado:'';?>">
					</div>
				</div>
				<div class="form-actions">
					<button type="submit" name="submit" class="btn btn-success">Agregar</button>
					<a class="btn" href="index.php">Volver</a>
				</div>
			</form>
		</div>
	</div>
</body>
</html>
