$(function(){
	var asistencia = JSON.parse(sessionStorage.asistencia);
	console.log(asistencia);

	var html;
	// for (var j = 1; j <= 40; j++) {
		for (var i = 0; i < asistencia.length; i++) {
			var estudiante = asistencia[i];
			html = '<tr>'+
			'<th>'+(i)+'</th>'+
			'<th>'+estudiante.Apellidos+'</th>'+
			'<th>'+estudiante.Nombres+'</th>'+
			'<th>'+estudiante.NumeroIdentificacion+'</th>'+
			'<th>'+estudiante.LugarExpedicion+'</th>'+
			'<th>'+estudiante.CorreoElectronico+'</th>'+
			'<th>'+estudiante.Telefono1 +" / "+ estudiante.Telefono2 +" / "+ estudiante.Telefono3 +'</th>'+
			'<th>'+sessionStorage.fecha +'</th>'+
			'<th></th>'+
			'</tr>';
			$("#tablaAsistencia").last().append(html);
		}
	// }
	
});