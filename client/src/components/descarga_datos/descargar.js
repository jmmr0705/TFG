import React from "react";
import Axios from "axios";

const Descarga = ({onClose}) =>{
    const confirmar = () =>{
        Axios.get("http://localhost:3001/main/descargadatos",{
            responseType: "blob"
        }).then((resp) =>{
            const url= window.URL.createObjectURL(new Blob([resp.data]))
            const enlace= document.createElement("a")
            enlace.href= url
            enlace.setAttribute("download","registro_datos.csv")
            document.body.appendChild(enlace)
            enlace.click()
            enlace.parentNode.removeChild(enlace)
            onClose()
        }).catch((error) =>{
            console.log("Error al crear excel"+error)
        })
    }

    return(
        <div className="confir">
            <div className="modal-container">
                <p>¿Descargar datos de asistencia ?</p>
                <button className="button" onClick={confirmar}>Si</button>
                <button className="button" onClick={onClose}>No</button>
            </div>
        </div>
    )
}

export default Descarga;