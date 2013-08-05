define(['mods/deformables/node', 'mods/deformables/spring'], function (Node, Spring) {

    var DeformableObject = function (surfaceStiffness, surfaceDamping, connectiveStiffness, connectiveDamping) {
        this.surfaceStiffness = surfaceStiffness;
        this.surfaceDamping = surfaceDamping;
        this.connectiveStiffness = connectiveStiffness;
        this.connectiveDamping = connectiveDamping;

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

    DeformableObject.prototype.createNodes = function (mesh, vertexMass) {
        var nodes = [];
        for (var i = 0, il = mesh.vertices.length; i < il; i++) {
            var node = new Node(mesh, i, vertexMass);
            nodes.push(node);
        }

        return nodes;
    };

    DeformableObject.prototype.createSurfaceSprings = function (mesh, nodes) {
        var edges = mesh.findEdges();
        var springs = []

        for (var i = 0, il = edges.length; i < il; i++) {
            var edge = edges[i];
            var node1 = nodes[edge.a];
            var node2 = nodes[edge.b];
            var spring = new Spring(node1, node2, this.surfaceStiffness, this.surfaceDamping);
            springs.push(spring);
        }

        return springs;
    };

    DeformableObject.prototype.createConnectiveSprings = function (outerMesh, innerMesh, outerNodes, innerNodes) {
        var springs = [];

        for (var i = 0, il = outerMesh.faces.length; i < il; i++) {
            var face = outerMesh.faces[i];

            var radialSpringA = new Spring(innerNodes[face.a], outerNodes[face.a], this.connectiveStiffness, this.connectiveDamping);
            var radialSpringB = new Spring(innerNodes[face.b], outerNodes[face.b], this.connectiveStiffness, this.connectiveDamping);
            var radialSpringC = new Spring(innerNodes[face.c], outerNodes[face.c], this.connectiveStiffness, this.connectiveDamping);

            var shearSpringAB = new Spring(innerNodes[face.a], outerNodes[face.b], this.connectiveStiffness, this.connectiveDamping);
            var shearSpringCA = new Spring(innerNodes[face.c], outerNodes[face.a], this.connectiveStiffness, this.connectiveDamping);

            springs.push(radialSpringA);
            springs.push(radialSpringB);
            springs.push(radialSpringC);
            springs.push(shearSpringAB);
            springs.push(shearSpringCA);
        }

        return springs;
    };

    DeformableObject.prototype.step = function (externalForces, integrator, dt) {
        for (var i = 0, il = this.springs.length; i < il; i++) {
            this.springs[i].apply();
        }

        for (var i = 0; i < this.pressureForces.length; i++) {
            this.pressureForces[i].apply();
        }

        for (var i = 0, il = this.nodes.length; i < il; i++) {
            var node = this.nodes[i];
            for (var j = 0, jl = externalForces.length; j < jl; j++) {
                externalForces[j].apply(node);
            }

            integrator.apply(node, dt);
            node.resetForce();
        }

        this.updateRenderMesh();
    };

    return DeformableObject;

});