var fs = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var tokensIssuer = require('../includes/token');
var tokens; // global to use inside callbacks
var unless = require('express-unless');

// Middleware
var bearerAuth = require('./middleware/bearer-auth');

// Middleware error handler for json response
function handleError(err,req,res,next){
	var output = {
		error: {
			name: err.name,
			message: err.message,
			text: err.toString()
		}
	};
	if('TokenExpiredError'===err.name){
		err.status = 401;
	}
	var statusCode = err.status || 500;
	res.status(statusCode).json(output);
}

// Callback for passport.authenticate routes
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

// recurse and use directories
function recursiveRoute(dir, parentRoute, config){
	fs.readdirSync(dir).forEach(function(filename) {
		var fullname = dir+'/'+filename;
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		var pathRoute = express.Router();
		console.log(dir+'/'+name);
		//TODO: set base require dir at each level when requring
		if(fs.lstatSync(fullname).isDirectory()){
			//recurse
			recursiveRoute(fullname,pathRoute,config);
		} else {
			//require filename
			require(dir+'/'+ name)(pathRoute,config,dir);
		}
		parentRoute.use('/'+name,pathRoute);
	});
}

module.exports = function(app,config) {

	// this is filling in a global to store the token generator
	tokens = tokensIssuer(config);

	// api is a router for all api routes (except the api/auth routes)
	var api = express.Router();

	// API routes require specific middleware.
	// ensureAuthenticated was once specified here, but now that is the
	// responsibility of individual routes. Some routes may be open,
	// some may require authentication.
	api.use( [
			cors(),
			bearerAuth,
			] );

	// load all api routes
	recursiveRoute(__dirname+'/routes',api,config);

	// error handling middleware last
	api.use( [
			handleError
			] );

	// auth routes have a separate router to enable different middleware
	var auth = express.Router();

	// they require different middleware
	auth.use( [
			cors(),
			] );

	// api auth options
	// TODO: move this to a shared location, same code is in middleware/bearer-auth.js
	var apioptions = { 
		failureFlash : false, 
		session: false,
		failWithError: true, // passport normally wants to send its own 401, but it's not json
	};
	//and now the auth routes
	fs.readdirSync(__dirname+'/auth').forEach(function(filename) {
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		if( filename !== 'index.js' && '.js'===ext ){
			require('./auth/' + name)(auth,config,onApiLogin,apioptions);
		}
	});

	// error handling middleware last
	auth.use( [
			handleError
			] );

	app.use('/api/auth',auth);
	app.use('/api',api);
};
