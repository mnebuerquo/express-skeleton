var tokensIssuer = require('includes/token');
var tokens; // global to use inside callbacks
var requireLogin = require('includes/require-login');

module.exports = function(app,config) {

	// Use this middleware for all routes here
	// This requires login for all routes in this module
	app.use(requireLogin);

	// construct the tokens validator using the config
	tokens = tokensIssuer(config);

	app.post('/token-verify', function(req, res) {
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

	app.get('/token-verify', function(req, res) {
		// figure out token from post arg
		// verify/decode token using public key
		// send payload as output
		var token = req.headers.authorization;
		token = token.replace('Bearer ','');
		var payload = tokens.verifyToken(token);
		var output = {
			"payload": payload
		};
		res.json(output);
	});

	app.get('/user', requireLogin, function(req,res){
		var user = req.user;
		if( user.local && user.local.password ){
			user.local.password='x';
		}
		return res.status(200).json(user);
	});

};
