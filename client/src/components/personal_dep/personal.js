import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import Departamento_Elegir from "./departamento.js";

const Personal_Departamento = ({ onClose, children }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [lineaElegida, setLineaElegida] = useState(null);
    const [abrirDepart, abrirModalDepart, cerrarModalDepart] = Hook_Usuario(false);

    useEffect(() => {
        const getUsuarios = () => {
            Axios.get("http://localhost:3001/main/usuarios")
                .then((response) => {
                    setUsuarios(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener usuarios:", error);
                });
        };

        getUsuarios();
    }, []);

    const elegirFila = (linea) => {
        setLineaElegida(linea);
        abrirModalDepart(true);
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Usuarios creados</h3>

                <table className="tabla-dispositivos">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Carrera</th>
                            <th>Privilegios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((val, key) => (
                            <tr key={key} onClick={() => elegirFila(val)} className="fila_boton">
                                <td>{val.usuario}</td>
                                <td>{val.carrera}</td>
                                <td>{val.privilegios}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {abrirDepart && (
                    <Departamento_Elegir onClose={cerrarModalDepart} linea={lineaElegida} />
                )}

                {children}
            </div>
        </div>
    );
};

export default Personal_Departamento;
