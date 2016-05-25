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
			// GeoFactory.getLines(response.data)
			GeoFactory.getVehicles(response.data);
			}, function(err) {
				console.error("Error:",err)
		})
	};

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
		console.log("GeoFactory getVehicles on",stopArray);

		// the array of promises should be built here
		// then we'll insert into $q.all
		// https://docs.angularjs.org/api/ng/service/$q

		/* EXAMPLE: http://fdietz.github.io/recipes-with-angular-js/consuming-external-services/deferred-and-promise.html
		var first  = $http.get("/app/data/first.json"),
		    second = $http.get("/app/data/second.json"),
		    third  = $http.get("/app/data/third.json");

		$q.all([first, second, third])
		.then(function(result) {
		  var tmp = [];
		  angular.forEach(result, function(response) {
		    tmp.push(response.data);
		  });
		  return tmp;
		}).then(function(tmpResult) {
		  $scope.combinedResult = tmpResult.join(", ");
		});
		*/

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


		return $http.get('/api/vehicles', {params: { stop: stopArray[0]}})
		.then(function(response) {
			console.log("Successfully got VEHICLE data", response.data)
		}, function (err) {
			console.error("Error:", err)			
		})
	}

	return GeoFactory;
});