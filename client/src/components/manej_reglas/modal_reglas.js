import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { Hook_Usuario } from "../../hooks/hook_modal.js"; 
import CambioRegla from "../cambio_reglas/cambio_reglas.js";
import AgregarReglas from "../agregar_reglas/agregar_reglas.js";

const ModalRegla = ({ children, onClose }) => {
    const [reglas, setReglas] = useState([]);
    
    // Usando Hook_Usuario para manejar el modal de modificar reglas
    const [abrirModif, setAbrirModif, setCerrarModif] = Hook_Usuario(false);
    
    // Usando Hook_Usuario para manejar el modal de agregar reglas
    const [abrirAgregar, setAbrirAgregar, setCerrarAgregar] = Hook_Usuario(false);

    const [lineaElegida, setLineaElegida] = useState(null);

    // Obtener las reglas al cargar el componente
    useEffect(() => {
        const getReglas = () => {
            Axios.get("http://localhost:3001/main/reglas")
                .then((response) => {
                    setReglas(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener reglas:", error);
                });
        };

        getReglas();
    }, []);

    // Manejar la selección de una regla para editarla
    const elegirfila = (linea) => {
        setLineaElegida(linea);
        setAbrirModif(true);  // Abre el modal de modificación
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestión de Reglas</h3>  

                <button className="boton_agregar" onClick={() => setAbrirAgregar(true)}>Agregar Regla</button>

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
                            <tr key={key} onClick={() => elegirfila(val)} className="fila_boton">
                                <td>{val.nombre}</td>
                                <td>{val.fecha_inicio}</td>
                                <td>{val.fecha_fin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {abrirModif && (
                    <CambioRegla 
                        linea={lineaElegida} 
                        onClose={setCerrarModif}></CambioRegla>
                )}
                {abrirAgregar && (
                    <AgregarReglas onClose={setCerrarAgregar}></AgregarReglas>
                )}
                {children}
            </div>
        </div>
    );
};

export default ModalRegla;
