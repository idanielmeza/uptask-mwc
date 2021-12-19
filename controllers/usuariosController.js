const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handler/email');

const formCrearCuenta = (req, res) => {

    res.render('crearCuenta',{
        nombrePagina: 'Crear Cuenta'
    });

}

const crearCuenta = async (req, res) => {
    //leer los datos
    const {email,password} = req.body;

    try {
        await Usuarios.create({
            email,
            password
        });


        //Crear url de confirmar

        const confirmarUrl = `${req.headers.origin}/confirmar/${email}`;

        //Crear objeto usuario
        const usuario = {
            email
        }

        //Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confrimar Cuenta',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });
        

        //Redireccionar

        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta',{
            nombrePagina: 'Crear Cuenta',
            mensajes: req.flash(),
            email
        });
    }

    //Crear usuario
}

const formIniciarSesion = (req, res) => {
        const {error} = res.locals.mensajes;
        res.render('iniciar-sesion',{
            nombrePagina: 'Iniciar Sesion',
            error
        });
    
    
}

const formRestablecerPassword = (req, res) => {
    res.render('restablecer',{
        nombrePagina: 'Restablecer Contrasena'
    });
}

const confirmarCuenta = async(req, res) => {

    const {email} = req.params;

    const usuario = await Usuarios.findOne({
        where:{email}
    });

    if(!usuario){
        req.flash('error', 'No existe una cuenta con ese correo');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');

    res.redirect('/iniciar-sesion');

}

module.exports = {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    formRestablecerPassword,
    confirmarCuenta
}