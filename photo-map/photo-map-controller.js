photoMap.controller('photoMapController', ['$scope', 'photoMapService',
	function ($scope, photoMapService) {
		photoMapService.activate();
	}]);