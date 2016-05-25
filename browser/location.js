window.app = angular.module('multiBusApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});

app.controller('LocationCtrl', function($scope, GeoFactory) {
	$scope.getLatLong = GeoFactory.getLatLong;
	$scope.httpTest = GeoFactory.httpTest;
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
		GeoFactory = {};

	GeoFactory.httpTest = function() {
		var data = {
			"address" : "25 Broadway, New York, New York"
		}
		return $http.get('/api/geo', data)
			.then(function (response) {
				console.log("successful response", response)
			}, function(err) {
				console.error("Error:",err)
			})
		// return $http({
		//   method: 'GET',
		//   url: '/api/geo',
		//   data: { address: '25 Broadway, New York, NY' }
		// }).then(function (response) {
		// 	console.log("successful response", response)
		//   }, function (err) {
		//   	console.error("Error:",err);
		//   });
	}

	GeoFactory.getLatLong = function(address) {
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				console.log("Lat",results[0].geometry.location.lat());
				console.log("Long",results[0].geometry.location.lng());
			} else {
				console.log("Geocode was not successful for the following reason: " + status);
			}
		});

	}

	return GeoFactory;
});