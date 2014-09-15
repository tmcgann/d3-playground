collisionApp.controller('collisionController', ['$scope', 'collisionFactory', 'enums', (function () {
	function collisionController($scope, collisionFactory, enums) {
		$scope.friction = 0.95;
		$scope.gravity = 0.05;
		$scope.charge = -15;
		$scope.onFrictionChange = collisionFactory.onFrictionChange;
		$scope.onGravityChange = collisionFactory.onGravityChange;
		$scope.onChargeChange = collisionFactory.onChargeChange;

		$scope.enums = enums;
		$scope.forceLife = enums.forceLife.DECAY;

		$scope.onForceLifeChange = collisionFactory.onForceLifeChange;
		$scope.startForce = collisionFactory.startForce;
		$scope.stopForce = collisionFactory.stopForce;
	}

	return collisionController;
}())]);