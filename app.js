
//set up app without generator
//http://www.marcusoft.net/2014/02/mnb-express.html

var app = require('express')();

var config = require('./config');

// load middleware
require('./app-uses')(app,config);

// set up routes
require('./routes')(app);

// once it's all loaded, start doing stuff
app.listen(config.app.port);
console.log("Listening on port "+config.app.port);
