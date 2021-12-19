const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo a utilizar
const Usuario = require('../models/usuarios');

//Local strategy - Login con credenciales propias del la pagina
passport.use(new LocalStrategy(
    {
    //Por default espera usuario y password
    usernameField: 'email',
    passwordField: 'password'
    },
    async(email,password,done)=>{
        try {
            const usuario = await Usuario.findOne({where:{email}});

            //El usuario existe, password incorrecto
            if(!usuario.verificarPassword(password)){
                return done(null,false,{
                    message: 'Contrasena incorrecta'
                });
            }
            if(!usuario.activo){
                return done(null,false,{
                    message: 'Activa tu cuenta para poder iniciar sesion, revisa tu correo'
                })
            }

            //Todo correcto
            return done(null,usuario);

        } catch (error) {
            //Ese usuario no existe
            return done(null,false,{message:'El usuario no existe'});
        }
    }
));

//Serealiza el usuario
passport.serializeUser((usuario,done)=>{
    done(null,usuario);
})

//Deserializa el usuario
passport.deserializeUser((usuario,done)=>{
    done(null,usuario);
})

module.exports = passport;