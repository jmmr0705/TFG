import React, { useState, useEffect } from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { Hook_Usuario } from "../../hooks/hook_modal.js";

const ConfirmarReg= ({onClose, info}) =>{

    const registro = () => {
        console.log(info);
        Axios.post("http://localhost:3001/main/ponerreglas",{
            id_usr: info.id_usr,
            nombre: info.dep,
        }).then(() => {
            onClose();
        }).catch((error) => {
            console.log("Registro fallido: " + error);
        });
    };

    return (
        <div className='modal is-open'>
            <div className='modal-container'>
                <h4>Añadir <span>{info.usr}</span> al departamento <span>{info.dep}</span></h4>
                <button onClick={registro}>Si</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    );
}

export default ConfirmarReg;
