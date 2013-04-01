var HEIGHT = window.innerHeight,
	WIDTH = window.innerWidth;

var FOV = 90,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;

var clock;

var renderer, scene, camera;

var materials = {
	'x': new THREE.MeshPhongMaterial({
		color: 0xffffff,
		wireframe: false
	})
}

function init() {
	renderer =  new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);

	$('#container').html(renderer.domElement);

	camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR );

	scene = new THREE.Scene();
	camera.position.z = 20;
	camera.lookAt(new THREE.Vector3(0, 0, 20));
	scene.add(camera);

	var counter = 0;
	for (var y = roguebyte.length - 1; y >= 0; y--) {
		for (var x = 0, z = roguebyte[y].length - 1; x < roguebyte[y].length - 1, z >= 0; x++, z--) {
			if((y % 2 == 0 && roguebyte[y][x] in materials) || (y % 2 != 0 && roguebyte[y][z] in materials)) {
				var geometry = new THREE.CubeGeometry(1, 1, 1);

				var w;
				if (y % 2 == 0) {
					w = x;
				} else {
					w = z;
				}

				var mesh = new THREE.Mesh(geometry, materials[roguebyte[y][w]]);
				mesh.targetPosition = new THREE.Vector3(w-39, -y+13, 0);
				mesh.position.x = w-39;
				
				mesh.timeout = counter++ * 0.05 + Math.random() * 0.2;
				mesh.speed = 0.6;
				mesh.position.y = 80;
				scene.add(mesh);
			}
		}
	}

	var pointLight = new THREE.PointLight(0xffffff);

	pointLight.position.x = 0;
	pointLight.position.y = 20;
	pointLight.position.z = 80;

	scene.add(pointLight);

	document.addEventListener( 'mousemove', onMouseMove, false );

	clock = new THREE.Clock();
	clock.start();

}

function animate() {
	requestAnimationFrame(animate)

	var time = clock.getElapsedTime();

	for (var i = scene.children.length - 1; i >= 0; i--) {
		var child = scene.children[i]

		if (child.timeout && child.timeout > time) { 
			continue;
		}

		if (child.targetPosition) {
			if (child.targetPosition.y < child.position.y) {
				child.position.y -= child.speed;
			} else {
				child.position = child.targetPosition;
				child.targetPosition = null;
			}
		}
	}

	renderer.render(scene, camera);
}

function onMouseMove(event) {
	var position = new THREE.Vector3(-((WIDTH/2) - event.clientX)/100, ((HEIGHT/2) - event.clientY)/100, 0);
	camera.lookAt(position);
}

$(document).ready(function() {
	if (Modernizr.webgl && Modernizr.fullscreen) {
		$('#content').removeClass("no-webgl");
		init();
		animate();
	} else {
		$('#banner').slideDown();
	}
});