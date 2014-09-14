var collisionApp = angular.module('collisionApp', []);

collisionApp.controller('collisionController', ['$scope', (function () {
	var enums = {
		forceLife: {
			DECAY: 1,
			HEARTBEAT: 2,
			PERPETUAL: 3
		}
	};

	function collisionController($scope) {
		$scope.friction = 0.95;
		$scope.gravity = 0.05;
		$scope.charge = -15;

		$scope.enums = enums;
		$scope.forceLife = enums.forceLife.DECAY;
	}

	return collisionController;
}())]);