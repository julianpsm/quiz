//Definición del modelo de datos Comment con validación para campos vacíos.
module.exports=function (sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
		{texto: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "--> Falta comentario"}}
		}
	}
	);
}