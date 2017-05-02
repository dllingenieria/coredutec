$(function() {
	$("#filtrarAsistencia").click(function(){
		sessionStorage.filtro = $("#tipoDeFiltro").val();
		window.location.href = "reporteAsistencia.html";
	});
});