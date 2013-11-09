require.config({
    paths: {
        jquery: 'libs/jquery'
    },
    waitSeconds: 180
});

require(
    ['mods/simulation', 'mods/world', 'mods/objectFactory', 'mods/actions/objectGrabber'],
    function (Simulation, World, ObjectFactory, ObjectGrabber) {

        var _world = new World(600, 600);
        var _simulation = new Simulation('#container', _world);

        var setUpWorld = function(){
            _world.setCamera(110, 0, 110, 0, 0, 0);
            _world.addLight(50, 50, 50, 0xFFFFFF);
            _world.addLight(-50, 50, 50, 0x888888);
            _world.setGravity(0, -10, 0);
        };

        var createObjects = function() {
            var objectFactory = new ObjectFactory();

            var material1 = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false, vertexColors: THREE.FaceColors });
            var material2 = new THREE.MeshPhongMaterial({ color: 0x00FF00, wireframe: false, vertexColors: THREE.FaceColors });

            var sphere = objectFactory.createSphere(12, 6, 2, 0.8, 200, 10, 15, 2, 2000, 10000, material1);
            var cube = objectFactory.createCube({x:20, y:20, z:20}, {x:10, y:10, z:10}, {x:6, y:6, z:6}, 3.0, 400, 10, 85, 20, 5000, 10000, material2);

            sphere.renderMesh.position = new THREE.Vector3(-25, 0, 0);
            cube.renderMesh.position = new THREE.Vector3(25, 10, 0);

            _world.addObject(sphere);
            _world.addObject(cube);
        };

        var setUpActions = function () {
            var objectGrabber = new ObjectGrabber();

            _simulation.onMouseDown = function (intersections) {
                objectGrabber.grab();
            };

            _simulation.onMouseUp = function (intersections) {
                objectGrabber.release();
            };
        };

        var setUpUI = function() {
            $('#js-btn-run').on('click', function() { _simulation.run(); });
            $('#js-btn-stop').on('click', function() { _simulation.stop(); });

            $('#js-gravity-off').on('click', function() { _world.setGravity(0, 0, 0); });
            $('#js-gravity-on').on('click', function() { _world.setGravity(0, -10, 0); });
        };

        setUpWorld();
        createObjects();
        setUpActions();
        setUpUI();

        _simulation.run();
    });