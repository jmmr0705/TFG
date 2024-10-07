import React, {useState , useEffect} from 'react'
import axios from 'axios';
import './perfilusur.css';

export function UserProfile(){
    const [user, setUser] = useState(null);

    useEffect(() => {
        const sacarusur = async () =>{
            try{
                const usur= null //tengo aquí la función para sacar el usuario, esta en proceso
                const resp= await axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/user/${usur}`)
                setUser(resp.data)
            } catch(error){
                console.error("Error",error)
            }
        };
        sacarusur();
    }, [])

    return(
        <div className='UserProfile'>
            {user ? (
                <div>
                    <h3>Perfil de Usuario</h3>
                    <p>Usuario: {user.usur}</p>
                    <p>Usuario: {user.cnt}</p>
                    <p>Usuario: {user.tel}</p>
                    <p>Usuario: {user.corr}</p>
                    <p>Usuario: {user.titul}</p>
                    {user.foto && <img src={user.foto} alt='Foto perfil' className='fotoperfil'/>}
                </div>
                ) : (
                    <p>Cargando perfil</p>
            )}
        </div>
    )
}