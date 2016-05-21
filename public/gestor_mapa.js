// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

var map;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
var markers = [];
var flightPlanCoordinates = [];
var flightPath;
var puntos_intermedios = [];
var user_actual;
var boton_dificultad;

const senderosTemplate = `
    <% _.each(senderos, (sendero) => { %>

    <div class='col-md-4 col-sm-6 wow bounceIn' data-wow-duration='1s' data-wow-delay='1s'>
              <img src='assets/images/caminante.jpg' alt='Portfolio' title='Desktop Apps' />
              <a href="#contact"><p class='senderos'><%= sendero.nombre %></p></a>
    </div>
    <% }); %>
`;


const mostrar_mapa = (datos) =>
{
  $.get('/mostrar_mapa_seleccionado',{ nombre_mapa: datos}, data_respuesta => {
      var puntos = JSON.parse(data_respuesta.camino[0]);
      
      $("#guardar_camino").css("display","none");
      $("#publicar").css("display","none");
      $("#mostrar").fadeIn();
      
      $("#usuario_mostrarmapa").html(data_respuesta.user_propietario);
      $("#titulo_mapa").html(datos);
      $("#latitudo_mostrarmapa").html("Lat: "+puntos[0].latitud);
      $("#latitudd_mostrarmapa").html("Lat: "+puntos[0].longitud);
      $("#longitudo_mostrarmapa").html("Long: "+puntos[puntos.length-1].latitud);
      $("#longitudd_mostrarmapa").html("Long: "+puntos[puntos.length-1].longitud);
      $("#dificultad_mostrarmapa").html(data_respuesta.dificultad);
      $("#puntuacion_mostrarmapa").html(data_respuesta.puntuacion);
      $("#descripcion_mostrarmapa").html(data_respuesta.descripcion);
      generar_mapa();
      
      //Limpiar marcadores y polyline
      clearMarkers();
      markers.length = 0;
      flightPlanCoordinates.length = 0;
      // var pos = new google.maps.LatLng(data_respuesta.camino[0].latitud, data_respuesta.camino[0].longitud);
      // var pos1 = new google.maps.LatLng(data_respuesta.camino[data_respuesta.camino.length-1].latitud, data_respuesta.camino[data_respuesta.camino.length-1].longitud);
      
      $.each(puntos, function(key,value)
      {
        var pos = new google.maps.LatLng(value.latitud, value.longitud);
        addMarker(pos,map);
      });
      
      // polyline (array)
      flightPlanCoordinates.length = 0;
      
      $.each(markers, function(key,value)
      {
          flightPlanCoordinates.push(value.position);
      });
      
      generar_linea_sendero(flightPlanCoordinates,map);
      // setMapOnAll(map);
      /*var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title:"Esto es un marcador",
            animation: google.maps.Animation.DROP
      }); 
      
      var marker1 = new google.maps.Marker({
            position: pos1,
            map: map,
            title:"Esto es un marcador",
            animation: google.maps.Animation.DROP
      }); */


  });
}

const mostrando_senderos = (datos) => 
{
    //console.log("Mapas:"+datos.mapas);
    //console.log("Mensaje:"+datos.mensaje_respuesta_peticionsenderos);
    if(datos.mensaje_respuesta_peticionsenderos == "No se han encontrado senderos")
    {
      $("#respuesta_mostrandosenderos").fadeIn();
      $("#respuesta_mostrandosenderos").html(datos.mensaje_respuesta_peticionsenderos);  
    }
    
    $("#nuestros_senderos").html(_.template(senderosTemplate, {senderos: datos.mapas}));

    $('p.senderos').each( (_,y) => {
      $(y).click( () => { 
        $("#contact").show();
        $("#publicar").css("display","none");
        $("#mostrar").show();
        mostrar_mapa(`${$(y).text()}`); });
    });
}

function generar_mapa()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.678373, lng: -17.850015},
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControl: false
  });
  clearMarkers();
  markers.length = 0;
  flightPlanCoordinates.length = 0;
  google.maps.event.addListener(map, 'click', function(event)
  {
      //console.log("Datos:"+event.latLng.lat());
      //console.log("Datos1:"+event.latLng.lng());
      var aux = new Object();
      aux["latitud"] = event.latLng.lat();
      aux["longitud"] = event.latLng.lng();
      puntos_intermedios.push(aux);
      addMarker(event.latLng, map);
  });

}


