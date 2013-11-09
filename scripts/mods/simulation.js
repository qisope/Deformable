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
        $domElement.on('mousedown', function(e) { e.preventDefault(); instance.mouseDown = e; });
        $domElement.on('mouseup', function(e) { e.preventDefault(); instance.mouseUp = e; });
        $domElement.on('mousemove', function(e) { e.preventDefault(); instance.mouseMove = e; });
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

    Simulation.prototype.processMouseEvents = function (handler, mouseEvent) {
        if (handler && mouseEvent) {
            var vFar = this.getMouseFar(mouseEvent);
            var intersections = this.world.getInersections(vFar);
            handler(intersections, mouseEvent);
        }
    };

    Simulation.prototype.getMouseFar = function (mouseEvent) {
        return new THREE.Vector3((mouseEvent.offsetX / this.width) * 2 - 1, 1 - (mouseEvent.offsetY / this.height) * 2, 1)
    };

    return Simulation;
});