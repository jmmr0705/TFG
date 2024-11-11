import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "../../estilos/agregar.css"

const AgregarDepartamento = ({children,onClose}) =>{

    const [nombre,setNombre]= useState("")

    const envio= (e) =>{
        e.preventDefault()
        Axios.post("http://localhost:3001/main/departamentos/agregar",{
            nombre:nombre
        }).then(() =>{
            console.log("Departamento Agregado")
            onClose()
        }).catch((error) =>{
            console.log("Error al añadir departamento"+error)
        })
    }

    return(
        <div className="Agregar">
            <div className="modal-container">
                <button className="modal-close" onClick={onClose}>X</button>
                <h3>Agregar Departamento</h3>
                <form className="Formulario" onSubmit={envio}>
                    <label>Nombre</label>
                    <input type="text" onChange={(e) => setNombre(e.target.value)}/>
                    <button type="submit">Agregar</button>
                </form>
                {children}
            </div>
        </div>
    )

}

export default AgregarDepartamento