const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const crypto= require("crypto-js")
const KEY= require("./secret_132_.js")
const multer= require("multer");
const { parse } = require("dotenv");
const logger= require("./logger.js");
const { log, error } = require("winston");
const { generarReportePDF} = require('./reportePDF');
const {crearExcel}= require("./xls.js")
const PDFDocument = require('pdfkit');
const axios= require("axios")
const { PassThrough } = require('stream');
const path = require('path');
const xlsx = require("xlsx");
const fs = require("fs");

app.use(cors());
app.use(express.json({limit: '100mb'}));

/*const almacenaje = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'fotos/'); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,"fotografia"); // Nombre único para cada archivo
    }
});
*/
const almacenaje = multer.memoryStorage();
upload= multer({storage:almacenaje})

const bd = mysql.createConnection({
    user: "tfguser",
    host: "mysql-db",
    password: "tfgpasswd",
    database: "sampledb",
    port: 3306
});

// const bd = mysql.createConnection({
//     user: "root",
//     host: "localhost",
//     password: "parquelagos14",
//     database: "tfg_asis",
// });

// Ruta de login
app.post('/login', (req, res) => { 
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena; // Contraseña cifrada enviada desde el frontend

    // Consulta para obtener el usuario y la contraseña encriptada desde la base de datos
    const query = 'SELECT * FROM user WHERE usuario = ?';
    bd.query(query, [usuario], (error, result) => {
        if (error) {
            res.status(500).json({ message: "Error en la consulta" });
            return;
        }

        // Si se encuentra el usuario
        if (result.length > 0) {
            const storedEncryptedPassword = result[0].contrasena; // Obtén la contraseña encriptada

            // Desencriptar la contraseña almacenada
            const bytes = crypto.AES.decrypt(storedEncryptedPassword, KEY);
            const decryptedStoredPassword = bytes.toString(crypto.enc.Utf8);

            // Comparar la contraseña desencriptada almacenada con la contraseña encriptada proporcionada
            const bytesProvided = crypto.AES.decrypt(contrasena, KEY);
            const decryptedProvidedPassword = bytesProvided.toString(crypto.enc.Utf8);

            // Comparar las contraseñas
            if (decryptedStoredPassword === decryptedProvidedPassword) {
                res.status(200).json({ message: "Login correcto", num: result[0].id });
            } else {
                res.status(401).json({ message: "Login invalido, credenciales erroneas" });
            }
        } else {
            res.status(401).json({ message: "Login invalido, credenciales erroneas" });
        }
    });

    logger.info("Se ha logeado la cuenta de usuario: " + usuario);
});



function encriptadar(numero){
    cifrado= numero*3
    cifrado/=2
    cifrado+=10000
    cifrado*=4
    return cifrado;
}

function desencriptar(numero) {
    original= numero/4
    original-=10000
    original*=2
    original/=3
    return original;
}
    
// Ruta de registro
// Endpoint original para registrar sin foto
app.post('/register', (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena; // Esto ya viene encriptado desde el frontend
    const correo = req.body.correo;         // También encriptado
    const telefono = req.body.telefono;
    const titulo = req.body.titulo;
    const numerencrypt = encriptadar(telefono);

    const query = "INSERT INTO user (usuario, contrasena, correo, carrera, telefono) VALUES (?,?,?,?,?)";

    bd.query(query, [usuario, contrasena, correo, titulo, numerencrypt], (err, result) => {
        if (err) {
            console.log("Ha ocurrido un error:" + err);
            logger.info("Fallo al registrar un usuario");
        } else {
            res.send("Registro completado");
            logger.info("Se ha registrado el usuario :" + usuario);
        }
    });
});

// Nuevo endpoint para registrar con foto
app.post('/registerWithPhoto', upload.single('foto'), (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena; // Esto ya viene encriptado desde el frontend
    const correo = req.body.correo;         // También encriptado
    const telefono = req.body.telefono;
    const titulo = req.body.titulo;
    const foto = req.file ? req.file.buffer : null; // Foto como buffer de tipo longblob
    const numerencrypt = encriptadar(telefono);

    const query = "INSERT INTO user (usuario, contrasena, correo, carrera, telefono, foto) VALUES (?,?,?,?,?,?)";

    bd.query(query, [usuario, contrasena, correo, titulo, numerencrypt, foto], (err, result) => {
        if (err) {
            console.log("Ha ocurrido un error:" + err);
            logger.info("Fallo al registrar un usuario con foto");
        } else {
            res.send("Registro completado con foto");
            logger.info("Se ha registrado el usuario con foto :" + usuario);
        }
    });
});


app.post("/main/personal",(req,res) =>{
    const nombre= req.body.nombre
    const id_usuario= req.body.id_usr
    console.log("Soy el departamento"+nombre)
    const query= "INSERT INTO departamento (id_usuario, nombre) VALUES (?,?)"
    bd.query(query, [id_usuario, nombre], (err, result) => {
        if(err){
            console.log("Ha ocurrido un error: "+err)
            logger.info("Error al añadir un usuario al departamento"+nombre)
        }else{
            res.status(200).send({message: "Registro completado"})
            logger.info("Se ha registrado el usuario :"+id_usuario+"En el departamento"+nombre)
        }
    })
})

app.post("/main/ponerreglas", (req, res) => {
    const id_usr = req.body.id_usr;
    const nombre = req.body.nombre;

    console.log("Pongo reglas para ID:", id_usr, "en nombre:", nombre);

    // Consulta SQL para actualizar solo los registros que coincidan con el nombre
    const query = "UPDATE departamento SET id_regla = ? WHERE nombre = ?";

    bd.query(query, [id_usr, nombre], (err, result) => {
        if (err) {
            console.error("Error al actualizar la tabla departamento:", err);
            return res.status(500).send("Error en el servidor al actualizar la tabla departamento.");
        }
        res.send("Actualización de reglas exitosa en los registros de la tabla departamento.");
    });
});

