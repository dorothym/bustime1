var express = require('express'),
	request = require('request'),
	path = require('path');

var app = express();

app.use('/',express.static('static'));

var MTA_BUSTIME_KEY = require(path.join(__dirname, './config.js')).MTA_BUSTIME_KEY;
var GOOGLE_MAPS_API_KEY = require(path.join(__dirname, './config.js')).GOOGLE_MAPS_API_KEY;

var testPath = 'http://bustime.mta.info/api/where/stops-for-location.json?lat=40.747716&lon=-73.98781&latSpan=0.005&lonSpan=0.005&key=' + MTA_BUSTIME_KEY;

app.get('/', function(req,res) {
	var response = '<ul><li><a href=\"/stops3\">View example stops near test location</a></li><li><a href=\"/location\">Google Maps API test</a></li></ul>'
	res.send(response)
});

app.get('/stops1', function(req,res) {

	request
		.get(testPath)
		.on('error', function(err) {
			console.log(chalk.red(err))
		})
		.pipe(res)

});

app.get('/stops2', function(req,res) {
	request(testPath, function (error, response, body) {
		var strData = "";
		if(error){
			console.error(chalk.red(error))
		} else {
			strData = JSON.parse(body)
			console.log(strData.data.stops)
			res.send('OK')
		}
	});
})

app.get('/stops3', function(req,res) {

	var stopInfoArrayShort = [];

	request(testPath, function (error, response, body) {
		var strData, output;
		if(error){
			console.error(chalk.red(error))
		} else {
			strData = JSON.parse(body)
			output = strData.data.stops.map(function(longStopInfo) {
				var shortStopInfo = {};
				shortStopInfo.code = longStopInfo.code;
				shortStopInfo.name = longStopInfo.name;
				return shortStopInfo;
			})
			// console.log(output)
			res.json(output)
		}
	});
});


app.get('/stops4', function (req,res) {

	res.render('test', {
		stops: {code: '123', name: 'abc'}
	});
	
});

module.exports = app;

