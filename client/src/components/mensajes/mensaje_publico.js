import React, { useState } from 'react';
import Axios from 'axios';
import "../../estilos/agregar.css"
import cryptoJS from 'crypto-js';
import {KEY} from '../../secret_132_.js'

const Mensaje_Publico= ({onClose}) =>{

    const [mensaje,setMensaje]= useState("")
    const envio= (e) =>{
        e.preventDefault()

        const id_usr= localStorage.getItem('id')
        const encry= cryptoJS.AES.encrypt(mensaje,KEY).toString()
        try{
            Axios.post("http://localhost:3001/main/mensajes/publico",{
                id_usr: id_usr,
                mensaje: encry,
            })
            onClose()
        }catch(error){
            console.log("error al mandar mensaje"+error)
        }

    }

    return(
        <div className="modal is-open">
            <div className='modal-container'>
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Escribe tu mensaje</h3>
                <form className="Formulario" onSubmit={envio}>
                    <input type="text" onChange={(e) => setMensaje(e.target.value)} required/>
                    <button>Enviar Mensaje</button>
                </form>
            </div>
        </div>
    )
}

export default Mensaje_Publico