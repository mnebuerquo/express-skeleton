var jwt = require('jsonwebtoken');
var fs = require('fs');

var options = {};
var privateKey = null;
var publicKey = privateKey ;

var methods = {
	issueToken: function issueToken(payload){
		var myoptions = options;
		return jwt.sign(payload, privateKey, myoptions);
	},

	verifyToken: function verifyToken(token){
		var myoptions = options;
		return jwt.verify(token, publicKey, myoptions);
	}
};

function configure(config){
	// Figure out the configuration outside of the route handlers
	options.expiresIn = (config.token.expiresIn || '1d');
	//options.algorithms = ['RS256','RS384','RS512'];

	// Keys are a public and private key
	if(config.token.keys){
		privateKey = fs.readFileSync(__dirname+'/../'+config.token.keys.privateKey);
		publicKey = fs.readFileSync(__dirname+'/../'+config.token.keys.publicKey);
	}
	// If we don't have a key pair, we just use a secret
	if( !(privateKey && publicKey) ){
		privateKey = config.token.secret || 
			"this key is not secure! aslefaifabagiaopbgaepoijfaoeiabagaze";
		publicKey = privateKey;
	}
	if( privateKey != publicKey ){
		// ensure we're using rsa if we have key pair
		options.algorithm = 'RS512';
	}
	// Return the functions to issue and verify
	return methods;
}

module.exports = configure;
