import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import "../../estilos/perfil.css";
import crypto from 'crypto-js';
import { KEY, encriptadar, desencriptar } from '../../secret_132_.js';
import { pixelarImagen, revertirPixelado } from '../../pixelfoto.js';

function Perfil() {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [correo, setCorreo] = useState("");
    const [carrera, setCarrera] = useState("");
    const [telefono, setTelefono] = useState(0);
    const [foto, setFoto] = useState(null);

    const [error, setError] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("id");
        if (id) {
            Axios.post("http://localhost:3001/main/usuario", { user_id: id })
                .then((resp) => {
                    const data = resp.data;
                    setUsuario(data.usuario);
                    setContrasena(crypto.AES.decrypt(data.contrasena, KEY).toString(crypto.enc.Utf8));
                    setCorreo(crypto.AES.decrypt(data.correo, KEY).toString(crypto.enc.Utf8));
                    setCarrera(data.carrera);
                    setTelefono(desencriptar(data.telefono));
                    setFoto(data.foto);
                })
                .catch((error) => {
                    setError("Error en la carga de perfil");
                    console.log("Error en la carga de perfil");
                });
        } else {
            setError("No se encontró el id del usuario");
        }
    }, []);

    const envio = (e) => {
        e.preventDefault();
        const id = localStorage.getItem("id");
        const idnum = Number(id);
        const contrasenaen = crypto.AES.encrypt(contrasena, KEY).toString();
        const correoen = crypto.AES.encrypt(correo, KEY).toString();
        const encrynum = encriptadar(telefono);
    
        if (id) {
            // Verifica si la foto es un archivo nuevo seleccionado por el usuario
            if (foto instanceof File) {
                // Enviar la foto usando FormData
                const formData = new FormData();
                formData.append("usuario", usuario);
                formData.append("contrasena", contrasenaen);
                formData.append("correo", correoen);
                formData.append("carrera", carrera);
                formData.append("telefono", encrynum);
                const pixelf = pixelarImagen(foto, 20);  // Asegúrate de que `pixelarImagen` devuelva un `Blob` o `File`
                if (pixelf instanceof Blob || pixelf instanceof File) {
                        formData.append("foto", pixelf, foto.name);  // Usa la foto pixelada
                }else {
                    formData.append("foto", foto);  // Si no se pixeló correctamente, usa la foto original
                }
    
                Axios.put(`http://localhost:3001/main2/user/${idnum}`, formData)
                    .then(() => {
                        console.log("Cambio de perfil hecho con foto");
                    })
                    .catch((error) => {
                        console.log("Error al actualizar el perfil con foto: " + error);
                        alert("Error al actualizar el perfil con foto");
                    });
            } else {
                // Enviar los datos en el body si no hay foto nueva
                const data = {
                    usuario,
                    contrasena: contrasenaen,
                    correo: correoen,
                    carrera,
                    telefono: encrynum
                };
    
                Axios.put(`http://localhost:3001/main/user/${idnum}`, data)
                    .then(() => {
                        console.log("Cambio de perfil hecho sin foto");
                    })
                    .catch((error) => {
                        console.log("Error al actualizar el perfil sin foto: " + error);
                        alert("Error al actualizar el perfil sin foto");
                    });
            }
        }
    };
    

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h3 className='Titulo'>Perfil de usuario</h3>
            <div className='Perfil'>
                <form className='formul' onSubmit={envio}>
                    <label>Usuario</label>
                    <input
                        type='text'
                        name="nombre"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                    <label>Contraseña</label>
                    <input
                        type='text' // Cambié aquí para mostrar la contraseña tal como se ingresa
                        name="contrasena"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                    />
                    <label>Correo</label>
                    <input
                        type='text'
                        name="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <label>Carrera</label>
                    <input
                        type='text'
                        name="carrera"
                        value={carrera}
                        onChange={(e) => setCarrera(e.target.value)}
                    />
                    <label>Teléfono</label>
                    <input
                        type="number"
                        name="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                    <label>Foto</label>
                    <input
                        type="file"
                        name='foto'
                        onChange={(e) => setFoto(e.target.files[0])}
                    />
                    <button type="submit">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
}

export default Perfil;
