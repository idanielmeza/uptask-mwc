const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const agregarTarea = async(req,res)=>{

    const proyecto = await Proyectos.findOne({where:{url:req.params.url}});

    //leer valor de input
    const {tarea} = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;
    
    //Insertar en base de datos
    await Tareas.create({tarea,estado,proyectoId});

    //Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);

}

const actualizarTarea = async(req,res, next)=>{
    const {id} = req.params;

    const tarea = await Tareas.findOne({where:{id}});

    if(tarea.estado){
        tarea.estado = 0;
    }else{
        tarea.estado = 1;
    }

    try {
        await tarea.save();
        res.status(201).send('Tarea actualizada');
    } catch (error) {
        return next();
    }
    

}

const eliminarTarea = async(req,res, next)=>{
    const {id} = req.params;

    //Eliminar tarea
    try {
        await Tareas.destroy({where:{id}});
        res.status(200).send('Tarea eliminada');
    } catch (error) {
        return next();
    }    
    

}

module.exports ={
    agregarTarea,
    actualizarTarea,
    eliminarTarea
}