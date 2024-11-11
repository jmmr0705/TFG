import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import cryptoJS from 'crypto-js';
import {KEY} from '../../secret_132_.js'
import "../../estilos/agregar.css"

const Mensaje_Departamento = ({ onClose }) => {
    const [mensaje, setMensaje] = useState("");
    const [departamentos, setDepartamentos] = useState([]);
    const [depSeleccionado, setDepSeleccionado] = useState("");

    useEffect(() => {
        // Obtener la lista de departamentos al montar el componente
        const obtenerDepartamentos = async () => {
            try {
                const response = await Axios.get("http://localhost:3001/main/departamentos");
                setDepartamentos(response.data);
            } catch (error) {
                console.log("Error al obtener departamentos:", error);
            }
        };

        obtenerDepartamentos();
    }, []);

    const envio = async (e) => {
        e.preventDefault();
        
        const id_usr = localStorage.getItem('id');
        const encry= cryptoJS.AES.encrypt(mensaje,KEY).toString()
        if (!depSeleccionado || !mensaje) {
            console.log("Departamento seleccionado o mensaje no están definidos");
            return;
        }

        try {
            await Axios.post("http://localhost:3001/main/mensajes/departamento", {
                id_usr: id_usr,
                nombre_departamento: depSeleccionado,
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
                    <h4>Selecciona un departamento</h4>
                    <ul>
                        {departamentos.map(departamento => (
                            <li key={departamento.id}>
                                <button 
                                    type="button" 
                                    onClick={() => setDepSeleccionado(departamento.nombre)}
                                >
                                    {departamento.nombre}
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

export default Mensaje_Departamento;
