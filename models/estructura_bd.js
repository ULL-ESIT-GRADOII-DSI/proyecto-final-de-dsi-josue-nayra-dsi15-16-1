    "use strict";
    console.log("Configurando MongoDB...");
    //Conexión con MongoDB
    const util = require('util');
    const mongoose = require('mongoose');
    
    mongoose.connect('mongodb://localhost/Practica10');
    
    const Schema = mongoose.Schema;
    
    const UserSchema = new Schema({
        nombre: String,
        apellidos: String,
        correo_electronico: String,
        username: String
    });

    const MapaSchema = new Schema({
        nombre: String,
        descripcion: String,
        //origen: {Latitud: String, Longitud: String},
        //destino: {Latitud: String, Longitud: String},
        camino: Array,
        _creator: [{type: Schema.Types.ObjectId, ref: "User"}]
    });

    /*const PuntoSchema = new Schema({
        latitud: String,
        longitud: String,
        _mapa: [{type: Schema.Types.ObjectId, ref: "Mapa"}] 
    });*/
    
    const User = mongoose.model("User", UserSchema);
    const Mapa = mongoose.model("Mapa",MapaSchema);
    //const Punto = mongoose.model("Punto",PuntoSchema);
    
    User.remove({}).then(() => {
        Mapa.remove({}).then(() => {
               //Usuario Josue de Prueba
               console.log("Usuario Josue de prueba");
               let usuario_prueba1 = new User(
               {
                    nombre: "Josue",
                    apellidos: "Toledo Castro",
                    correo_electronico: "alu0100763492@ull.edu.es",
                    username: "JosueTC94"
               });
               usuario_prueba1.save(function(err)
               {
                    if(err) return console.log(err);
                    console.log(`Saved: ${usuario_prueba1}`);
                    //Ejemplos por defecto
                    let mapa1 = new Mapa(
                    {
                        nombre: "Los Tilos",
                        descripcion: "Bonito sendero",
                        //origen: {Latitud: "17.123445", Longitud: "80.1233445"},
                        //destino: {Latitud: "17.123445", Longitud: "80.1233445"},
                        camino: [{"latitud":28.723109102552225,"longitud":-17.830810546875},{"latitud":28.69902011148479,"longitud":-17.848663330078125},{"latitud":28.66890107414433,"longitud":-17.85003662109375},{"latitud":28.64479960910591,"longitud":-17.85003662109375},{"latitud":28.619487109380707,"longitud":-17.856903076171875},{"latitud":28.613459424004418,"longitud":-17.8692626953125},{"latitud":28.60622574490014,"longitud":-17.88848876953125}],
                        _creator: usuario_prueba1._id
                    });
                    //Guardamos tabla en BD
                    mapa1.save(function(err)
                    {
                       if(err) return console.log(err); 
                       console.log(`Saved: ${mapa1}`);
                    }).then(()=>{
                        Mapa
                        .findOne({ nombre: "Los Tilos", descripcion: "Bonito sendero"})
                        .populate('_creator')
                        .exec(function(err,mapa){
                            if(err) return console.log(err);
                            console.log('Propietario del mapa: %s',mapa._creator);
                        }).then( () => {

                        });
                    });
                });
            });
        });
    
    module.exports = { User: User, Mapa: Mapa};
