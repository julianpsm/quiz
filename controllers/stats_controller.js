var models=require('../models/models.js');

//GET /quizes/stats

exports.show=function(req,res){
	models.Quiz.findAll({include:
		[{model:models.Comment}]})
	.then(function(quest){
		models.Comment.count().then(function(comentarios){
			var num_quest = quest.length;
			var avg_comentarios = (comentarios/num_quest).toFixed(2);
			var questConComentarios=0;
			for (i = 0; i < num_quest; i++) {
				if(quest[i].Comments.length>0){
					questConComentarios++;
				}
			};
			var questSinComentarios=num_quest - questConComentarios;
			res.render('stats.ejs', 
				{num_quest:num_quest,
				comentarios:comentarios,
				avg_comentarios:avg_comentarios,
				questConComentarios:questConComentarios,
				questSinComentarios:questSinComentarios,
				errors:[]});
		});
	});
};	