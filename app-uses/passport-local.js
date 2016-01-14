var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

function use(app,config) {

	passport.use('local-login', new LocalStrategy({
			passReqToCallback: true,
			usernameField: 'username',
			passwordField: 'password',
		},
		function handleLocalLogin(req, email, password, done) {
			User.findOne({ 'local.email': email}, function(err, user) {
				if (err) { return done(err); }
				if (!user || !user.validPassword(password)) {
					var error = new Error('Incorrect email or password.');
					error.name = 'Login error';
					error.status = 401;
					return done(null, false, error);
				}
				return done(null, user);
			});
		}
	));

	passport.use('local-signup', new LocalStrategy({
			passReqToCallback : true,
			usernameField : 'username',
			passwordField : 'password',
		},
		function handleLocalCreateUser(req, email, password, done) {

			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'local.email' :  email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);

				// check to see if theres already a user with that email
				if (user) {
					var error = new Error('That email is already taken.');
					error.name = 'Signup error';
					error.status=409;//conflict
					return done(error, false, error);
				} else {

					// if there is no user with that email
					// create the user
					var newUser            = new User();

					// set the user's local credentials
					newUser.local.email    = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.birthdate= req.body.birthdate || 'unknown';

					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;//TODO: Shouldn't this return done(err) instead?
						return done(null, newUser);
					});
				}

			});    
		}
	));
}

module.exports = use;
