import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from "axios";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import CambioRegistro from "../cambio_registros/cambio_registros";

const Modal_Registro = ({ children, onClose }) => {
    const [registros, SetRegistros] = useState([]);
    const [abrirModif, setAbrirModif, setCerrarModif] = Hook_Usuario(false);
    const [lineaElegida, setLineaElegida] = useState(null);

    useEffect(() => {
        const getUsuarios = () => {
            Axios.get("http://localhost:3001/main/registros")
                .then((response) => {
                    SetRegistros(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener usuarios:", error);
                });
        };

        getUsuarios();
    }, []);

    const elegirfila = (linea) => {
        setLineaElegida(linea);
        setAbrirModif(true);
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestión de Registros</h3>
                
                <table className="tabla-dispositivos">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo de Verificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((val, key) => (
                            <tr key={key} onClick={() => elegirfila(val)} className="fila_boton">
                                <td>{val.fecha}</td>
                                <td>{val.Tipo_Verificacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {abrirModif && (
                    <CambioRegistro linea={lineaElegida} onClose={setCerrarModif}></CambioRegistro>
                )}

                {children}
            </div>
        </div>
    );
};

export default Modal_Registro;
