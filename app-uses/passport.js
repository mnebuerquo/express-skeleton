var passport = require('passport');
var User = require('../models/user');
var ensure = require('connect-ensure-login');
var unless = require('express-unless');

function use(app,config) {

	app.use(passport.initialize());
	app.use(passport.session());

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	app.use(function logAuthState(req,res,next){
		var state = (req.isAuthenticated && req.isAuthenticated());
		console.log(req.url+' login state: '+state);
		next();
	});

	// ensure logged in unless in the /auth paths
	requireLogin = ensure.ensureLoggedIn('/auth');
	requireLogin.unless = unless;
	app.use(requireLogin.unless({'path':/^\/(auth|api)/}));

	// ensure logged out unless not in the /auth paths
	requireLogout = ensure.ensureLoggedOut('/');
	app.use('/auth',requireLogout);
}


module.exports = use;

