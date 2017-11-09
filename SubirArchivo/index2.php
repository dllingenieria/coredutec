<?php



$nombreCortoConvocatoria =  @$_GET['nombreCortoConvocatoria'];
$accion =  @$_GET['accion'];
// echo $accion."fff";

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

document.cookie = "accion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
$.cookie("accion","<?php echo @$accion; ?>" ); 
</script>

<style>

</style>

<body>


</body>