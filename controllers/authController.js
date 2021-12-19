const Usuarios = require('../models/usuarios');

const passport = require('passport');

const crypto = require('crypto');
const Op = require('sequelize').Op;

const bcrypt = require('bcryptjs');

const enviarEmail = require('../handler/email');

const autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

const verificarUsuario = (req, res, next) => {
    //Si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next();
    }
    //Si no esta autenticado, redirigir a fomrulario
    return res.redirect('/iniciar-sesion');
}

const cerrarSesion = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion');
    });
}

const enviarToken = async (req, res) => {
    //Verificar que el usuario exista
    const { email } = req.body;
    const usuario = await Usuarios.findOne({ where: { email } });

    if(!usuario){
        req.flash('error', 'No existe cuenta');

        res.redirect('/reestablecer');
    }


    //Generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; //1 hora

    //Guardar token en la base de datos
    await usuario.save();


    //url de reset
    const resetUrl = `${req.headers.origin}/restablecer/${usuario.token}`;
    
    //Enviar email
    await enviarEmail.enviar({
        usuario,
        subject: 'Restablecer Contraseña',
        resetUrl,
        archivo: 'restablecer-password'
    });

    res.redirect('/iniciar-sesion');


}

const validarToken = async (req, res) => {
    const {token} = req.params;

    const usuario = await Usuarios.findOne({
        where:{
            token
        }
    });

    if(!usuario){
        req.flash('error', 'Token invalido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer contraseña',
    })
}

const resetPassword = async (req, res) => {
    const {token} = req.params;

    const usuario = await Usuarios.findOne({
        where:{
            token,
            expiracion:{
                [Op.gte]: Date.now()
            }
        }
    })
    
    //Verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'Token invalido o expirado');
        res.redirect('/reestablecer');
    };

    //Hashear password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //Guardar cambios
    await usuario.save();
    res.redirect('/iniciar-sesion');
}

module.exports = {
    autenticarUsuario,
    verificarUsuario,
    cerrarSesion,
    enviarToken,
    validarToken,
    resetPassword
}