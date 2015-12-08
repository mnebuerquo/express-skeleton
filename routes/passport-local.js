var passport = require('passport');
var tokensIssuer = require('../includes/token');
var tokens;

function onApiLogin(req, res) {
	// req.user is the user record
	var response = {};
	if( req.user && req.user._id ){
		//do something with the user id, construct jwt, etc.
		var timestamp = new Date();
		var currentTime = timestamp.getTime();
		var payload = { 
			"userId": req.user._id, 
			"timestamp": currentTime
	   	};
		response.access_token = tokens.issueToken(payload);
		res.status(200).json(response);
	} else {
		response.error={
			status:401,
			message:'Login failed'
		};
		res.status(401).json(response);
	}
}

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

	//API routes use simple options

	var apioptions = { 
		failureFlash : false, 
		session: false,
	};

	app.post('/auth/api/login',
		passport.authenticate('local-login', apioptions ),
		onApiLogin
	);

    app.post('/auth/api/signup', 
		passport.authenticate('local-signup', apioptions ),
		onApiLogin
	);

	// non API routes

	app.post('/auth/login',
		passport.authenticate('local-login', { 
			failureFlash : true, 
			successRedirect: '/',
			failureRedirect: '/auth/login' 
		}),
		onLogin
	);

	app.get('/auth/login',
	   function loginGet(req,res) {
		   res.render('login',{'message':req.flash('login')});
	   }
	);

    app.post('/auth/signup', 
		passport.authenticate('local-signup', { 
			failureFlash : true, 
			successRedirect: '/',
			failureRedirect: '/auth/signup' 
		}),
		onLogin
	);

	app.get('/auth/signup',
	   function signupGet(req,res) {
		   res.render('signup',{'message':req.flash('signup')});
	   }
	);

};

