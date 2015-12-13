/*
 * This provides an index for /auth, with redirect if logged in already
 * Also provides a logout route.
 *
 */
module.exports = function(app) {

	app.get('/auth', function(req, res) {
		res.render('auth-index', {
			title: 'Choose Login Method '+req.session.views
		});
	});

	app.get('/auth/logout', function(req, res) {
		// delete cookie, session
		// redirect to home?
		req.logout();
		req.session = null;
		res.redirect('/');
	});

};

