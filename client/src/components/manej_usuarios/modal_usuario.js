import React from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { useState, useEffect } from "react";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import TocaInfo from "../cambio_usuarios/toca_info.js"; // Importamos el componente TocaInfo
import BorrarUsuario from "../cambio_usuarios/cambio_usuarios.js";

const Modal_Usuario = ({ children, onClose }) => {
    const [usuarios, SetUsuarios] = useState([]);
    const [abrirBorrar, useopenBorrar, usecloseBorrar] = Hook_Usuario(false);
    const [lineaElegida, setLineaElegida] = useState(null);
    const [abrirEditar, useopenEditar, usecloseEditar] = Hook_Usuario(false); // Hook para abrir/cerrar TocaInfo

    useEffect(() => {
        const getUsuarios = () => {
            Axios.get("http://localhost:3001/main/usuarios")
                .then((response) => {
                    SetUsuarios(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener usuarios:", error);
                });
        };

        getUsuarios();
    }, []);

    const elegirFila = (linea) => {
        setLineaElegida(linea);
        useopenEditar(true); // Abre el modal de TocaInfo cuando se selecciona un usuario
    };

    const abrirBorrarModal = () => {
        useopenBorrar(true);
    }

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestión de Usuarios</h3>

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

                {abrirBorrar && (
                    <BorrarUsuario linea={lineaElegida} onClose={usecloseBorrar}></BorrarUsuario>
                )}
                {abrirEditar && (
                    <TocaInfo linea={lineaElegida} onClose={usecloseEditar}></TocaInfo>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal_Usuario;
