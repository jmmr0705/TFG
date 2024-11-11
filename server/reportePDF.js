const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

// Función para generar el informe a partir de múltiples partes
function generarInforme(res, informe) {
    const resultado = new PDFDocument();
    res.setHeader('Content-Type', "application/pdf");
    res.setHeader('Content-Disposition', 'attachment; filename=informe_asistencia.pdf');

    resultado.pipe(res);

    let processedPages = 0;

    // Agrega cada página al PDF y espera a que cada una termine antes de pasar a la siguiente
    informe.forEach((pagina, index) => {
        pagina.pipe(resultado, { end: false });
        pagina.on('end', () => {
            processedPages++;

            // Cuando todos los PDFs hayan sido agregados, finaliza el documento
            if (processedPages === informe.length) {
                resultado.end();
            }
        });
    });
}

// Función para generar un reporte PDF con información de un usuario
function generarReportePDF(nombre, carrera, registros, horastotales, departamentos) {
    const doc = new PDFDocument();
    
    // Título del reporte
    doc.fontSize(20).text(`Reporte de Asistencia`, { align: 'center' });
    
    // Información del usuario
    doc.moveDown();
    doc.fontSize(12).text(`Nombre: ${nombre}`, { align: 'left' });
    doc.text(`Carrera: ${carrera}`, { align: 'left' });
    doc.text(`Horas Totales: ${horastotales.toFixed(2)}`, { align: 'left' });

    // Listado de departamentos
    doc.moveDown().fontSize(15).text('Departamentos Asociados:', { underline: true });
    doc.fontSize(12);
    departamentos.forEach((departamento, index) => {
        doc.text(`${index + 1}. ${departamento}`, { align: 'left' });
    });

    // Detalles de los registros de asistencia
    doc.moveDown().fontSize(15).text('Detalles de los registros:', { underline: true });
    doc.moveDown().fontSize(10);
    registros.forEach((registro, index) => {
        doc.text(`Registro ${index + 1}:`);
        doc.text(`  Dispositivo: ${registro.dispositivo}`);
        doc.text(`  Fecha: ${registro.fecha}`);
        doc.text(`  Verificación: ${registro.Tipo_Verificacion}`);
        doc.text(`  Tiempo Transcurrido: ${registro.diferencia} horas`);
        doc.moveDown();
    });

    return doc;
}

function generaInforme(nombre, carrera, registros, horasTotales, departamentos) {
    const doc = new PDFDocument();

    // Título del reporte
    doc.fontSize(20).text(`Reporte de Asistencia`, { align: 'center' });

    // Información del usuario
    doc.moveDown();
    doc.fontSize(12).text(`Nombre: ${nombre}`, { align: 'left' });
    doc.text(`Carrera: ${carrera}`, { align: 'left' });
    doc.text(`Horas Totales: ${horasTotales.toFixed(2)}`, { align: 'left' });

    // Listado de departamentos
    doc.moveDown().fontSize(15).text('Departamentos Asociados:', { underline: true });
    doc.fontSize(12);
    departamentos.forEach((departamento, index) => {
        doc.text(`${index + 1}. ${departamento}`, { align: 'left' });
    });

    // Detalles de los registros de asistencia
    doc.moveDown().fontSize(15).text('Detalles de los registros:', { underline: true });
    doc.moveDown().fontSize(10);
    registros.forEach((registro, index) => {
        doc.text(`Registro ${index + 1}:`);
        doc.text(`  Dispositivo: ${registro.registros[0].nombre_dispositivo}`);
        doc.text(`  Fecha: ${registro.registros[0].fecha}`);
        doc.text(`  Verificación: ${registro.registros[0].Tipo_Verificacion}`);
        // Asumiendo que cada registro tiene un campo 'diferencia'
        const diferencia = (registro.horasTotales / (registro.registros.length - 1)).toFixed(2); // Aquí solo se muestra un cálculo de ejemplo
        doc.text(`  Tiempo Transcurrido: ${diferencia} horas`);
        doc.moveDown();
    });

    return doc;
}


module.exports = { generarInforme, generarReportePDF };
