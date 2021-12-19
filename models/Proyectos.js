const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');
const db = require('../config/db');

const Proyectos = db.define('proyectos', {

    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:{
        type: Sequelize.STRING(100),
    },
    url: {
        type: Sequelize.STRING(100)
    }

},{
    hooks:{
        beforeCreate(proyecto){
            proyecto.url = slug(proyecto.nombre).toLowerCase() + '-' + shortid.generate();
        }
    }
});

module.exports = Proyectos;