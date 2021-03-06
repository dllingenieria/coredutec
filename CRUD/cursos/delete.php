<?php
include dirname(__FILE__) . '/../../BD/conexionBD.php';
          
$id = 0;
if (!empty($_GET['id'])) {
  $id = $_REQUEST['id'];
}

if ( !empty($_POST)) {
  $id = $_POST['id'];
  $bd = new conexionBD(); 
  $result = $bd -> query("DELETE FROM TCURSO WHERE Id =" . $id);
  header("Location: index.php");
}
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
  <div class="container">
    <div class="span10 offset1">
      <div class="row">
        <h3>Eliminar Curso</h3>
      </div>
      <form class="form-horizontal" action="delete.php" method="post">
        <input type="hidden" name="id" value="<?php echo $id;?>"/>
        <p class="alert alert-error">Está seguro que desea eliminar?</p>
        <div class="form-actions">
          <button type="submit" class="btn btn-danger">Sí</button>
          <a class="btn btn-success" href="index.php">No</a>
        </div>
      </form>
    </div>
  </div> <!-- /container -->
</body>
</html>
