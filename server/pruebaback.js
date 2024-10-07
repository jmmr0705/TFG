const mysql = require('mysql2/promise');
const CryptoJS = require('crypto-js');

// Conexión a la base de datos MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'your_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Clave secreta para encriptar y desencriptar
const secretKey = 'my_secret_key';

// Función para encriptar datos
function encrypt(data) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Función para desencriptar datos
function decrypt(data) {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Tabla 1: Funciones CRUD

// Crear un nuevo registro en la tabla 1
async function createTable1(selectionString) {
    const [result] = await pool.query('INSERT INTO table1 (selection_string) VALUES (?)', [selectionString]);
    return result.insertId;
}

// Leer un registro de la tabla 1
async function getTable1(id) {
    const [rows] = await pool.query('SELECT * FROM table1 WHERE id = ?', [id]);
    return rows[0];
}

// Actualizar el campo de selección de string en la tabla 1
async function updateTable1(id, newSelectionString) {
    await pool.query('UPDATE table1 SET selection_string = ? WHERE id = ?', [newSelectionString, id]);
}

// Eliminar un registro de la tabla 1
async function deleteTable1(id) {
    await pool.query('DELETE FROM table1 WHERE id = ?', [id]);
}

// Tabla 2: Funciones CRUD

// Crear un nuevo registro en la tabla 2
async function createTable2(idTable1, idTable3, someString, date) {
    const [result] = await pool.query('INSERT INTO table2 (table1_id, table3_id, some_string, date) VALUES (?, ?, ?, ?)', [idTable1, idTable3, someString, date]);
    return result.insertId;
}

// Leer un registro de la tabla 2
async function getTable2(id) {
    const [rows] = await pool.query('SELECT * FROM table2 WHERE id = ?', [id]);
    return rows[0];
}

// Actualizar un registro en la tabla 2
async function updateTable2(id, newString, newDate) {
    await pool.query('UPDATE table2 SET some_string = ?, date = ? WHERE id = ?', [newString, newDate, id]);
}

// Eliminar un registro de la tabla 2
async function deleteTable2(id) {
    await pool.query('DELETE FROM table2 WHERE id = ?', [id]);
}

// Tabla 3: Funciones CRUD con encriptación

// Crear un nuevo registro en la tabla 3
async function createTable3(bitmap1, bitmap2, integerField, email, string1, string2, password, phone) {
    const encryptedEmail = encrypt(email);
    const encryptedBitmap1 = encrypt(bitmap1);
    const encryptedBitmap2 = encrypt(bitmap2);
    
    const [result] = await pool.query('INSERT INTO table3 (bitmap1, bitmap2, integer_field, email, string1, string2, password, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [encryptedBitmap1, encryptedBitmap2, integerField, encryptedEmail, string1, string2, password, phone]);
    
    return result.insertId;
}

// Leer un registro de la tabla 3
async function getTable3(id) {
    const [rows] = await pool.query('SELECT * FROM table3 WHERE id = ?', [id]);
    
    // Desencriptar los campos que fueron encriptados
    if (rows[0]) {
        rows[0].email = decrypt(rows[0].email);
        rows[0].bitmap1 = decrypt(rows[0].bitmap1);
        rows[0].bitmap2 = decrypt(rows[0].bitmap2);
    }
    
    return rows[0];
}

// Actualizar un registro en la tabla 3
async function updateTable3(id, bitmap1, bitmap2, integerField, email, string1, string2, password, phone) {
    const encryptedEmail = encrypt(email);
    const encryptedBitmap1 = encrypt(bitmap1);
    const encryptedBitmap2 = encrypt(bitmap2);
    
    await pool.query('UPDATE table3 SET bitmap1 = ?, bitmap2 = ?, integer_field = ?, email = ?, string1 = ?, string2 = ?, password = ?, phone = ? WHERE id = ?', 
        [encryptedBitmap1, encryptedBitmap2, integerField, encryptedEmail, string1, string2, password, phone, id]);
}

// Eliminar un registro de la tabla 3
async function deleteTable3(id) {
    await pool.query('DELETE FROM table3 WHERE id = ?', [id]);
}

// Función main para probar los CRUDs
async function main() {
    try {
        // Prueba Tabla 1
        console.log("=== Tabla 1 ===");
        const id1 = await createTable1('Selection A');
        console.log('Creado en tabla 1, ID:', id1);

        const table1Data = await getTable1(id1);
        console.log('Datos de tabla 1:', table1Data);

        await updateTable1(id1, 'Updated Selection');
        console.log('Actualizado registro en tabla 1');

        await deleteTable1(id1);
        console.log('Eliminado registro en tabla 1');

        // Prueba Tabla 2
        console.log("\n=== Tabla 2 ===");
        const id2 = await createTable2(1, 1, 'Test String', new Date());
        console.log('Creado en tabla 2, ID:', id2);

        const table2Data = await getTable2(id2);
        console.log('Datos de tabla 2:', table2Data);

        await updateTable2(id2, 'Updated String', new Date());
        console.log('Actualizado registro en tabla 2');

        await deleteTable2(id2);
        console.log('Eliminado registro en tabla 2');

        // Prueba Tabla 3
        console.log("\n=== Tabla 3 ===");
        const id3 = await createTable3('Bitmap1', 'Bitmap2', 123, 'test@example.com', 'String1', 'String2', 'password123', '123456789');
        console.log('Creado en tabla 3, ID:', id3);

        const table3Data = await getTable3(id3);
        console.log('Datos de tabla 3 (desencriptados):', table3Data);

        await updateTable3(id3, 'NewBitmap1', 'NewBitmap2', 456, 'new@example.com', 'NewString1', 'NewString2', 'newpassword123', '987654321');
        console.log('Actualizado registro en tabla 3');

        await deleteTable3(id3);
        console.log('Eliminado registro en tabla 3');
    } catch (err) {
        console.error('Error:', err);
    }
}

// Ejecutar la función main
main();
