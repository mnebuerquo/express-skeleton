var jwt = require('jsonwebtoken');
var fs = require('fs');
var colors = require('colors/safe');

var options = null; 
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
	if( !options ){
		options = {};
		// Figure out the configuration outside of the route handlers
		options.expiresIn = (config.token.expiresIn || '1d');
		//options.algorithms = ['RS256','RS384','RS512'];

		// Keys are a public and private key
		if(config.token.keys){
			try {
				privateKey = fs.readFileSync(__dirname+'/../'+config.token.keys.privateKey);
				publicKey = fs.readFileSync(__dirname+'/../'+config.token.keys.publicKey);
			} catch (e) {
				console.warn(e);
				console.log(colors.yellow('Could not load key files! Falling back to app secret.'));
				privateKey = null;
				publicKey = null;
			}
		}
		// If we don't have a key pair, we just use a secret
		if( !(privateKey && publicKey) ){
			privateKey = config.token.secret || null; 
			if(!privateKey){
				privateKey = "This key is not secure! aslefaifabagiaopbgaepoijfaoeiabagaze";
				console.warn(colors.red('No token secret specified! Using insecure secret!'));
			}
			publicKey = privateKey;
		}
		if( privateKey != publicKey ){
			// ensure we're using rsa if we have key pair
			options.algorithm = 'RS512';
		}
	}
	// Return the functions to issue and verify
	return methods;
}

module.exports = configure;
