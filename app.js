'use strict';
// var Promise = require('bluebird');
var express = require('express'),
	chalk = require('chalk'),
	request = require('request'),
	handlebars = require('handlebars'),
	morgan = require('morgan');

var app = express();

var PORT = process.env.PORT || 1337;

app.use(morgan('dev'));

app.use('/', require('./routes.js'));

app.use(function (err, req, res, next) {
  res.status(err.status).send('<h1>Error</h1>', { error: err });
});

app.use(function (req,res) {
  res.status(404).send("<h1>Error</h1><p>Can't find that page</p>")
});

app.listen(PORT, function () {
    console.log(chalk.blue('Server started on port', PORT));
});


