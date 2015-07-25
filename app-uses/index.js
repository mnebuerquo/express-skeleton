/*
Export a function to initialize all the app.use calls
*/
var fs = require('fs');
var path = require('path');

var requires = [];

fs.readdirSync(__dirname).forEach(function(filename) {
	// We probably don't want names starting with .
	// We want to limit it to names ending with .js
	var ext = path.extname(filename);
	var name = path.basename(filename,ext);
	if( filename !== 'index.js' && '.js'===ext ){
		var func = require('./' + name);
		requires.push(func);
	}
});

function useAll(app, config) {
	for (var i = 0; i < requires.length; i++) {
		var func = requires[i];
		func(app, config);
	}
}

module.exports = useAll;
