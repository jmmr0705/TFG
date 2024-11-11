const CryptoJS = require("crypto-js");
const fs = require('fs');
const KEY= require("./secret_132_.js")
// Definir una clave secreta para el cifrado y descifrado
const SECRET_KEY = "mi_clave_secreta"; // Debe ser guardada de manera segura

// Función para cifrar una imagen
function encryptImage(imagePath) {
  // Leer la imagen y convertirla a base64
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString('base64');

  // Cifrar la imagen usando CryptoJS
  const encryptedImage = CryptoJS.AES.encrypt(imageBase64, SECRET_KEY).toString();

  console.log('Imagen cifrada:');
  console.log(encryptedImage);
  
  return encryptedImage;
}

// Función para descifrar la imagen
function decryptImage(encryptedImage) {
  // Descifrar la imagen usando CryptoJS
  const bytes = CryptoJS.AES.decrypt(encryptedImage, SECRET_KEY);
  const decryptedBase64 = bytes.toString(CryptoJS.enc.Utf8);

  if (decryptedBase64) {
    // Convertir el base64 descifrado de nuevo a un buffer de imagen
    const imageBuffer = Buffer.from(decryptedBase64, 'base64');
    
    // Guardar la imagen descifrada en el sistema de archivos
    fs.writeFileSync('imagen_descifrada.jpg', imageBuffer);

    console.log('Imagen descifrada y guardada como "imagen_descifrada.jpg"');
  } else {
    console.log('Error al descifrar la imagen');
  }
}

// Ejemplo de uso
const encryptedImage = encryptImage('./logo.png'); // Ruta de tu imagen
decryptImage(encryptedImage);
