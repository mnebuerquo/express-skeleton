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
