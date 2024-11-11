import React, { useState } from 'react';
import { Hook_Usuario } from '../../hooks/hook_modal';
import "../../estilos/modal_usuario.css";
import Mensaje_Privado from './mensaje_privado';
import Mensaje_Publico from './mensaje_publico';
import Mensaje_Temporal from './mensaje_temporal';
import Mensaje_Departamento from './mensaje_departamento';

const Mensajes= ({children,onClose}) =>{

    const [abrir_pub,useopenPub,usecerrarPub]= Hook_Usuario(false)
    const [abrir_priv,useopenPriv,usecerrarPriv]= Hook_Usuario(false)
    const [abrir_temp,useopenTemp,usecerrarTemp]= Hook_Usuario(false)
    const [abrir_dep,useopenDep,usecerrarDep]= Hook_Usuario(false)

    return(
        <div className='modal is-open'>
            <div className='modal-container'>
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Enviar Mensajes</h3>
                <button className="boton_agregar_m" onClick={useopenPub}>Mensaje publico</button>
                <button className="boton_agregar_m" onClick={useopenPriv}>Mensaje privado</button>
                <button className="boton_agregar_m" onClick={useopenTemp}>Mensaje Temporal</button>
                <button className="boton_agregar_m" onClick={useopenDep}>Mensaje a Departamento</button>
                {abrir_pub && (
                    <Mensaje_Publico onClose={usecerrarPub}/>
                )}
                {abrir_priv && (
                    <Mensaje_Privado onClose={usecerrarPriv}/>
                )}
                {abrir_temp && (
                    <Mensaje_Temporal onClose={usecerrarTemp}/>
                )}
                {abrir_dep && (
                    <Mensaje_Departamento onClose={usecerrarDep}/>
                )}
                {children}
            </div>
        </div>
    )
}

export default Mensajes