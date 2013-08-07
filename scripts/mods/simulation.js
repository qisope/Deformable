define(['jquery'], function ($, World) {

    var Simulation = function (containerSelector, world) {
        this.world = world;

        var $container = $(containerSelector);
        var domElement = this.world.getDomElement();
        $container.append(domElement);

        var $domElement = $(domElement);
        this.width = $domElement.width();
        this.height = $domElement.height();

        var that = this;
        $domElement.on('mousemove', function (e) { that.onMouseMove(e); });

        this.projector = new THREE.Projector();
    };

    Simulation.prototype.onMouseMove = function () {
        this.mouseFar = new THREE.Vector3((event.clientX / this.width) * 2 - 1, 1 - (event.clientY / this.height) * 2, 1);
    };

    Simulation.prototype.beforeUpdate = null;
    Simulation.prototype.afterUpdate = null;
    Simulation.prototype.hoverObjectChanged = null;
    Simulation.prototype.processIntersections = null;

    Simulation.prototype.run = function () {
        this.running = true;
        var that = this;

        window.requestAnimationFrame(function renderLoop(timeMs) {

            if (that.running) {
                window.requestAnimationFrame(renderLoop);

                var frameTimeMs = timeMs - (that.previousFrameTimeMs || timeMs);
                that.previousFrameTimeMs = timeMs;

                var t = timeMs / 1000;
                var td = frameTimeMs / 1000;

                if (that.beforeUpdate) {
                    that.beforeUpdate(t, td, that.world);
                };

                that.processMouse();
                that.world.step(td);

                if (that.afterUpdate) {
                    that.afterUpdate(t, td, that.world);
                };

                that.world.render();
            }
        });
    };

    Simulation.prototype.stop = function () {
        this.running = false;
        delete this.previousFrameTimeMs;
    };

    Simulation.prototype.processMouse = function () {
        if (!this.mouseFar) {
            return;
        }

        var pFar = this.projector.unprojectVector(this.mouseFar.clone(), this.world.camera);
        var direction = pFar.sub(this.world.camera.position).normalize();
        var rc = new THREE.Raycaster(this.world.camera.position, direction);

        var newIntersections = rc.intersectObjects(this.world.scene.__objects);

        if (this.processIntersections) {
            this.processIntersections(this.intersections, newIntersections);
        }

        this.intersections = newIntersections;
    };

    return Simulation;
});