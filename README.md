# Proyecto 

## Desarrollo de Sistemas Informáticos

En este proyecto se ha desarrollado una aplicación para almacenar y compartir senderos de la isla de La Palma. 
La aplicación permite compartir tus propios senderos, almacenándolos con tu cuenta de usuario. 
Cada usuario puede marcar los distintos puntos que conforman su ruta o sendero, sobre el mismo mapa de la isla, para posteriormente compartirlo.

--------

## Despliegue


--------

## Herramientas utilizadas

### API de Google Maps

Herramienta ofrecida por Google para desarrolladores que permite la comunicación con los servicios de Google y su integración con otros servicios. 
En este proyecto la API ha sido utilizada para almacenar las rutas y senderos que el usuario ha marcado sobre el propio mapa, en este caso de la isla de la Palma.
Por otro lado, también se hace un volcado de los senderos que tiene cada usuario para su posterior visita.

### NodeJS

Node.js es un entorno en tiempo de ejecución multiplataforma, de código abierto, para la capa del servidor basado en el lenguaje de programación ECMAScript, asíncrono, con I/O de datos en una arquitectura orientada a eventos y basado en el motor V8 de Google.

### Express

Express es una infraestructura de aplicaciones web Node.js mínima y flexible que proporciona un conjunto sólido de características para las aplicaciones web y móviles.

### ECMA 6

* Funciones de dirección. Sintaxis más corta en comparación con las expresiones de función.
* Plantillas literales de strings que permiten expresiones incrustadas.
* Se pueden utilizar cadenas multilínea e interpolación de cadenas con cadenas de la plantilla.
* Diferencia entre let y var.
Cuando let se utiliza dentro de un bloque, el alcance de los límites de la variable para ese bloque. El alcance de var está dentro de la función en la que se declara.

`let name = "Bob", time = "today";`

`Hello ${name}, how are you ${time}?`

### MongoDB

`$ mkdir data`

`$ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod`

`$ chmod a+x mongod`

* Mongoose
* Populations

### SASS

Sass es una extensión de CSS que añade potencia y elegancia al lenguaje básico de CSS. 
Se permite el uso de variables, reglas anidadas, mixins, importaciones en línea, etc. 
Todo con una sintaxis totalmente compatible con CSS. Sass ayuda a mantener hojas de estilo bien organizadas.

En este proyecto se ha aplicado esta herramienta en el archivo: style.sass

### Gulp

Sistema que permite automatizar tareas de desarrollo. Permite administrar y controlar todas las tareas desde un mismo lugar.

### Browser-sync

Herramienta que permite a los desarrolladores mantener su navegador web actualizado mientras realiza cambios en la configuración en diferentes ordenadores o sistemas operativos.

[Más información](https://www.browsersync.io/)

### Expresiones regulares

En este proyecto se han utilizado expresiones regulares para el filtro de búsqueda.
El usuario podrá especificar la dificultad y alguna palabra clave con la desee realizar la búsqueda.

### Passport

Passport es un middleware de autenticación para Node.js. 
Es extremadamente flexible y modular, se puede utilizar en cualquier aplicación web basada en Express. 
Un conjunto completo de autenticación de apoyo utilizando un nombre de usuario y contraseña, Facebook, Twitter, y más.

En este proyecto se ha utilizado la dependencia "passport local" para garantizar un proceso de autenticación local.

[Más información](http://passportjs.org/)

--------

### ENLACES DE INTERÉS:
### Enlace al campus de la asignatura

* [Desarrollo de Sistemas Informáticos](https://campusvirtual.ull.es/my/)


### Repositorios en github.io

* [Repositorio de la práctica en la organización](https://github.com/ULL-ESIT-GRADOII-DSI/proyecto-final-Josue-Nayra)
* [Fork del repositorio](https://github.com/alu0100406122/proyecto-final-Josue-Nayra)


### Despliegue de la práctica

* [Cloud 9]()
* [Workspace]()

--------

### AUTORES: 
### Páginas personales de gh-pages:

* [Josué Toledo Castro](http://josuetc94.github.io/)
* [María Nayra Rodríguez Pérez](http://alu0100406122.github.io/)