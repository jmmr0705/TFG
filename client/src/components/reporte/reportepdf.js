import React, { useState } from 'react';
import axios from 'axios';

function ReporteAsistencia() {
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('id');  // Obtenemos el ID del usuario desde localStorage

    const handleDownload = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/main/reporte', { id: userId }, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

            // Crear un link temporal para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte_asistencia.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error al descargar el reporte: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Cargando reporte...</p>
            ) : (
                <button onClick={handleDownload}>Descargar Reporte</button>
            )}
        </div>
    );
}

export default ReporteAsistencia;
