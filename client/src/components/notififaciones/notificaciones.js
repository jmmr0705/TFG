import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import cryptoJS from 'crypto-js';
import { KEY } from '../../secret_132_.js';

const Modal_Mensajes = ({ onClose }) => {
    const [mensajes, setMensajes] = useState([]);
    const [abrirMensaje, setAbrirMensaje] = useState(false);
    const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    useEffect(() => {
        const getMensajes = () => {
            const idUsuario = localStorage.getItem('id'); // Obtener ID del usuario desde localStorage
            Axios.get(`http://localhost:3001/main/mensajes/${idUsuario}`)
                .then((response) => {
                    const mensajesDesencriptados = response.data.map((mensaje) => {
                        const mensajeDesencriptado = cryptoJS.AES.decrypt(mensaje.mensaje, KEY).toString(cryptoJS.enc.Utf8);
                        return { ...mensaje, mensaje: mensajeDesencriptado };
                    });
                    setMensajes(mensajesDesencriptados);
                })
                .catch((error) => {
                    console.log("Error al obtener mensajes:", error);
                });
        };

        getMensajes();
    }, []);

    const manejarSeleccion = (mensaje) => {
        setMensajeSeleccionado(mensaje);
        setMostrarConfirmacion(true); // Mostrar la ventana de confirmación
    };

    const manejarEliminar = (id) => {
        Axios.delete(`http://localhost:3001/main/mensaje/${id}`)
            .then((response) => {
                setMensajes(mensajes.filter(mensaje => mensaje.id !== id)); // Actualizar la lista de mensajes
                console.log('Mensaje eliminado');
            })
            .catch((error) => {
                console.log('Error al eliminar el mensaje', error);
            });
        setMostrarConfirmacion(false); // Cerrar el modal de confirmación
    };

    const cancelarEliminar = () => {
        setMostrarConfirmacion(false); // Cerrar el modal sin hacer nada
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Mensajes</h3>

                <div className="botones-mensajes">
                    {mensajes.map((mensaje, index) => (
                        <button
                            key={index}
                            className="boton-mensaje"
                            onClick={() => manejarSeleccion(mensaje)}
                        >
                            {mensaje.mensaje} {/* Suponiendo que 'mensaje' es el campo de contenido */}
                        </button>
                    ))}
                </div>

                {/* Modal de Confirmación para Borrar */}
                {mostrarConfirmacion && (
                    <div className="modal-confirmacion">
                        <h4>¿Estás seguro de que quieres eliminar este mensaje?</h4>
                        <button
                            onClick={() => manejarEliminar(mensajeSeleccionado.id)}
                            className="confirmar-borrar"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={cancelarEliminar}
                            className="cancelar-borrar"
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal_Mensajes;
