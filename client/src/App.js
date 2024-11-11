import './estilos/App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import crypto from 'crypto-js';
import { KEY } from './secret_132_.js';
import Perfil from './components/perfil/perfil.js';
import { encriptadar } from './secret_132_.js';
import { Hook_Usuario } from "./hooks/hook_modal.js";
import Modal_usuario from "./components/manej_usuarios/modal_usuario.js";
import Modal_Departamento from './components/manej_departamentos/manej_departamentos.js';
import Modal_Dispositivo from './components/manej_dispositivos/manej_dispositivos.js';
import Modal_Registro from './components/manej_registros/manej_registros.js';
import Modal_Regla from './components/manej_reglas/modal_reglas.js';
import DispConectar from './components/conectar/conectar.js';
import RegistroAsistencia from './components/registro_asistencia/registro_asistencia.js';
import Buscador from './components/buscador/buscador.js';
import Privilegios from './components/privilegios/privilegios.js';
import Personal_Departamento from './components/personal_dep/personal.js';
import ReporteAsistencia from './components/reporte/reportepdf.js';
import Descarga from './components/descarga_datos/descargar.js';
import InformeComp from './components/informe/informe.js';
import Mensajes from './components/mensajes/mensajes.js';
import Modal_Mensajes from './components/notififaciones/notificaciones.js';
import Modal_Subir from './components/subir_datos/subir_datos.js';
import Operaciones_BD from './components/operaciones_bd/operaciones_bd.js';
import Aplicar_Regla from './components/poner_reglas/reglas.js';
import { pixelarImagen, revertirPixelado } from './pixelfoto.js';

