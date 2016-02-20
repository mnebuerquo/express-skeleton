var passport = require('passport');
var apioptions = require('../../includes/passport-api-options');

function bearerAuth(req,res,next) {

	function afterAuth(err) {
		// swallow the error and call next
		next();
	}
	var func = passport.authenticate('token-bearer', apioptions );
	return func(req,res,afterAuth);
}

module.exports = bearerAuth;


