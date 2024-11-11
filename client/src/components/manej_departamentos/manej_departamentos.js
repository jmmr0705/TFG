import React from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { useState, useEffect } from "react";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import CambioDepartamento from "../cambio_departamentos/cambio_departamentos";
import AgregarDepartamento from "../agregar_departamento/agregar_departamento.js";

const Modal_Departamento = ({ children, onClose }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [abrirModif, setAbrirModif, setCerrarModif] = Hook_Usuario(false);
    const [abrirAgregar, setAbrirAgregar, setCerrarAgregar] = Hook_Usuario(false);
    const [lineael, setLinea] = useState(null);

    const elegirfila = (linea) => {
        setLinea(linea);
        setAbrirModif(true);
    }

    useEffect(() => {
        const getDepartamentos = () => {
            Axios.get("http://localhost:3001/main/departamentos")
                .then((response) => {
                    setDepartamentos(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener departamentos:", error);
                });
        };

        getDepartamentos();
    }, []);

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestión de Departamentos</h3>
                <button className="boton_agregar" onClick={() => setAbrirAgregar(true)}>Agregar Departamento</button>

                <table className="tabla-dispositivos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departamentos.map((val, key) => (
                            <tr key={key} onClick={() => elegirfila(val)} className="fila_boton">
                                <td>{val.nombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {abrirModif && (
                    <CambioDepartamento
                        linea={lineael} 
                        onClose={setCerrarModif}></CambioDepartamento>
                )}

                {abrirAgregar && (
                    <AgregarDepartamento onClose={setCerrarAgregar}></AgregarDepartamento>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal_Departamento;
