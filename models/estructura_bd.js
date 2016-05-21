    "use strict";
    //console.log("Configurando MongoDB...");
    //Conexión con MongoDB
    
    const mongoose = require('mongoose');
    //mongoose.connect('mongodb://localhost/Practica10');
    
    const Schema = mongoose.Schema;
    
    var UserSchema = new Schema({
    	local: {
    		username: String,
    		password: String
    	},
    	facebook: {
    		id: String,
    		token: String,
    		email: String,
    		name: String
    	}
    });

    const MapaSchema = new Schema({
        nombre: String,
        descripcion: String,
        //origen: {Latitud: String, Longitud: String},
        //destino: {Latitud: String, Longitud: String},
        camino: Array,
        dificultad: String,
        puntuacion: { type: Number, min: 0, max: 10 },
        _creator: [{type: Schema.Types.ObjectId, ref: "User"}]
    });

    /*const PuntoSchema = new Schema({
        latitud: String,
        longitud: String,
        _mapa: [{type: Schema.Types.ObjectId, ref: "Mapa"}] 
    });*/
    
    const User = mongoose.model("User", UserSchema);
    const Mapa = mongoose.model("Mapa",MapaSchema);
    
    
    User.remove({}).then(() => {
        Mapa.remove({}).then(() => {
               //Usuario Josue de Prueba
               //console.log("Usuario Josue de prueba");
               let usuario_prueba1 = new User(
               {
                   local:{
                        username: "JosueTC94",
                        password: "x"   
                   },
                   facebook: {}
               });
               usuario_prueba1.save(function(err)
               {
                    if(err) return console.error(err);
                    //console.log(`Saved: ${usuario_prueba1}`);
                    //Ejemplos por defecto
                    let mapa1 = new Mapa(
                    {
                        nombre: "Los Tilos",
                        descripcion: "Bonito sendero",
                        //origen: {Latitud: "17.123445", Longitud: "80.1233445"},
                        //destino: {Latitud: "17.123445", Longitud: "80.1233445"},
                        camino: '[{"latitud":28.723109102552225,"longitud":-17.830810546875},{"latitud":28.69902011148479,"longitud":-17.848663330078125},{"latitud":28.66890107414433,"longitud":-17.85003662109375},{"latitud":28.64479960910591,"longitud":-17.85003662109375},{"latitud":28.619487109380707,"longitud":-17.856903076171875},{"latitud":28.613459424004418,"longitud":-17.8692626953125},{"latitud":28.60622574490014,"longitud":-17.88848876953125}]',
                        dificultad: "facil",
                        puntuacion: 7,
                        _creator: usuario_prueba1._id
                    });
                    //Guardamos tabla en BD
                    mapa1.save(function(err)
                    {
                       if(err) return console.error(err); 
                       //console.log(`Saved: ${mapa1}`);
                    }).then(()=>{
                        Mapa
                        .findOne({ nombre: "Los Tilos", dificultad: "facil", puntuacion: 7, descripcion: "Bonito sendero", camino: '[{"latitud":28.723109102552225,"longitud":-17.830810546875},{"latitud":28.69902011148479,"longitud":-17.848663330078125},{"latitud":28.66890107414433,"longitud":-17.85003662109375},{"latitud":28.64479960910591,"longitud":-17.85003662109375},{"latitud":28.619487109380707,"longitud":-17.856903076171875},{"latitud":28.613459424004418,"longitud":-17.8692626953125},{"latitud":28.60622574490014,"longitud":-17.88848876953125}]'})
                        .populate('_creator')
                        .exec(function(err,mapa){
                            if(err) return console.error(err);
                            //console.log('Propietario del mapa: %s',mapa._creator);
                        }).then( () => {

                        });
                    });
                });
                //--------------------------------------------------------------------------
                let usuario_prueba2 = new User(
               {
                   local: {
                        username: "Nayra",
                        password: "y"
                   },
                   facebook:{}
               });
               usuario_prueba2.save(function(err)
               {
                    if(err) return console.error(err);
                    //console.log(`Saved: ${usuario_prueba2}`);
                    //Ejemplos por defecto
                    let mapa2 = new Mapa(
                    {
                        nombre: "La Caldera",
                        descripcion: "Bonito sendero",
                        camino: '[{"latitud":28.713205302552225,"longitud":-17.80810546875},{"latitud":28.69902011148479,"longitud":-17.848663330078125},{"latitud":28.66890107414433,"longitud":-17.85003662109375},{"latitud":28.64479960910591,"longitud":-17.85003662109375},{"latitud":28.619487109380707,"longitud":-17.856903076171875},{"latitud":28.613459424004418,"longitud":-17.8692626953125},{"latitud":28.60622574490014,"longitud":-17.88848876953125}]',
                        dificultad: "media",
                        puntuacion: 9,
                        _creator: usuario_prueba2._id
                    });
                    //Guardamos tabla en BD
                    mapa2.save(function(err)
                    {
                       if(err) return console.error(err); 
                       //console.log(`Saved: ${mapa2}`);
                    }).then(()=>{
                        Mapa
                        .findOne({ nombre: "La Caldera", dificultad: "media", puntuacion: 9, descripcion: "Bonito sendero", camino: '[{"latitud":28.713205302552225,"longitud":-17.80810546875},{"latitud":28.69902011148479,"longitud":-17.848663330078125},{"latitud":28.66890107414433,"longitud":-17.85003662109375},{"latitud":28.64479960910591,"longitud":-17.85003662109375},{"latitud":28.619487109380707,"longitud":-17.856903076171875},{"latitud":28.613459424004418,"longitud":-17.8692626953125},{"latitud":28.60622574490014,"longitud":-17.88848876953125}]'})
                        .populate('_creator')
                        .exec(function(err,mapa){
                            if(err) return console.error(err);
                            //console.log('Propietario del mapa: %s',mapa._creator);
                        }).then( () => {

                        });
                    });
                });
                //--------------------------------------------------------------------------
            });
        });
    
    module.exports = { UserSchema: UserSchema, Mapa: Mapa};
