import React, { useEffect, useState, useRef } from "react";
import Axios from 'axios';
import "../../estilos/cambio_reglas.css";

const Formul_Privilegios = ({ onClose, linea }) => {
    const [privilegios, setPrivilegios] = useState(0);
    const [showOptions, setShowOptions] = useState(false); // Estado para controlar la visibilidad de las opciones
    const opciones = [0, 1, 2];
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (linea) {
            setPrivilegios(linea.privilegios || 0);
        }
    }, [linea]);

    // Cerrar el menú al hacer clic fuera del desplegable
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const modificar = (e) => {
        e.preventDefault();
        Axios.put(`http://localhost:3001/main/user/${linea.id}`, {
            privilegios: privilegios
        }).then(() => {
            console.log("Privilegios modificados");
            onClose();
        }).catch((error) => {
            console.log("Ha habido un error:", error);
        });
    };

    const handleOptionClick = (opcion) => {
        setPrivilegios(opcion);
        setShowOptions(false); // Cierra el menú después de seleccionar una opción
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Elige los privilegios para el usuario</h3>
                <form onSubmit={modificar} className="formul-privil">
                    <label>Nombre del Usuario</label>
                    <p>{linea.usuario}</p>
                    
                    <label>Privilegios</label>
                    <div className="dropdown" ref={dropdownRef}>
                        <input
                            type="text"
                            value={`Privilegio ${privilegios}`}
                            readOnly
                            onClick={() => setShowOptions(!showOptions)} // Abre o cierra el menú al hacer clic en el input
                            className="input-privilegios"
                        />
                        {showOptions && (
                            <ul className="options-list">
                                {opciones.map((opcion) => (
                                    <li
                                        key={opcion}
                                        onClick={() => handleOptionClick(opcion)}
                                        className="option-item"
                                    >
                                        {`Privilegio ${opcion}`}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <button type="submit">Cambiar</button>
                </form>
            </div>
        </div>
    );
};

export default Formul_Privilegios;
