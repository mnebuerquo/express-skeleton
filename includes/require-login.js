
// Middleware used to ensure user is logged in
module.exports = function requireLogin(req, res, next){
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
