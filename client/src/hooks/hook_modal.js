import { useState } from "react";

export const Hook_Usuario = (init=false) =>{

    const [abrir,setAbrir] = useState(init)

    const useabrirPantalla= () => setAbrir(true)

    const usecerrarPantalla= () => setAbrir(false)

    return [abrir,useabrirPantalla,usecerrarPantalla]
}

