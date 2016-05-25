window.app = angular.module('multiBusApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});

app.controller('LocationCtrl', function($scope, GeoFactory) {
	$scope.getLatLon = GeoFactory.getLatLon;
	$scope.getStops = GeoFactory.getStops;
})

app.config(function ($stateProvider) {
    $stateProvider.state('location', {
        url: '/location',
        templateUrl: 'location.html',
        controller: 'LocationCtrl'
    });

});

app.factory('GeoFactory', function ($http) {

	var geocoder, 
		map,
		GOOGLE_MAPS_API_KEY = 'AIzaSyDDDW__-3OYqcUy9TH3YQGeA3d2rmFmmwk',
		geocoder = new google.maps.Geocoder(),
		GeoFactory = {},
		myLatLon = {};
		

	GeoFactory.getLatLon = function(address) {
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				myLatLon.lat = results[0].geometry.location.lat();
				myLatLon.lon = results[0].geometry.location.lng();
				return GeoFactory.getStops(myLatLon)

			} else {
				console.log("Geocode was not successful: " + status);
			}
		});

	}

	GeoFactory.getStops = function(latLon) {
		console.log("GeoFactory getStops on", latLon);
		return $http.get('/api/stops', {params: latLon})
		.then(function (response) {
			console.log("successful response", response.data);
			GeoFactory.getLines(response.data)
			}, function(err) {
				console.error("Error:",err)
		})
	};

	GeoFactory.getLines = function(stopArray) {
		console.log("GeoFactory getLines on", stopArray)

		return $http.get('/api/lines', {
			params: {stop: stopArray[0]}
		})
		.then(function(response) {
			console.log("successful response", response.data)
		}, function (err) {
			console.error("Error:", err)
		})
	}

	return GeoFactory;
});