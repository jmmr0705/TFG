import React, { useState } from 'react';
import Axios from 'axios';

const InformeComp = ({ onClose }) => {
    const [nombre, setNombre] = useState("");

    const descarga = async () => {
        try {
            const resp = await Axios.post("http://localhost:3001/main/informe", {}, {
                responseType: 'blob'
            });

            // Crear un enlace para la descarga
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const enlace = document.createElement("a");
            enlace.href = url;
            enlace.setAttribute('download', `${nombre}.pdf`);
            document.body.appendChild(enlace);
            enlace.click();
            enlace.parentNode.removeChild(enlace);
        } catch (error) {
            console.log("Error en la descarga del informe: " + error);
        }
    }

    return (
        <div className='modal is-open'>
            <div className='modal-container'>
                <h3>Ingrese el nombre del informe</h3>
                <button className="modal-close" onClick={onClose}>X</button>
                <input 
                    type='text' 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                    placeholder="Nombre del informe" 
                />
                <button onClick={descarga}>Descargar Informe Completo de Asistencia</button>
            </div>
        </div>
    );
}

export default InformeComp;
