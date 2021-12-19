const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');

const bcrypt = require('bcryptjs');

const Usuarios = db.define('usuarios',{
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail:{
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'El email no puede estar vacio'
            }
        },
        unique: {
            args: true,
            msg: 'El correo ya esta registrado'
        }

    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'El password no puede estar vacio'
            }
        }
    },
    token:{
        type: Sequelize.STRING,
    },
    expiracion:{
        type: Sequelize.DATE
    },
    activo:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
},{
    hooks:{
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

//Meotods personalizados
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}


Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
