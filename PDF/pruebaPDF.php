<?php

include('GenerarPDF.php');
//$html = Documento();
Ver_pdf(Documento(), "Factura");

function Documento() {
    $doc = '<table cellpadding="0" cellspacing="0" style="width:21cm;border:0px solid black;">
        <tr style="height:1mm"><td rowspan="7" style="width:1mm"></td><td></td></tr><tr>
            <td colspan="2"><table style="width:22cm" cellpadding="0" cellspacing="0">
                    <tr valign="bottom">
                        <td>
                            <table cellpadding="0" cellspacing="0"><tr><td><img src="000900343574.jpg"/></td></tr><tr><td class="encFac1">SOFTWARE DE COLOMBIA                                    <br/> NIT     800,241,389-5</td></tr>
                                <tr><td class="encFac2" style="display:inline">Cra 23 # 74A - 71 Edificio ANDI Of 906                       MANIZALES                      - CALDAS                         <br/> Telefono: 8874737                                                      <br/>info@softwaredecolombia.com                                  </td></tr>
                            </table>
                        </td>
                        <td style="vertical-align: bottom">
                            <table cellpadding="0" cellspacing="0">
                                <tr>
                                    <td></td>
                                </tr>
                            </table>
                        </td>
                        <td style="vertical-align: bottom">
                            <table style="width:22cm" cellpadding="0" cellspacing="0">
                                <tr align="center"><td colspan="2" class="encFac1">FACTURA DE VENTA <br/>No.                            3213</td></tr>
                                <tr style="height:10px"><td colspan="2"></td></tr>
                                <tr style="background-color:#C0C0C0;height:5px"><td colspan="2"></td></tr>
                                <tr align="center" style="background-color:#C0C0C0" class="encFac1"><td>Expedida</td><td>Vence</td></tr>
                                <tr style="background-color:#C0C0C0;height:5px"><td colspan="2"></td></tr>
                                <tr align="center" class="encFac3"><td>2013/11/20</td><td>2013/12/04</td></tr>
                                <tr style="height:10px"><td colspan="2"></td></tr>
                                <tr align="center"><td colspan="2" class="encFrase"><b>Cancelada de Contado</b></td></tr>
                            </table>
                        </td>
                    </tr>
                </table></td>
        </tr><!-- Fin Encabezado -->

        <!-- Ini Datos Cliente -->
        <tr>
            <td colspan="2">
                <table cellpadding="0" cellspacing="2" class="encFac2 tabCli" border="1" rules="all" style="width:22cm">
                    <tr class="altFilCli">
                        <td class="centCelda"><b>Cliente:</b> 
                            ASOCIACION DE COMERCIANTES EN VIVERES Y ABARROTES DE CARTAGENA        
                        </td>
                        <td class="centCelda"><b>Nit:</b>     890,481,551-9</td>
                    </tr>
                    <tr class="altFilCli">
                        <td class="centCelda"><b>Direcci&oacute;n:</b> LOS LAURELES TURBACO                                                                                          
                        </td>
                        <td class="centCelda"><b>Tel:</b> 6625081                                                     </td>
                    </tr>
                    <tr class="altFilCli">
                        <td class="centCelda"><b>Ciudad:</b> TURBACO                        - BOLIVAR                       
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr><!-- Fin Datos Cliente -->

        <!-- Ini Detalles -->
        <tr>
            <td colspan="2">
                <table cellpadding="0" cellspacing="3" style="width:22cm;border:1px solid black;">
                    <tr class="encFac4 altFilDet" style="background-color:#DDDDDD" valign="middle">
                        <th style="width:8%" align="left" class="centCelda">C&oacute;digo</th>
                        <th style="width:43%" class="centCelda">Descripcion</th>
                        <th style="width:8%" align="right" class="centCelda">IVA</th>
                        <th style="width:6%" class="centCelda">Cant</th>
                        <th style="width:16%" align="right" class="centCelda">Valor Unitario</th>
                        <th style="width:16%" align="right" class="centCelda">Valor Total</th>
                    </tr>
                    <tr class="encFac2 altFilDet tamLetDet">
                        <td class="centCelda">25             </td>
                        <td class="centCelda">SERVICIO CLAUSERP - PLAN COMERCIANTE 7% SMLV     </td>
                        <td align="right" class="centCelda"> 16%</td>
                        <td align="right" class="centCelda">          1.00</td>
                        <td align="right" class="centCelda">1,000,000.00</td>
                        <td align="right" class="centCelda">$1,000,000.00</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet">
                        <td colspan="6" class="centCelda">&nbsp;</td>
                    </tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr class="encFac2 altFilDet"><td colspan="6" class="centCelda">&nbsp;</td></tr>
                    <tr>
                        <td colspan="6">
                            <table style="width:22cm" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="width:50%"></td>
                                    <td>
                                        <table style="width:22cm" cellpadding="0" cellspacing="0">
                                            <tr class="encFac4 altFilDet"><td>Sub Total              </td>
                                                <td align="right">$1,000,000.00</td></tr>
                                            <tr class="encFac2 altFilDet">
                                              <td>I.V.A                                   </td>
                                              <td align="right">$160,000.00</td>
                                            </tr>
                                            <tr class="encFac2 altFilDet">
                                                <td><b>Pago/Abono de Contado</b>            </td>
                                                <td align="right">$1,120,000.00</td>
                                            </tr>
                                            <tr class="encFac4 altFilDet">
                                                <td>RETENCION SERVICIOS                     </td>
                                                <td align="right">$40,000.00</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr><!-- Fin Totales -->
                </table>
            </td>
        </tr><!-- Fin Detalles -->
        <tr>
            <td colspan="2">
                <table cellpadding="0" cellspacing="0" style="width:22cm;border:1px solid black;">
                    <tr>
                        <td>
                            <span class="encFac5">Son: UN MILLON CIENTO VEINTE MIL PESOS M/L                                                                                                                                                    </span>
                        </td>
                    </tr><tr><td class="encFac5">
                        </td></tr><tr><td class="encFac2">
                        </td></tr>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <table cellpadding="0" cellspacing="0" style="width:22cm;border:1px solid black;">
                    <tr class="encFac2">
                        <td>
                            <p style="text-align:justify">

                                Resolucion Dian No. 100000070274 Fecha 2013-02-18 Tipo 02 Factura por Computador desde No 3001 hasta No 6000.                                                                                                                                             

                                <br/>

                                Esta factura se asimila en sus efectos a una letra                                                                                                                                                                                                        
                                de cambio articulo 774 del codigo de comercio y su cancelacion despues de la fecha de vencimiento causara intereses de mora a la tasa mas alta permitida por la ley (articulo 65 ley 45/90).  Regimen Comun.                                              
                                Consignar en el Banco de Occidente Cuenta Corriente No 061000824 Manizales. Para clientes de la Costa Atlantica en Bancolombia Cuenta de Ahorros No 78757543388. Para Clientes en Bogota D.C en Banco  
                                lombia Cuenta de Ahorros No.46183159836. Para clientes del resto del                                                                                                                                                                                      
                                pais Bancolombia Cuenta de Ahorros No 37358049410.                                                                                                                                                                                                        
                                Enviar consignacion al Fax 6-8874737 o escaneado a cartera@softwaredecolombia.com                                                                                                                                                                         

                                <br/><br/>
                                <b>Autorizado:_______________________________ Aprobado:_________________________________</b>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr><!-- Fin Pie -->

        <!-- Ini Pie Final -->
        <tr>
            <td colspan="2">
                <table cellpadding="0" cellspacing="0" style="width:22cm" class="encFacFin">
                    <tr>
                        <td class="encFacFin1" style="width:50%">Impreso por:<span style="color:#0000CC">&nbsp;www.clauserp.com - Software de Colombia LTDA</span></td>
                        <td class="encFacFin2" align="right">Elaborado por: SU                                                      </td>
                    </tr>
                </table>
            </td>
        </tr><!-- Fin Pie Final -->
    </table>';
    return $doc;
}

?>