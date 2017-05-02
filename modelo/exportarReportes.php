<?php 
ini_set('memory_limit', '512M');
set_time_limit (600);

require_once('PHPExcel/Classes/PHPExcel.php');
require_once('../serviciosTecnicos/utilidades/UtilConexion.php');
include_once('../controlador/config.php');
ini_set('max_input_vars', 10000);
$conexion = new UtilConexion();
$datos = $_REQUEST['datos'];
$reporte = $_REQUEST['rep'];
$time = explode(' ', microtime());
$objPHPExcel = new PHPExcel();
$objPHPExcel->getProperties()->setCreator("Codedrinks") // Nombre del autor
    ->setLastModifiedBy("Codedrinks") //Ultimo usuario que lo modificó
    ->setTitle("Reporte Excel con PHP y MySQL") // Titulo
    ->setSubject("Reporte Excel con PHP y MySQL") //Asunto
    ->setDescription("Reporte de alumnos") //Descripción
    ->setKeywords("reporte alumnos carreras") //Etiquetas
    ->setCategory("Reporte excel"); //Categorias


switch ($reporte) {
    case 'convocados':
        $objPHPExcel->setActiveSheetIndex(0)
        ->setCellValue('A1', 'Nombres') 
        ->setCellValue('B1', 'Apellidos')
        ->setCellValue('C1', 'Identificación')
        ->setCellValue('D1', 'Email')
        ->setCellValue('E1', 'Teléfono 1')
        ->setCellValue('F1', 'Teléfono 2')
        ->setCellValue('G1', 'Teléfono 3');
        
        $fila = 2;    
        foreach ($datos as $dato) {
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A'.$fila,$dato[1]);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B'.$fila,$dato[2]);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C'.$fila,$dato[3]);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D'.$fila,$dato[4]);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E'.$fila,$dato[5]);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F'.$fila,$dato[6]);
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G'.$fila,$dato[7]);
            $fila++;
        }
        $objPHPExcel->getActiveSheet()->getStyle('A1:G1')->getFont()->setBold(true);
        $objPHPExcel->getActiveSheet()->getStyle('A1:G1')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);  
        break;
    
    case 'matriculados':
        $fechaInicio = $_REQUEST['fecha_inicio'];
        $sql = "CALL SPREPORTEMATRICULASALAFECHA('$fechaInicio');";
        if ($rs = $conexion->getPDO()->query($sql)) {
            if($datos = $rs->fetchAll()){
                $objPHPExcel->setActiveSheetIndex(0)
                            ->setCellValue('A1', 'Identificación') 
                            ->setCellValue('B1', 'Nombres') 
                            ->setCellValue('C1', 'Apellidos')
                            ->setCellValue('D1', 'Teléfono 1')
                            ->setCellValue('E1', 'Teléfono 2')
                            ->setCellValue('F1', 'Teléfono 3')
                            ->setCellValue('G1', 'Correo Electrónico')
                            ->setCellValue('H1', 'Convocatoria')
                            ->setCellValue('I1', 'Fecha')
                            ->setCellValue('J1', 'Hora')
                            ->setCellValue('K1', 'Ruta')
                            ->setCellValue('L1', 'CodigoCurso')
                            ->setCellValue('M1', 'Curso')
                            ->setCellValue('N1', 'Código Módulo')
                            ->setCellValue('O1', 'Módulo')
                            ->setCellValue('P1', 'Salón')
                            ->setCellValue('Q1', 'Matriculado por');
                
                $fila = 2;   
                foreach ($datos as $dato) {
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A'.$fila,$dato[0]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B'.$fila,$dato[1]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C'.$fila,$dato[2]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D'.$fila,$dato[3]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E'.$fila,$dato[4]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F'.$fila,$dato[5]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G'.$fila,$dato[6]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('H'.$fila,$dato[7]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('I'.$fila,$dato[8]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('J'.$fila,$dato[9]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('K'.$fila,$dato[10]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('L'.$fila,$dato[11]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('M'.$fila,$dato[12]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('N'.$fila,$dato[13]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('O'.$fila,$dato[14]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('P'.$fila,$dato[15]);
                    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('Q'.$fila,$dato[16]);
                    $fila++;
                }
                $objPHPExcel->getActiveSheet()->getStyle('A1:Q1')->getFont()->setBold(true);
                $objPHPExcel->getActiveSheet()->getStyle('A1:Q1')->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER); 
            }
        }
    break;

    default:
        break;
}

foreach (range('A', $objPHPExcel->getActiveSheet()->getHighestDataColumn()) as $col) {
        $objPHPExcel->getActiveSheet()
                ->getColumnDimension($col)
                ->setAutoSize(true);
    }

$nombre_archivo = '../tmp/Reporte_'.$reporte.'_'.$time[1].'.xlsx';
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
$objWriter->save($nombre_archivo);
echo json_encode(array('nombrearchivo' => $nombre_archivo));
?>