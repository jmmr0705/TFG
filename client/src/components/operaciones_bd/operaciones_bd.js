import "../../estilos/modal_usuario.css";
import React, { useState } from "react";
import cryto from "crypto-js";
import { KEY } from "../../secret_132_.js";
import Axios from "axios";

const Operaciones_BD = ({ onClose }) => {
    const [auten, setAuten] = useState(false);
    const [usur, setUsur] = useState("");
    const [passw, setPassw] = useState("");
    const [filePath, setFilePath] = useState("");

    const autenticar = () => {
        const encry = cryto.AES.encrypt(passw, KEY).toString();
        Axios.post("http://localhost:3001/main/auten", {
            usuario: usur,
            contrasena: encry,
        })
        .then((resp) => {
            if (resp.status === 200) {
                setAuten(true);
                alert("Identidad verificada");
            } else {
                alert("Fallo en las credenciales");
            }
        })
        .catch((error) => {
            console.log("Error en inicio de sesión: " + error);
            alert("Fallo al confirmar credenciales");
        });
    };

    const copia_seg = () => {
        const confirmacion = window.confirm("¿Seguro que desea hacer la copia de seguridad?");
        if (confirmacion) {
            Axios.post("http://localhost:3001/main/operaciones/copia")
            .then((resp) => {
                if (resp.data.file) {
                    alert(`Copia de seguridad creada exitosamente en: ${resp.data.file}`);
                } else {
                    alert("Copia de seguridad creada exitosamente.");
                }
            })
            .catch((error) => {
                alert("Error al crear la copia de seguridad");
                console.error("Error en la copia de seguridad:", error);
            });
        }
    };

    const borrar = () => {
        const confirmacion = window.confirm("¿Seguro que quiere borrar los datos?");
        if (confirmacion) {
            Axios.post("http://localhost:3001/main/operaciones/borrar")
            .then((resp) => {
                alert("Datos eliminados exitosamente");
            })
            .catch((error) => {
                alert("Error al borrar los datos");
                console.error("Error al borrar los datos:", error);
            });
        }
    };

    const restaurar = () => {
        const confirmacion = window.confirm("¿Seguro que quiere restaurar los datos?");
        if (confirmacion && filePath) {
            Axios.post("http://localhost:3001/main/operaciones/restaurar", { filePath })
            .then((resp) => {
                alert("Base de datos restaurada exitosamente");
            })
            .catch((error) => {
                alert("Error al restaurar la base de datos");
                console.error("Error en la restauración:", error);
            });
        } else if (!filePath) {
            alert("Ingrese la ruta del archivo para restaurar.");
        }
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Operaciones de la Base de Datos</h3>
                {!auten ? (
                    <div>
                        <input type="text" placeholder="Usuario" onChange={(e) => setUsur(e.target.value)} />
                        <input type="password" placeholder="Contraseña" onChange={(e) => setPassw(e.target.value)} />
                        <button onClick={autenticar}>Autenticar</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={copia_seg}>Copia de Seguridad</button>
                        <button onClick={borrar}>Eliminar Datos</button>
                        <input
                            type="text"
                            placeholder="Ruta del archivo de restauración"
                            value={filePath}
                            onChange={(e) => setFilePath(e.target.value)}
                        />
                        <button onClick={restaurar}>Restaurar Base de Datos</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Operaciones_BD;
