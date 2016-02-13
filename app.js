// Set up a relative path for including app modules from deeply nested
// directories such as api routes.
// https://www.npmjs.com/package/app-module-path
// https://gist.github.com/branneman/8048520
require('app-module-path').addPath(__dirname);

//set up app without generator
//http://www.marcusoft.net/2014/02/mnb-express.html

var app = require('express')();

var config = require('./config');

var mongoose = require('mongoose');
mongoose.connect(config.db.url);

// load middleware
require('./app-uses')(app,config);

// set up routes
require('./routes')(app,config);
// set up api routes
require('./api')(app,config);

// once it's all loaded, start doing stuff
app.listen(config.app.port);
console.log("Listening on port "+config.app.port);
