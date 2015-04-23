/*
Export a function to initialize all the app.use calls
*/
var fs = require('fs');

var requires = [];

fs.readdirSync(__dirname).forEach(function(filename) {
	if (filename !== 'index.js' && filename.indexOf('.js') !== -1) {
		var name = filename.substr(0, filename.indexOf('.js'));
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
