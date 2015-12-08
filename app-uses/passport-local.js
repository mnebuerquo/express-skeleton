var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

function use(app,config) {

	passport.use('local-login', new LocalStrategy({
			passReqToCallback: true,
			usernameField: 'email',
			passwordField: 'password',
			session: true
		},
		function handleLocalLogin(req, email, password, done) {
			User.findOne({ 'local.email': email}, function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, req.flash('login', 'Incorrect flurb.'));
				}
				if (!user.validPassword(password)) {
					return done(null, false, req.flash('login', 'Incorrect blorg.'));
				}
				return done(null, user);
			});
		}
	));

	passport.use('local-signup', new LocalStrategy({
			passReqToCallback : true,
			usernameField : 'email',
			passwordField : 'password',
			session: true
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
					return done(null, false, req.flash('signup', 'That email is already taken.'));
				} else {

					// if there is no user with that email
					// create the user
					var newUser            = new User();

					// set the user's local credentials
					newUser.local.email    = email;
					newUser.local.password = newUser.generateHash(password);

					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}

			});    
		}
	));
}

module.exports = use;
