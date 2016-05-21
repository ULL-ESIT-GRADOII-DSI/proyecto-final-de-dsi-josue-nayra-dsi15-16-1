"use strict";

var express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const util = require('util');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 5000));


//Conexión mongoDB
const conexionBD = require('./config/database.js');
mongoose.connect(conexionBD.url);

//Importando esquemas de BD
const Estructura = require('./models/estructura_bd.js');
const UserSchema = Estructura.User;
const MapaSchema = Estructura.Mapa;
//console.log("Estructura:"+Estructura);
//console.log("User:"+UserSchema);
//console.log("Mapa:"+MapaSchema);
const User = mongoose.model("User", UserSchema);
const Mapa = mongoose.model("Mapa", MapaSchema);

require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'proyecto-nayra-josue',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.get('/', (request, response) => {     
  ////console.log("Accediendo a index");
    response.render('index', {title: "Senderos LaPalma", message: "Login"});
});



// Muestra todas las rutas (sección rutas) -----------------------------------------------------------------------

app.get('/mostrar_caminos', (request, response) => {
    Mapa.find({}, function(err,data)
    {
        if(err)  console.error("Error:"+err);
        else
        {
            response.send({mapas: data, mensaje_respuesta_peticionsenderos: "Nuestros senderos"});   
        }
    });
});


// Mostrar mapa -------------------------------------------------------------------------------------------------

app.get('/mostrar_mapa_seleccionado',(request, response) => {
        //console.log("Accedo a mapa");
        //console.log("Nombre:"+request.query.nombre_mapa);
        
        Mapa.find({nombre: request.query.nombre_mapa}, function(err,data)
        {
            //console.log("Data:"+data);
            if(err) console.error("Error:"+err);
            else
            {
                if(data.length > 0)
                {   
                    //const id = mongoose.Types.ObjectId(data._creator);
                    //console.log("Data_creator:"+data[0]._creator);
                    User.find({ _id: data[0]._creator}, function(err,data_usuario)
                    {
                       if(err) console.error("Error:"+err);
                       else
                       {
                           response.send({puntuacion: data[0].puntuacion, dificultad: data[0].dificultad, descripcion: data[0].descripcion, camino: data[0].camino, user_propietario: data_usuario[0].local.username});
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
        dificultad: request.query.dificultad,
        puntuacion: request.query.puntuacion,
        _creator: id
    });
    nuevo_mapa.save(function(err)
    {
        if(err) return console.error(err);
        console.log(`Guardado: ${nuevo_mapa}`);
    }).then(() => {
        Mapa
        .findOne({nombre:request.query.nombre_mapa, dificultad: request.query.dificultad, puntuacion: request.query.puntuacion, descripcion: request.query.descripcion_mapa, _creator: id, camino: request.query.puntos})
        .populate('_creator')
        .exec(function(err,mapa){
            if(err) return console.error(err);
            console.log('Propietario del mapa: %s',mapa._creator);
        }).then( () => {
            response.send({mensaje_respuesta_publicar: "Guardado con exito"});
        });            
    });            
});

// Login ---------------------------------------------------------------------------------------------------

app.get('/login', function(req, res){
	//res.redirect('index.ejs', { message: req.flash('loginMessage') });
    res.send({message: req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile_login',
    failureRedirect: '/login',
    failureFlash: true
}));  
  
app.get('/signup', function(req, res){
	//res.render('signup.ejs', { message: req.flash('signupMessage') });
    res.send({message: req.flash('signupMessage')});
});

app.post('/signup', passport.authenticate('local-signup', {
	successRedirect: '/profile_register',
	failureRedirect: '/signup',
	failureFlash: true
}));

app.get('/profile_login', isLoggedIn, function(req, res){

	 res.send({message: "Usuario correcto", id_usuario: req.user._id, email: req.user.local.username});
});

app.get('/profile_register', isLoggedIn, function(req, res){
	 res.send({message: "Usuario registrado" , id_usuario: req.user._id, email: req.user.local.username});
});

function isLoggedIn(req, res, next) {
    //console.log("Req,isAuthenticated:"+req.isAuthenticated());
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}

// Filtro de búsqueda -------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/filtrar', (request, response) => {
  //console.log("Filtro:"+request.query.filtro);
  //console.log("Filtro dificultad:"+request.query.dificultad);
//  odel.findOne({name: new RegExp('^'+name+'$', "i")}
    //console.log("Filtrando");
    if(!request.query.dificultad)
    {
          Mapa.find({ $or: [{ descripcion: new RegExp('\s*^.*\s*('+request.query.filtro+')+\s*.*\s*$', "i")}, { nombre: new RegExp('^.*('+request.query.filtro+')+.*$', "i")}]}, function(err, data) {
             if(err) return console.error(err);
             //console.log("Caminos:"+data.length); 
             if(data.length > 0)
                response.send({mapas:data, mensaje_respuesta_peticionsenderos: "Senderos encontrados"});
             else
                response.send({mensaje_respuesta_peticionsenderos: "No se han encontrado senderos"});
              
          });
    }
    else
    {
          Mapa.find({ $or: [{ descripcion: new RegExp('\s*^.*\s*('+request.query.filtro+')+\s*.*\s*$', "i")}, { nombre: new RegExp('^.*('+request.query.filtro+')+.*$', "i")}], dificultad: request.query.dificultad }, function(err, data) {
             if(err) return console.error(err);
             //console.log("Caminos:"+data.length); 
             if(data.length > 0)
                response.send({mapas:data, mensaje_respuesta_peticionsenderos: "Senderos encontrados"});
             else
                response.send({mensaje_respuesta_peticionsenderos: "No se han encontrado senderos"});
          });
    }   
});

app.get('/logout', function(req, res){
  req.logout();
  //console.log("Req:"+req);
  res.redirect('/');
});
// -------------------------------------- PUERTO Y HOST-------------------------------------------------------------------------

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});
