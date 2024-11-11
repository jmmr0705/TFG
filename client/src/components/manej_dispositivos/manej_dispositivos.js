import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from "axios";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import CambioDispositivo from "../cambio_dispositivos/cambio_dispositivos.js";
import AgregarDispositivo from "../agregar_dispositivo/agregar_dispositivo.js";

const Modal_Dispositivo = ({ children, onClose }) => {
    const [dispositivos, SetDispositivos] = useState([]);
    const [modif, useabrirModif, usecerrarModif] = Hook_Usuario(false);
    const [agregar, useabrirAgregar, usecerrarAgregar] = Hook_Usuario(false);
    const [lineel, setLineael] = useState(null);

    useEffect(() => {
        const getUsuarios = () => {
            Axios.get("http://localhost:3001/main/dispositivos")
                .then((response) => {
                    SetDispositivos(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener usuarios:", error);
                });
        };

        getUsuarios();
    }, []);

    const elegirfila = (linea) => {
        setLineael(linea);
        useabrirModif(true);
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestión de Dispositivos</h3>
                <button className="boton_agregar" onClick={() => useabrirAgregar(true)}>Agregar Dispositivo</button>
                
                <table className="tabla-dispositivos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispositivos.map((val, key) => (
                            <tr key={key} onClick={() => elegirfila(val)} className="fila_boton">
                                <td>{val.nombre}</td>
                                <td>{val.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {modif && (
                    <CambioDispositivo linea={lineel} onClose={usecerrarModif}></CambioDispositivo>
                )}

                {agregar && (
                    <AgregarDispositivo onClose={usecerrarAgregar}></AgregarDispositivo>
                )}

                {children}
            </div>
        </div>
    );
};

export default Modal_Dispositivo;
