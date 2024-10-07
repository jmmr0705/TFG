import React, { useState } from "react";
//import axios from "axios";
import './registro.css';
import { useNavigate } from 'react-router-dom'

export function Registro() {
  const [form, setForm] = useState({ usur: '', cnt: '', corr: '', titul: '', telf: '' });
  const history = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
 /*
  const handleRegister = async () => {
    try {
      const res = await axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/register`, form);
      if (res.status === 201) {
    //    history.push('/login');
      }
    } catch (error) {
      console.error('Error', error);
    }
  }*/
  //onClick={handleRegister}
  return (
    <div className="registro">
      <h3>Registrate aquí</h3>
      <h4>Luego se pedirán foto y huella</h4>
      <input type='text' placeholder='Usuario' className='entrada' name='usur' onChange={handleChange}></input>
      <input type='password' placeholder="Contraseña" className="entrada" name="cnt" onChange={handleChange}></input>
      <input type='email' placeholder="Correo" className="entrada" name="corr" onChange={handleChange}></input>
      <input type="text" placeholder="Titulación" className="entrada" name='titul' onChange={handleChange}></input>
      <input type="tel" placeholder="Teléfono" className="entrada" name="telf" onChange={handleChange}></input>
      <button  className="boton">Registrarse</button>
    </div>
  );
}
