/*
Routes index

Requires each route file, which exports a function.
The exported function takes app as an argument and registers all routes.
*/
var fs = require('fs');

function setupRoutes(app) {
	fs.readdirSync(__dirname).forEach(function(filename) {
		if (filename !== 'index.js' && filename.indexOf('.js') !== -1) {
			var name = filename.substr(0, filename.indexOf('.js'));
			require('./' + name)(app);
		}
	});
}

module.exports = setupRoutes;
