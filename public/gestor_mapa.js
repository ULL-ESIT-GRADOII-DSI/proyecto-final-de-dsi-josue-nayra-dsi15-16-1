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

function generar_mapa()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 28.678373, lng: -17.850015},
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
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

$(document).ready(() => {
        
    //Hacemos la lectura del JSON
    //$.get("senderos.json", botones_ejemplos, 'json');
    $("#generar_mapa").click(function()
    {
        //initMap(origen,destino);    
        console.log("Generando mapa");
        generar_mapa();
    });
       
    $("#mostrar_camino").click(function()
    {
        console.log("Mostrando camino");
        /*console.log("Camino:"+markers);
        $.each(markers,function(key,value)
        {
          console.log("Key:"+key+",Value:"+value.position);
          flightPlanCoordinates.push(value.position);
        });
        generar_linea_sendero(flightPlanCoordinates,map);*/
     });
     $("#guardar_camino").click(function(event)
     {
        console.log("Guardando camino");
        event.preventDefault();
        /*$.get("/nuevo_camino",{usuario: "Josue", puntos: JSON.stringify(puntos_intermedios)}, data_respuesta => {
            console.log("Data_respuesta:"+data_respuesta);
        });*/
     });
        
        
       // Búsqueda de usuarios
       $("#buscar_usuario").click( (event) => {
          event.preventDefault();
          $.get('/buscar/'+$("#nombre_usuario").val(),
            { usuario: $("nombre_usuario").val()},
            botones_ejemplos,
            'json'
          );
        });
    });
    
//--------------------------------------------------------------------------------------------    
    
    $('.modal-footer button').click(function(){
		var button = $(this);

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
						title.text("Log in is successful");
						button.attr("data-dismiss", "modal");
					});
		}
	});

	$('#myModal').on('hidden.bs.modal', function (e) {
		var inputs = $('form input');
		var title = $('.modal-title');
		var progressBar = $('.progress-bar');
		var button = $('.modal-footer button');

		inputs.removeAttr("disabled");

		title.text("Log in");

		progressBar.css({ "width" : "0%" });

		button.removeClass("btn-success")
				.addClass("btn-primary")
				.text("Ok")
				.removeAttr("data-dismiss");
                
	});
    
//--------------------------------------------------------------------------------------------    

})();

