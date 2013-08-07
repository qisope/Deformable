require.config({
    paths: {
        jquery: 'libs/jquery'
    },
    waitSeconds: 180
});

require(['mods/simulation', 'mods/world', 'mods/objectFactory', 'mods/meshes/cube'], function (Simulation, World, ObjectFactory, Cube) {

    var afterUpdate = function (t, td, world) {
        var x = 110 * Math.sin(t / 5);
        var z = 110 * Math.cos(t / 5);
        world.setCamera(x, 0, z, 0, 0, 0);
    };

    var processIntersections = function (oldIntersects, newIntersects) {
        if (oldIntersects) {
            for (var i = 0; i < oldIntersects.length; i++) {
                oldIntersects[i].face.color = new THREE.Color();
                oldIntersects[i].object.geometry.elementsNeedUpdate = true;
                oldIntersects[i].object.geometry.colorsNeedUpdate = true;
            }
        }

        if (newIntersects) {
            for (var i = 0; i < newIntersects.length; i++) {
                newIntersects[i].face.color = new THREE.Color(0x0000FF);
                newIntersects[i].object.geometry.elementsNeedUpdate = true;
                newIntersects[i].object.geometry.colorsNeedUpdate = true;
            }
        }
    };

    var world = new World(600, 600);
    var simulation = new Simulation('#container', world);
    simulation.afterUpdate = afterUpdate;
    simulation.processIntersections = processIntersections;

    world.addLight(50, 50, 50, 0xFFFFFF);
    world.addLight(-50, 50, -50, 0x888888);

    var objectFactory = new ObjectFactory();

    var material1 = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false, vertexColors: THREE.FaceColors });
    var material2 = new THREE.MeshPhongMaterial({ color: 0x00FF00, wireframe: false, vertexColors: THREE.FaceColors });

    var sphere = objectFactory.createSphere(12, 5, 2, 1.5, 300, 3, 15, 2, 2000, 10000, material1);
    var cube = objectFactory.createCube({x:20, y:20, z:20}, {x:10, y:10, z:10}, {x:6, y:6, z:6}, 1.2, 400, 4, 45, 2, 5000, 10000, material2);

    sphere.renderMesh.position = new THREE.Vector3(-25, 0, 0);
    cube.renderMesh.position = new THREE.Vector3(25, 10, 0);

    world.addObject(sphere);
    world.addObject(cube);
    world.setGravity(0, -10, 0);

    var material2 = new THREE.MeshBasicMaterial({ color: 0xBBBBBB, wireframe: true });
    var backdrop = new THREE.Mesh(new THREE.SphereGeometry(5000, 50, 50), material2);

    world.scene.add(backdrop);

    simulation.run();
});