module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('main', {
			title: 'Express',
			email: req.user.local.email,
		});
	});

};
