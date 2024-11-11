import React, { useState } from "react";
import Axios from "axios";

const Modal_Subir = ({ onClose }) => {
    const [archivo, setArchivo] = useState(null);

    const confirmar = (e) => {
        e.preventDefault();
        
        // Crear un FormData y agregar el archivo
        const formData = new FormData();
        formData.append("archivo", archivo);

        try {
            Axios.post("http://localhost:3001/main/cargadatos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            .then((resp) => {
                alert("Se han registrado las asistencias");
            })
            .catch((error) => {
                console.log("Error en el endpoint: " + error);
                alert("Error al procesar el archivo: " + error);
            });
        } catch (error) {
            console.log("Hay un error: " + error);
            alert("Error con el archivo de datos");
        }
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Seleccione el archivo de asistencia</h3>
                <form onSubmit={confirmar}>
                    <input
                        type="file"
                        onChange={(e) => setArchivo(e.target.files[0])}
                        accept=".csv"
                    />
                    <button type="submit">Subir Registros</button>
                </form>
            </div>
        </div>
    );
};

export default Modal_Subir;
