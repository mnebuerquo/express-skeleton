var passport = require('passport');
var tokensIssuer = require('../includes/token');
var tokens;

function onLogin(req, res) {
	// req.user is the user record
	if( req.user && req.user._id ){
		//do something with the user id, construct jwt, etc.
		res.status(200).send('yay!');
	} else {
		res.status(401).send('User signup failed.');
	}
}

module.exports = function(app,config) {

	tokens = tokensIssuer(config);

	// non API routes

	app.post('/auth/login',
		passport.authenticate('local-login', { 
			failureFlash : true, 
			successRedirect: '/',
			failureRedirect: '/auth/login' ,
			session: true,
		}),
		onLogin
	);

	app.get('/auth/login',
	   function loginGet(req,res) {
		   res.render('login',{'message':req.flash('error')});
		   req.flash('error');
	   }
	);

    app.post('/auth/signup', 
		passport.authenticate('local-signup', { 
			failureFlash : true, 
			successRedirect: '/',
			failureRedirect: '/auth/signup' ,
			session: true,
		}),
		onLogin
	);

	app.get('/auth/signup',
	   function signupGet(req,res) {
		   res.render('signup',{'message':req.flash('error')});
		   req.flash('error');
	   }
	);

};

