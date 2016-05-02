'use strict';
// var Promise = require('bluebird');
var path = require('path');
var MTA_BUSTIME_KEY = require(path.join(__dirname, './config.js')).MTA_BUSTIME_KEY;
var app = require('express');


var PORT = process.env.PORT || 1337;

app.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', PORT);
});

};
app.get('/', function() {
	res.send('hello');
});

router.use(function (req, res) {
    res.status(404).end();
});