app.post("/main/reglas/agregar",(req, res) =>{
    const nombre= req.body.nombre
    const fecha_inicio= req.body.fecha_inicio
    const fecha_fin= req.body.fecha_fin
    const query="INSERT INTO regla (nombre, fecha_inicio, fecha_fin) VALUES (?,?,?)"
    bd.query(query, [nombre,fecha_inicio,fecha_fin], (err,result) =>{
        if(err){
            logger.info("Error al registrar una nueva regla")
            console.log(err)
        }else{
            res.send("Se ha registrado una nueva regla")
            logger.info("Se ha añadido una regla nueva")
        }
    })
    
})

app.post("/main/registro/agregar", (req, res) => {
    const id_usuario = req.body.id_usr; // Declarar como const
    const id_dispositivo = req.body.id_disp; // Declarar como const
    const fecha = new Date();
    
    const queryTipo = "SELECT tipo FROM dispositivo WHERE id = ?";
    bd.query(queryTipo, [id_dispositivo], (err, result) => {
        if (err) {
            console.log("Error en la consulta");
            return res.status(500).send("Error en la consulta");
        } else if (result.length === 0) {
            return res.status(400).send("No hay dispositivo");
        } else {
            const tipo = result[0].tipo;
            console.log(tipo)
            const queryInsert =
                "INSERT INTO registro (id_usuario, id_dispositivo, fecha, Tipo_Verificacion) VALUES (?, ?, ?, ?)";
            bd.query(queryInsert, [id_usuario, id_dispositivo, fecha, tipo], (err) => {
                if (err) {
                    console.log("Error al añadir el registro");
                    logger.info("Error al generar el registro de asistencia");
                    return res.status(500).send("Error al añadir el registro");
                } else {
                    res.send("Registro de asistencia agregado");
                    logger.info("Registro de asistencia creado por: " + id_usuario);
                }
            });
        }
    });
});


app.post("/main/dispositivos/agregar",(req, res) =>{
    const tipo= req.body.tipo
    const nombre= req.body.nombre
    const query="INSERT INTO dispositivo (Tipo, Nombre) VALUES (?,?)"
    bd.query(query, [tipo,nombre], (err,result) =>{
        if(err){
            console.log("Error al registrar el dispositivo")
            logger.info("Error al registrar un dispositivo")
        }else{
            res.send("Dispositivo agregado")
            logger.info("Se ha agregado un dispositivo nuevo")
        }
    })
})

app.post("/main/departamentos/agregar",(req, res) =>{
    const nombre= req.body.nombre
    query="INSERT INTO departamento (nombre) VALUES(?)"
    bd.query(query, [nombre], (err,result) =>{
        if(err){
            console.log("Error al registrar el departamento"+ err)
            logger.info("Error al crear el departamento en la base de datos")
        }else{
            res.send("Departamento agregado")
            logger.info("Departamento creado en la base de datos")
        }
    })
})

// Ruta para obtener usuarios
app.get('/main/usuarios', (req, res) => {
    bd.query("SELECT id, usuario, correo, carrera, privilegios FROM user", (err, result) => {
        if (err) {
            console.log("Ha ocurrido un error");
            logger.info("Ha habido un error al obtener la informacion de los usuarios")
        }else{
            res.status(200)
            res.send(result);
            logger.info("Se ha obtenido la informacinn de los usuarios de las tablas")
        }
    });
});

app.get("/main/dispositivos", (req,res) =>{
    bd.query("SELECT id, tipo, nombre FROM dispositivo", (err,result) =>{
        if(err){
            console.error(err)
            logger.info("Error al obtener la informacion de los dispositivos")
        }else{
            res.status(200)
            res.send(result)
            logger.info("Se ha obtenido la informacion de los dispositivos")
        }
    })
})

app.get('/main/registros',(req,res) =>{
    bd.query("SELECT id, id_dispositivo, id_usuario, fecha, Tipo_Verificacion FROM registro", (err,result) =>{
        if(err){
            console.error(err)
            logger.info("Error al obtener informacion de los registros")
        }else{
            res.status(200)
            res.send(result)
            logger.info("Se ha obtenido informacion de los registros")
        }
    })
})

app.get('/main/reglas',(req,res) =>{
    bd.query("SELECT id, nombre, fecha_inicio, fecha_fin FROM regla", (err,result) =>{
        if(err){
            console.error(err)
            logger.info("Error al obtener informacion de las reglas")
        }else{
            res.status(200)
            res.send(result)
            logger.info("Se ha obtenido informacion de las reglas")
        }
    })
})

app.get('/main/departamentos', (req, res) => {
    bd.query(`
        SELECT MIN(id) AS id, nombre 
        FROM departamento 
        GROUP BY nombre
    `, (err, result) => {
        if (err) {
            console.error(err);
            logger.info("Error al obtener información de los departamentos");
            res.status(500).send("Error interno del servidor");
        } else {
            res.status(200).send(result);
            logger.info("Se ha obtenido información de los departamentos");
        }
    });
});



app.post('/main/usuario',(req,res) =>{
    const id= req.body.user_id
    bd.query("SELECT * FROM user WHERE id= ?",[id], (err,result) =>{
        if(err){
            console.error(err)
            console.log("fallo")
            logger.info("Error al obtener informacion del usuario")
        }else{
            if(result.length > 0){
                res.status(200).json(result[0])
                logger.info("Se ha obtenido informacion del usuario")
            }else{
                res.status(404).json({message: "Usuario no encontrado"})
                logger.info("Usuario no encontrado")
            }
        }
    })
})

