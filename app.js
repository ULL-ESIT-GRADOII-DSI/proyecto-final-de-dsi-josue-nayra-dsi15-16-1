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
    response.render('index', {title: "Senderos LaPalma"});
});

//---------------------------------------------------------------------------------------------

//  Página personal de google developer (Google cloud Plataform)
//  https://console.cloud.google.com/apis/credentials/oauthclient/562518393680-l8316pdco37a1nujqh1oseq41f3u6di8.apps.googleusercontent.com?project=senderos-la-palma
  

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: "562518393680-l8316pdco37a1nujqh1oseq41f3u6di8.apps.googleusercontent.com",
    clientSecret: "VhcdcgzJCMgWKYU1MMvk8gyL",
    // callbackURL: "http://www.example.com/auth/google/callback",
    // callbackURL: "https://dsi-1516-alu0100406122.c9users.io/?_c9_id=livepreview1&_c9_host=https://ide.c9.io"
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});



// Muestra todas las rutas (sección rutas) -----------------------------------------------------------------------

app.get('/mostrar_caminos', (request, response) => {
    Mapa.find({}, function(err,data)
    {
        if(err)  console.log("Error:"+err);
        else
        {
            response.send({mapas: data, mensaje_respuesta_peticionsenderos: "Nuestros senderos"});   
        }
    });
});

// Mostrar mapa -------------------------------------------------------------------------------------------------


app.get('/mostrar_mapa_seleccionado',(request, response) => {
        console.log("Accedo a mapa");
        console.log("Nombre:"+request.query.nombre_mapa);
        
        Mapa.find({nombre: request.query.nombre_mapa}, function(err,data)
        {
            console.log("Data:"+data);
            if(err) console.log("Error:"+err);
            else
            {
                if(data.length > 0)
                {   
                    //const id = mongoose.Types.ObjectId(data._creator);
                    console.log("Data_creator:"+data[0]._creator);
                    User.find({ _id: data[0]._creator}, function(err,data_usuario)
                    {
                       if(err) console.log("Error:"+err);
                       else
                       {
                           response.send({descripcion: data[0].descripcion, camino: data[0].camino, user_propietario: data_usuario[0].username});
                       }
                    });
                }
            }
        });
});

// Guardar nueva ruta -------------------------------------------------------------------------------------------


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
        .findOne({nombre:request.query.nombre_mapa,descripcion: request.query.descripcion_mapa, _creator: id, camino: request.query.puntos})
        .populate('_creator')
        .exec(function(err,mapa){
            if(err) return console.log(err);
            console.log('Propietario del mapa: %s',mapa._creator);
        }).then( () => {
            response.send({mensaje_respuesta_publicar: "Guardado con exito"});
        });            
    });            
});

// Usuarios ---------------------------------------------------------------------------------------------------

app.get('/login',(request, response) => {
    console.log("Datos recibidos en el servidor:");
    console.log("Nombre de usuario:"+request.query.nombre_usuario);
    console.log("Password de usuario:"+request.query.password_usuario);
    User.find({username: request.query.nombre_usuario}, function(err, data)
    {
        if(err)
        {
            console.error("Se ha producido un error->"+err);
        }
        else
        {
            if(data.length > 0)
            {
                response.send({id_usuario: data[0]._id, autor: data[0].username, mensaje_respuesta_login: "Usuario correcto"});    
            }
            else
            {
                let nuevo_usuario = new User({
                    username: request.query.nombre_usuario,
                    password: request.query.password
                });
                nuevo_usuario.save(function(err){
                    if(err) return console.log(err);
                    else {
                        console.log(`Nuevo usuario creado: ${nuevo_usuario}`);
                    }
                }).then(()=>{
                    User 
                        .findOne({username: request.query.nombre_usuario, password: request.query.password})
                        .exec(function(err,usuario){
                            if(err) return console.log(err);
                            else {
                                response.send({id_usuario: usuario._id, autor: usuario.username, mensaje_respuesta_login: "Nuevo usuario"});   
                            }
                        })
                        
                });
            }
        }
    });
    
});

// ---------------------------------------------------------------------------------------------------------------

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
