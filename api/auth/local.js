var passport = require('passport');

module.exports = function(app,config,onApiLogin,apioptions ) { 

	app.post('/local/login',
		passport.authenticate('local-login', apioptions ),
		onApiLogin
	);

    app.post('/local/signup', 
		passport.authenticate('local-signup', apioptions ),
		onApiLogin
	);

};
