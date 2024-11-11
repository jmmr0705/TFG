import React, { useState } from 'react';
import Axios from 'axios';
import cryptoJS from 'crypto-js';
import {KEY} from '../../secret_132_.js'
import "../../estilos/agregar.css"

const Mensaje_Temporal = ({ onClose }) => {
    const [mensaje, setMensaje] = useState("");
    const [fecha, setFecha] = useState("");

    const envio = async (e) => {
        e.preventDefault();

        const id_usr = localStorage.getItem('id');
        const encry= cryptoJS.AES.encrypt(mensaje,KEY).toString()
        try {
            await Axios.post("http://localhost:3001/main/mensajes/temporal", {
                id_usr: id_usr,
                mensaje: encry,
                fecha: fecha,
            });
            onClose();
        } catch (error) {
            console.log("Error al mandar mensaje: ", error);
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
                    <input 
                        type="datetime-local" 
                        onChange={(e) => setFecha(e.target.value)} 
                        required 
                    />
                    <button type="submit">Enviar Mensaje</button>
                </form>
            </div>
        </div>
    );
}

export default Mensaje_Temporal;
