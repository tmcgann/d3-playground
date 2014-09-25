collision.factory('collisionService', ['enumsService', function (enums) {
	var w = 1280,
		h = 800,
		forceLife = enums.forceLife.PERPETUAL,
		color,
		force,
		nodes,
		svg;

	init();

	function activate() {
		force.start();
		initSVG();
	}

	function deactivate() {
		force.stop();
	}

	function collide(node) {
		var r = node.radius + 16,
			nx1 = node.x - r,
			nx2 = node.x + r,
			ny1 = node.y - r,
			ny2 = node.y + r;

		return function(quad, x1, y1, x2, y2) {
			if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
					y = node.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = node.radius + quad.point.radius;

				if (l < r) {
					l = (l - r) / l * .5;
					node.x -= x *= l;
					node.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}

			return x1 > nx2
				|| x2 < nx1
				|| y1 > ny2
				|| y2 < ny1;
		};
	}

	function getCharge() {
		return force.charge();
	}

	function getForceLife() {
		return forceLife;
	}

	function getFriction() {
		return force.friction();
	}

	function getGravity() {
		return force.gravity();
	}

	function init() {
		initNodes();
		initColor();
		initForce();

		// var root = nodes[0];
		// root.radius = 0;
		// root.fixed = true;

		// svg.on('mousemove', function() {
		// 	var p1 = d3.svg.mouse(this);
		// 	root.px = p1[0];
		// 	root.py = p1[1];
		// 	force.resume();
		// });
	}

	function initColor() {
		color = d3.scale.category10();
	}

	function initForce() {
		force = d3.layout.force()
			.friction(0.95)
			.gravity(0.05)
			.charge(-15)
			.nodes(nodes)
			.size([w, h]);

		force.on('tick', function(e) {
			var q = d3.geom.quadtree(nodes),
				i = 0,
				n = nodes.length;

			while (++i < n) {
				q.visit(collide(nodes[i]));
			}

			svg.selectAll('circle')
				.attr('cx', function(d) {
					return d.x;
				})
				.attr('cy', function(d) {
					return d.y;
				});

			updateForceLife();
		});
	}

	function initNodes() {
		nodes = d3.range(200)
			.map(function () {
				return {
					radius: Math.random() * 12 + 4
				};
			});
	}

	function initSVG() {
		d3.selectAll('#d3 svg').remove();

		svg = d3.select('#d3')
			.append('svg:svg')
			.attr('width', w)
			.attr('height', h);

		svg.selectAll('circle')
			.data(nodes)
			.enter()
			.append('svg:circle')
			.attr('r', function(d) {
				var r = d.radius - 2;
				return r < 0 ? 0 : r;
			})
			.style('fill', function(d, i) {
				return color(i % 3);
			});
	}

	function onChargeChange(newCharge) {
		var options = {
			charge: newCharge
		};
		updateForce(options);
		startForce();
	}

	function onForceLifeChange(newForceLife) {
		forceLife = newForceLife;
		force.resume();
	}

	function onFrictionChange(newFriction) {
		var options = {
			friction: newFriction
		};
		updateForce(options);
		startForce();
	}

	function onGravityChange(newGravity) {
		var options = {
			gravity: newGravity
		};
		updateForce(options);
		startForce();
	}

	function startForce(e) {
		if (e) {
			e.preventDefault();
		}
		force.start();
	}

	function stopForce(e) {
		if (e) {
			e.preventDefault();
		}
		force.stop();
	}

	function updateForce(options) {
		var charge, friction, gravity;

		options = options || {};
		charge = options.charge || force.charge();
		friction = options.friction || force.friction();
		gravity = options.gravity || force.gravity();

		force.friction(friction)
			.gravity(gravity)
			.charge(charge)
			.nodes(nodes)
			.size([w, h]);
	}

	function updateForceLife() {
		if (forceLife === enums.forceLife.HEARTBEAT && force.alpha() <= 0.01) {
			force.alpha(0.1);
			return;
		}

		if (forceLife === enums.forceLife.PERPETUAL) {
			force.alpha(0.1);
		}
	}

	return {
		activate: activate,
		deactivate: deactivate,
		getCharge: getCharge,
		getForceLife: getForceLife,
		getFriction: getFriction,
		getGravity: getGravity,
		onChargeChange: onChargeChange,
		onForceLifeChange: onForceLifeChange,
		onFrictionChange: onFrictionChange,
		onGravityChange: onGravityChange,
		startForce: startForce,
		stopForce: stopForce
	};
}]);