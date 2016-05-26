window.app = angular.module('multiBusApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});

app.controller('LocationCtrl', function($scope, GeoFactory) {
	$scope.getLatLon = GeoFactory.getLatLon;
	$scope.getStops = GeoFactory.getStops;
	$scope.getVehicles = GeoFactory.getVehicles;
})

app.config(function ($stateProvider) {
    $stateProvider.state('location', {
        url: '/location',
        templateUrl: 'location.html',
        controller: 'LocationCtrl'
    });

});

app.factory('GeoFactory', function ($http, $q) {

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
			// GeoFactory.getLines(response.data)
			GeoFactory.getVehicles(response.data);
			}, function(err) {
				console.error("Error:",err)
		})
	};

	// this is not currently in use - might delete later 
	GeoFactory.getLines = function(stopArray) {
		console.log("GeoFactory getLines on", stopArray)


		return $http.get('/api/lines', {
			params: {stop: stopArray[0]} // only getting first stop for now; need to expand
		})
		.then(function(response) {
			console.log("successful response", response.data)
		}, function (err) {
			console.error("Error:", err)
		})
	};

	GeoFactory.getVehicles = function(stopArray) {
		// console.log("GeoFactory getVehicles on",stopArray);

		var allVehicles = [],
			promiseArray = [],
			tempArray = [],
			stopArrayLength = stopArray.length,
			i;

		for (i = 0; i < stopArrayLength; i++ ) {
			promiseArray.push($http.get('/api/vehicles', {
				params: {
					stop: stopArray[i]
				}
			}))
		}

		return $q.all(promiseArray)
		.then(function(vehicleArray) {
			// console.log("****** FINAL RESULT front-end vehicles",result)
			angular.forEach(vehicleArray, function(item) {
				// console.log("item.data",item.data)
				allVehicles = allVehicles.concat(item.data);
				// console.log("allVehicles is now",allVehicles,"and tempArray is", tempArray)
			});
			console.log("Front end final result allVehicles", allVehicles);
			return allVehicles; // not sure if this will work
		}, function(err) {console.error("Error retrieving monitored vehicles",err)})

		/* ANOTHER EXAMPLE: http://stackoverflow.com/questions/25570618/multiple-http-with-promise-using-factory-angular
			factory("getDefaults", function($http, $q) {
			  var promise1 = $http({ method: "GET", url: "/getStringDropdown/materials" });
			  var promise2 = $http({ method: "GET", url: "/getStringDropdown/materials" });
			  var promise3 = $http({ method: "GET", url: "/getStringDropdown/materials" });
			  return {
			    data: $q.all([promise1,promise2,promise3]),
			    anotherCall: $http.get('/anothercallUrl')
			  }
			});
		*/

		// stop: stopArray[]

	}

	return GeoFactory;
});