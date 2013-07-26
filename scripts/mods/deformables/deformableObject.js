define([], function () {

    var DeformableObject = function () {
        this.nodes = [];
        this.springs = [];
        this.pressureForces = [];
    };

    DeformableObject.prototype.addNode = function (node) {
        this.nodes.push(node);
    };

    DeformableObject.prototype.addSpring = function (spring) {
        this.springs.push(spring);
    };

    DeformableObject.prototype.addPressureForce = function (pressureForce) {
        this.pressureForces.push(pressureForce);
    };

    DeformableObject.prototype.getRenderMesh = function () {
        return this.renderMesh;
    };

    DeformableObject.prototype.updateRenderMesh = function () {
    };

    DeformableObject.prototype.step = function (externalForces, integrator, dt) {
        for (var i = 0; i < this.springs.length; i++) {
            this.springs[i].apply();
        }

        for (var i = 0; i < this.pressureForces.length; i++) {
            this.pressureForces[i].apply();
        }

        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            for (var j = 0; j < externalForces.length; j++) {
                externalForces[j].apply(node);
            }

            integrator.apply(node, dt);
            node.resetForce();
        }

        this.updateRenderMesh();
    };

    return DeformableObject;

});