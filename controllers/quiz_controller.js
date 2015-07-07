var models = require('../models/models.js');

//Autoload, factoriza el código si la ruta incluye :quizId
exports.load=function(req,res,next,quizId){
	models.Quiz.find(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz=quiz;
				next();
			}else
			{next (new Error ('No existe quizId= ' + quizId));}
		}
	).catch (function(error) { next(error);});
};


//GET /quizes búsqueda de preguntas
//El patrón buscado es reemplazado por %, siendo insensible a mayúsculas 

exports.index = function( req, res){

	if(req.query.search){
		var search = '%' + req.query.search.replace(/\s/gi, "%") + '%';
	} else {var search = '%'};
	
	models.Quiz.findAll({where: ["upper(pregunta) like upper(?)", search], order: 'pregunta ASC'}).then(function(quizes) {
		res.render('quizes/index', {quizes: quizes});
	}).catch(function(error) {next(error);});
};


//GET /quizes/:id
exports.show = function (req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: req.quiz});	
	});
};

//GET /quizes/:id/answer
exports.answer = function (req,res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});	
};	

//GET /quizes/new
exports.new =function (req, res){
	var quiz=models.Quiz.build( //crea un objeto nuevo quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new', {quiz: quiz});
};

//POST quizes/create
exports.create= function(req, res){
	var quiz=models.Quiz.build(req.body.quiz);
//guarda en la base de datos los campos pregunta y respuesta
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes'); //redirección HTTP (URL relativo) de la lista de preguntas
	})	
};