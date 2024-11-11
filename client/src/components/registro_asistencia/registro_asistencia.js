import React, {useState} from "react";
import Axios from 'axios';
import "../../estilos/registro_asistencia.css"

const RegistroAsistencia= ({onClose}) =>{

    const [sacarPregunta,setsacarPregunta]= useState(true)

    const PreguntarAsistencia= (resp) =>{
        const conec= localStorage.getItem("conectar")
            if(resp === "si" && conec){
                const id_usr= localStorage.getItem("id")
                const id_disp= localStorage.getItem("id_disp")
                Axios.post("http://localhost:3001/main/registro/agregar",{
                    id_usr: id_usr,
                    id_disp: id_disp,
                }).then(() =>{
                    console.log("Asistencia registrada")
                }).catch((error) =>{
                    console.log("Error al registrar la asistencia")
                    onClose()
                })
        }else{
            onClose()
        }
    }

    if(!setsacarPregunta){
        return null
    }

    return(
        <div reg="Reg_asistencia" onClick={onClose}>
            <div className="Pregunta">
                <h5>Registrar asistencia</h5>
                <button className="modal-close" onClick={onClose}>X</button>
                <button onClick={() => PreguntarAsistencia("si")}>Si</button>
                <button onClick={() => PreguntarAsistencia("no")}>No</button>
            </div>
        </div>
    )
} 

export default RegistroAsistencia
