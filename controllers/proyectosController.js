const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const proyectosHome = async(req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});


    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

const formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

const nuevoProyecto = async(req, res) => {
    // Validar el input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    if(errores.length > 0){
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({where:{usuarioId}});
        res.render('nuevoProyecto', {
            errores,
            nombrePagina: 'Nuevo Proyecto',
            proyectos
        });
    }else{
        //No hay errores
        //Insertar en db
        try {
            // const url = slug(nombre).toLowerCase();
            const usuarioId = res.locals.usuario.id;
            await Proyectos.create({nombre, usuarioId});
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
        

    }

}

const proyectoUrl = async(req, res, next) => {
    const { url } = req.params;
    const usuarioId = res.locals.usuario.id;
    const [proyectos,proyecto] = await Promise.all([
        Proyectos.findAll({where:{usuarioId}}),
        Proyectos.findOne({where:{url}})
    ]);

    if(!proyecto) return next();

    //Consultar tareas del proyectop actual
    const tareas = await Tareas.findAll({where:{
        proyectoId:proyecto.id
        }
    });

    res.render('tareas',{
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

const formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const [proyectos,proyecto] = await Promise.all([
        await Proyectos.findAll({where:{usuarioId}}),
        Proyectos.findOne({where:{id: req.params.id}})
    ]);

    res.render('nuevoProyecto',{
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

const actualizarProyecto = async(req, res) => {

    // Validar el input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    if(errores.length > 0){
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId});
        res.render('nuevoProyecto', {
            errores,
            nombrePagina: 'Editar Proyecto',
            proyectos
        });
    }else{
        //No hay errores
        //Insertar en db
        try {

            await Proyectos.update(
                {nombre},
                {where:
                    {id: req.params.id}
                });
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
        

    }

}

const eliminarProyecto = async(req, res) => {
    const {url} = req.params;

    await Proyectos.destroy({where:{
        url
    }});

    res.status(200).send('Proyecto Eliminado');
}


module.exports = {
    proyectosHome,
    formularioProyecto,
    nuevoProyecto,
    proyectoUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
}