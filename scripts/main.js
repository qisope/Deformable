require.config({
    paths: {
        jquery: 'libs/jquery'
    },
    waitSeconds: 180
});

require(['mods/simulation', 'mods/world', 'mods/objectFactory'], function (Simulation, World, ObjectFactory) {
    var world = new World(600, 600);
    var simulation = new Simulation('#container', world);

    world.addLight(50, 50, 50, 0xFFFFFF);
    world.addLight(-50, 50, -50, 0x888888);

    var objectFactory = new ObjectFactory();

    var material = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false });
    var sphere = objectFactory.createSphere(10, 5, 2, 1.5, 300, 3, 15, 2, material, 2000,10000);

    world.addObject(sphere);
    world.setGravity(0, -10, 0);

    var material2 = new THREE.MeshBasicMaterial({ color: 0xEEEEEE, wireframe: true });
    var backdrop = new THREE.Mesh(new THREE.SphereGeometry(5000, 50, 50), material2);

    world.scene.add(backdrop);

    simulation.run();
});