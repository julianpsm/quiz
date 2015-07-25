var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride =require('method-override');
var session=require('express-session');//importar el paquete express-session

var routes = require('./routes/index');


var app = express(); //se crea aplicación

// view engine setup, instala generador de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());


//instala los middlewares a utilizar en la aplicación
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('Quiz 2015'));
app.use(session()); //Instalamos el MW session
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//solución al P2P del módulo 9
app.use(function(req, res, next){
	var inactivo= 30000;
	//Se comprueba si existe sesión 
	if (req.session.user) {
		// si existe hay que comprobar si ha caducado por tiempo de inactividad
		if (Date.now()- req.session.timeSession > inactivo) {
			// si se cumple la condición,se ha sobrepasado tiempo de inactividad 
			//hace autologout de forma automática
			delete req.session.user;
			req.session.timeSession = Date.now();
		} else {
			//no se ha soprepasado tiempo de inactividad, ha habido interacción con el sistema
			// y es necesario reinicializar la variable de toma de tiempos de la sesión
			req.session.timeSession = Date.now();
		}
	}
	// si no hay una sesión en marcha no se hace nada
	next();
});

//Helpers dinámicos:
app.use(function(req, res, next){
    //guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir= req.path;
    }
    //hacer visible req.session en las vistas
    res.locals.session=req.session;
    next();
});

// instalar enrutadores y asociar rutas a su manejadores o gestores
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


//exportar app para comando de arranque
module.exports = app;
