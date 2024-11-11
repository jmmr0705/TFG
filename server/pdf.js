const pdf= require("jspdf")

function createInforme(nombre,correo,titulo,columnas,datos){
    const {jspdf} = window.jspdf
    const doc= new  pdf.jsPDF

    doc.setFontSize(12)
    doc.text(`Nombre: ${nombre}`)
    doc.text(`Carrera ${titulo}`)
    doc.text(`Correo: ${correo}`)

    let initX=10
    let initY=50
    let ancho=40
    let alto=10

    columnas.forEach((columna,index) =>{
        doc.text(columna,initX + index*ancho,initY)
    })

    datos.forEach((fila,indexr) =>{
        fila.forEach((registro,index) =>{
            doc.text(string(registro), initX + index*ancho, initY + (indexr +1)*alto)
        })
    })

    doc.save(`${nombre}_informe.pdf`)
}

module.exports = createInforme
