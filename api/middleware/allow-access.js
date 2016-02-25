// Middleware to allow us to access any route unless it's protected
// Passport strategies add a status(401) whenever there isn't a valid
// bearer token. For open API routes this isn't what we want. Instead,
// we add the allowed middleware to change the status to 200 after the
// bearer token middleware.
// Later, if we want to log stuff for users by token, we will still have
// the req.user set by passport. We can also log requests by 
// non-logged-in users.

module.exports = function allowed(req, res, next){

	// can't do it if headers already sent
	if(! res.headersSent ){
		// we're only interested in overriding a 401
		if( res.statusCode === 401){
			res.status(200);
		}
	}

	return next();
}
