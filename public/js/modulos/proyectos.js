import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {

        const urlProyecto = e.target.dataset.proyectoUrl;

        // console.log(urlProyecto);
        // return;
    
        Swal.fire({
            title: 'Estas seguro que eliminaras el proyecto?',
            text: "Los proyectos eliminados no se pueden recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              //Eliminar proyecto
              
              const url = `${location.origin}/proyectos/${urlProyecto}`;
              //Enviar peticion

                axios.delete(url,{params: {urlProyecto}}).then(resultado => console.log);
              
              Swal.fire(
                'Proyecto eliminado!',
                'El proyecto se ha eliminado correctamente',
                'success'
              );
    
              //redireccionar al inicio
              setTimeout(() => {
                  location.href = '/';
              }, 2000)  
    
            }
          })
    
    });
}

export default btnEliminar;
