photoMap.factory('photoMapService', [function () {
	var width = 960,
		height = 600,
		mapJSON = 'photo-map/us_alt.json',
		photosJSON = 'photo-map/photos.json',
		formatNumber,
		path,
		projection,
		rScale,
		svg;

	init();

	function activate() {
		initSVG();
	}

	function init() {
		initNumberFormat();
		initPath();
		initRadiusScale();
	}

	function initMap() {
		d3.json(mapJSON, function(error, us) {
			if (error) {
				return console.error(error);
			}

			// svg.append('path')
			// 		.datum(topojson.feature(us, us.objects.nation))
			// 		.attr('class', 'land')
			// 		.attr('d', path);

			// svg.append('path')
			// 		.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
			// 		.attr('class', 'border border--state')
			// 		.attr('d', path);

			svg.insert("path", ".graticule")
				.datum(topojson.feature(us, us.objects.land))
				.attr("class", "land")
				.attr("d", path);

			svg.insert("path", ".graticule")
				.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
				.attr("class", "state-boundary")
				.attr("d", path);
		});
	}

	function initNumberFormat() {
		formatNumber = d3.format(',.0f');
	}

	function initPath() {
		// path = d3.geo.path()
		// 	.projection(null);

		projection = d3.geo.albersUsa()
			.scale(1000)
		    .translate([width / 2, height / 2]);
		path = d3.geo.path()
			.projection(projection);
	}

	function initPhotos() {
		d3.json(photosJSON, function (error, photos) {
			if (error) {
				return console.error(error);
			}

			svg.append('g')
					.attr('class', 'bubble')
				.selectAll('circle')
					.data(photos)
				.enter().append('circle')
					// .attr('transform', function (d) {
					// 	return 'translate(' + ')';
					// })
					.attr('cx', function(d) {
						return parseFloat(d.GPSLongitude);
					})
					.attr('cy', function(d) {
						return parseFloat(d.GPSLatitude);
					})
					.attr('r', function(d) {
						return 3;
					});
		});
	}

	function initRadiusScale() {
		rScale = d3.scale.sqrt()
			.domain([0, 1e6])
			.range([0, 15]);
	}

	function initSVG() {
		d3.selectAll('#d3 svg').remove();

		svg = d3.select('#d3').append('svg')
			.attr('width', width)
			.attr('height', height);

		initMap();
		initPhotos();

		// d3.select(self.frameElement).style('height', height + 'px');
	}

	return {
		activate: activate
	};
}]);
