import React from "react";
import Axios from 'axios';
import { useState, useEffect } from "react";
import "../../estilos/conectar.css";

const DispConectar= ({children, onClose}) =>{

    const [dispositivos, SetDispositivos] = useState([]);

    useEffect(() =>{
        const getDispositivos = () => {
            Axios.get("http://localhost:3001/main/dispositivos").then((response) => {
                console.log(response.data)
                SetDispositivos(response.data)
            }).catch((error) => {
              console.log("Error al obtener usuarios:", error);
            });
        };

        getDispositivos();
    },[])

    const elegirfila= (linea) =>{
        localStorage.setItem("id_disp",linea.id)
        localStorage.setItem("conectar",true)
        console.log(localStorage)
        onClose()
    }

    return(
            <div className="modal is-open">
                <div className="modal-container">
                    <button className="modal-close" onClick={onClose}>X</button>
                    <h3>Elige un dispositivo a conectar</h3>
                        {dispositivos.map((val,key) =>{
                            return <button className="boton" onClick={() => elegirfila(val)}>
                                <p>{val.nombre}</p>
                                <p>{val.tipo}</p>
                            </button>
                        })}
                    {children}
                </div>
            </div>
    )
}

export default DispConectar