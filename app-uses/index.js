/*
Export a function to initialize all the app.use calls
*/
var fs = require('fs');
var path = require('path');

var sequence = [
	'common',
	'session',
	'passport',
	'passport-local',
	'passport-bearer',
];

function loadNames(){
	var names = [];
	fs.readdirSync(__dirname).forEach(function(filename) {
		// We don't want names starting with .
		// We want to limit it to names ending with .js
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		if( filename !== 'index.js' && '.js'===ext && name.charAt(0)!=='_' ){
			names.push(name);
		}
	});
	return names;
}

function useAll(app, config) {

	// filter array to unique values http://stackoverflow.com/a/14438954
	var fullList = sequence.concat(loadNames());
	var unique = fullList.filter( 
			function onlyUnique(value, index, self) { 
				return self.indexOf(value) === index;
			});

	unique.forEach(function(name){
		console.log('require('+name+')');
		var func = require('./' + name);
		func(app, config);
	});
}

module.exports = useAll;
