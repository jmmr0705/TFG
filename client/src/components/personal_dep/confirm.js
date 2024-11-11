import Axios from 'axios';
import { useState, useEffect } from "react";
import React from "react";
import "../../estilos/modal_usuario.css";

const Confirm= ({onClose, info}) =>{

    const registro = () => {
        console.log(info);
        Axios.post("http://localhost:3001/main/personal",{
            id_usr: info.id_usr,
            nombre: info.dep,
        }).then(() => {
            onClose();
        }).catch((error) => {
            console.log("Registro fallido: " + error);
        });
    };

    const borrar = () => {
        Axios.delete("http://localhost:3001/main/personalb", {
            data: {
                id_usr: info.id_usr,
                nombre: info.dep,
            }
        }).then(() => {
            console.log('Eliminación exitosa');
            onClose();
        }).catch((error) => {
            console.log("Error al borrar: " + error);
        });
    };
    

    return (
        <div className='modal is-open'>
            <div className='modal-container'>
                <h4>Añadir <span>{info.usr}</span> al departamento <span>{info.dep}</span></h4>
                <button onClick={registro}>Si</button>
                <button onClick={onClose}>No</button>
                <h4>Borrar <span>{info.usr}</span> del departamento<span>{info.dep}</span></h4>
                <button onClick={borrar}>Si</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    );
}

export default Confirm;
