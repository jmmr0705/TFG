// Exportar las funciones
export const pixelarImagen = (imageFile, pixelSize = 10) => {
    const img = new Image();
    const reader = new FileReader();
    let pixelatedImageBlob = null;

    reader.onload = (e) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Aplicar el pixelado
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let y = 0; y < canvas.height; y += pixelSize) {
                for (let x = 0; x < canvas.width; x += pixelSize) {
                    const red = averageColor(x, y, pixelSize, 'r', data, canvas.width, canvas.height);
                    const green = averageColor(x, y, pixelSize, 'g', data, canvas.width, canvas.height);
                    const blue = averageColor(x, y, pixelSize, 'b', data, canvas.width, canvas.height);

                    for (let ky = 0; ky < pixelSize; ky++) {
                        for (let kx = 0; kx < pixelSize; kx++) {
                            const index = ((y + ky) * canvas.width + (x + kx)) * 4;
                            if (index < data.length) {
                                data[index] = red;
                                data[index + 1] = green;
                                data[index + 2] = blue;
                            }
                        }
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            canvas.toBlob((blob) => {
                pixelatedImageBlob = blob; // Guardamos la imagen pixelada
            }, "image/jpeg");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);

    // Devolvemos el Blob pixelado
    return pixelatedImageBlob;
};

// Función para obtener el color promedio de un área
const averageColor = (x, y, pixelSize, colorChannel, data, canvasWidth, canvasHeight) => {
    let total = 0;
    let count = 0;

    for (let ky = 0; ky < pixelSize; ky++) {
        for (let kx = 0; kx < pixelSize; kx++) {
            const ix = x + kx;
            const iy = y + ky;

            if (ix < canvasWidth && iy < canvasHeight) {
                const index = (iy * canvasWidth + ix) * 4;
                const colorValue = colorChannel === 'r' ? data[index] :
                                   colorChannel === 'g' ? data[index + 1] :
                                   data[index + 2];
                total += colorValue;
                count++;
            }
        }
    }

    return total / count;
};

// Función para revertir el pixelado (restaurar la imagen)
export const revertirPixelado = (imageFile) => {
    const img = new Image();
    const reader = new FileReader();
    let restoredImageBlob = null;

    reader.onload = (e) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Intentamos suavizar la imagen
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                restoredImageBlob = blob; // Guardamos la imagen suavizada
            }, "image/jpeg");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);

    // Devolvemos el Blob restaurado
    return restoredImageBlob;
};
