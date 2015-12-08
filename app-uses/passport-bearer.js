var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models/user');
var tokensIssuer = require('../includes/token');

// Uses bearer token posted as access_token for auth

function use(app,config) {
	var tokens = tokensIssuer(config); 

	passport.use('token-bearer', new BearerStrategy(
		function(token, done) {
			// decode token payload to get user id
			var payload = tokens.verifyToken(token);
			// now look up user by _id if token existed
			User.findOne({'_id': payload.userId}, function (err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false); }
				return done(null, user, { scope: 'all' });
			});
		}
	));

}

module.exports = use;
