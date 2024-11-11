import React, { useState } from "react";
import Axios from 'axios';
import "../../estilos/agregar.css";

const AgregarDispositivo = ({ children, onClose }) => {
    const [nombre, setNombre] = useState("");
    const [tipo, setTipo] = useState("");
    const posib_tipo = ["SI", "FP", "RF"];
    const [sacar_lista, setSacarLista] = useState(false);

    const botonLista = () => {
        setSacarLista(!sacar_lista);
    };

    const elegirTipo = (tipo) => {
        setTipo(tipo);
        setSacarLista(false);
    };

    const envio = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/main/dispositivos/agregar", {
            tipo: tipo,
            nombre: nombre,
        })
        .then(() => {
            onClose();
        })
        .catch((error) => {
            console.log("Error al agregar dispositivo" + error);
        });
    };

    return (
        <div className="Agregar">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Agregar Dispositivo</h3>
                <form className="Formulario" onSubmit={envio}>
                    <label>Nombre</label>
                    <input 
                        type="text" 
                        onChange={(e) => setNombre(e.target.value)} 
                    />
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
                    <button className="boton_agregar" type="submit">Agregar Regla</button>
                </form>
                {children}
            </div>
        </div>
    );
};

export default AgregarDispositivo;
