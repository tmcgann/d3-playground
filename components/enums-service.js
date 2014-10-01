app.factory('enumsService', [function () {
	return {
		forceLife: {
			DECAY: 1,
			HEARTBEAT: 2,
			PERPETUAL: 3
		},
		mapType: {
			ALBERS_USA: 1,
			ORTHOGRAPHIC: 2
		}
	};
}]);