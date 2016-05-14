(() => {
"use strict";
// Importamos el modulo para subir ficheros
var fs = require('fs');

const Uploads = function(req, res) {
    console.log("Req.files:"+req.files);
    console.log("Req.archivo:"+req.archivo);
    var tmp_path = req.files.photo.path;
    // Ruta donde colocaremos las imagenes
    var target_path = './public/Imagenes/' + req.files.photo.name;
   // Comprobamos que el fichero es de tipo imagen
    if (req.files.photo.type.indexOf('image')==-1){
                console.log("El fichero que acabas de subir no es una imagen");
                //res.send('El fichero que deseas subir no es una imagen');
    } else {
         // Movemos el fichero temporal tmp_path al directorio que hemos elegido en target_path
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // Eliminamos el fichero temporal
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                //res.render('upload',{message: '/Imagenes/' + req.files.photo.name, mensaje_respuesta_subidaimagen: 'Subido con exito'});
            });
         });
     }
};
module.exports = Uploads;
})();