var fs = require('fs');
var path = require('path');
var express = require('express');
var cors = require('cors');
var tokensIssuer = require('../includes/token');
var tokens; // global to use inside callbacks
var passport = require('passport');
var unless = require('express-unless');

// Middleware
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
function recursiveRoute(dir, route, config){
	fs.readdirSync(dir).forEach(function(filename) {
		var fullname = dir+'/'+filename;
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		var pathRoute = express.Router();
		console.log('Processing '+name);
		if(fs.lstatSync(fullname).isDirectory()){
			//recurse
			recursiveRoute(fullname,pathRoute,config);
		} else {
			//require filename
			require('./' + name)(pathRoute,config);
		}
		api.use('/'+name,pathRoute);
	}
}

module.exports = function(app,config) {

	// this is filling in a global to store the token generator
	tokens = tokensIssuer(config);

	// api is a router for all api routes (except the api/auth routes)
	var api = express.Router();

	// api auth options
	var apioptions = { 
		failureFlash : false, 
		session: false,
		failWithError: true, // passport normally wants to send its own 401, but it's not json
	};

	// api routes require specific middleware
	api.use( [
			cors(),
			passport.authenticate('token-bearer', apioptions ),
			ensureAuthenticated,
			] );

	// load all api routes
	recursiveRoute(__dirname+'/routes/',api,config);

   /* // api routes other than auth are loaded automatically*/
	//fs.readdirSync(__dirname).forEach(function(filename) {
		//// We probably don't want names starting with .
		//// We want the name to end with .js
		//var ext = path.extname(filename);
		//var name = path.basename(filename,ext);
		//if( filename !== 'index.js' ){
			//var pathRoute = express.Router();
			//require('./' + name)(pathRoute,config);
			//api.use('/'+pathRoute,pathRoute);
		//}
	/*});*/

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
