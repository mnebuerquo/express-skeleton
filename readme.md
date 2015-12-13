# Skeleton Express App

# Installation

This is not an actual app, but a template to get started with express.
This project is an example of an Express app, and uses several important
concepts from Express.

I intended it to be a starting template, which can be cloned/forked and
then extended into an actual project. Ideally, this will implement some
login and user management features and save us all some tedious work in
future projects.

## Dependencies

* node.js

## Tools Setup

After cloning this repo, run the following command in the same directory
as the repo to get npm and grunt set up. If jshint runs, then you have
everything installed and working.

1. `npm install`
2. [sudo] `npm install -g grunt-cli`
3. `npm install grunt`
4. `grunt jshint`

## Project Setup

To create an express app, you will need Configuration, Routes,
Middleware, and Views. Each of these is added by placing files in the
correct locations with certain structures in them.

Additionally, you can use the `api` directory to add routes for a REST
api.

### Configuration

Add json files in the `config` directory to set configuration data for
your app.

Each directory in `config` should named for an execution environment
with the exception of `default`. The execution environment is selected
by the environment variable `NODE_ENV` when the app starts. So when
running in `development`, the app will load configuration from the
`config/development` directory.

The `config/default` directory is loaded for all environments, and then
the environment specific configuration overrides those set in
`config/default`. 

### Routes

To set up a route, add a file in the `routes` directory with the
following structure:

```javascript
// The module exports a function which adds the routes to the app
// The config is passed as an argument
module.exports = function(app,config) {

	// each route is added within the exported function
	app.get('/', function(req, res) {
		res.render('main', {
			title: 'Skeleton Express App Main Page'
		});
	});

};
```

The routes `index.js` will include that file and call the function as
part of its setup sequence.

The `api` directory works the same way as the `routes` directory. Just
follow the same pattern with the exported function.

### Middleware

To include middleware in the app, add files to the `app-uses` directory.
Each will follow this pattern:

```javascript
// require files for this middleware
// set up any module level variables
// do load-time initialization
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

// export a function which sets up the middleware
// remember, middleware must be used in the correct order
function use(app, config) {
	app.use(express.static(__dirname + '../static'));
	app.use(morgan(':date[iso] dev'));
	app.use(cookieParser());
	app.use(bodyParser.json());
}

module.exports = use;
```

Each middleware loader exports a function which is called by the
`index.js` when we load. Within that function, just call `app.use` with
the middleware object. Adding more middleware is as simple as creating
another file following this pattern. 

To require and use your middleware files in order, you can create a json
file called `use-order.json` containing a single array of module names.

```json
[
"common",
"handlebars",
"session"
]
```

The `index.js` will load and use all the modules listed in the array
first, then load any other modules in unspecified order.

### Views

The `views` directory has a different structure. It contains both
layouts and partials. Each view in its top level can referenceany number
of partials, and is rendered inside a layout.

```
+-- views
	+-- index.hbs
	+-- layouts
	|	+-- single.hbs
	+-- partials
	|	+-- head.hbs
```

In this example, rendering `index.hbs` will use the layout `single.hbs`, which
includes the partial `head.hbs`.

This project uses handlebars for its templates, but you can use any engine you
like. Just add the middleware for it in the `app-uses` directory. See
`app-uses/handlebars.js` as an example.

### Models

This project uses MongoDB with Mongoose models. This project provides a
user model for handling logins.

## Running the Project

To run the project and see the express app in action, use the following
command: 
```bash
NODE_ENV=development node app.js
```

Additionally an example of a debug command line is found in `debug.sh`
and can be triggered by running that script.

This command sets the variable NODE_ENV to choose between production and
development. See the Configuration section above.

## TODO

These are things I would like to add to this skeleton project. In no
particular order.

* A companion project with Ember to demonstrate using Torii or similar
  library for authentication with the api.

* Project generator - Express has a generator which creates a basic project.
  Ideally I would like to be able to npm install this project into another
  project and run the generator to build the structure.

* Bootstrap and other front-end tools - I intend to extend the Gruntfile
  and use Bower to install and manage front-end libraries. This would
  allow just adding the library to bower.json and then running grunt to
  get started.


