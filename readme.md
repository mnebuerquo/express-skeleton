# Skeleton Express App

# Installation

This is not an actual app, but a template to get started with express.

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

To create an express app, you will need Routes, Middleware, and Views.
Each of these is added by placing files in the correct locations with
certain structures in them.

### Routes

To set up a route, add a file in the `routes` directory with the following structure:

```javascript
module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('main', {
			title: 'Skeleton Express App Main Page'
		});
	});

};
```

The routes `index.js` will include that file and call the function as part of its setup sequence.

### Middleware

To include middleware in the app, add files to the `app-uses` directory. Each will follow this pattern:

```javascript
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');

function use(app, config) {
	app.use(express.static(__dirname + '../static'));
	app.use(morgan(':date[iso] dev'));
	app.use(cookieParser());
	app.use(bodyParser.json());
}

module.exports = use;
```

Each middleware loader exports a function which is called by the `index.js` when we load. Within that function, just call `app.use` with the middleware object. Adding more middleware is as simple as creating another file following this pattern. You can use multiple middlewares in one file if you need to initialize them in order.

### Views

The `views` directory has a different structure. It contains both layouts and partials. Each view in its top level can referenceany number of partials, and is rendered inside a layout.

```
+-- views
	+-- index.hbs
	+-- layouts
		+-- single.hbs
	+-- partials
		+-- head.hbs
```

In this example, rendering `index.hbs` will use the layout `single.hbs`, which includes the partial `head.hbs`.

This project uses handlebars for its templates, but you can use any engine you like. Just add the middleware for it in the `app-uses` directory. See `app-uses/handlebars.js` as an example.



