app.factory('enumsService', [function () {
	return {
		forceLife: {
			DECAY: 1,
			HEARTBEAT: 2,
			PERPETUAL: 3
		}
	};
}]);