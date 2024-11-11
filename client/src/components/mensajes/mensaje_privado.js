import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import cryptoJS from 'crypto-js';
import {KEY} from '../../secret_132_.js'
import "../../estilos/agregar.css"

const Mensaje_Privado = ({ onClose }) => {
    const [mensaje, setMensaje] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {
        // Obtener la lista de usuarios al montar el componente
        const obtenerUsuarios = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/main/usuarios");
                setUsuarios(response.data);
            } catch (error) {
                console.log("Error al obtener usuarios:", error);
            }
        };

        obtenerUsuarios();
    }, []);

    const envio = async (e) => {
        e.preventDefault();
        
        const id_usr = localStorage.getItem('id');
        const encry= cryptoJS.AES.encrypt(mensaje,KEY).toString()
        if (!usuarioSeleccionado || !mensaje) {
            console.log("Usuario seleccionado o mensaje no están definidos");
            return;
        }

        try {
            await Axios.post("http://localhost:3001/main/mensajes/privado", {
                id_usr: id_usr,
                id_dest: usuarioSeleccionado,
                mensaje: encry,
            });
            onClose();
        } catch (error) {
            console.log("Error al mandar mensaje:", error);
        }
    };

    return (
        <div className="modal is-open">
            <div className='modal-container'>
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Escribe tu mensaje</h3>
                <form className="Formulario" onSubmit={envio}>
                    <input 
                        type="text" 
                        onChange={(e) => setMensaje(e.target.value)} 
                        required 
                        placeholder="Escribe tu mensaje aquí..."
                    />
                    <h4>Selecciona un usuario</h4>
                    <ul>
                        {usuarios.map(usuario => (
                            <li key={usuario.id}>
                                <button 
                                    type="button" 
                                    onClick={() => setUsuarioSeleccionado(usuario.id)}
                                >
                                    {usuario.usuario}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button type="submit">Enviar Mensaje</button>
                </form>
            </div>
        </div>
    );
}

export default Mensaje_Privado;
