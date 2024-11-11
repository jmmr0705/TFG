import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "../../estilos/buscador.css";

const Buscador = ({onClose}) => {
    const [filtro, setFiltro] = useState("");
    const [resultado, setResultado] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [visible, setVisible] = useState(true); // Estado de visibilidad

    const buscar = async (input) => {
        try {
            setCargando(true);
            const resultado = await Axios.get("http://localhost:3001/main/buscar", { params: { filtro: input } });
            setResultado(resultado.data);
            setCargando(false);
        } catch (error) {
            setCargando(false);
            console.log("Error en la búsqueda");
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (filtro) {
                buscar(filtro);
            } else {
                setResultado([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [filtro]);

    if (!visible) return null; // Si no es visible, no renderiza el componente

    return (
        <div className='contenedor'>
            <div className='buscador'>
                <input type="text" value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar..." />
                {cargando && <p>Cargando...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Dispositivo</th>
                            <th>Usuario</th>
                            <th>Tipo de Verificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultado.map((item, index) => (
                            <tr key={index}>
                                <td>{item.dispositivo}</td>
                                <td>{item.usuario}</td>
                                <td>{item.Tipo_Verificacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="boton-cerrar" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default Buscador;
