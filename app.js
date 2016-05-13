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
    response.render('index', {title: "Senderos LaPalma"});
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
