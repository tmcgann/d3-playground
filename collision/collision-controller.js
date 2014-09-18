collision.controller('collisionController', ['$scope', 'collisionService', 'enumsService',
	function ($scope, collisionService, enumsService) {
		$scope.friction = 0.95;
		$scope.gravity = 0.05;
		$scope.charge = -15;
		$scope.onFrictionChange = collisionService.onFrictionChange;
		$scope.onGravityChange = collisionService.onGravityChange;
		$scope.onChargeChange = collisionService.onChargeChange;

		$scope.enums = enumsService;
		$scope.forceLife = collisionService.getForceLife();

		$scope.onForceLifeChange = collisionService.onForceLifeChange;
		$scope.startForce = collisionService.startForce;
		$scope.stopForce = collisionService.stopForce;
	}]);