function App() {
  return (
    <Router>
      <div className="router">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/log" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main_Page />} />
          <Route path="/main/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </Router>
  );

  function Register() {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState(0);
    const [carrera, setCarrera] = useState("");
    const [foto, setFoto] = useState(null);  // Guardamos la ruta de la foto

    const navigate = useNavigate();
  
    const envio = (event) => {
      event.preventDefault();
    
      // Encriptar la contraseña y el correo
      const encryptedPassword = crypto.AES.encrypt(contrasena, KEY).toString();
      const encryptedCorreo = crypto.AES.encrypt(correo, KEY).toString();
      const encryptedtel = telefono; // Asumiendo que el teléfono no necesita encriptación
    
      if (foto) {
        const formData = new FormData();
        formData.append("usuario", usuario);
        formData.append("contrasena", encryptedPassword);
        formData.append("correo", encryptedCorreo);
        formData.append("telefono", encryptedtel);
        formData.append("titulo", carrera);
    
        // Pixelar la imagen si es necesario
        const pixelf = pixelarImagen(foto, 20);  // Asegúrate de que `pixelarImagen` devuelva un `Blob` o `File`
        if (pixelf instanceof Blob || pixelf instanceof File) {
          formData.append("foto", pixelf, foto.name);  // Usa la foto pixelada
        } else {
          formData.append("foto", foto);  // Si no se pixeló correctamente, usa la foto original
        }
    
        // Enviar con el endpoint que maneja foto
        Axios.post("http://localhost:3001/registerWithPhoto", formData)
          .then(() => {
            console.log("Registro completado con foto");
            navigate("/");
          })
          .catch((error) => {
            console.log("Error al registrar con foto:", error);
          });
      } else {
        const data = {
          usuario,
          contrasena: encryptedPassword,
          correo: encryptedCorreo,
          telefono: encryptedtel,
          titulo: carrera
        };
    
        // Enviar con el endpoint sin foto
        Axios.post("http://localhost:3001/register", data)
          .then(() => {
            console.log("Registro completado");
            navigate("/");
          })
          .catch((error) => {
            console.log("Error al registrar:", error);
          });
      }
    };
    
  
    return (
      <div className="Registro">
        <img src="./granasat_ico.png" className='foto_reg'/>
        <h1>Registre Sus Datos Aquí</h1>
        <form onSubmit={envio} className="form-container">
          <div className="left-column">
            <label>Ruta de la Foto</label>
            <input 
              type="file"  
              onChange={(e) => setFoto(e.target.files[0])} 
            />
            <label>Nombre de usuario*</label>
            <input type="text" placeholder="usuario" required onChange={(e) => setUsuario(e.target.value)} />
            <label>Contraseña*</label>
            <input type="password" placeholder="contraseña" required onChange={(e) => setContrasena(e.target.value)} />
          </div>
          <div className="right-column">
            <label>Correo</label>
            <input type="email" placeholder="correo" onChange={(e) => setCorreo(e.target.value)} />
            <label>Teléfono</label>
            <input type="number" placeholder="666666666" onChange={(e) => setTelefono(e.target.value)} />
            <label>Carrera</label>
            <input type="text" placeholder="eg: Arquitectura" onChange={(e) => setCarrera(e.target.value)} />
          </div>
          <button className="Register_button" type="submit">Registrar</button>
        </form>
        <div className='links'>
          <Link to="/log">Inicio Sesión</Link>
        </div>
      </div>
    );
  }
  

  function Login() {
    const [usuario, setUser] = useState("");
    const [contrasena, setContrasena] = useState("");
    const navigate = useNavigate();

    const login = () => {
      const cifr = crypto.AES.encrypt(contrasena, KEY).toString();

      Axios.post("http://localhost:3001/login", {
          usuario: usuario,
          contrasena: cifr
      }).then((response) => {
          if (response.status === 200) {
              navigate("/main");
              const id_user = response.data.num;
              localStorage.setItem('id', id_user);

              // Llamada al endpoint después de iniciar sesión
              Axios.post("http://localhost:3001/main/mirarasist", {
                  id_usuario: id_user
              }).then((res) => {
                  const numRegistros = res.data.num_registros;

                  // Verificamos si hay registros, si el número es impar o par
                  if (numRegistros === 0) {
                      // Si no hay registros, enviar un mensaje específico
                      const id_sis = 77;
                      const usuarioSeleccionado = id_user;  // Reemplazar con el destinatario real
                      const mensaje = "No se han registrado asistencias.";
                      const encry = crypto.AES.encrypt(mensaje, KEY).toString();

                      // Llamada al endpoint para enviar el mensaje de "No registros"
                      Axios.post("http://localhost:3001/main/mensajes/privado", {
                          id_usr: id_sis,
                          id_dest: usuarioSeleccionado,
                          mensaje: encry,
                      }).then((response) => {
                          console.log("Mensaje de no registros enviado con éxito:", response.data);
                      }).catch((error) => {
                          console.log("Error al enviar mensaje de no registros:", error);
                      });
                  } else if (numRegistros % 2 !== 0) {
                      // Si el número de registros es impar, enviar otro mensaje
                      const id_usr = 77;
                      const usuarioSeleccionado = id_user;  // Reemplazar con el destinatario real
                      const mensaje = "Falta un registro de asistencia en este tramo";
                      const encry = crypto.AES.encrypt(mensaje, KEY).toString();

                      // Llamada al endpoint para enviar el mensaje de "Número impar"
                      Axios.post("http://localhost:3001/main/mensajes/privado", {
                          id_usr: id_usr,
                          id_dest: usuarioSeleccionado,
                          mensaje: encry,
                      }).then((response) => {
                          console.log("Mensaje de registros impares enviado con éxito:", response.data);
                      }).catch((error) => {
                          console.log("Error al enviar mensaje de registros impares:", error);
                      });
                  } else {
                      console.log("El número de registros es par, no se envía mensaje.");
                  }
              }).catch((error) => {
                  console.log("Error al obtener los registros de asistencia:", error);
              });

          } else {
              alert("Fallo en las credenciales");
          }
      }).catch((error) => {
          console.log("Error al iniciar sesión:", error);
          alert("Fallo en las credenciales");
      });
  };
  

    return (
      <div className="App">
        <div className='Login_Page'>
          <h1 className='Titulo'>Iniciar Sesión</h1>
          <label>Usuario</label>
          <input type="text" placeholder='Usuario' onChange={(event) => setUser(event.target.value)} />
          <label>Contraseña</label>
          <input type="password" placeholder='Contraseña' onChange={(event) => setContrasena(event.target.value)} />
          <button onClick={login}>Iniciar Sesión</button>
          <Link to="/register">Registro</Link>
        </div>
      </div>
    );
  }

  function Main_Page() {
    const navigate = useNavigate();
    const [usuarios, SetUsuarios] = useState([]);
    const [profileImage, setProfileImage] = useState('');
    const [mess_count,setMess_Count]= useState(0)
    const [info,setInfo]= useState(null)

    useEffect(() =>{
      const getMessCount = () =>{
        try{
          const id= localStorage.getItem('id')
          Axios.get("http://localhost:3001/main/nummensaj",{params:{id:id}}).then((resp) =>{
            setMess_Count(resp.data.count)
          }).catch((error) =>{
            console.log("Erro en cuenta"+error)
          })
        }catch(err){
          console.log("Eror ocurrido"+err)
        }
      }
      getMessCount()
    },[])

    useEffect(() => {
      // Obtener los datos del usuario
      const getUsuario = async () => {
        try {
          const id = localStorage.getItem('id'); 
          const response = await Axios.get('http://localhost:3001/main/sacausur', { params: { id } });
          setInfo(response.data);

          const uint8Array = new Uint8Array(response.data.foto.data);

          // Crea un Blob a partir del Uint8Array y especifícale el tipo MIME
          const blob = new Blob([uint8Array], { type: 'image/png' });

          // Usa FileReader para leer el Blob como base64
          const reader = new FileReader();
          reader.onloadend = function () {
            // El resultado será una cadena base64 con el prefijo `data:image/png;base64,`
            const base64Image = reader.result;

            setProfileImage(base64Image);
          };

          // Inicia la lectura del Blob como Data URL
          reader.readAsDataURL(blob);

        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      };
  
      getUsuario();
    }, []);

    const [abrir_usuario, useopenPantalla, usecerrarPantalla] = Hook_Usuario(false);
    const [abrir_registro, useopenRegistro, usecerrarRegistro] = Hook_Usuario(false);
    const [abrir_dispositivo, useopenDispositivo, usecerrarDispositivo] = Hook_Usuario(false);
    const [abrir_regla, useabrirRegla, usecerrarRegla] = Hook_Usuario(false);
    const [abrir_departamento, useopenDepartamento, usecerrarDepartamento] = Hook_Usuario(false);
    const [abrir_conectar,useopenConec,usecerrarConec]= Hook_Usuario(false)
    const [abrir_Regasis,useopenRegasis,usecerrarRegasis]= Hook_Usuario(false)
    const [abrir_buscador,useopenBuscador,usecerrarBuscador]= Hook_Usuario(false)
    const [abrir_privl,useopenPrivil,usecerrarPrivil]= Hook_Usuario(false)
    const [abrir_persona,useopenPersonal,usecerrarPersonal]= Hook_Usuario(false)
    const [abrir_reporte,useopenReporte,usecerrarReporte]= Hook_Usuario(false)
    const [abrir_descarga,useopenDescarga,usecerrarDescarga]= Hook_Usuario(false)
    const [abrir_informe,useopenInforme,usecerrarInforme]= Hook_Usuario(false)
    const [abrir_mensajes,useopenMensajes,usecerrarMensajes]= Hook_Usuario(false)
    const [abrir_notif,useopenNotif,usecerrarNotif]= Hook_Usuario(false)
    const [abrir_subir,useopenSubir,usecerrarSubir]= Hook_Usuario(false)
    const [abrir_oper,useopenOper,usecerrarOper]= Hook_Usuario(false)
    const [abrir_poner,useopenPoner,usecerrarPoner]= Hook_Usuario(false)

    const showPerfil = () => {
      navigate("/main/perfil");
    };

    const desconectar = () =>{
      localStorage.removeItem('id_disp');
      localStorage.removeItem('conectar')
    }

    const salir = () =>{
      localStorage.removeItem("id")
      desconectar()
      navigate("/")
    }
    
    return (
      <div className="Main_Page">
        <div className='Horizontal_Barra'>
          <button className='boton_barra' onClick={useopenConec}>
            <img src='./iconos/conectar.png' alt='' className='foto_barra'/>
            <span>Conectar</span>
          </button>
          <button className='boton_barra' onClick={desconectar}>
            <img src='./iconos/desconectar.png' alt='' className='foto_barra'/>
            <span>Desconectar</span>
          </button>
          <button className='boton_barra' onClick={useopenRegasis}>
            <img src='./iconos/asistencia.png' alt='' className='foto_barra'/>
            <span>Registrar Asistencia</span>
          </button>
          <button className='boton_barra' onClick={showPerfil}>
            <img src='./iconos/perfil.png' alt='' className='foto_barra'/>
            <span>Perfil de Usuario</span>
          </button>
          <p className='nombre_usuario'>Hola : {info ? info.usuario : 'Cargando...'}</p>
          {info && profileImage && <img src={profileImage || ''} className='foto_usuario' alt="Foto de usuario"/>}
        </div>

        {abrir_conectar && (
            <DispConectar onClose={usecerrarConec}></DispConectar>
          )}
        {abrir_Regasis && (
          <RegistroAsistencia onClose={usecerrarRegasis}></RegistroAsistencia>
        )}
        <div className='Main_Grid'>
          {info && info.privilegios >= 2 && (
          <button className='item' onClick={useopenPantalla}>
            <img src='./iconos/gestion_usuario.png' className="foto_grid" alt='' />
            <p className='nombre_boton'>Gestion de Usuarios</p>
          </button>
          )}
          {abrir_usuario && (
            <Modal_usuario onClose={usecerrarPantalla}></Modal_usuario>
          )}
          {info && info.privilegios >= 2 && (
            <button className='item' onClick={useopenDepartamento}>
              <img src='./iconos/departamento.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Departamentos</p>
            </button>  
          )}
          {abrir_departamento && (
            <Modal_Departamento onClose={usecerrarDepartamento}></Modal_Departamento>
          )}
          {info && info.privilegios >= 2 && (
            <button className='item' onClick={useopenDispositivo}>
              <img src='./iconos/dispositivo.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Dispositivos</p>
            </button>
          )}
          {abrir_dispositivo && (
            <Modal_Dispositivo onClose={usecerrarDispositivo}></Modal_Dispositivo>
          )}
          {info && info.privilegios >= 2 && (
            <button className='item' onClick={useabrirRegla}>
              <img src='./iconos/turnos.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Turnos</p>
            </button>
          )}
          {abrir_regla && (
            <Modal_Regla onClose={usecerrarRegla}></Modal_Regla>
          )}
          <button className='item' onClick={useopenMensajes}>
            <img src='./iconos/mensaje.png' className="foto_grid" alt='' />
            <p className='nombre_boton'>Mensajes</p>
          </button>
          {abrir_mensajes && (
            <Mensajes onClose={usecerrarMensajes}></Mensajes>
          )}
          {info && info.privilegios >= 2 && (
            <button className='item' onClick={useopenRegistro}>
              <img src='./iconos/registros.jpg' className="foto_grid" alt='' />
              <p className='nombre_boton'>Registros</p>
            </button>
          )}
          {abrir_registro && (
            <Modal_Registro onClose={usecerrarRegistro}></Modal_Registro>
          )}
          {info && info.privilegios >= 1 &&(
            <button className='item' onClick={useopenPersonal}>
              <img src='./iconos/gestion_departamento.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Personal de Departamentos</p>
            </button>
          )}
          {abrir_persona && (
            <Personal_Departamento onClose={usecerrarPersonal}></Personal_Departamento>
          )}
          {info && info.privilegios >= 2 &&(
            <button className='item'>
              <img src='./iconos/privlegios.png' className="foto_grid" alt='' onClick={useopenPrivil}/>
              <p className='nombre_boton'>Permisos</p>
            </button>
          )}
          {abrir_privl && (
            <Privilegios onClose={usecerrarPrivil}></Privilegios>
          )}
          <button className='item' onClick={useopenReporte}>
            <img src='./iconos/reporte.png' className="foto_grid" alt='' />
            <p className='nombre_boton'>Reportes</p>
          </button>
          {abrir_reporte && (
            <ReporteAsistencia onClose={usecerrarReporte}></ReporteAsistencia>
          )}
          {info && info.privilegios >= 1 &&(
            <button className='item' onClick={useopenBuscador}>
              <img src='./iconos/buscar.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Buscar Registro</p>
            </button>
          )}
          {abrir_buscador && (
            <Buscador onClose={usecerrarBuscador}></Buscador>
          )}
          {info && info.privilegios >= 2 &&(
            <button className='item' onClick={useopenSubir}>
              <img src='./iconos/carga.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Cargar Archivo</p>
            </button>
          )}
          {abrir_subir && (
            <Modal_Subir onClose={usecerrarSubir}></Modal_Subir>
          )}
          {info && info.privilegios >= 2 &&(
            <button className='item' onClick={useopenDescarga}>
              <img src='./iconos/descarga.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Descargar Datos</p>
            </button>
          )}
          {abrir_descarga && (
            <Descarga onClose={usecerrarDescarga}></Descarga>
          )}
          {info && info.privilegios >= 1 &&(
            <button className='item' onClick={useopenInforme}>
              <img src='./iconos/informe.png' className="foto_grid" alt='' />
              <p className='nombre_boton'>Informe</p>
            </button>
          )}
          {abrir_informe && (
            <InformeComp onClose={usecerrarInforme}></InformeComp>
          )}
          <button className='item_n' onClick={useopenNotif}>
            <img src='./iconos/notificacion.png' className="foto_grid" alt='' />
            <p className='nombre_boton'>Notificaciones</p>
          </button>
          {mess_count > 0 && (
            <span className='notifnum'>{mess_count}</span>
          )}
          {abrir_notif && (
            <Modal_Mensajes onClose={usecerrarNotif}></Modal_Mensajes>
          )}
          {info && info.privilegios >= 2 &&(
              <button className='item'>
                <img src='./iconos/operaciones.png' className="foto_grid" alt='' onClick={useopenOper}/>
                <p className='nombre_boton'>Operaciones de la base de datos</p>
              </button>
          )}
          {abrir_oper && (
            <Operaciones_BD onClose={usecerrarOper}></Operaciones_BD>
          )}
          {info && info.privilegios >= 1 &&(
            <button className='item'>
              <img src='./iconos/poner_reglas.png' className="foto_grid" alt='' onClick={useopenPoner}/>
              <p className='nombre_boton'>Aplicar Reglas de Asistencia</p>
            </button>
          )}
          {abrir_poner && (
            <Aplicar_Regla onClose={usecerrarPoner}></Aplicar_Regla>
          )}
          <button className='item'>
            <img src='./iconos/salir.png' className="foto_grid" alt='' onClick={salir}/>
            <p className='nombre_boton'>Salir</p>
          </button>
        </div>
      </div>
    );
  }
}

export default App;
