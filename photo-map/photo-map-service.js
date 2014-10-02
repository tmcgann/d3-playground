photoMap.factory('photoMapService', ['$q', function ($q) {
	var width = 960,
		height = 600,
		viewId = '#USMap',
		mapJSON = 'photo-map/us.json',
		photosJSON = 'photo-map/photos.json',
		color,
		path,
		projection,
		rScale,
		svg;

	init();

	function activate() {
		initSVG();
	}

	function init() {
		initPath();
		initRadiusScale();
		initColor();
	}

	function initColor() {
		color = d3.scale.linear()
			.domain([-100, 0, 2000, 12000])
			.range(['blue','green','yellow','orange']);
	}

	function initMap() {
		var def = $q.defer();

		d3.json(mapJSON, function(error, us) {
			if (error) {
				return console.error(error);
				def.reject();
			}

			svg.insert('path')
				.datum(topojson.feature(us, us.objects.land))
				.attr('class', 'land-light')
				.attr('d', path);

			svg.insert('path')
				.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
				.attr('class', 'state-boundary')
				.attr('d', path);

			def.resolve();
		});

		return def.promise;
	}

	function initPath() {
		projection = d3.geo.albersUsa()
			.scale(1200)
		    .translate([width / 2, height / 2]);

		path = d3.geo.path()
			.projection(projection);
	}

	function initPhotos() {
		d3.json(photosJSON, function (error, photos) {
			if (error) {
				return console.error(error);
			}

			_.chain(photos)
				.each(function (item) {
					item.GPSLatitude = item.GPSLatitude || 0;
					item.GPSLongitude = item.GPSLongitude || 0;
					item.GPSAltitude = item.GPSAltitude || null;
				})
				.reject(function (item) {
					return !item.GPSLatitude || !item.GPSLongitude;
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
						return 3;
					})
					.style('fill', function (d) {
						if (d.GPSAltitude) {
							return color(d.GPSAltitude);
						}
						return '#777';
					});
		});
	}

	function initRadiusScale() {
		rScale = d3.scale.sqrt()
			.domain([0, 1e6])
			.range([0, 15]);
	}

	function initSVG() {
		d3.selectAll(viewId + ' svg').remove();

		svg = d3.select(viewId).append('svg')
			.attr('width', width)
			.attr('height', height);

		initMap().then(initPhotos);
	}

	return {
		activate: activate
	};
}]);
