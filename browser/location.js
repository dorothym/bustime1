window.app = angular.module('multiBusApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});

app.controller('LocationCtrl', function($scope, GeoFactory) {
	$scope.getLatLon = GeoFactory.getLatLon;
	$scope.httpTest = GeoFactory.httpTest;
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

	GeoFactory.httpTest = function() {
		var obj = { test: "hello world"}
		$http.get('/api/geo', {params: obj})
		.then(function (response) {
			console.log("successful response", response)
			}, function(err) {
				console.error("Error:",err)
		})
	}

	GeoFactory.getLatLon = function(address) {
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				myLatLon.lat = results[0].geometry.location.lat();
				myLatLon.lon = results[0].geometry.location.lng();
				console.log("myLatLon is", myLatLon)
				console.log("fetching stops")
				return GeoFactory.getStops(myLatLon)

			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});

	}

	GeoFactory.getStops = function(latLon) {
		console.log("Inside GeoFactory.getStops. Passed latLon", latLon)
		return $http.get('/api/stops', {params: latLon})
		.then(function (response) {
			console.log("successful response", response)
			}, function(err) {
				console.error("Error:",err)
		})
	}

	return GeoFactory;
});