app.delete('/main/:tabla/:id', (req,res) =>{
   
    const {tabla,id} = req.params
    console.log("borro de tabla" +tabla)
    const query= "DELETE FROM ?? WHERE id= ?"
    console.log(tabla+"///////"+id)

    bd.query(query,[tabla,id], (err, resultado) =>{
        if(err){
            res.status(500).json({message:"Error al borrar la fila"})
            logger.info("Error al borrar la fila")
            console.log("Falla"+err)
        }else{
            res.status(200).json({message:"Fila borrada"})
            logger.info("Se ha eliminado el registro de"+tabla+"la base de datos")
        }
    })
})
/* 
app.put("/main/:tabla/:id",(req,res) =>{
    const {tabla,id} = req.params
    
    const datos= req.body
    const query= "UPDATE ?? SET ? WHERE id= ?"
    
    bd.query(query, [tabla,datos,id], (err,result) =>{
        if(err){
            console.log("Error en"+err)
            res.status(500).json({message:"Error al actualizar fila"})
            logger.info("Error al actualizar la fila")
        }else{
            res.status(200).json({message:"Fila actualizada"})
            logger.info("Se ha actualizado el registro de "+tabla+"la base de datos")
        }
    })
})
*/
app.put("/main2/:tabla/:id",upload.single('foto'),(req,res) =>{
    const data = req.body;
    const foto = req.file;
    const {tabla,id} = req.params
    console.log(foto );
    data.foto = foto.buffer;
    
    const query= "UPDATE ?? SET ? WHERE id= ?"
    
    bd.query(query, [tabla,data,id], (err,result) =>{
        if(err){
            console.log("Error en"+err)
            res.status(500).json({message:"Error al actualizar fila"})
            logger.info("Error al actualizar la fila")
        }else{
            res.status(200).json({message:"Fila actualizada"})
            logger.info("Se ha actualizado el registro de "+tabla+"la base de datos")
        }
    })
})

app.put("/main/:tabla/:id",(req,res) =>{
    const data = req.body;
    const foto = req.file;
    const {tabla,id} = req.params
    
    const query= "UPDATE ?? SET ? WHERE id= ?"
    
    bd.query(query, [tabla,data,id], (err,result) =>{
        if(err){
            console.log("Error en"+err)
            res.status(500).json({message:"Error al actualizar fila"})
            logger.info("Error al actualizar la fila")
        }else{
            res.status(200).json({message:"Fila actualizada"})
            logger.info("Se ha actualizado el registro de "+tabla+"la base de datos")
        }
    })
})

// app.post("/main/registro_asistencia",(req,res) =>{
//     const query="INSERT INTO registro ("
// })

app.get("/main/buscar", (req, res) => {
    const { filtro } = req.query;

    bd.query(
        `SELECT registro.Tipo_Verificacion, dispositivo.nombre AS dispositivo, user.usuario AS usuario
         FROM registro
         JOIN dispositivo ON registro.id_dispositivo = dispositivo.id
         JOIN user ON registro.id_usuario = user.id
         WHERE dispositivo.nombre LIKE ? OR user.usuario LIKE ?`,
        [`%${filtro}%`, `%${filtro}%`],
        (error, results) => {
            if (error) {
                console.error("Error en la consulta:", error); // Muestra el error en la consola
                return res.status(500).send("Error en la consulta: " + error.message);
            }

            // Si no hubo error, envía los resultados en formato JSON
            res.json(results);
        }
    );
});

