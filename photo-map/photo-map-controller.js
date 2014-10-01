photoMap.controller('photoMapController', ['$scope', 'enumsService', 'photoMapService', 'worldMapService',
	function ($scope, enumsService, photoMapService, worldMapService) {
		photoMapService.activate();
		worldMapService.activate();

		$scope.enums = enumsService;

		$scope.selectedMapType = enumsService.mapType.ORTHOGRAPHIC;
		$scope.isMapVisible = isMapVisible;

		function isMapVisible(mapType) {
			return $scope.selectedMapType === mapType;
		}
	}]);