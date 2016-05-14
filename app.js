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
console.log("Tabla:"+Mapa);
console.log("Punto:"+Punto);

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

app.get('/nuevo_camino',(request, response) => { 
    console.log("Accediendo a ruta");
    console.log("Usuario:"+request.query.usuario);
    console.log("Puntos intermedios:"+request.query.puntos);

    const id = mongoose.Types.ObjectId(request.query.usuario);
    
    User.find({id_: id},function(err,data)
    {
        if(err)
        {
            console.error("Se ha producido un error->"+err);
        }
        else
        {
            if(data.length > 0) //Usuario existe
            {
                console.log("El usuario existe");
                /*let nuevo_mapa = new Mapa(
                {
                    nombre: request.query.nombre_mapa,
                    descripcion: request.query.descripcion_mapa,
                    origen: request.query.origen,
                    destino: request.query.destino,
                    camino: request.query.puntos,
                    _creator: data[0]._id
                });
                nuevo_mapa.save(function(err)
                {
                    if(err) return console.log(err);
                    console.log(`Guardada: ${nuevo_mapa}`);
                }).then(() => {
                    Mapa
                    .findOne({entrada_tabla: request.query.input,nombre:request.params.ejemplo,descripcion: request.query.descripcion, _creator: id})
                    .populate('_creator')
                    .exec(function(err,tabla){
                        if(err) return console.log(err);
                        console.log('Propietario de tabla: %s',tabla._creator);
                    }).then( () => {
                        var nuevo;
                         Mapa.find({ _creator: id}, function(err, nueva_data)
                         {
                             nuevo = nueva_data;
                             console.log("Nuevas tablas:"+nueva_data);
                             response.send({contenido: nuevo, usuario_propietario: id, mensaje_respuesta: " ", mensaje_guardado: "Guardado"});
                         });
                    });            
                });*/                
            }
            else
            {
                //Usuario no existe
                console.log("El usuario no existe");
            }
        }
    });
});

// Usuarios -----------------------------------------------------------------------

app.param('usuario',function(req,res,next,usuario)
{
    if (usuario.match(/^[a-z0-9_]*$/i)) { 
      req.ejemplo = usuario;
    } else { 
      next(new Error(`<${usuario}> does not match 'usuario' requirements`));
    }
    next();
});

app.get('/buscar/:usuario',(request,response) => {
    console.log("Usuario a buscar:"+request.params.usuario);
    User.find({nombre: request.params.usuario},function(err,data) {
        if(err) {
            console.error("Se ha producido un error->"+err);
        }
        else {
            if(data.length > 0){
                console.log("Error:"+err);
                console.log("Enviando datos a csv.js => Id de usuario:"+data[0]._id);
                /*var id = new ObjectId(data[0]._id);
                console.log("Id:"+id._id);*/
                const id = mongoose.Types.ObjectId(data[0]._id);
                console.log("Id:"+id);
                Tabla.find({_creator: id},function(err,data_tablas)
                {
                    if(err)
                    {
                        console.error("Se ha producido un error->"+err);
                    }
                    else
                    {
                        console.log("Enviando dattos a csv.js => Tablas asociadas:"+data_tablas);    
                    }
                    response.send({contenido: data_tablas, usuario_propietario: id, mensaje_respuesta: "Busqueda realizada correctamente.", mensaje_guardado: " "});
                });
            }
            else{
                console.log("creando nuevo usuario.");
                let nuevo_usuario = new User({
                    nombre: request.params.usuario
                });
                nuevo_usuario.save(function(err){
                   if(err) return console.log(err);
                   response.send({contenido: " ", usuario_propietario: nuevo_usuario._id, mensaje_respuesta: "Nuevo usuario creado.", mensaje_guardado: " "});
                }).then(() => {
                    console.log(`Saved: ${nuevo_usuario}`);
                })
            }
        }
    });
});

// ---------------------------------------------------------------------------------------

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
