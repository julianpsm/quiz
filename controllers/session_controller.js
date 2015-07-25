//MW de autorización de accesos HTTP restringidos
exports.loginRequired= function (req, res, next){
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

//GET login -- Formulario del login
exports.new= function(req, res){
	var errors=req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

//POST /login --Crear la sesión
exports.create= function(req, res){
	var login = req.body.login;
	var password = req.body.password;

	var userController= require('./user_controller');
	userController.autenticar(login, password, function (error, user){
		if (error) { //si existe error se retorna mensaje de error de sesión
			req.session.errors= [{"message": 'Se ha producido un error: '+ error}];
			res.redirect("/login");
			return;
		}

		//Crear req.session.user y guardar campos id y username. Se le añade un campo más que captura el tiempo del momento de iniciar la sesión
		//Ese nuevo campo es timeSession
		//La sesión se define por la existencia de: req.session.user
		req.session.user= {id:user.id, username:user.username, timeSession: Date.now()};
		res.redirect(req.session.redir.toString()); //redireccionar a path anterior a login
	});
};

//DELETE /logout --Destruir sesión
exports.destroy= function(req, res){
	delete req.session.user;
	//req.session.timeSession=Date.now()
	res.redirect(req.session.redir.toString()); //redireccionar a path anterior a login
};
