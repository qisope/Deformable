define([
    'mods/deformables/deformableObject',
    'mods/deformables/node',
    'mods/deformables/spring',
    'mods/meshes/icosphere',
    'mods/forces/pressure'],
    function (
        DeformableObject,
        Node,
        Spring,
        Icosphere,
        PressureForce) {

        var DeformableSphere = function (
            outerRadius,
            innerRadius,
            refinements,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            material,
            pressureConstantOuter,
            pressureConstantInner) {
            DeformableObject.call(this);

            this.outerRadius = outerRadius;
            this.innerRadius = innerRadius;
            this.refinements = refinements;
            this.vertexMass = vertexMass;
            this.surfaceStiffness = surfaceStiffness;
            this.surfaceDamping = surfaceDamping;
            this.connectiveStiffness = connectiveStiffness;
            this.connectiveDamping = connectiveDamping;
            this.material = material;

            this.makeDeformable();

            var pressureForceOuter = new PressureForce(pressureConstantOuter, this, this.outerMesh);
            var pressureForceInner = new PressureForce(pressureConstantOuter, this, this.innerMesh);

            DeformableObject.prototype.addPressureForce.call(this, pressureForceOuter);
            DeformableObject.prototype.addPressureForce.call(this, pressureForceInner);
        };

        DeformableSphere.prototype = Object.create(DeformableObject.prototype);

        DeformableSphere.prototype.makeDeformable = function () {
            this.outerMesh = new Icosphere(this.outerRadius, this.refinements);
            this.innerMesh = new Icosphere(this.innerRadius, this.refinements);

            this.outerNodes = this.createNodes(this.outerMesh);
            this.innerNodes = this.createNodes(this.innerMesh);

            this.outerSprings = this.createSurfaceSprings(this.outerMesh, this.outerNodes);
            this.innerSprings = this.createSurfaceSprings(this.innerMesh, this.innerNodes);
            this.connectiveSprings = this.createConnectiveSprings(this.outerMesh, this.innerMesh, this.outerNodes, this.innerNodes);

            //------- hackery

            var fakeMesh = {vertices: [new THREE.Vector3(0, 0, 0)]};
            var lockedNode = new Node(fakeMesh, 0, 1);
            var face = this.outerMesh.faces[0];
            var lockedSprings = [new Spring(lockedNode, this.outerNodes[face.c], 800, 10)];
            fakeMesh.vertices[0].y = 18;
            //-------

            var allNodes = this.outerNodes.concat(this.innerNodes);
            var allSprings = this.outerSprings.concat(this.innerSprings, this.connectiveSprings, lockedSprings);

            for (var i = 0; i < allNodes.length; i++) {
                DeformableObject.prototype.addNode.call(this, allNodes[i]);
            }

            for (var i = 0; i < allSprings.length; i++) {
                DeformableObject.prototype.addSpring.call(this, allSprings[i]);
            }

            var geometry = this.outerMesh.toThreeJsGeometry();
            this.renderMesh = new THREE.Mesh(geometry, this.material);

        };

        DeformableSphere.prototype.createNodes = function (mesh) {
            var nodes = [];
            for (var i = 0; i < mesh.vertices.length; i++) {
                var node = new Node(mesh, i, this.vertexMass);
                nodes.push(node);
            }

            return nodes;
        };

        DeformableSphere.prototype.createSurfaceSprings = function (mesh, nodes) {
            var edges = mesh.findEdges();
            var springs = []

            for (var i = 0; i < edges.length; i++) {
                var edge = edges[i];
                var node1 = nodes[edge.a];
                var node2 = nodes[edge.b];
                var spring = new Spring(node1, node2, this.surfaceStiffness, this.surfaceDamping);
                springs.push(spring);
            }

            return springs;
        };

        DeformableSphere.prototype.createConnectiveSprings = function (outerMesh, innerMesh, outerNodes, innerNodes) {
            var springs = [];

            for (var i = 0; i < outerMesh.faces.length; i++) {
                var face = outerMesh.faces[i];

                var radialSpringA = new Spring(innerNodes[face.a], outerNodes[face.a], this.connectiveStiffness, this.connectiveDamping);
                var radialSpringB = new Spring(innerNodes[face.b], outerNodes[face.a], this.connectiveStiffness, this.connectiveDamping);
                var radialSpringC = new Spring(innerNodes[face.c], outerNodes[face.a], this.connectiveStiffness, this.connectiveDamping);

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

        DeformableSphere.prototype.updateRenderMesh = function () {
            for (var i = 0; i < this.outerMesh.vertices.length; i++) {
                var dataVertex = this.outerMesh.vertices[i];
                var renderVertex = this.renderMesh.geometry.vertices[i];
                renderVertex.x = dataVertex.x;
                renderVertex.y = dataVertex.y;
                renderVertex.z = dataVertex.z;
            }

            this.renderMesh.geometry.verticesNeedUpdate = true;
        };

        return DeformableSphere;
    });