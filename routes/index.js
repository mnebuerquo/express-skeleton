/*
Routes index

Requires each route file, which exports a function.
The exported function takes app as an argument and registers all routes.
*/
var fs = require('fs');

function setupRoutes(app) {
	fs.readdirSync(__dirname).forEach(function(filename) {
		//TODO: regex for matching file names
		// We probably don't want names starting with .
		// We want the name to end with .js
		if (filename !== 'index.js' && filename.indexOf('.js') !== -1) {
			var name = filename.substr(0, filename.indexOf('.js'));
			require('./' + name)(app);
		}
	});
}

module.exports = setupRoutes;