function convertirFecha(fechaString) {
    try {
        // Intenta crear un objeto Date con el string recibido
        const fecha = new Date(fechaString);
        
        // Verifica si la fecha es válida
        if (isNaN(fecha.getTime())) {
            throw new Error('Formato de fecha incorrecto');
        }

        // Formatear la fecha en un formato compatible (por ejemplo, 'YYYY-MM-DD HH:mm:ss')
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        const seconds = String(fecha.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        throw new Error(`Formato de fecha incorrecto: ${error.message}`);
    }
}


// Función para procesar cada registro en el archivo
function procesarRegistro(index, registros, filasProcesadas, callback) {
    if (index >= registros.length) {
        return callback(null, filasProcesadas);
    }
    console.log(registros);
    console.log("fila");
    const row = registros[index];
    console.log(row);

    // Acceder a la cadena completa y dividirla en partes
    const filaCompleta = row['Nº CA'];
    if (!filaCompleta) {
        console.error("Fila vacía o formato inesperado.");
        return callback(new Error("Formato de fila no válido."));
    }

    // Dividir la fila CSV en un array de valores
    const valores = filaCompleta.split(',');

    // Asignar los valores individuales
    const userId = valores[0];
    const nombre = valores[1].replace(/\"/g, ''); // Quitar comillas
    const sTime = valores[2].replace(/\"/g, '');
    const modoVerificacion = valores[3].replace(/\"/g, '');
    const dispositivoId = valores[4].replace(/\"/g, '');

    console.log(`Nombre: ${nombre}`);
    console.log(`Valores restantes: ${valores}`);

    // Llamar a la función `existe` con los valores adecuados
    existe(nombre, [userId, nombre, sTime, modoVerificacion, dispositivoId], (error) => {
        if (error) {
            console.error('Error procesando el registro:', error);
            return callback(error);
        }

        if (row) {
            filasProcesadas++;
        }

        procesarRegistro(index + 1, registros, filasProcesadas, callback);
    });
}


// Función que verifica si el usuario existe y, si es así, intenta registrar la asistencia
function existe(nombre, datos, callback) {
    console.log("Proceso la fila");
    bd.query('SELECT id FROM user WHERE usuario = ?', [nombre], (err, resultado) => {
        if (err) {
            console.log("Error al comprobar existencia: " + err);
            return callback(err);
        }
        console.log("Busqueda hecha");
        console.log(resultado);
        if (resultado.length > 0) {
            console.log("hola sigo aqui");
            const idUsuario = resultado[0].id;
            const fechaString = datos[2];  // La fecha está en la tercera columna
            let fecha;
            try {
                fecha = convertirFecha(fechaString);
            } catch (error) {
                console.log(`Error al transformar la fecha para el usuario ${nombre}: ${error.message}`);
                return callback(null); // Ignorar fila si la fecha es incorrecta
            }

            const tipoVerificacion = datos[3];
            const idDispositivo = datos[4];
            console.log("Sigo procesando");
            // Verificar si el dispositivo existe antes de insertar
            bd.query('SELECT id FROM dispositivo WHERE id = ?', [idDispositivo], (error, dispositivoResultado) => {
                if (error) {
                    console.log("Error al verificar el dispositivo: " + error);
                    return callback(error);
                }
                console.log(dispositivoResultado);
                if (dispositivoResultado.length === 0) {
                    console.log(`El dispositivo con ID ${idDispositivo} no existe. Registro ignorado.`);
                    return callback(null); // Ignorar el registro si el dispositivo no existe
                }
                console.log("Entro a registrar el registro");
                bd.query(
                    'INSERT INTO registro (id_usuario, fecha, Tipo_Verificacion, id_dispositivo) VALUES (?, ?, ?, ?)',
                    [idUsuario, fecha, tipoVerificacion, idDispositivo],
                    (insertError) => {
                        if (insertError) {
                            console.log("Error al insertar en registro: " + insertError);
                            return callback(insertError);
                        }
                        console.log("Registro insertado exitosamente");
                        callback(null);
                    }
                );
            });
        } else {
            console.log("El usuario no existe");
            callback(null);
        }
    });
}


// Endpoint que utiliza la función procesarRegistro
app.post("/main/cargadatos", upload.single('archivo'), (req, res) => {
    if (!req.file) {
        console.error('req.file es undefined');
        return res.status(400).send('No se ha proporcionado ningún archivo');
    }

    console.log('req.file:', req.file); // Para depuración

    try {
        // Validar que el buffer no sea undefined o vacío
        if (!req.file.buffer) {
            console.error('El buffer del archivo es undefined o vacío');
            return res.status(500).send('Error: El archivo no se pudo cargar correctamente');
        }

        // Leer el archivo desde el buffer en memoria
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const registros = xlsx.utils.sheet_to_json(worksheet);
        let filasProcesadas = 0;
        console.log("entro a procesar fila")
        // Llamada inicial a la función procesarRegistro
        procesarRegistro(0, registros, filasProcesadas, (error, totalProcesadas) => {
            if (error) {
                console.error('Error al procesar el archivo:', error);
                return res.status(500).send('Error al procesar el archivo');
            }
            res.send(`Archivo procesado: ${totalProcesadas} filas agregadas a la base de datos`);
        });
    } catch (error) {
        console.error('Error al procesar el archivo XLSX:', error);
        res.status(500).send('Error al procesar el archivo');
    }
});


app.get("/main/descargadatos", async (req, res) => {
    try {
        // Obtiene los datos de la tabla `registro`, incluyendo el id de cada registro
        bd.query(`
        SELECT 
        registro.id_usuario AS userId,      
        usuario.usuario AS userName,          
        registro.fecha AS sTime,            
        registro.Tipo_Verificacion AS modoVerificacion, 
        registro.id_dispositivo AS dispositivoId      
        FROM registro
        JOIN user AS usuario ON registro.id_usuario = usuario.id
        `, (err, datos) => {
            if (err) {
                console.error("Error al obtener datos de registro:", err);
                return res.status(500).send("Error al obtener los datos de registro");
            }

            // Llama a la función externa para generar el archivo .xls y le pasa los datos obtenidos
            const excelBuffer = crearExcel(datos);

            // Configura los encabezados y envía el archivo
            res.setHeader("Content-Type", "application/vnd.ms-excel");
            res.setHeader("Content-Disposition", "attachment; filename=registro_datos.xls");
            res.send(excelBuffer);
        });
    } catch (error) {
        console.error("Error al generar el archivo Excel:", error);
        res.status(500).send("Error al generar el archivo Excel");
    }
});


app.post("/main/reporte", (req, res) => {
    const id = req.body.id;
    
    // Primera consulta para obtener la información del usuario
    bd.query("SELECT usuario AS nombre, carrera FROM user WHERE id = ?", [id], (err, resuser) => {
        if (err) {
            console.error("Error en la info del usuario: " + err);
            logger.info("Error al obtener la informacion de asistencia")
            return res.status(500).send("Error al obtener la información del usuario");
        } 
        
        if (resuser.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        const { nombre, carrera } = resuser[0];

        // Segunda consulta para obtener los registros de asistencia
        bd.query(
            `SELECT dispositivo.nombre AS dispositivo, registro.fecha, registro.Tipo_Verificacion 
            FROM registro 
            JOIN dispositivo ON registro.id_dispositivo = dispositivo.id 
            WHERE registro.id_usuario = ? ORDER BY registro.fecha ASC`,
            [id],
            (err, resasis) => {
                if (err) {
                    console.error("Error en los registros de asistencia: " + err);
                    logger.info("Error al obtener los registros de asistencia")
                    return res.status(500).send("Error al obtener los registros de asistencia");
                }

                let horastotales = 0;
                const registros = [];

                for (let i = 1; i < resasis.length; i++) {
                    const anter = resasis[i - 1];
                    const actual = resasis[i];
                    const dif = (new Date(actual.fecha) - new Date(anter.fecha)) / (1000 * 60 * 60);
                    horastotales += dif;

                    registros.push({
                        dispositivo: anter.dispositivo,
                        fecha: anter.fecha,
                        Tipo_Verificacion: anter.Tipo_Verificacion,
                        diferencia: dif.toFixed(2),
                    });
                }

                // Si el último registro no tiene par, agrégalo con una diferencia de 0
                if (resasis.length % 2 !== 0) {
                    const ultimoRegistro = resasis[resasis.length - 1];
                    registros.push({
                        dispositivo: ultimoRegistro.dispositivo,
                        fecha: ultimoRegistro.fecha,
                        Tipo_Verificacion: ultimoRegistro.Tipo_Verificacion,
                        diferencia: "0.00", // O un mensaje, como "Sin par"
                    });
                }

                // Tercera consulta para obtener los departamentos asociados al usuario
                bd.query(
                    "SELECT DISTINCT nombre FROM departamento WHERE id_usuario = ?;",
                    [id],
                    (err, resDeps) => {
                        if (err) {
                            console.error("Error en los departamentos del usuario: " + err);
                            return res.status(500).send("Error al obtener los departamentos del usuario");
                        }
                        
                        const departamentos = resDeps.map(dep => dep.nombre);

                        const doc = generarReportePDF(nombre, carrera, registros, horastotales, departamentos);

                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
                        logger.info("Se ha generado un reporte de un usuario")
                        doc.pipe(res);
                        doc.end();
                    }
                );
            }
        );  
    });
});

// Función para obtener el reporte de un solo usuario en formato de Buffer
// function obtenerReporteUsuario(id, callback) {
//     bd.query("SELECT usuario AS nombre, carrera FROM user WHERE id = ?", [id], (err, resuser) => {
//         if (err) return callback(err);

//         if (resuser.length === 0) return callback(new Error("Usuario no encontrado"));

//         const { nombre, carrera } = resuser[0];

//         // Segunda consulta: obtener registros de asistencia
//         bd.query(
//             `SELECT dispositivo.nombre AS dispositivo, registro.fecha, registro.Tipo_Verificacion 
//              FROM registro 
//              JOIN dispositivo ON registro.id_dispositivo = dispositivo.id 
//              WHERE registro.id_usuario = ? ORDER BY registro.fecha ASC`,
//             [id],
//             (err, resasis) => {
//                 if (err) return callback(err);

//                 let horastotales = 0;
//                 const registros = [];

//                 for (let i = 1; i < resasis.length; i++) {
//                     const anter = resasis[i - 1];
//                     const actual = resasis[i];
//                     const dif = (new Date(actual.fecha) - new Date(anter.fecha)) / (1000 * 60 * 60);
//                     horastotales += dif;

//                     registros.push({
//                         dispositivo: anter.dispositivo,
//                         fecha: anter.fecha,
//                         Tipo_Verificacion: anter.Tipo_Verificacion,
//                         diferencia: dif.toFixed(2),
//                     });
//                 }

//                 // Si el último registro no tiene par, agregarlo con diferencia de 0
//                 if (resasis.length % 2 !== 0) {
//                     const ultimoRegistro = resasis[resasis.length - 1];
//                     registros.push({
//                         dispositivo: ultimoRegistro.dispositivo,
//                         fecha: ultimoRegistro.fecha,
//                         Tipo_Verificacion: ultimoRegistro.Tipo_Verificacion,
//                         diferencia: "0.00",
//                     });
//                 }

//                 // Tercera consulta: obtener departamentos del usuario
//                 bd.query(
//                     "SELECT DISTINCT nombre FROM departamento WHERE id_usuario = ?;",
//                     [id],
//                     (err, resDeps) => {
//                         if (err) return callback(err);

//                         const departamentos = resDeps.map(dep => dep.nombre);
//                         const doc = generarReportePDF(nombre, carrera, registros, horastotales, departamentos);

//                         // Almacenar el PDF en un Buffer
//                         const buffers = [];
//                         doc.on('data', (chunk) => buffers.push(chunk));
//                         doc.on('end', () => callback(null, Buffer.concat(buffers)));
//                     }
//                 );
//             }
//         );
//     });
// }

app.post("/main/informe", (req, res) => {
    const usuariosQuery = "SELECT id, usuario FROM user";
    const departamentosQuery = "SELECT id, nombre FROM departamento";
    const registrosQuery = `
      SELECT u.id AS usuario_id, u.usuario AS nombre_usuario, d.nombre AS nombre_dispositivo, r.fecha, r.Tipo_Verificacion
      FROM registro r
      JOIN user u ON r.id_usuario = u.id
      JOIN dispositivo d ON r.id_dispositivo = d.id
      ORDER BY u.usuario, r.fecha
    `;

    bd.query(usuariosQuery, (err, usuarios) => {
        if (err) {
            console.log("Error obteniendo usuarios:", err);
            return res.status(500).send("Error obteniendo usuarios.");
        }
        console.log("Usuarios:", usuarios); // Mostrar información de usuarios

        bd.query(departamentosQuery, (err, departamentos) => {
            if (err) {
                console.log("Error obteniendo departamentos:", err);
                return res.status(500).send("Error obteniendo departamentos.");
            }
            console.log("Departamentos:", departamentos); // Mostrar información de departamentos

            bd.query(registrosQuery, (err, registros) => {
                if (err) {
                    console.log("Error obteniendo registros:", err);
                    return res.status(500).send("Error obteniendo registros.");
                }
                console.log("Registros:", registros); // Mostrar información de registros

                // Agrupar registros y calcular horas totales
                const registrosAgrupados = {};
                const horasPorDepartamento = {};

                registros.forEach(registro => {
                    const { nombre_usuario, nombre_dispositivo, fecha } = registro;

                    // Agrupar registros por nombre de usuario
                    if (!registrosAgrupados[nombre_usuario]) {
                        registrosAgrupados[nombre_usuario] = { registros: [], horasTotales: 0 };
                    }

                    registrosAgrupados[nombre_usuario].registros.push({ nombre_dispositivo, fecha });

                    // Calcular horas totales
                    const usuarioRegistros = registrosAgrupados[nombre_usuario].registros;
                    if (usuarioRegistros.length > 1) {
                        const anter = usuarioRegistros[usuarioRegistros.length - 2];
                        const actual = usuarioRegistros[usuarioRegistros.length - 1];
                        const dif = (new Date(actual.fecha) - new Date(anter.fecha)) / (1000 * 60 * 60);
                        registrosAgrupados[nombre_usuario].horasTotales += dif;
                    }

                    // Sumar horas por departamento
                    const departamentoId = usuarios.find(u => u.usuario === nombre_usuario)?.id; // Supone que el id del usuario es el id del departamento
                    if (departamentoId) {
                        if (!horasPorDepartamento[departamentoId]) {
                            horasPorDepartamento[departamentoId] = { horasTotales: 0, nombre: departamentos.find(d => d.id === departamentoId)?.nombre || "Desconocido" };
                        }
                        const dif = (new Date(fecha) - new Date(usuarioRegistros[usuarioRegistros.length - 2]?.fecha || fecha)) / (1000 * 60 * 60);
                        horasPorDepartamento[departamentoId].horasTotales += dif;
                    }
                });

                console.log("Registros Agrupados:", registrosAgrupados); // Mostrar registros agrupados
                console.log("Horas por Departamento:", horasPorDepartamento); // Mostrar horas por departamento

                console.log("Creo pdf");
                // Calcular las horas totales de todos los registros
                const horasTotales = Object.values(registrosAgrupados).reduce((total, registro) => total + registro.horasTotales, 0);

                // Generar PDF con los parámetros necesarios
                const pdfDoc = generaInforme(usuarios, departamentos, registros, Object.values(registrosAgrupados), horasTotales, Object.values(horasPorDepartamento));
                console.log("termino pdf");

                const buffers = [];
                pdfDoc.on('data', chunk => buffers.push(chunk));
                pdfDoc.on('end', () => {
                    const pdfBuffer = Buffer.concat(buffers);
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader('Content-Disposition', 'attachment; filename=reporte_asistencia.pdf');
                    res.send(pdfBuffer);
                });
                pdfDoc.end(); // Finaliza el PDF
            });
        });
    });
});


function generaInforme(usuarios, departamentos, registros, registrosAgrupados, horasTotales, horasDepartamentos) {
    const doc = new PDFDocument();
    console.log(departamentos)
    // Título del reporte
    doc.fontSize(20).text(`Reporte de Asistencia`, { align: 'center' });

    // Información del primer usuario (suponiendo que solo se necesita uno para la cabecera)
    if (usuarios.length > 0) {
        for(let i=0;i < usuarios.length;i++){
            doc.moveDown();
            doc.fontSize(12).text(`Nombre: ${usuarios[i].usuario}`, { align: 'left' });
        }
    }

    // Horas Totales
    doc.moveDown();
    doc.text(`Horas Totales: ${horasTotales.toFixed(2)}`, { align: 'left' });

    // Listado de departamentos
    doc.moveDown().fontSize(15).text('Departamentos Asociados:', { underline: true });
    doc.fontSize(12);
    if (departamentos.length > 0) {
        for(let i=0;i < departamentos.length;i++){
            doc.moveDown();
            doc.fontSize(12).text(`Nombre: ${departamentos[i].nombre}`, { align: 'left' });
        }
    }
    
    // Detalles de los registros de asistencia originales
    doc.moveDown().fontSize(15).text('Detalles de los registros originales:', { underline: true });
    doc.moveDown().fontSize(10);
    registros.forEach((registro, index) => {
        doc.text(`Registro ${index + 1}:`);
        doc.text(`  Usuario: ${registro.nombre_usuario}`);
        doc.text(`  Dispositivo: ${registro.nombre_dispositivo}`);
        doc.text(`  Fecha: ${registro.fecha}`);
        doc.text(`  Verificación: ${registro.Tipo_Verificacion}`);
        doc.moveDown();
    });

    // Detalles de los registros de asistencia agrupados
    doc.moveDown().fontSize(15).text('Detalles de los registros agrupados:', { underline: true });
    doc.moveDown().fontSize(10);
    Object.entries(registrosAgrupados).forEach(([nombreUsuario, { registros }], index) => {
        doc.text(`Usuario: ${nombreUsuario}`);
        registros.forEach((item, regIndex) => {
            doc.text(`  Registro ${regIndex + 1}:`);
            doc.text(`    Dispositivo: ${item.nombre_dispositivo}`);
            doc.text(`    Fecha: ${item.fecha}`);
            // Si necesitas calcular y mostrar el tiempo transcurrido, puedes agregarlo aquí.
        });
        doc.moveDown();
    });

    return doc;
}

// Función para generar el informe combinando los PDFs
// function generarInforme(res, informe) {
//     const resultado = new PDFDocument();
//     res.setHeader('Content-Type', "application/pdf");
//     res.setHeader('Content-Disposition', 'attachment; filename=informe_asistencia.pdf');

//     resultado.pipe(res);

//     let processedPages = 0;

//     // Agrega cada página al PDF y espera a que cada una termine antes de pasar a la siguiente
//     informe.forEach((pagina, index) => {
//         pagina.pipe(resultado, { end: false });
//         pagina.on('end', () => {
//             processedPages++;

//             // Cuando todos los PDFs hayan sido agregados, finaliza el documento
//             if (processedPages === informe.length) {
//                 resultado.end();
//             }
//         });
//     });
// }

app.post("/main/mensajes/publico", (req, res) => {
    const { id_usr, mensaje } = req.body;
    
    if (!id_usr || !mensaje) {
        return res.status(400).json({ error: "ID de usuario y mensaje son requeridos." });
    }

    bd.query("SELECT id FROM user", (error, ids) => {
        if (error) {
            console.log("Hay error"+error)
            logger.info("Error al obtener id de los usuarios:", error);
            return res.status(500).json({ error: "Error en consulta id" });
        }

        const mensajes = ids.map(usuario => ([
            usuario.id, // id_usuario
            id_usr,     // id_emisor
            mensaje     // mensaje
        ]));

        const sql = 'INSERT INTO mensaje (id_usuarior, id_usuarioe, mensaje) VALUES ?';
        
        bd.query(sql, [mensajes], (insertError) => {
            if (insertError) {
                console.log("Hay error al meter"+insertError)
                logger.info("Error al enviar el mensaje:", insertError);
                return res.status(500).json({ error: 'Error al enviar el mensaje' });
            }
            res.status(200).json({ message: 'Mensajes enviados correctamente' });
        });
    });
});

app.post("/main/mensajes/privado",(req,res) =>{
    const { id_usr, id_dest, mensaje } = req.body;

    if (!id_usr || !id_dest || !mensaje) {
        return res.status(400).json({ error: "ID de usuario, destinatario y mensaje son requeridos." });
    }

    const sql = 'INSERT INTO mensaje (id_usuarior, id_usuarioe, mensaje) VALUES (?, ?, ?)';
    
    bd.query(sql, [id_dest, id_usr, mensaje], (insertError) => {
        if (insertError) {
            console.error("Error al enviar el mensaje:", insertError);
            return res.status(500).json({ error: 'Error al enviar el mensaje' });
        }
        res.status(200).json({ message: 'Mensaje enviado correctamente' });
    });
})

app.post("/main/mensajes/temporal",(req,res) =>{
    const { id_usr, mensaje, fecha } = req.body;

    if (!id_usr || !mensaje || !fecha) {
        return res.status(400).json({ error: "ID de usuario, mensaje y fecha son requeridos." });
    }

    const sql = 'INSERT INTO mensaje (id_usuarior, id_usuarioe, mensaje, fecha) VALUES (?, ?, ?, ?)';
    
    bd.query(sql, [id_usr, id_usr, mensaje, fecha], (insertError) => {
        if (insertError) {
            console.error("Error al enviar el mensaje:", insertError);
            return res.status(500).json({ error: 'Error al enviar el mensaje' });
        }
        res.status(200).json({ message: 'Mensaje enviado correctamente' });
    });
})

app.post('/main/mensajes/departamento', (req, res) => {
    const { id_usr, nombre_departamento, mensaje } = req.body;

    if (!id_usr || !nombre_departamento || !mensaje) {
        return res.status(400).json({ error: 'Faltan parámetros en la solicitud' });
    }

    // Primero, buscar el id_usuario en la tabla departamento
    const query = 'SELECT id_usuario FROM departamento WHERE nombre = ?';
    bd.query(query, [nombre_departamento], (err, resultados) => {
        if (err) {
            console.log("Error al buscar departamento:", err);
            return res.status(500).json({ error: 'Error al buscar departamento' });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }

        // Obtener todos los ids de usuario
        const idsUsuarios = resultados.map(result => result.id_usuario);
        
        // Insertar el mensaje para cada id_usuario
        let errores = [];
        let insertCount = 0;

        idsUsuarios.forEach(id_usuario => {
            const insertQuery = 'INSERT INTO mensaje (id_usuarior, id_usuarioe, mensaje) VALUES (?, ?, ?)';
            bd.query(insertQuery, [id_usr, id_usuario, mensaje], (err) => {
                if (err) {
                    console.log("Error al insertar mensaje:", err);
                    errores.push(err);
                }
                insertCount++;

                // Cuando todas las inserciones han terminado
                if (insertCount === idsUsuarios.length) {
                    if (errores.length > 0) {
                        return res.status(500).json({ error: 'Error al enviar algunos mensajes', details: errores });
                    }
                    return res.status(200).json({ message: 'Mensajes enviados exitosamente' });
                }
            });
        });
    });
});

app.get('/main/mensajes/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;

    const query = 'SELECT * FROM mensaje WHERE id_usuarior = ?';
    
    bd.query(query, [idUsuario], (error, results) => {
        if (error) {
            console.error('Error al obtener mensajes:', error);
            return res.status(500).json({ error: 'Error al obtener mensajes' });
        }
        res.json(results);
    });
});

app.get("/main/nummensaj",(req,res) =>{
    const id= req.query.id

    const query="SELECT COUNT(*) AS count FROM mensaje WHERE id_usuarior= ?"
    bd.query(query,[id],(error,resultado) =>{
        if(error){
            console.error("Fallo en la cuenta"+error)
            res.status(500).json({message:"Error en la consulta"})
        }
        res.json({count: resultado[0].count})
    })
})

app.post('/main/auten', (req, res) => { 
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena; // Contraseña cifrada enviada desde el frontend
    console.log("auten pr")

    // Consulta para obtener el usuario y la contraseña encriptada desde la base de datos
    const query = 'SELECT * FROM user WHERE usuario = ?';
    bd.query(query, [usuario], (error, result) => {
        if (error) {
            res.status(500).json({ message: "Error en la consulta" });
            return;
        }

        // Si se encuentra el usuario
        if (result.length > 0) {
            const storedEncryptedPassword = result[0].contrasena; // Obtén la contraseña encriptada

            // Desencriptar la contraseña almacenada
            const bytes = crypto.AES.decrypt(storedEncryptedPassword, KEY);
            const decryptedStoredPassword = bytes.toString(crypto.enc.Utf8);

            // Comparar la contraseña desencriptada almacenada con la contraseña encriptada proporcionada
            const bytesProvided = crypto.AES.decrypt(contrasena, KEY);
            const decryptedProvidedPassword = bytesProvided.toString(crypto.enc.Utf8);

            // Comparar las contraseñas
            if (decryptedStoredPassword === decryptedProvidedPassword) {
                res.status(200).json({ message: "Login correcto", num: result[0].id });
            } else {
                res.status(401).json({ message: "Login invalido, credenciales erroneas" });
            }
        } else {
            res.status(401).json({ message: "Login invalido, credenciales erroneas" });
        }
    });

    logger.info("Se ha logeado la cuenta de usuario: " + usuario);
});

app.post("/main/operaciones/borrar",(req,res) =>{

    bd.query("SHOW TABLES",(error,tablas) =>{
        if(error){
            console.log("Error al ver tablas"+error)
        }

        tablas.forEach((tabla,index) =>{
            const nombre= Object.values(tabla)[0]
            const borrador= `TRUNCATE TABLE ${nombre}`

            bd.query(borrador,(error) =>{
                if(error){
                    console.error("Error al borrar"+error)
                }
            })
            if(index === tablas.length -1){
                res.status(200).json({message:"Tabla borrada"})
            }
        })
    })
})

app.post('/main/operaciones/copia', (req, res) => {
    const backupFilePath = path.join(__dirname, `backup-${Date.now()}.sql`);
    const writeStream = fs.createWriteStream(backupFilePath);

    // Desactivar las restricciones de clave externa
    writeStream.write('SET FOREIGN_KEY_CHECKS = 0;\n');

    // Obtener todas las tablas
    bd.query('SHOW TABLES', (error, tables) => {
        if (error) {
            console.error('Error al obtener las tablas:', error);
            return res.status(500).json({ message: 'Error al obtener las tablas' });
        }

        tables.forEach((tableObj, index) => {
            const tableName = Object.values(tableObj)[0];
            writeStream.write(`-- Dumping data for table ${tableName}\n`);

            // Usar TRUNCATE en lugar de DELETE
            writeStream.write(`TRUNCATE TABLE \`${tableName}\`;\n`);

            // Obtener los datos de la tabla para incluir en la copia
            bd.query(`SELECT * FROM \`${tableName}\``, (error, rows) => {
                if (error) {
                    console.error(`Error al obtener datos de la tabla ${tableName}:`, error);
                    return res.status(500).json({ message: `Error al obtener datos de la tabla ${tableName}` });
                }

                rows.forEach(row => {
                    const columns = Object.keys(row).map(col => `\`${col}\``).join(', ');
                    const values = Object.values(row).map(val => bd.escape(val)).join(', ');
                    writeStream.write(`INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});\n`);
                });

                // Cuando terminamos con la última tabla, reactivamos las restricciones
                if (index === tables.length - 1) {
                    writeStream.write('SET FOREIGN_KEY_CHECKS = 1;\n'); // Reactivar restricciones de claves foráneas
                    writeStream.end();
                    res.status(200).json({ message: 'Copia de seguridad creada exitosamente', file: backupFilePath });
                }
            });
        });
    });
});


// 3. Endpoint para restaurar la base de datos desde un archivo SQL
app.post('/main/operaciones/restaurar', (req, res) => {
    const { filePath } = req.body;

    // Leer el archivo de copia de seguridad
    fs.readFile(filePath, 'utf8', (err, sql) => {
        if (err) {
            console.error('Error al leer el archivo de copia de seguridad:', err);
            return res.status(500).json({ message: 'Error al leer el archivo de copia de seguridad' });
        }

        // Filtrar comentarios y dividir el archivo en sentencias individuales
        const queries = sql
            .split(';')  // Divide el archivo por cada ';'
            .map(line => line.trim()) // Elimina espacios innecesarios
            .filter(line => line && !line.startsWith('--') && !line.startsWith('/*')); // Excluye comentarios

        // Ejecutar cada consulta SQL en orden
        const executeQueries = async () => {
            for (let query of queries) {
                try {
                    await bd.promise().query(query);
                } catch (error) {
                    console.error('Error al ejecutar la consulta:', error);
                    return res.status(500).json({ message: 'Error al restaurar la base de datos', error });
                }
            }
            res.status(200).json({ message: 'Base de datos restaurada exitosamente' });
        };

        executeQueries();
    });
});

app.get("/main/sacausur", (req, res) => {
    const { id } = req.query;
  
    // Validar que el id no sea nulo o vacío
    if (!id) {
      return res.status(400).json({ error: 'ID no proporcionado' });
    }
  
    bd.query('SELECT usuario, privilegios, foto FROM user WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ error: 'Error al obtener el usuario' });
      }
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    });
  });
  
  app.post("/main/mirarasist", (req, res) => {
    const { id_usuario } = req.body;

    // Primero obtenemos las reglas asociadas a este usuario desde la tabla 'departamento'
    bd.query("SELECT id_regla FROM departamento WHERE id_usuario = ?", [id_usuario], (error, reglas) => {
        if (error) {
            console.log("Error al ver reglas: " + error);
            return res.status(500).json({ message: "Error al obtener las reglas: " + error });
        }

        if (reglas.length === 0) {
            return res.status(400).json({ message: "No hay reglas asociadas al usuario" });
        }

        // Extraemos los ids de las reglas asociadas al usuario
        const id_reglas = reglas.map(r => r.id_regla);

        // Ahora, obtenemos los intervalos de fechas para las reglas asociadas al usuario
        bd.query("SELECT fecha_inicio, fecha_fin FROM regla WHERE id IN (?)", [id_reglas], (error, reglasFecha) => {
            if (error) {
                console.log("Error al obtener las fechas de las reglas: " + error);
                return res.status(500).json({ message: "Error al obtener las fechas de las reglas: " + error });
            }

            if (reglasFecha.length === 0) {
                return res.status(400).json({ message: "No se encontraron intervalos de fechas para las reglas" });
            }

            // Obtenemos la fecha y hora actuales en formato DATETIME
            const hoy = new Date();
            const hoyInicio = hoy.setHours(0, 0, 0, 0); // Solo fecha, sin hora
            const hoyFin = hoy.setHours(23, 59, 59, 999); // Último momento de hoy

            // Filtramos las reglas cuya fecha de inicio ya haya pasado o sea hoy, y cuya fecha de fin no haya pasado
            const reglasValidas = reglasFecha.filter(regla => {
                const fechaInicio = new Date(regla.fecha_inicio).getTime();
                const fechaFin = new Date(regla.fecha_fin).getTime();
                
                // La fecha de inicio debe ser hoy o anterior, y la fecha de fin debe ser igual o posterior a hoy
                return fechaInicio <= hoyInicio && fechaFin <= hoyInicio;
            });

            if (reglasValidas.length === 0) {
                console.log("No hay reglas activas hasta hoy");
                return res.status(400).json({ message: "No hay reglas activas hasta hoy" });
            }

            // Ordenamos las reglas válidas por fecha de inicio, seleccionando la más reciente
            const reglaReciente = reglasValidas.sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))[0];

            // Creamos una lista de promesas para contar los registros dentro de cada intervalo
            const query = `
                SELECT COUNT(*) AS num_registros
                FROM registro
                WHERE id_usuario = ? 
                  AND fecha BETWEEN ? AND ?
            `;
            bd.query(query, [id_usuario, reglaReciente.fecha_inicio, reglaReciente.fecha_fin], (error, resultados) => {
                if (error) {
                    console.log("Error al contar los registros: " + error);
                    return res.status(500).json({ message: "Error al contar los registros: " + error });
                }
                return res.json({ num_registros: resultados[0].num_registros });
            });
        });
    });
});

app.delete("/main/personalb", (req, res) => {
    const { id_usr, nombre } = req.body;
    console.log(id_usr)
    console.log(nombre)
    if (!id_usr || !nombre) {
        return res.status(400).send('Faltan parámetros requeridos');
    }

    try {
        bd.query("DELETE FROM departamento WHERE id_usuario = ? AND nombre = ?", [id_usr, nombre], (error, results) => {
            if (error) {
                console.error('Error al eliminar registros:', error);
                return res.status(500).send('Error del servidor');
            }

            if (results.affectedRows > 0) {
                res.status(200).send('Registros eliminados exitosamente');
            } else {
                res.status(404).send('No se encontraron registros para eliminar');
            }
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).send('Error del servidor');
    }
});

  
app.listen(3001, () => {
    console.log("Server running en el puerto 3001");
});


