define([
    'mods/deformables/deformableObject',
    'mods/deformables/node',
    'mods/deformables/spring',
    'mods/meshes/cube',
    'mods/forces/pressure'],
    function (
        DeformableObject,
        Node,
        Spring,
        Cube,
        PressureForce) {

        var DeformableCube = function (
            outerSize, innerSize,
            vertexCount,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            pressureConstantOuter, pressureConstantInner,
            material) {
            DeformableObject.call(this, surfaceStiffness, surfaceDamping, connectiveStiffness, connectiveDamping);

            this.outerSize = outerSize;
            this.innerSize = innerSize;
            this.vertexCount = vertexCount;
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

        DeformableCube.prototype = Object.create(DeformableObject.prototype);

        DeformableCube.prototype.makeDeformable = function () {
            this.outerMesh = new Cube(this.outerSize.x, this.outerSize.y, this.outerSize.z, this.vertexCount.x, this.vertexCount.y, this.vertexCount.z);
            this.innerMesh = new Cube(this.innerSize.x, this.innerSize.y, this.innerSize.z, this.vertexCount.x, this.vertexCount.y, this.vertexCount.z);

            this.outerNodes = DeformableObject.prototype.createNodes.call(this, this.outerMesh, this.vertexMass);
            this.innerNodes = DeformableObject.prototype.createNodes.call(this, this.innerMesh, this.vertexMass);

            this.outerSprings = DeformableObject.prototype.createSurfaceSprings.call(this, this.outerMesh, this.outerNodes);
            this.innerSprings = DeformableObject.prototype.createSurfaceSprings.call(this, this.innerMesh, this.innerNodes);
            this.connectiveSprings = DeformableObject.prototype.createConnectiveSprings.call(this, this.outerMesh, this.innerMesh, this.outerNodes, this.innerNodes);

            //------- hackery

            var fakeMesh = {vertices: [this.outerMesh.vertices[0].clone()]};
            var lockedNode = new Node(fakeMesh, 0, 1);
            var face = this.outerMesh.faces[0];
            var lockedSprings = [new Spring(lockedNode, this.outerNodes[face.a], 1000, 3)];
            //-------

            var allNodes = this.outerNodes.concat(this.innerNodes);
            var allSprings = this.outerSprings.concat(this.innerSprings, this.connectiveSprings, lockedSprings);

            for (var i = 0, il = allNodes.length; i < il; i++) {
                DeformableObject.prototype.addNode.call(this, allNodes[i]);
            }

            for (var i = 0, il = allSprings.length; i < il; i++) {
                DeformableObject.prototype.addSpring.call(this, allSprings[i]);
            }

            var geometry = this.outerMesh.toThreeJsGeometry();
            this.renderMesh = new THREE.Mesh(geometry, this.material);

        };

        return DeformableCube;
    });