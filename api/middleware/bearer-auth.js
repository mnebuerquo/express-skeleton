var passport = require('passport');

// api auth options
var apioptions = { 
	failureFlash : false, 
	session: false,
	failWithError: true, // passport normally wants to send its own 401, but it's not json
};

function bearerAuth(req,res,next) {

	function afterAuth(err) {
		// swallow the error and call next
		next();
	}
	var func = passport.authenticate('token-bearer', apioptions );
	return func(req,res,afterAuth);
}

module.exports = bearerAuth;


