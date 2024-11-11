import React, { useState} from "react";
import Axios from 'axios';
import "../../estilos/agregar.css"

const AgregarReglas = ({children,onClose}) =>{
    const [nombre,setNombre] = useState("")
    const [fecha_ini,setFecha_ini]= useState(null)
    const [fecha_fin,setFecha_fin]= useState(null)

    const MYSQLformat = (fecha) => {
        return fecha.replace("T", " ") + ":00"
    };

    const envio= (e) =>{
        e.preventDefault()

        const fecha_ini_my= MYSQLformat(fecha_ini)
        const fecha_fin_my= MYSQLformat(fecha_fin)
        Axios.post("http://localhost:3001/main/reglas/agregar",{
            nombre:nombre,
            fecha_ini:fecha_ini_my,
            fecha_fin:fecha_fin_my
        }).then(() =>{
            alert("Regla Añadida")
            onClose()
        }).catch((error) =>{
            console.log("Error al añadir la regla")
        })
    }

    return(
        <div className="Agregar">
            <div className="modal-container">
            <button className="modal-close" onClick={onClose}>X</button>
            <h3>Agregar Regla</h3>
            <form className="Formulario" onSubmit={envio}>
                <label>Nombre</label>
                <input type="text" onChange={(e) => setNombre(e.target.value)}/>
                <label>Fecha Inicio</label>
                <input type="datetime-local" onChange={(e) => setFecha_ini(e.target.value)}/>
                <label>Fecha Fin</label>
                <input type="datetime-local" onChange={(e) => setFecha_fin(e.target.value)}/>
                <button className="boton_agregar" type="submit">Agregar Regla</button>
            </form>
            {children}
            </div>
        </div>
    )
}

export default AgregarReglas