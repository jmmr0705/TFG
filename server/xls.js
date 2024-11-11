const xlsx = require("xlsx");

function crearExcel(datos) {
    const data = [['Nº CA', 'Nombre', 'sTime', 'Modo Verificación', 'Dispositivo', 'Excepción']]; // Encabezado de la primera línea

    // Recorre las filas y construye el string para cada registro
    datos.forEach((row) => {
        const concatenado = `${row.userId},\"${row.userName}\",\"${row.sTime}\",\"${row.modoVerificacion}\",\"${row.dispositivoId}\",\"\"`;
        data.push([concatenado]); // Añade cada string como una nueva fila en la única columna
    });

    // Crea el libro y la hoja de trabajo
    const ws = xlsx.utils.aoa_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Registro Datos");

    // Genera el archivo en formato .xls
    return xlsx.write(wb, { bookType: "xls", type: "buffer" });
}

module.exports = { crearExcel };
