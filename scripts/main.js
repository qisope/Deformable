require.config({
    paths: {
        jquery: 'libs/jquery'
    },
    waitSeconds: 180
});

require(['mods/simulation', 'mods/world', 'mods/objectFactory', 'mods/meshes/cube'], function (Simulation, World, ObjectFactory, Cube) {
    var world = new World(600, 600);
    var simulation = new Simulation('#container', world);

    world.addLight(50, 50, 50, 0xFFFFFF);
    world.addLight(-50, 50, -50, 0x888888);

    var objectFactory = new ObjectFactory();

    var material1 = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false });
    var material2 = new THREE.MeshPhongMaterial({ color: 0x00FF00, wireframe: false });

    var sphere = objectFactory.createSphere(12, 5, 2, 1.5, 300, 3, 15, 2, 2000, 10000, material1);
    var cube = objectFactory.createCube({x:20, y:20, z:20}, {x:10, y:10, z:10}, {x:6, y:6, z:6}, 1.2, 400, 4, 45, 2, 5000, 10000, material2);

    var sphere2 = objectFactory.createSphere(5, 2, 2, 1.5, 300, 3, 15, 2, 4000, 10000, material1);
    var cube2 = objectFactory.createCube({x:10, y:10, z:10}, {x:5, y:5, z:5}, {x:4, y:4, z:4}, 1.3, 200, 4, 45, 2, 4000, 5000, material2);

    sphere.renderMesh.position = new THREE.Vector3(-25, 0, 0);
    cube.renderMesh.position = new THREE.Vector3(25, 10, 0);

    sphere2.renderMesh.position = new THREE.Vector3(-25, 5, -20);
    cube2.renderMesh.position = new THREE.Vector3(25, 10, -30);

    world.addObject(sphere);
    world.addObject(cube);
    world.addObject(sphere2);
    world.addObject(cube2);
    world.setGravity(0, -10, 0);

    var material2 = new THREE.MeshBasicMaterial({ color: 0xBBBBBB, wireframe: true });
    var backdrop = new THREE.Mesh(new THREE.SphereGeometry(5000, 50, 50), material2);

    world.scene.add(backdrop);

    simulation.run();
});