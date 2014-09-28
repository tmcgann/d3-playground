var app = angular.module('app', [
	'ngRoute',
	'appControllers',
	'home',
	'collision',
	'photoMap'
]);

app.config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/home', {
				templateUrl: 'home/home.html',
        		controller: 'homeController'
			})
			.when('/collision', {
				templateUrl: 'collision/collision.html',
        		controller: 'collisionController'
			})
			.when('/photo-map', {
				templateUrl: 'photo-map/photo-map.html',
        		controller: 'photoMapController'
			})
			.otherwise({
				redirectTo: '/home'
			});
	}]);