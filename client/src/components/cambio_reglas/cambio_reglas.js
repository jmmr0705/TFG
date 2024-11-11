import "../../estilos/cambio_reglas.css";
import Axios from 'axios';
import React, { useEffect, useState } from "react";

const CambioReglas = ({ linea, onClose, children }) => {
    const [nombre, setNombre] = useState("")
    const [fecha_inicio, setfechainicio] = useState("")
    const [fecha_fin, setfechafin] = useState("")

    // Formato de fecha para MySQL
    const MYSQLformat = (fecha) => {
        return fecha.replace("T", " ") + ":00"
    };

    // Formato para mostrar la fecha en el input
    const formatfront = (fecha) => {
        const aux = new Date(fecha)
        return aux.toISOString().slice(0, 16)
    };

    useEffect(() => {
        if (linea) {
            setNombre(linea.nombre || "");
            setfechainicio(linea.fecha_inicio ? formatfront(linea.fecha_inicio) : "")
            setfechafin(linea.fecha_fin ? formatfront(linea.fecha_fin) : "")
        }
    }, [linea]);

    // Manejo de la modificación de la regla
    const modificar = (e) => {
        e.preventDefault()
        const ini_format = MYSQLformat(fecha_inicio)
        const fin_format = MYSQLformat(fecha_fin)

        Axios.put(`http://localhost:3001/main/regla/${linea.id}`, {
            nombre: nombre,
            fecha_inicio: ini_format,
            fecha_fin: fin_format
        })
        .then(() => {
            alert("Regla modificada")
            onClose()
        })
        .catch((error) => {
            console.log("Error al modificar la regla:", error)
        })
    }

    const borrar= () =>{
        Axios.delete(`http://localhost:3001/main/regla/${linea.id}`).then((resp) =>{
            onClose()
        }).catch((error) =>{
            console.log("Error al borrar el usuario"+error)
        })
    }

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Modificar Reglas</h3>
                <form onSubmit={modificar} className="formulario_modif">
                    <label>Nombre</label>
                    <input 
                        type="text" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
                    <label>Fecha Inicio</label>
                    <input 
                        type="datetime-local" 
                        value={fecha_inicio} 
                        onChange={(e) => setfechainicio(e.target.value)} 
                    />
                    <label>Fecha Fin</label>
                    <input 
                        type="datetime-local" 
                        value={fecha_fin} 
                        onChange={(e) => setfechafin(e.target.value)} 
                    />
                    <button type="submit">Guardar Cambios</button>
                    <button onClick={borrar}>Borrar Regla</button>
                </form>
                {children}
            </div>
        </div>
    );
};

export default CambioReglas;