function generar_linea_sendero(coordenadas, map)
{
  var flightPath = new google.maps.Polyline({
    path: coordenadas,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
  //clearMarkers();
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

  // Adds a marker to the map.
function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  //console.log("Location:"+location);
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
  //console.log("Marker:"+marker);
  markers.push(marker);
}


$(document).ready(() => {
        
    //Hacemos la lectura del JSON
    //Fichero geoJSON 
    
    generar_mapa();
    
    $.get("/mostrar_caminos", mostrando_senderos, 'json');

    $("#generar_mapa").click(function(event)
    {
      event.preventDefault();
      $("#guardar_camino").fadeIn();
      $("#contact").show();
      $("#mostrar").css("display","none");
      $("#publicar").show();
        //initMap(origen,destino);    
        //console.log("Generando mapa");
        clearMarkers();
        markers.length = 0;
        flightPlanCoordinates.length = 0;
        //console.log("Fly:"+flightPlanCoordinates);
        puntos_intermedios.length = 0;
        generar_mapa();
    });
    
    $("#hacia_mywork").click(function(event)
    {
      event.preventDefault();
      //console.log("Entrando en mostrando caminos");
      $.get("/mostrar_caminos", mostrando_senderos, 'json');
    });
    
    $("#guardar_camino").click(function(event)
    {
        event.preventDefault();
        
        if(user_actual == null)
        {
          //console.log("No inicio sesion");
          //Login con el foco
          $("#mensaje_aviso_publicar").fadeIn();
          $("#mensaje_aviso_publicar").html("Debes iniciar sesión antes de guardar un nuevo sendero");
          $("#guardar_camino").focusout(function()
          {
              //$("#mensaje_aviso_publicar").css("display","none");
              $("#mensaje_aviso_publicar").fadeOut();
          });
        }
        else
        {
          //console.log("Nombre_mapa:"+$("#nombre_mapa").val());
          if(!$("#nombre_mapa").val())
          {
            $("#mensaje_aviso_publicar").fadeIn();
            $("#mensaje_aviso_publicar").html("El sendero debe tener un nombre");
            $("#nombre_mapa").css("border-color","red");
            $("#nombre_mapa").focusout(function()
            {
                $("#mensaje_aviso_publicar").fadeOut();
                $("#nombre_mapa").css("border-color", "white");
            });
          }
          else
          {
                //console.log("Guardando camino");
                //console.log("Camino:"+markers);
                $.each(markers,function(key,value)
                {
                  //console.log("Key:"+key+",Value:"+value.position);
                  flightPlanCoordinates.push(value.position);
                });
                generar_linea_sendero(flightPlanCoordinates,map);
                var puntos_sendero = JSON.stringify(puntos_intermedios);
                
                //var caminando_baby = JSON.stringify(markers);
                //console.log("User_actual:"+user_actual);
                
                $.get("/nuevo_camino",{usuario: user_actual, dificultad: ($("#dificultad_nuevomapa").val()).toLowerCase(), puntuacion: $("#puntuacion_nuevomapa").val(),nombre_mapa: $("#nombre_mapa").val(), descripcion_mapa: $("#descripcion_mapa").val(), puntos: puntos_sendero}, data_respuesta => {
                    //console.log("Data_respuesta:"+data_respuesta.mensaje_respuesta_publicar);
                    $("#mensaje_aviso_publicar").fadeIn();
                    $("#mensaje_aviso_publicar").html(data_respuesta.mensaje_respuesta_publicar);
                }); 
          }
        }
     });


      // --------------------------------------LOGIN---------------------------------------------    
      $("#login_cabecera").click(function()
      {
        $("#login .modal-footer > button").fadeIn();  
      });
      
      $('#login .modal-footer button').click(function(event){
        event.preventDefault();
      		var button = $(this);
          
          //console.log("Nombre:"+$("#uLogin").val());
          //console.log("Password:"+$("#uPassword").val());
          $.post("/login",{email: $("#uLogin").val(), password: $("#uPassword").val()}, data_respuesta => {
                //console.log("Data_respuesta:"+data_respuesta.message);
                $("#login #myModalLabel").html(data_respuesta.message);
                
                user_actual = data_respuesta.id_usuario;
                //Rellenamos inputs
                $("#autor_mapa").val(data_respuesta.email);
                
                if(data_respuesta.message == "Usuario correcto")
                {
                    $("#login .modal-footer > button").fadeOut();
                }
          });
      	});
      
      
      //--------------------------------REGISTER-----------------------------------
      $("#registro_cabecera").click(function(event)
      {
        event.preventDefault();
        $("#registro .modal-footer > button").fadeIn();
      });
      
      $('#registro .modal-footer').click(function(event){
              event.preventDefault();
              //console.log("Registro");
            		var button = $(this);
                
                //console.log("Nombre:"+$("#uRegister").val());
                //console.log("Password:"+$("#uRegisterPassword").val());
                $.post("/signup",{email: $("#uRegister").val(), password: $("#uRegisterPassword").val()}, data_respuesta => {
                      //console.log("Data_respuesta:"+data_respuesta.message);
                      //console.log("Autor del mapa:"+data_respuesta.email);
                      $("#registro #myModalLabel").html(data_respuesta.message);
                      
                      user_actual = data_respuesta.id_usuario;
                      //Rellenamos inputs
                      $("#autor_mapa").val(data_respuesta.email);
                      
                      if(data_respuesta.message == "Usuario registrado")
                      {
                          $("#registro .modal-footer > button").fadeOut();
                      }
                  
                });
            	});
      
            
      $("#aplicar_filtro").click(function()
      {
          $("#aplicar_filtro").hide();
          setTimeout(function()
          {
            $("#seccion_filtro").fadeIn();
          },
          450);
      });
      
      // Formulario de búsqueda
      $(".btn-group > button").click(function(event){
          event.preventDefault();
          //console.log("Group button clicked:"+$(this).val());
          boton_dificultad = $(this).val();
          $(this).addClass("active").siblings().removeClass("active");
      });
      
      $("#filtrar").click(function(event)
      {
        event.preventDefault();
        $("#respuesta_mostrandosenderos").fadeOut();  
        
        if(boton_dificultad == null)
        {
            ////console.log("Sin dificultad");
            $.get("/filtrar", { filtro: $("#filtro").val() }, mostrando_senderos, 'json'); 
            boton_dificultad = null;
        }
        else
        {
            ////console.log("Con dificultad");
            //console.log("Dificultad yeah baby:"+boton_dificultad);
            $.get("/filtrar", { filtro: $("#filtro").val(), dificultad: boton_dificultad }, mostrando_senderos, 'json');
            boton_dificultad = null;
        }
        $(".btn-group > button").removeClass("active");
        $("#filtro").val(" ");
      });
});

})();

