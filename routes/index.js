const {check} = require('express-validator');

const {Router} = require('express');
const {proyectosHome,formularioProyecto,nuevoProyecto, proyectoUrl, formularioEditar, actualizarProyecto, eliminarProyecto} = require('../controllers/proyectosController');
const {agregarTarea, actualizarTarea, eliminarTarea} = require('../controllers/tareasController');
const {formCrearCuenta, crearCuenta, formIniciarSesion, formRestablecerPassword, confirmarCuenta} = require('../controllers/usuariosController');
const {autenticarUsuario, verificarUsuario, cerrarSesion, enviarToken, validarToken, resetPassword} = require('../controllers/authController');

const router = Router();

router.get('/', verificarUsuario ,proyectosHome);

router.get('/nuevo-proyecto',verificarUsuario,formularioProyecto)

router.post('/nuevo-proyecto', 
    [
        verificarUsuario,
        check('nombre').not().isEmpty().trim().escape()
    ]
,nuevoProyecto);

//Listar Proyecto
router.get('/proyectos/:url', verificarUsuario ,proyectoUrl);

//Actualizar proyecto
router.get('/proyecto/editar/:id', verificarUsuario,formularioEditar);
router.post('/nuevo-proyecto:id',[
    verificarUsuario, 
    check('nombre').not().isEmpty().trim().escape()
]
,actualizarProyecto);


//Eliminar proyecto
router.delete('/proyectos/:url',verificarUsuario ,eliminarProyecto);

//Tareas
//Agregar
router.post('/proyectos/:url', verificarUsuario,agregarTarea);

//actualizar tarea
router.patch('/tareas/:id',verificarUsuario ,actualizarTarea);
//eliminar tarea
router.delete('/tareas/:id',verificarUsuario ,eliminarTarea);

//Crear nueva cuenta
router.get('/crear-cuenta', formCrearCuenta);

router.post('/crear-cuenta', crearCuenta);

router.get('/confirmar/:email',confirmarCuenta)

//Iniciar Ssesion
router.get('/iniciar-sesion', formIniciarSesion);
router.post('/iniciar-sesion', autenticarUsuario);

//Cerrar sesion
router.get('/cerrar-sesion', cerrarSesion);

//Reestablecer contraseña
router.get('/restablecer', formRestablecerPassword);
router.post('/restablecer', enviarToken);

router.get('/restablecer/:token', validarToken);

router.post('/restablecer/:token', resetPassword);


module.exports = router;