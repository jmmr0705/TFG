import React from "react";
import Axios from 'axios';
import { useState, useEffect } from "react";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import Formul_Privilegios from "../formul_privil/formul_privilegios.js";
import "../../estilos/modal_usuario.css"

const Privilegios = ({onClose,children}) =>{

    const [usuarios, SetUsuarios] = useState([]);
    const [abrirPrivil,useopenPrivil,useclosePrivil]= Hook_Usuario(false)
    const [lineaElegida, setLineaElegida] = useState(null);

    useEffect(() =>{
        const getUsuarios = () => {
            Axios.get("http://localhost:3001/main/usuarios").then((response) => {
                SetUsuarios(response.data)
            }).catch((error) => {
              console.log("Error al obtener usuarios:", error);
            });
        };

        getUsuarios();
    },[])

    const elegirFila = (linea) =>{
        setLineaElegida(linea);
        useopenPrivil(true)
    }

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestion de Permisos</h3>
                {usuarios.map((val,key) =>{
                    return <button className="fila_boton" onClick={() => elegirFila(val)}>
                                <p>{val.usuario}</p>
                                <p>{val.carrera}</p>
                                <p>{val.privilegios}</p>
                            </button>
                })}

                {abrirPrivil && (
                    <Formul_Privilegios linea={lineaElegida} onClose={useclosePrivil}></Formul_Privilegios>
                )}
                {children}
            </div>
        </div>
    );
}

export default Privilegios