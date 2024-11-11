const fs = require('fs');

// Escuchar eventos de teclado
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

let buffer = '';  // Almacena los datos de la tarjeta temporalmente

process.stdin.on('data', (key) => {
    // El lector normalmente envía "Enter" (\r) al final de la lectura de la tarjeta
    if (key === '\r' || key === '\n') {  // Detectar "Enter" o "Nueva línea" como fin de lectura
        console.log(`Número de tarjeta capturado: ${buffer}`);

        // Escribir el número de tarjeta en un archivo
        fs.appendFile('tarjetas.txt', buffer + '\n', (err) => {
            if (err) throw err;
            console.log('Número de tarjeta guardado en el archivo.');
        });

        // Limpiar el buffer para la siguiente lectura
        buffer = '';
    } else if (key === '\u0003') {  // Detectar Ctrl+C para salir del programa
        process.exit();
    } else {
        // Almacenar los datos de la tarjeta en el buffer
        buffer += key;
    }
});
