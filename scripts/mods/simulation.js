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

    Simulation.prototype.processIntersections = null;

    Simulation.prototype.run = function () {
        if (this.running)
            return;

        this.running = true;
        var that = this;
        var stepSizeMs = 6;
        var lastRemainderMs = 0;

        window.requestAnimationFrame(function renderLoop(timeMs) {

            if (that.running) {
                window.requestAnimationFrame(renderLoop);

                var frameTimeMs = timeMs - (that.previousFrameTimeMs || timeMs) + lastRemainderMs;
                that.previousFrameTimeMs = timeMs;

                var steps = Math.floor(frameTimeMs / stepSizeMs);
                lastRemainderMs = frameTimeMs % stepSizeMs;

                that.processMouse();

                for (var i=0; i<steps; i++) {
                    var stepTimeMs = that.previousFrameTimeMs + stepSizeMs*i;
                    var td = stepSizeMs / 1000;
                    that.world.step(td);
                }

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

        var newIntersections = rc.intersectObjects(this.world.scene.children, false);

        if (this.processIntersections) {
            this.processIntersections(this.intersections, newIntersections);
        }

        this.intersections = newIntersections;
    };

    return Simulation;
});