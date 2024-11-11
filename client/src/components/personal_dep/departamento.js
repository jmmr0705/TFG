import React from "react";
import "../../estilos/modal_usuario.css";
import Axios from 'axios';
import { useState, useEffect } from "react";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import Confirm from "./confirm.js";

const Departamento_Elegir = ({ children, onClose, linea }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [abrirConf, setAbrirConf, setCerrarConf] = Hook_Usuario(false);
    const [dic, setDic] = useState();
    const [lineael, setLinea] = useState(null);
    
    const elegirfila = (linea_dep) => {
        setLinea(linea_dep);
        const newdic = {
            id_usr: linea.id,
            usr: linea.usuario,
            id_dep: linea_dep.id,
            dep: linea_dep.nombre
        };
        setDic(newdic);
        setAbrirConf(true);
    };

    useEffect(() => {
        const getDepartamentos = () => {
            Axios.get("http://localhost:3001/main/departamentos")
                .then((response) => {
                    setDepartamentos(response.data);
                })
                .catch((error) => {
                    console.log("Error al obtener departamentos:", error);
                });
        };

        getDepartamentos();
    }, []);

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Gestión de Departamentos</h3>

                <table className="tabla-dispositivos">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departamentos.map((val, key) => (
                            <tr key={key} onClick={() => elegirfila(val)} className="fila_boton">
                                <td>{val.nombre}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {abrirConf && (
                    <Confirm onClose={setCerrarConf} info={dic}></Confirm>
                )}
                {children}
            </div>
        </div>
    );
};

export default Departamento_Elegir;
