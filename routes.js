var express = require('express'),
	request = require('request'),
	handlebars = require('handlebars');

var MTA_BUSTIME_KEY = require(path.join(__dirname, './config.js')).MTA_BUSTIME_KEY;
var app = express();

var pathToGet = 'http://bustime.mta.info/api/where/stops-for-location.json?lat=40.748433&lon=-73.985656&latSpan=0.005&lonSpan=0.005&key=' + MTA_BUSTIME_KEY;

var options = {
  hostname: 'http://bustime.mta.info',
  path: '/api/where/stops-for-location.json?lat=40.748433&lon=-73.985656&latSpan=0.005&lonSpan=0.005&key=' + MTA_BUSTIME_KEY,
  method: 'GET'
};


app.get('/', function(req,res) {
	var response = '<ul><li><a href=\"/stops3\">View example stops near test location</a></li></ul>'
	res.send(response)
});

app.get('/stops1', function(req,res) {

	request
		.get(pathToGet)
		.on('error', function(err) {
			console.log(chalk.red(err))
		})
		.pipe(res)

});


app.get('/stops2', function(req,res) {
	request(pathToGet, function (error, response, body) {
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

	request(pathToGet, function (error, response, body) {
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
})
app.use(function (req, res) {
    res.status(404).end();
});

