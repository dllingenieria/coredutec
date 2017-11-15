<?php

if(@$_GET['accion']==1)
{
	$accion ="estudiante";
}
elseif(@$_GET['accion']==2)
{
	$accion ="casoEspecial";
}
elseif(@$_GET['accion']==3)
{
	$accion ="convocatoria";
}
@$tipoSoporte=$_GET['tipoSoporte'];

$nombreCortoConvocatoria =  @$_GET['nombreCortoConvocatoria'];
$descripcion =  @$_GET['descripcion'];


?>

<html>
<head>
	<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
	<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
	<script src="../includes/jquery.cookie.js"></script>
	<link rel="stylesheet" type="text/css" href="dropzone.css">
	<script type="text/javascript" src="dropzone.js"></script>
	<script type="text/javascript" src="dropzone-config.js"></script>
	
</head>

<script type="text/javascript">
//borrar cookie
document.cookie = "nombreCortoConvocatoria=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
$.cookie("nombreCortoConvocatoria","<?php echo @$nombreCortoConvocatoria; ?>" ); 
</script>

<style>

.swal-modal
{
	width:305px
	height:200px;
}
</style>

<body>
<div>
<form action="receptor.php?accion=<?php echo @$accion; ?>&tipoSoporte=<?php echo @$tipoSoporte ?>&fechaInicial=<?php echo @$_GET['fechaInicial'] ?>&fechaFinal=<?php echo @$_GET['fechaFinal']; ?>&convocatoria=<?php echo  @$_GET['convocatoria']; ?>&descripcion=<?php echo  @$_GET['descripcion']; ?>" class="dropzone needsclick dz-clickable" id="subir-imagen">
		<div class="dz-message needsclick">
			Arraste su archivo o click para seleccionar
		</div>
		
</div>

</body>