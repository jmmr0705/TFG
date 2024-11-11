import "../../estilos/cambio_reglas.css";
import Axios from 'axios';
import React, {useEffect, useState } from "react";

const CambioDepartamento = ({linea, onClose, children}) => {

    const [nombre,setNombre] = useState("")

    useEffect(() =>{
        if(linea){
            setNombre(linea.nombre || "")
        }
    }, [linea])

    const modificar= (e) =>{
        e.preventDefault()
        Axios.put(`http://localhost:3001/main/departamento/${linea.id}`,{
            nombre: nombre
        }).then(() =>{
            alert("Se ha modificado el departamento")
            onClose()
        }).catch((error) =>{
            console.log("Ha ocurrido un error:",error)
        })
    }

    const borrar= () =>{
        Axios.delete(`http://localhost:3001/main/departamento/${linea.id}`).then((resp) =>{
            onClose()
        }).catch((error) =>{
            console.log("Error al borrar el usuario"+error)
        })
    }

    return(
        <div className="modal is-open">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Modificar Departamento</h3>
                <form onSubmit={modificar} className="formulario_modif">
                    <lable>Nombre</lable>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                    <button type="submit">Guardar Cambios</button>
                    <button onClick={borrar}>Borrar Departamento</button>
                </form>
                {children}
            </div>
        </div>
    )

}

export default CambioDepartamento