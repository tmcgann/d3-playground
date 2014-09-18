var app = angular.module('app', [
	'ngRoute',
	'appControllers',
	'home',
	'collision'
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
			.otherwise({
				redirectTo: '/home'
			});
	}]);