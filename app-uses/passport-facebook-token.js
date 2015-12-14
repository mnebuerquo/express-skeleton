var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');

function use(app,config) {

	var fbID = config.facebook && config.facebook.id;
	var fbSecret = config.facebook && config.facebook.secret;

	if( !(fbID && fbSecret) ){
		console.log("Facebook auth not initialized. Missing ID and Secret.");
		return;// skip use functions
	}

	passport.use(new FacebookTokenStrategy({
		clientID: fbID,
		clientSecret: fbSecret, 
	}, function(accessToken, refreshToken, profile, done) {
		// find the user in the database based on their facebook id
		User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

			// if there is an error, stop everything and return that
			// ie an error connecting to the database
			if (err)
				return done(err);

			// if the user is found, then log them in
			if (user) {
				return done(null, user); // user found, return that user
			} else {
				// if there is no user found with that facebook id, create them
				var newUser            = new User();

				// set all of the facebook information in our user model 
				// set the users facebook id                   
				newUser.facebook.id    = profile.id;
				// we will save the token that facebook provides to the user
				newUser.facebook.token = token; 
				// look at the passport user profile to see how names are returned
				newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
				// facebook can return multiple emails so we'll take the first
				newUser.facebook.email = profile.emails[0].value; 

				// save our user to the database
				newUser.save(function(err) {
					if (err)
						throw err;

					// if successful, return the new user
					return done(null, newUser);
				});
			}

		});
	})
	);
}

module.exports = use;
