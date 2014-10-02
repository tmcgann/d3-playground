photoMap.factory('worldMapService', ['$q', function ($q) {
	var width = 880,
		height = 880,
		viewId = '#WorldMap',
		mapJSON = 'photo-map/world-110m.json',
		photosJSON = 'photo-map/photos.json',
		color,
		graticule,
		lambda,
		path,
		phi,
		photos,
		projection,
		svg;

	init();

	function activate() {
		initSVG();
	}

	function init() {
		initMovementScales();
		initPath();
		initGraticule();
		initColor();
	}

	function initColor() {
		color = d3.scale.linear()
			.domain([-100, 0, 2000, 12000])
			.range(['blue', 'green', 'yellow', 'orange']);
	}

	function initGraticule() {
		graticule = d3.geo.graticule();
	}

	function initMap() {
		var def = $q.defer();

		d3.json(mapJSON, function (error, world) {
			if (error) {
				return console.error(error);
				def.reject();
			}

			svg.insert('path', '.graticule')
				.datum(topojson.feature(world, world.objects.land))
				.attr('class', 'land-dark')
				.attr('d', path);

			svg.insert('path', '.graticule')
				.datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
				.attr('class', 'boundary')
				.attr('d', path);

			def.resolve();
		});

		return def.promise;
	}

	function initMovement() {
		svg.on('mousemove', function rotate() {
			var p = d3.mouse(this),
				lambdaOutput = lambda(p[0]),
				phiOutput = phi(p[1]);

			projection.rotate([lambdaOutput, phiOutput]);

			svg.selectAll('path')
				.attr('d', path);

			svg.selectAll('circle')
				.attr('transform', function (d) {
					return 'translate(' + projection([d.GPSLongitude, d.GPSLatitude]) + ')';
				})
				// .attr('display', function (d) {
				// 	var rotatedLong = d.GPSLongitude + lambdaOutput,
				// 		rotatedLat = d.GPSLatitude + phiOutput,
				// 		longitudeCeiling = phiOutput > 0 ? 90 + phiOutput : 90,
				// 		longitudeFloor = phiOutput < 0 ? -90 + phiOutput : -90,
				// 		latitudeCeiling = lambdaOutput > 0 ? 90 + lambdaOutput : 90,
				// 		latitudeFloor = lambdaOutput < 0 ? -90 + lambdaOutput : -90,
				// 		isLongitudeVisible = rotatedLong > longitudeFloor && rotatedLong < longitudeCeiling,
				// 		isLatitudeVisible = (rotatedLat > latitudeFloor && rotatedLat < latitudeCeiling),
				// 		isVisible = isLongitudeVisible && isLatitudeVisible;
				// 	return isVisible ? '' : 'none';
				// });
		});
	}

	function initMovementScales() {
		lambda = d3.scale.linear()
			.domain([0, width])
			.range([-180, 180]);

		phi = d3.scale.linear()
			.domain([0, height])
			.range([90, -90]);
	}

	function initPath() {
		projection = d3.geo.orthographic()
			.scale(425)
			.translate([width / 2, height / 2])
			.clipAngle(90)
			.precision(0.1);

		path = d3.geo.path()
			.projection(projection);
	}

	function initPhotos() {
		d3.json(photosJSON, function (error, data) {
			if (error) {
				return console.error(error);
			}

			_.chain(data)
				.each(function (item) {
					item.GPSLatitude = item.GPSLatitude || 0;
					item.GPSLongitude = item.GPSLongitude || 0;
					item.GPSAltitude = item.GPSAltitude || null;
				})
				.reject(function (item) {
					return !item.GPSLatitude || !item.GPSLongitude;
				});

			photos = data;

			// TEMP
			// Montevideo, Uruguay
			photos.push({
				GPSLongitude: -56.1819,
				GPSLatitude: -34.8836
			});
			// Cape Town, South Africa
			photos.push({
				GPSLongitude: 18.4239,
				GPSLatitude: -33.9253
			});
			// Dubai, UAE
			photos.push({
				GPSLongitude: 55.3333,
				GPSLatitude: 24.9500
			});

			svg.append('g')
					.attr('class', 'bubble')
				.selectAll('circle')
					.data(photos)
				.enter().append('circle')
					.attr('transform', function (d) {
						return 'translate(' + projection([d.GPSLongitude, d.GPSLatitude]) + ')';
					})
					.attr('r', function (d) {
						return 2;
					})
					.attr('fill', function (d) {
						if (d.GPSAltitude) {
							return color(d.GPSAltitude);
						}
						return 'red';
					});
		});
	}

	function initSVG() {
		d3.selectAll(viewId + ' svg').remove();

		svg = d3.select(viewId).append('svg')
			.attr('width', width)
			.attr('height', height);

		svg.append('path')
			.datum(graticule)
			.attr('class', 'graticule')
			.attr('d', path);

		initMovement();
		initMap().then(initPhotos);
	}

	return {
		activate: activate
	};
}]);
