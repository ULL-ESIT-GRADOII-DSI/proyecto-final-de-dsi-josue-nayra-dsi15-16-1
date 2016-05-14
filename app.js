"use strict";

var express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

//Conexión con Estructura de MongoDB
//Conexión con Estructura de MongoDB
const Estructura = require('./models/estructura_bd.js');
const User = Estructura.User;
const Mapa = Estructura.Mapa;
const Punto = Estructura.Punto;

console.log("Estructura:"+Estructura);
console.log("User:"+User);
console.log("Mapa:"+Mapa);


const mongoose = require('mongoose');

const util = require('util');

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));


app.get('/', (request, response) => {     
  //console.log("Accediendo a index");
    response.render('index', {title: "Senderos LaPalma", title1: "La Palma se siente", title2: "Descubre nuestros mejores senderos"});
});

//Imagenes
/*app.get('/upload',(request, response) => {
    upload.upload;
});*/

const upload = require('./models/upload.js');

app.post('/upload', (request, response) => {
    console.log("Accediendo a upload");
    console.log("Imagen:"+request.query.imagen);
    upload(request.query.imagen);
});


app.get('/nuevo_camino',(request, response) => { 
    console.log("Servidor:Guardando camino");
    console.log("Usuario:"+request.query.usuario);
    console.log("Puntos intermedios:"+request.query.puntos);

    const id = mongoose.Types.ObjectId(request.query.usuario);
    
    let nuevo_mapa = new Mapa(
    {
        nombre: request.query.nombre_mapa,
        descripcion: request.query.descripcion_mapa,
        camino: request.query.puntos,
        _creator: id
    });
    nuevo_mapa.save(function(err)
    {
        if(err) return console.log(err);
        console.log(`Guardado: ${nuevo_mapa}`);
    }).then(() => {
        Mapa
        .findOne({nombre:request.query.nombre_mapa,descripcion: request.query.descripcion_mapa, _creator: id})
        .populate('_creator')
        .exec(function(err,mapa){
            if(err) return console.log(err);
            console.log('Propietario del mapa: %s',mapa._creator);
        }).then( () => {
            var nuevo;
             Mapa.find({ _creator: id}, function(err, nueva_data)
             {
                 nuevo = nueva_data;
                 console.log("Nuevas tablas:"+nueva_data);
             });
        });            
    });            
});

// Usuarios -----------------------------------------------------------------------

app.get('/login',(request, response) => {
    console.log("Datos recibidos en el servidor:");
    console.log("Nombre de usuario:"+request.query.nombre_usuario);
    console.log("Password de usuario:"+request.query.password_usuario);
    User.find({nombre: request.query.nombre_usuario}, function(err, data)
    {
        if(err)
        {
            console.error("Se ha producido un error->"+err);
        }
        else
        {
            if(data.length > 0)
            {
                response.send({id_usuario: data[0]._id, mensaje_respuesta_login: "Usuario correcto"});    
            }
            else
            {
                response.send({id_usuario: -1, mensaje_respuesta_login: "Usuario no encontrado"});   
            }
        }
    });
    
});

// ---------------------------------------------------------------------------------------

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
