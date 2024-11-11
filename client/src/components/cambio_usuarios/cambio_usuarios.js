import Axios from 'axios';
import React, { useEffect, useState } from "react";

const BorrarUsuario = ({linea, onClose, children}) => {
    
    const borrar = () =>{
        Axios.delete(`http://localhost:3001/main/user/${linea.id}`).then((resp) =>{
            // console.log("Se ha borrado el usuario")
            // console.log(linea.id)
            onClose()
        }).catch((err) =>{
            console.log("Error al borrar el usuario"+err)
        })
    }

    return(
        <div className='modal is-open'>
            <div className='modal-container'>
                <h4>Confirma el borrado del usuario</h4>
                <button onClick={borrar}>Si</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    )
}

export default BorrarUsuario
