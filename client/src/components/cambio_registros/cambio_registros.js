import "../../estilos/cambio_reglas.css";
import Axios from 'axios';
import React, { useEffect, useState } from "react";


const CambioRegistro = ({linea, onClose, children}) => {

    const [fecha,setFecha]= useState()
    const [Tipo_Verificacion,setTipo_Verificacion]= useState()

    const MYSQLformat = (fecha) => {
        return fecha.replace("T", " ") + ":00"
    };

    // Formato para mostrar la fecha en el input
    const formatfront = (fecha) => {
        const aux = new Date(fecha)
        return aux.toISOString().slice(0, 16)
    };

    useEffect(() =>{
        if(linea){
            setFecha(linea.fecha ? formatfront(linea.fecha) : "")
            setTipo_Verificacion(linea.Tipo_Verificacion || "")
        }
    },[linea])
    
    const modificar= (e) =>{
        e.preventDefault()

        const fecha_format= MYSQLformat(fecha)

        Axios.put(`http://localhost:3001/main/registro/${linea.id}`,{
            fecha: fecha_format,
            Tipo_Verificacion: Tipo_Verificacion
        }).then(() =>{
            alert("Registro modificado")
            onClose()
        }).catch((error) =>{
            alert("Ha ocurrido un error",error)
        })
    }

    const borrar= () =>{
        Axios.delete(`http://localhost:3001/main/registro/${linea.id}`).then((resp) =>{
            onClose()
        }).catch((error) =>{
            console.log("Error al borrar el usuario"+error)
        })
    }

    return(
        <div className="modal is-open">
            <div className="modal-container">
            <button className="modal-close" onClick={onClose}>X</button>
            <h3>Modificar Registros</h3>
            <form onSubmit={modificar} className="formulario_modiff">
                <label>Tipo_Verificacion</label>
                <input type="text" value={Tipo_Verificacion} onChange={(e) => setTipo_Verificacion(e.target.value)}/>
                <lable>Fecha del Registro</lable>
                <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)}/>
                <button type="submit">Guardar Cambios</button>
                <button onClick={borrar}>Borrar Departamento</button>
            </form>
            </div>
        </div>
    )
}

export default CambioRegistro