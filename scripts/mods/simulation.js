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
        $domElement.on('mousemove', function (event) {
            that.mouseFar = new THREE.Vector3((event.clientX / that.width) * 2 - 1, 1 - (event.clientY / that.height) * 2, 1);
        });

        this.projector = new THREE.Projector();
    };

    Simulation.prototype.run = function () {
        var instance = this;

        window.requestAnimationFrame(function renderLoop(timeMs) {
            window.requestAnimationFrame(renderLoop);

            if (timeMs < 60000) {
                var frameTimeMs = timeMs - (instance.previousFrameTimeMs || timeMs);
                instance.previousFrameTimeMs = timeMs;

                instance.world.step(frameTimeMs / 1000);

                var x = 110 * Math.sin(timeMs / 5000);
                var z = 110 * Math.cos(timeMs / 5000);
                instance.world.setCamera(x, 0, z, 0, 0, 0);

                instance.processMouse();
                instance.world.render();
            }
        });
    };

    Simulation.prototype.processMouse = function () {
        if (!this.mouseFar) {
            return;
        }

        var pFar = this.projector.unprojectVector(this.mouseFar.clone(), this.world.camera);
        var direction = pFar.sub(this.world.camera.position).normalize();
        var rc = new THREE.Raycaster(this.world.camera.position, direction);
        var intersections = rc.intersectObjects(this.world.scene.__objects);

        var newSelection = intersections.length > 0 ? intersections[0].object : null;

        if (newSelection !== this.selection) {
            if (this.selection) {
                this.selection.material.transparent = false;
                this.selection.material.opacity = 1;
            }

            this.selection = newSelection;

            if (this.selection) {
                this.selection.material.transparent = true;
                this.selection.material.opacity = 0.5;
            }
        }
    };

    return Simulation;
});