var express = require('express');
var exphbs = require('express-handlebars');

function use(app, config) {
	var options = {
		defaultLayout: 'single',
		extname: '.hbs'
	};
	app.set('views', __dirname + '/../views');
	app.engine('.hbs', exphbs(options));
	app.set('view engine', '.hbs');
}

module.exports = use;
