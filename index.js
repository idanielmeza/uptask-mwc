const routes = require('./routes');
const express = require('express');
const path = require('path');

const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//Helpers
const {vardump} = require('./helpers');

//Conectar db
const db = require('./config/db');

require('dotenv').config();

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

(async ()=>{try {

    await db.sync();

    console.log('DB conectada');

} catch (error) {

    console.log(error);

}})();


//Crear servidor
const app = express();

// Habilitar carpeta publica
app.use(express.static('public'));

//Habilitar view engine
app.set('view engine', 'pug');

//Habilitar bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Anadir vistas
app.set('views', path.join(__dirname, './views'));


//Agrgar flash messages
app.use(flash());

//Cookie parser
app.use(cookieParser());

// Sesiones nos permite navegar entre paginas sin autenticacion
app.use(session({
    secret: 'secretsesion',
    resave: false,
    saveUninitialized: false

}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la aplicacion
app.use((req,res, next)=>{
    res.locals.vardump = vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

// ruta para el home
app.use('/', routes);

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

app.listen(port, host,()=>{
    console.log(`Servidor corriendo en http://${host}:${port}`);
})
