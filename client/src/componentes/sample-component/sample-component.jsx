import React, {useState} from 'react';
//import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './login.css'
/*
function callServer() {
  axios.get(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/test`, {
    params: {
      table: 'sample',
    },
  }).then((response) => {
    console.log(response.data);
  });
}
*/
export function SampleComponent() {

  const [form,setForm] = useState({usur: "",cnt: ""})

  const history= useNavigate();

  const handler = (e) =>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }
 /*
  const handleSubmit = async () =>{
    try{
      const resp= await axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/register`, form);
      console.log(resp.data)
    } catch(error){
      console.error('Error :',error)
    }
  };
*/
//{callServer()}
  return (
    <div>
      <div className='login'>
        <input type='text' placeholder='Usuario' className='entrada' name='usur' onChange={handler}></input>
        <input type='password' placeholder='contraseña' className='entrada' name='cnt' onChange={handler}></input>
        <button className='boton' >Inciar Sesion</button>
        <button className='boton' >Registrarse</button>
      </div>
      
    </div>
  );
}

