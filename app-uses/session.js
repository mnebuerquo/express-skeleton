var session = require('cookie-session');
var flash = require('connect-flash');//requires sessions
var ms = require('ms');

function use(app, config) {

	var options = {
		secret: config.session.secret,
		maxAge: ms(''+config.session.maxAge),
		secure: false, //config.session.secure,
		path: '/',
		domain: config.session.domain || null,
		httpOnly: true,
		signed: true,
		overwrite: true,
	};

	app.use(session(options));

	app.use(function(req, res, next){
		req.session.views = (req.session.views || 0) + 1;
		next();
	});

	app.use(flash({locals: 'flash'}));//requires sessions
}

module.exports = use;

