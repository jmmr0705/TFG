import "../../estilos/cambio_reglas.css";
import Axios from 'axios';
import React, { useEffect, useState } from "react";
import { Hook_Usuario } from "../../hooks/hook_modal.js";
import BorrarUsuario from "../cambio_usuarios/cambio_usuarios.js"; // Importamos el componente BorrarUsuario
import cryptoJS from "crypto-js";
import { KEY } from "../../secret_132_.js"; // Importamos la clave

const TocaInfo = ({ linea, onClose, children }) => {
    const [contrasena, setContrasena] = useState("");
    const [usuario, setUsur] = useState("");
    const [telefono, setTele] = useState(0);
    const [carrera, setTitul] = useState("");
    const [correo, setEmail] = useState("");
    const [abrirBorrar, useopenBorrar, usecloseBorrar] = Hook_Usuario(false); // Hook para abrir/cerrar el modal de borrado
    const [inhab,setInhab]= useState(false)

    // Encriptar y desencriptar datos usando CryptoJS y la clave proporcionada
    useEffect(() => {
        if (linea) {
            setContrasena(linea.contrasena || "");
            if (linea.correo) {
                try {
                    // Intentamos desencriptar solo si el correo existe
                    const decryptedEmail = cryptoJS.AES.decrypt(linea.correo, KEY).toString(cryptoJS.enc.Utf8);
                    setEmail(decryptedEmail || "");
                } catch (error) {
                    console.error("Error al desencriptar el correo:", error);
                    setEmail(""); // En caso de error, dejamos el correo vacío o manejamos el error de otra manera
                }
            }
    
            setUsur(linea.usuario || "");
            setTele(linea.telefono || 0);
            setTitul(linea.carrera || "");
        }
    }, [linea]);
    
    const petar= () =>{
        setInhab(true)
        onClose()
    }

    const modificar = () => {
        if(inhab){
            usuario=null
        }
        // Encriptamos la contraseña y el correo antes de enviarlos
        const encryptedPassword = cryptoJS.AES.encrypt(contrasena, KEY).toString();
        const encryptedEmail = cryptoJS.AES.encrypt(correo, KEY).toString();

        Axios.put(`http://localhost:3001/main/user/${linea.id}`, {
            usuario: usuario,
            contrasena: encryptedPassword,
            telefono: telefono,
            carrera: carrera,
            correo: encryptedEmail
        })
        .then(response => {
            // Manejar éxito
            console.log("Usuario actualizado");
            onClose();
        })
        .catch(error => {
            console.error("Error al actualizar el usuario", error);
        });
    };

    const abrirBorrarModal = () => {
        useopenBorrar(true); // Abre el modal de borrado
    };

    return (
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Editar Usuario</h3>
                <form>
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsur(e.target.value)}
                    />
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                    />
                    <label>Teléfono</label>
                    <input
                        type="number"
                        value={telefono}
                        onChange={(e) => setTele(e.target.value)}
                    />
                    <label>Carrera</label>
                    <input
                        type="text"
                        value={carrera}
                        onChange={(e) => setTitul(e.target.value)}
                    />
                    <label>Correo</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="button" onClick={modificar}>Guardar cambios</button>
                </form>
                <button onClick={abrirBorrarModal}>Eliminar Usuario</button>

                {abrirBorrar && (
                    <BorrarUsuario linea={linea} onClose={usecloseBorrar} />
                )}
                {children}
            </div>
        </div>
    );
};

export default TocaInfo;
