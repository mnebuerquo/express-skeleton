/*
Export a function to initialize all the app.use calls

Order of modules is important for app.use. This code will require
and then use all modules listed in array moduleNames in the order
they are listed. Any modules in the directory will be required and
used after the ones listed in moduleNames. The ones automatically
required will not be in a guaranteed order.

*/
var fs = require('fs');
var path = require('path');

// Add required modules here by name (without extension like require)
// These must be in the correct order.
var moduleNames = [];

var useFuncs = [];

fs.readdirSync(__dirname).forEach(function(filename) {
	// We probably don't want names starting with .
	// We want to limit it to names ending with .js
	var ext = path.extname(filename);
	var name = path.basename(filename,ext);
	if( filename !== 'index.js' && '.js'===ext ){
		if(0>=moduleNames.indexOf(name)){
			moduleNames.push(name);
		}
	}
});

moduleNames.forEach(function(name){
	var func = require('./' + name);
	useFuncs.push(func);
});

function useAll(app, config) {
	for (var i = 0; i < useFuncs.length; i++) {
		var func = useFuncs[i];
		func(app, config);
	}
}

module.exports = useAll;
