import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import Depart from "./depart.js";

const Aplicar_Regla = ({onClose, children}) => {
    const [reglas, setReglas] = useState([]);
    const [lineaElegida, setLineaElegida] = useState(null);
    const [abrir_dep, useopenDep, usecerrarDep] = Hook_Usuario(false);

    useEffect(() => {
        const getReglas = () => {
            Axios.get("http://localhost:3001/main/reglas").then((resp) => {
                setReglas(resp.data);
            }).catch((error) => {
                console.log("Error al ver reglas" + error);
            });
        };
        getReglas();
    }, []);

    const elegirFila = (linea) => {
        setLineaElegida(linea);
        useopenDep(true);  // Llamamos directamente a useopenDep() para abrir el modal
        console.log("aaaaaaaaaaaaa"+abrir_dep)
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Reglas Creadas</h3>
                <table className="tabla-dispositivos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reglas.map((val, key) => (
                            <tr key={key} onClick={() => elegirFila(val)} className="fila_boton">
                                <td>{val.nombre}</td>
                                <td>{val.fecha_inicio}</td>
                                <td>{val.fecha_fin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {abrir_dep && (
                    <Depart onClose={usecerrarDep} linea={lineaElegida} />
                )}
                {children}
            </div>
        </div>
    );
};

export default Aplicar_Regla;
