import axios from "axios";
import Swal from "sweetalert2";
import {actualizarAvance} from '../funciones/avance';
const tareas = document.querySelector('.listado-pendientes');

if(tareas){
    tareas.addEventListener('click', e => {

        if(e.target.classList.contains('fa-check-circle')){
            const icono= e.target,
                idTarea = icono.parentElement.parentElement.dataset.tarea;

            // actualizar tarea
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url,{params:{idTarea}}).then(respueta => {
                if(respueta.status === 201){
                    icono.classList.toggle('completo');
                    actualizarAvance();
                }
            })

        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                idTarea = tareaHTML.dataset.tarea;

            // eliminar tarea
            Swal.fire({
                title: 'Deseas eliminar la tarea?',
                text: "Los proyectos eliminados no se pueden recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url,{params:{idTarea}}).then(respuesta => {
                        if(respuesta.status === 200){
                            tareaHTML.parentElement.removeChild(tareaHTML);
                            actualizarAvance();
                        }
                    })
                }
            });

    }});
}


export default tareas;