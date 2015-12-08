var cors = require('cors');
var tokensIssuer = require('../includes/token');
var passport = require('passport');

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
		console.error(err.stack);
		output = {
			error: {
				name: err.name,
				message: err.message,
				text: err.toString()
			}
		};
		res.status(500).json(output);
}

module.exports = function(app,config) {

	var tokens = tokensIssuer(config);
	var apiRoute = [
			cors(),
			passport.authenticate('token-bearer', { session: false }),
			ensureAuthenticated,
			handleError
		];

	app.post('/api/token-verify', function(req, res) {
		// figure out token from post arg
		// verify/decode token using public key
		// send payload as output
		var token = req.body.access_token;
		var payload = tokens.verifyToken(token);
		var output = {
			"payload": payload
		};
		res.json(output);
	});

	app.get('/api/user/', function(req,res){
		return res.status(200).json(req.user);
	});

	// install api route middleware list
	app.use('/api',apiRoute);

};

