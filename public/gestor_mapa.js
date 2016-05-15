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

const senderosTemplate = `
    <% _.each(senderos, (sendero) => { %>

    <div class='col-md-4 col-sm-6 wow bounceIn' data-wow-duration='1s' data-wow-delay='1s'>
        <a href="#contact" data-target='#portfolio2' class='thumbnail hcaption'>
              <img src='assets/images/portfolio/portfolio2-thumb.jpg' alt='Portfolio' title='Desktop Apps' />
              <p class='senderos'><%= sendero.nombre %></p>
        </a>
    </div>
    <% }); %>
`;


const mostrar_mapa = (datos) =>
{
  console.log("Nombre del mapa a mostrar:"+datos);
  console.log("usuario:"+user_actual);
  $.get('/mostrar_mapa_seleccionado',{ nombre_mapa: datos}, data_respuesta => {
      console.log("Descripcion:"+data_respuesta.descripcion);
      console.log("User:"+data_respuesta.user_propietario);
      console.log("Correo:"+data_respuesta.correo_propietario);
      /*$.each(data_respuesta.camino, function(key, value)
      {
        console.log("Key:"+key+", Value:"+value);
      });*/
      console.log("Camino:"+data_respuesta.camino[0].latitud);
      var origen = data_respuesta.camino[0];
      var destino = data_respuesta.camino[data_respuesta.camino.length-1];
      console.log("Origen:"+origen.latitud+","+origen.longitud);
      console.log("Destino:"+destino.latitud+","+destino.longitud);
      var total_gimy = JSON.parse(data_respuesta.camino[0]);
      console.log("Total_gimy:!¡"+total_gimy[0].latitud);
      $("#publicar").css("display","none");
      $("#mostrar").fadeIn();
      
      console.log("Nombre usuarion wecnwccniowe:"+data_respuesta.nombre_);
      console.log("Apellidos usuario: "+data_respuesta.apellidos_);
      
      $("#usuario_mostrarmapa").html(data_respuesta.user_propietario);
      $("#nombre_mostrarmapa").html(data_respuesta.nombre_);
      $("#apellidos_mostrarmapa").html(data_respuesta.apellidos_);
      $("#email_mostrarmapa").html(data_respuesta.correo_propietario);
      
      $("#latitudo_mostrarmapa").html(total_gimy[0].latitud);
      $("#latitudd_mostrarmapa").html(total_gimy[0].longitud);
      $("#longitudo_mostrarmapa").html(total_gimy[total_gimy.length-1].latitud);
      $("#longitudd_mostrarmapa").html(total_gimy[total_gimy.length-1].longitud);
      
      $("#descripcion_mostrarmapa").html(data_respuesta.descripcion);
      generar_mapa();
      
      clearMarkers();
      markers.length = 0;
      flightPlanCoordinates.length = 0;
      // var pos = new google.maps.LatLng(data_respuesta.camino[0].latitud, data_respuesta.camino[0].longitud);
      // var pos1 = new google.maps.LatLng(data_respuesta.camino[data_respuesta.camino.length-1].latitud, data_respuesta.camino[data_respuesta.camino.length-1].longitud);
      
      $.each(total_gimy, function(key,value)
      {
        var pos = new google.maps.LatLng(value.latitud, value.longitud);
        addMarker(pos,map);
      });
      
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
    console.log("Mapas:"+datos.mapas);
    console.log("Mensaje:"+datos.mensaje_respuesta_peticionsenderos);
    $("#nuestros_senderos").html(_.template(senderosTemplate, {senderos: datos.mapas}));
    
    $('p.senderos').each( (_,y) => {
      $(y).click( () => { mostrar_mapa(`${$(y).text()}`); });
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
      console.log("Datos:"+event.latLng.lat());
      console.log("Datos1:"+event.latLng.lng());
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
  console.log("Location:"+location);
  var marker = new google.maps.Marker({
    position: location,
    label: labels[labelIndex++ % labels.length],
    map: map
  });
  console.log("Marker:"+marker);
  markers.push(marker);
}


$(document).ready(() => {
        
    //Hacemos la lectura del JSON
    //$.get("senderos.json", botones_ejemplos, 'json');
    
    $.get("/mostrar_caminos", mostrando_senderos, 'json');

    $("#generar_mapa").click(function(event)
    {
      event.preventDefault();
      $("#contact").show();
      $("#mostrar").css("display","none");
      $("#publicar").show();
        //initMap(origen,destino);    
        console.log("Generando mapa");
        clearMarkers();
        markers.length = 0;
        flightPlanCoordinates.length = 0;
        generar_mapa();
    });
    
    // $("#nuestros_senderos > a").click(function(event){
    //   event.preventDefault();
    //   console.log("entrando en nuestros_senderos...");
    //   $("#publicar").css("display","none");
    //   $("#mostrar").show();
    // });
    
    $("#subir_imagen").click(function(event)
    {
      event.preventDefault();
    
    });
    
    $("#hacia_mywork").click(function(event)
    {
      event.preventDefault();
      console.log("Entrando en mostrando caminos");
      $.get("/mostrar_caminos", mostrando_senderos, 'json');
    });
    
    $("#guardar_camino").click(function(event)
    {
        event.preventDefault();

        if(user_actual == null)
        {
          console.log("No inicio sesion");
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
          console.log("Nombre_mapa:"+$("#nombre_mapa").val());
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
                console.log("Guardando camino");
                console.log("Camino:"+markers);
                $.each(markers,function(key,value)
                {
                  console.log("Key:"+key+",Value:"+value.position);
                  flightPlanCoordinates.push(value.position);
                });
                generar_linea_sendero(flightPlanCoordinates,map);
                var puntos_sendero = JSON.stringify(puntos_intermedios);
                
                //var caminando_baby = JSON.stringify(markers);
                console.log("User_actual:"+user_actual);
                
                $.get("/nuevo_camino",{usuario: user_actual, nombre_mapa: $("#nombre_mapa").val(), descripcion_mapa: $("#descripcion_mapa").val(), puntos: puntos_sendero}, data_respuesta => {
                    console.log("Data_respuesta:"+data_respuesta);
                    $("#mensaje_aviso_publicar").fadeIn();
                    $("#mensaje_aviso_publicar").html(data_respuesta.mensaje_respuesta_publicar);
                }); 
          }
        }
     });
    
      $('.modal-footer button').click(function(){
      		var button = $(this);
          
          console.log("Nombre:"+$("#uLogin").val());
          console.log("Password:"+$("#uPassword").val());
          $.get("/login",{nombre_usuario: $("#uLogin").val(), password_usuario: $("#uPassword").val()}, data_respuesta => {
                console.log("Data_respuesta:"+data_respuesta);
                console.log("Id del usuario logueado:"+data_respuesta.id_usuario);
                console.log("Mensaje de respuesta:"+data_respuesta.mensaje_respuesta_login);
                user_actual = data_respuesta.id_usuario;
                //Rellenamos inputs
                $("#email").val(data_respuesta.email);
                $("#autor_mapa").val(data_respuesta.autor);
                
              if ( button.attr("data-dismiss") != "modal" ){
          			var inputs = $('form input');
          			var title = $('.modal-title');
          			var progress = $('.progress');
          			var progressBar = $('.progress-bar');
          
          			inputs.attr("disabled", "disabled");
          
          			button.hide();
          
          			progress.show();
          
          			progressBar.animate({width : "100%"}, 100);
          
          			progress.delay(1000)
          					.fadeOut(600);
          
          			button.text("Close")
          					.removeClass("btn-primary")
          					.addClass("btn-success")
              				.blur()
          					.delay(1600)
          					.fadeIn(function(){
          						title.text(data_respuesta.mensaje_respuesta_login);
          						button.attr("data-dismiss", "modal");
          					});
          		}
            
          });
      	
      	});

      $('#myModal').on('hidden.bs.modal', function (e) {
      		var inputs = $('form input');
      		var title = $('.modal-title');
      		var progressBar = $('.progress-bar');
      		var button = $('.modal-footer button');
      
      		inputs.removeAttr("disabled");
      
      		title.text("Inicio de sesion");
      
      		progressBar.css({ "width" : "0%" });
      
      		button.removeClass("btn-success")
      				.addClass("btn-primary")
      				.text("Ok")
      				.removeAttr("data-dismiss");
                      
      });
});

})();

