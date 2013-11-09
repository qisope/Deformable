define(['jquery'], function ($, World) {

    var Simulation = function (containerSelector, world) {
        this.world = world;

        var $container = $(containerSelector);
        var domElement = this.world.getDomElement();
        $container.append(domElement);

        var $domElement = $(domElement);
        this.width = $domElement.width();
        this.height = $domElement.height();

        var instance = this;
        $domElement.on('mousedown', function(e) { instance.mouseDown = e; });
        $domElement.on('mouseup', function(e) { instance.mouseUp = e; });
        $domElement.on('mousemove', function(e) { instance.mouseMove = e; });

        this.projector = new THREE.Projector();
    };

    Simulation.prototype.run = function () {
        if (this.running)
            return;

        this.running = true;
        var instance = this;
        var stepSizeMs = 6;
        var lastRemainderMs = 0;

        window.requestAnimationFrame(function renderLoop(timeMs) {

            if (instance.running) {
                window.requestAnimationFrame(renderLoop);

                var frameTimeMs = timeMs - (instance.previousFrameTimeMs || timeMs) + lastRemainderMs;
                instance.previousFrameTimeMs = timeMs;

                var steps = Math.floor(frameTimeMs / stepSizeMs);
                lastRemainderMs = frameTimeMs % stepSizeMs;

                instance.processMouse();

                for (var i=0; i<steps; i++) {
                    var stepTimeMs = instance.previousFrameTimeMs + stepSizeMs*i;
                    var td = stepSizeMs / 1000;
                    instance.world.step(td);
                }

                instance.world.render();
            }
        });
    };

    Simulation.prototype.stop = function () {
        this.running = false;
        delete this.previousFrameTimeMs;
    };

    Simulation.prototype.onMouseDown = null;
    Simulation.prototype.onMouseUp = null;
    Simulation.prototype.onMouseMove = null;

    Simulation.prototype.processMouse = function () {
        this.processMouseEvents(this.onMouseDown, this.mouseDown);
        this.processMouseEvents(this.onMouseUp, this.mouseUp);
        this.processMouseEvents(this.onMouseMove, this.mouseMove);

        this.mouseDown = null;
        this.mouseUp = null;
        this.mouseMove = null;
    };

    Simulation.prototype.processMouseEvents = function (handler, e) {
        if (handler && e) {
            var vFar = getMouseFar(e);
            var intersections = getInersections(vFar);
            handler(intersections);
        }
    };

    Simulation.prototype.getMouseFar = function (event) {
        return new THREE.Vector3((event.clientX / this.width) * 2 - 1, 1 - (event.clientY / this.height) * 2, 1)
    };

    Simulation.prototype.getInersections = function (vFar) {
        var pFar = this.projector.unprojectVector(vFar.clone(), this.world.camera);
        var direction = pFar.sub(this.world.camera.position).normalize();
        var rc = new THREE.Raycaster(this.world.camera.position, direction);

        return rc.intersectObjects(this.world.scene.children, false); // TODO not use scene.children
    };

    return Simulation;
});