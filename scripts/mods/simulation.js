define(['jquery'], function ($, World) {

    var Simulation = function (containerSelector, world) {
        this.world = world;

        var $container = $(containerSelector);
        $container.append(this.world.getDomElement());
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

                instance.world.render();
            }
        });
    };

    return Simulation;
});