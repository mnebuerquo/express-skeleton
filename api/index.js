var fs = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var tokensIssuer = require('../includes/token');
var tokens; // global to use inside callbacks
var passport = require('passport');
var unless = require('express-unless');

function ensureAuthenticated(req,res,next){
	if( req.isAuthenticated() ){
		return next();
	} else {
		var output = {
			error: {
				name: 'Not Authenticated',
				status: 401,
				message: 'Valid authentication token required',
				text: 'Not Authenticated',
			}
		};
		res.status(401).json(output);
	}
}

function handleError(err,req,res,next){
	var output = {
		error: {
			name: err.name,
			message: err.message,
			text: err.toString()
		}
	};
	var statusCode = err.status || 500;
	res.status(statusCode).json(output);
}

function onApiLogin(req, res) {
	// req.user is the user record
	var response = {};
	if( req.user && req.user._id ){
		//do something with the user id, construct jwt, etc.
		var timestamp = new Date();
		var currentTime = timestamp.getTime();
		var payload = { 
			"userId": req.user._id, 
			"timestamp": currentTime
	   	};
		response.access_token = tokens.issueToken(payload);
		res.status(200).json(response);
	} else {
		response.error={
			status:401,
			message:'Login failed'
		};
		res.status(401).json(response);
	}
}

module.exports = function(app,config) {

	// this is filling in a global to store the token generator
	tokens = tokensIssuer(config);

	// api is a router for all api routes (except the api/auth routes)
	var api = express.Router();

	// api routes require specific middleware
	api.use( [
			cors(),
			passport.authenticate('token-bearer', { session: false }),
			ensureAuthenticated,
			handleError
			] );

	// api routes other than auth are loaded automatically
	fs.readdirSync(__dirname).forEach(function(filename) {
		// We probably don't want names starting with .
		// We want the name to end with .js
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		if( filename !== 'index.js' && '.js'===ext ){
			require('./' + name)(api,config);
		}
	});

	// auth routes have a separate router to enable different middleware
	var auth = express.Router();
	// auth options
	var apioptions = { 
		failureFlash : false, 
		session: false,
	};

	// they require different middleware
	auth.use( [
			cors(),
			handleError
			] );

	//and now the auth routes
	//TODO: load additional auth routes from a dir named auth
	auth.post('/local/login',
		passport.authenticate('local-login', apioptions ),
		onApiLogin
	);

    auth.post('/local/signup', 
		passport.authenticate('local-signup', apioptions ),
		onApiLogin
	);

	app.use('/api/auth',auth);
	app.use('/api',api);
};
