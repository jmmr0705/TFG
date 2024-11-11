import "../../estilos/cambio_reglas.css";
import Axios from 'axios';
import React, { useEffect, useState } from "react";

const CambioDispositivo = ({ linea, onClose, children }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const posib_tipo = ["SI", "FP", "RF"];
    const [sacar_lista, setSacarLista] = useState(false);

    useEffect(() => {
        if (linea) {
            setNombre(linea.nombre || "");
            setTipo(linea.tipo || "");
        }
    }, [linea]);

    const botonLista = () => {
        setSacarLista(!sacar_lista);
    };

    const elegirTipo = (tipo) => {
        setTipo(tipo);
        setSacarLista(false);
    };

    const modificar = (e) => {
        e.preventDefault();
        
        Axios.put(`http://localhost:3001/main/dispositivo/${linea.id}`, {
            nombre: nombre,
            tipo: tipo
        })
        .then(() => {
            alert("Dispositivo Modificado");
            onClose();
        })
        .catch((error) => {
            console.log("Error al modificar la regla:", error);
        });
    };

    const borrar= () =>{
        Axios.delete(`http://localhost:3001/main/dispositivo/${linea.id}`).then((resp) =>{
            onClose()
        }).catch((error) =>{
            console.log("Error al borrar el usuario"+error)
        })
    }

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Modificar Dispositivo</h3>
                <form onSubmit={modificar} className="formulario_modif">
                    <label>Nombre</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    <label>Tipo</label>
                    <div className="lista">
                        <input 
                            type="text" 
                            value={tipo} 
                            readOnly 
                            onClick={botonLista} 
                            placeholder="Seleccione tipo"
                        />
                        {sacar_lista && (
                            <div className="lista-opciones">
                                {posib_tipo.map((opcion, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => elegirTipo(opcion)} 
                                        className="opcion"
                                    >
                                        {opcion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button type="submit">Guardar Cambios</button>
                    <button onClick={borrar}>Borrar Dispositivo</button>
                </form>
            </div>
        </div>
    );
};

export default CambioDispositivo;
