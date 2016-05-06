window.app = angular.module('multiBusApp', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
});

app.controller('LocationCtrl', function($scope) {
	$scope.foo="bar";
	console.log("LocationCtrl is running. Foo is", $scope.foo)
})

app.config(function ($stateProvider) {
    $stateProvider.state('location', {
        url: '/location',
        templateUrl: 'location.html',
        controller: 'LocationCtrl'
    });

});