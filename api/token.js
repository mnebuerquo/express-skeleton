var tokensIssuer = require('../includes/token');
var tokens; // global to use inside callbacks

module.exports = function(app,config) {

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

	app.get('/user', function(req,res){
		return res.status(200).json(req.user);
	});

};
