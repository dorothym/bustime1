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

var basePath = 'http://bustime.mta.info/api/';

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

	console.log("GET api/stops", req.query)

	var strData, 
		output,
		pathToGet = basePath + 'where/stops-for-location.json?radius=200&key=' + MTA_BUSTIME_KEY + "&lat=" + req.query.lat + "&lon=" + req.query.lon,
		stops = [],
		numStops = 0;

	console.log("pathToGet:",pathToGet)

	request(pathToGet, function (error, response, body) {
		if(error){
			console.error(chalk.red("REQUEST ERROR:",error))
		} else {
			strData = JSON.parse(body);
			numStops = strData.data.stops.length;
			for(var i = 0; i < numStops; i++) {
				stops.push(strData.data.stops[i].code);
			}
			// console.log("STOPS:",stops);
			res.json(stops)
		}
	});
});

// get VEHICLES at stop X
app.get('/api/vehicles', function(req,res) {
	// console.log("GET api/vehicles for", req.query.stop)

	var pathToGet = basePath + "siri/stop-monitoring.json?key=" + MTA_BUSTIME_KEY + "&OperatorRef=MTA&MonitoringRef=" + req.query.stop,
		strData, 
		numVehicles = 0,
		vehicles = [],
		currentVehicle;

	console.log('pathToGet', pathToGet);

	request(pathToGet, function (error, response, body) {
		if(error){
			// console.error("request error", chalk.red(error))
		} else {
			strData = JSON.parse(body)

			// console.log("vref", strData.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[0].MonitoredVehicleJourney.VehicleRef)

			numVehicles = strData.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.length;

			for(var i = 0; i < numVehicles; i++) {

				currentVehicle = strData.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit[i].MonitoredVehicleJourney.VehicleRef;
				// console.log("currentVehicle is", currentVehicle);

				vehicles.push(currentVehicle); 
			}

		}
		// console.log("VEHICLES", vehicles);
		res.json(vehicles);
	});
});


// get lines at stop X
app.get('/api/lines', function(req,res) {
	console.log("GET api/lines", req.query.stop)

	var stopID = "MTA_" + req.query.stop,
		pathToGet = basePath + "stop/" + stopID + ".json?key=" + MTA_BUSTIME_KEY,
		strData, 
		output, 
		shortRouteInfo = {},
		numLines = 0,
		routes = [];

	console.log('pathToGet', pathToGet);

	request(pathToGet, function (error, response, body) {
		if(error){
			console.error("request error", chalk.red(error))
		} else {
			strData = JSON.parse(body)
			// console.log("LINES", strData.data.routes)

			numLines = strData.data.routes.length;
			for(var i = 0; i < numLines; i++) {
				routes.push(strData.data.routes[i].id);
			}

		}
		// console.log("ROUTES", routes);
		res.json(routes);
	});
});

module.exports = app;

