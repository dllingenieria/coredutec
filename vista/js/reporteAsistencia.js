$(function(){
	if (typeof(sessionStorage.IdPreprogramacion) === "undefined") {
		window.location.href = "docente.html";
	}

	$.post("../../controlador/fachada.php", {
		clase: 'clsAsistencia',
		oper: 'consultarAsistenciaEstudiantes',
		idPreprogramacion: sessionStorage.IdPreprogramacion
	}, function(data) {
		console.log(data);
		if (data !== 0) {
			if(data !== null){
				var newData = data.filter(function(info){
					var asistencia = Number(info[3]);
					if (sessionStorage.filtro === "0") {
						return  asistencia === 0;
					}else if(sessionStorage.filtro === "1"){
						return asistencia > 0 ;
					}
					return true;
				});
				console.log("NewData" + newData);
				cargarInformacionEnTabla(newData);
			}else{alert("error 1");}             
		}else {alert("error 2");}
	}, "json");

	function cargarInformacionEnTabla(data){
		var table = $('#tablaModulos').DataTable({
			"data": data,
			columns: [
			{ title: "Id Tercero" },
			{ title: "Nombre" },
			{ title: "Teléfono" },
			{ title: "Horas Asistidas" },],
			"paging":   false,
			"info":     false,
			"order": [[ 3, "asc" ]],
			"scrollY": "300px",
			"scrollX": true,
			"scrollCollapse": true,
			"columnDefs": [{"targets": [ 0 ],"visible": false,"searchable": false}],
			"language": {
				"sSearch": "Filtrar:",
				"zeroRecords": "Ningún resultado encontrado",
				"infoEmpty": "No hay registros disponibles",
				"Search:": "Filtrar"
			}
		});
	}
});