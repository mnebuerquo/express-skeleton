module.exports = function(grunt) {
	// Do grunt-related things in here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options:{
				ignores: ['node_modules/**/*.js'],
			},
			src: [
				'./**/*.js'
			]
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint']);
};
