require.config({
    paths: {
        jquery: 'libs/jquery'
    },
    waitSeconds: 180
});

require(['mods/simulation', 'mods/world', 'mods/objectFactory', 'mods/meshes/cube'], function (Simulation, World, ObjectFactory, Cube) {

    var world = new World(600, 600);
    var simulation = new Simulation('#container', world);

    world.setCamera(110, 0, 110, 0, 0, 0);

    world.addLight(50, 50, 50, 0xFFFFFF);
    world.addLight(-50, 50, 50, 0x888888);

    var objectFactory = new ObjectFactory();

    var material1 = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false, vertexColors: THREE.FaceColors });
    var material2 = new THREE.MeshPhongMaterial({ color: 0x00FF00, wireframe: false, vertexColors: THREE.FaceColors });

    var sphere = objectFactory.createSphere(12, 6, 2, 0.8, 200, 10, 15, 2, 2000, 10000, material1);
    var cube = objectFactory.createCube({x:20, y:20, z:20}, {x:10, y:10, z:10}, {x:6, y:6, z:6}, 3.0, 400, 10, 85, 20, 5000, 10000, material2);

    sphere.renderMesh.position = new THREE.Vector3(-25, 0, 0);
    cube.renderMesh.position = new THREE.Vector3(25, 10, 0);

    world.addObject(sphere);
    world.addObject(cube);
    world.setGravity(0, -10, 0);

    var material2 = new THREE.MeshBasicMaterial({ color: 0xBBBBBB, wireframe: true });
    var backdrop = new THREE.Mesh(new THREE.SphereGeometry(5000, 50, 50), material2);

    world.scene.add(backdrop);

    simulation.run();

    $('#js-btn-run').on('click', function() { simulation.run(); });
    $('#js-btn-stop').on('click', function() { simulation.stop(); });

    $('#js-gravity-off').on('click', function() { world.setGravity(0, 0, 0); });
    $('#js-gravity-on').on('click', function() { world.setGravity(0, -10, 0); });
});