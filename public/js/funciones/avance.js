export const actualizarAvance = ()=>{

    //Seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if(tareas.length){

        //Seleccionar las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');
    

        //Ccalcular avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        //Mostrar avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';

    }

    

}