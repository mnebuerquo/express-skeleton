/*
   Config index

   Loads config from json files. 

   Uses directories named for environments:
   development, test, production

   Config loaded from default directory first, then environment files override
   default config.
   */

var extend = require('xtend');
var env = process.env.NODE_ENV || 'development';
var fs = require('fs');
var path = require('path');
var colors = require('colors/safe');
var config = {};

var dirs = ['default', env];
var existing = fs.readdirSync(__dirname);
dirs.forEach(function(dirname) {
	if(existing.indexOf(dirname)<0){
		console.log( colors.red('Warning!!! ')+colors.yellow('Using ENV='+env+' but could not read directory '+__dirname+'/'+dirname+'!'));
		return;
	}
	var files = fs.readdirSync(__dirname + '/' + dirname);
	if(!files){
		return;
	}
	files.forEach(function(filename) {
		//TODO: regex for matching file names
		// We probably don't want names starting with .
		// We do want both json and js files
		var ext = path.extname(filename);
		var name = path.basename(filename,ext);
		var requirePath = __dirname + '/' + dirname + '/' + name;
		if( '.js'===ext || '.json'===ext){
			try {
				var conf = require(requirePath);
				config = extend(config, conf);
			} catch(e) {
				console.log(colors.red("Exception while loading file: ")+'['+requirePath+'] '+colors.red(e));
			}
		}
	});
});

module.exports = config;
