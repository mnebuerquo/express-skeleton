var passport = require('passport');

module.exports = function(app,config,onApiLogin,apioptions ) { 

	app.post('/facebook/token',
		passport.authenticate('facebook-token', apioptions ), onApiLogin
	);

};
