var express = require('express'),
	request = require('request'),
	path = require('path'),
	bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/',express.static('static'));

var MTA_BUSTIME_KEY = require(path.join(__dirname, './config.js')).MTA_BUSTIME_KEY;
var GOOGLE_MAPS_API_KEY = require(path.join(__dirname, './config.js')).GOOGLE_MAPS_API_KEY;

var pathStub = 'http://bustime.mta.info/api/where/stops-for-location.json?radius=200&key=' + MTA_BUSTIME_KEY;

app.get('/', function(req,res) {
	var response = '<ul><li><a href=\"/location\">Get all stops near a location</a></li></ul>'
	res.send(response)
});

/* api */

app.get('/api/geo', function(req,res, next) {
	// this is not currently in used.
	// query parameters are accessible at req.query
})

app.get('/api/stops', function(req,res) {

	var stopInfoArrayShort = [];

	pathStub += ("&lat=" + req.query.lat + "&lon=" + req.query.lon)

	request(pathStub, function (error, response, body) {
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
			console.log(output);
			res.send(output)
		}
	});
});

module.exports = app;

