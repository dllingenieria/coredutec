$(function() {
    fecha();
    recuperarDatos();

    var fecha1;
    var mes;

    function fecha() {
        var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
        var f = new Date();
        fecha1 = (f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear());
        mes = meses[f.getMonth()];
    }

    function recuperarDatos() {
        var today = new Date();
        var olday = new Date($.cookie("eda_usu"));
        $("#nombres").val($.cookie("nom_usu"));
        $("#nombresyapellidos2").val($.cookie("nom_usu"));
        $("#nombresyapellidos3").val($.cookie("nom_usu"));
        $("#nombres1").val($.cookie("nom_usu"));
        $("#estadocivil").val($.cookie("est_civ"));
        $("#telefono1").val($.cookie("tel_fij"));
        $("#telefono2").val($.cookie("tel_cel"));
        $("#telefono3").val($.cookie("tel_alt"));
        $("#correo").val($.cookie("cor_ele"));
        $("#escolaridad").val($.cookie("gra_esc"));
        $("#expedicion").val($.cookie("lug_exp"));
        $("#localidad").val($.cookie("loc_usu"));
        $("#identificacion").val($.cookie("ide_usu"));
        $("#identificacion1").val($.cookie("ide_usu"));
        $("#identificacion3").val($.cookie("ide_usu"));
        $("#fecha").val($.cookie("fec_matr"));
        $("#fecha_a").val($.cookie("fec_matr"));
        $("#fecha_b").val($.cookie("FechaInicialCurso"));
        $("#edad").val(dateDiff(olday,today));
        //$("#edad").val($.cookie("eda_usu"));
        $("#mes").val(mes);
        $("#fecha1").val($.cookie("fec_matr"));
        $("#mes1").val(mes);
        $("#rutanumero2").val($.cookie("rut_num"));
        $("#codigocurso2").val($.cookie("cod_cur"));
        $("#tipodeservicio2").val($.cookie("tip_ser"));
        $("#nombrecurso2").val($.cookie("nom_cur"));
        $("#nom_cur2").val($.cookie("nom_cur"));
        $("#numero").val($.cookie("rut_num"));
        $("#ruta_for").val($.cookie("rut_num"));
        $("#codigocurso2").val($.cookie("cod_cur"));
        $("#codigocurso3").val($.cookie("cod_cur"));
        $("#duracioncurso2").val($.cookie("dur_cur"));
        $("#modalidad2").val($.cookie("mod_cur"));
        $("#sede2").val($.cookie("sed_cur"));
        $("#sede3").val($.cookie("sed_cur"));
        $("#docente2").val($.cookie("doc"));
        $("#matriculadoen2").val($.cookie("mat"));
        $("#matriculadoen3").val($.cookie("mat"));
        $("#docente3").val($.cookie("doc"));
        $("#estado2").val($.cookie("est_cur"));
        $("#curso").val($.cookie("cod_cur"));
        $("#horario2").val($.cookie("hor_cur"));
        $("#horario3").val($.cookie("hor_cur"));
        $("#modulo2").val($.cookie("mod"));
        $("#duracionmodulo2").val($.cookie("dur_mod"));
        $("#mes").val($.cookie("mes_asi"));
        $("#mesasignacion2").val($.cookie("mes_asi"));
        $("#idMatricula").val($.cookie("id_mat"));
        $("#idMatricula2").val($.cookie("id_mat"));
    }

    function dateDiff(dateold, datenew){
      var ynew = datenew.getFullYear();
      var mnew = datenew.getMonth();
      var dnew = datenew.getDate();
      var yold = dateold.getFullYear();
      var mold = dateold.getMonth();
      var dold = dateold.getDate();
      var diff = ynew - yold;
      if(mold > mnew) diff--;
      else
      {
        if(mold == mnew)
        {
          if(dold > dnew) diff--;
        }
      }
      return diff;
    }
});
