var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');

function use(app, config) {
	// static files served by express. use s3 or cdn for this.
	app.use(express.static(__dirname + '../static'));
	// favicon 
	var iconfile = (config.app.favicon || 'favicon.ico').replace(/$\//g,'');
	var iconpath = __dirname+'/../';
	app.use(favicon(iconpath+iconfile));
	// morgan for logging requests
	app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
	// cookie parser used for session cookie
	app.use(cookieParser());
	// body parser used for post body containing json
	// for regular forms in addition to json, we may need to only use this on certain routes
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:false}));
}

module.exports = use;
