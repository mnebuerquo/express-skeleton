/*
Routes index

Requires each route file, which exports a function.
The exported function takes app as an argument and registers all routes.
*/
var fs = require('fs');
var path = require('path');

function setupRoutes(app) {
	fs.readdirSync(__dirname).forEach(function(filename) {
		// We probably don't want names starting with .
		// We want the name to end with .js
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		if( filename !== 'index.js' && '.js'===ext ){
			require('./' + name)(app);
		}
	});
}

module.exports = setupRoutes;
