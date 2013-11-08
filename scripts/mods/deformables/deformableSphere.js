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
            pressureConstantOuter,
            pressureConstantInner,
            material) {
            DeformableObject.call(this, surfaceStiffness, surfaceDamping, connectiveStiffness, connectiveDamping);

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

            this.outerNodes = DeformableObject.prototype.createNodes.call(this, this.outerMesh, this.vertexMass);
            this.innerNodes = DeformableObject.prototype.createNodes.call(this, this.innerMesh, this.vertexMass);

            this.outerSprings = DeformableObject.prototype.createSurfaceSprings.call(this, this.outerMesh, this.outerNodes);
            this.innerSprings = DeformableObject.prototype.createSurfaceSprings.call(this, this.innerMesh, this.innerNodes);
            this.connectiveSprings = DeformableObject.prototype.createConnectiveSprings.call(this, this.outerMesh, this.innerMesh, this.outerNodes, this.innerNodes);

            //------- hackery

            var fakeMesh = {vertices: [this.outerMesh.vertices[0].clone()]};
            var lockedNode = new Node(fakeMesh, 0, 1);
            var face = this.outerMesh.faces[0];
            var lockedSprings = [new Spring(lockedNode, this.outerNodes[face.c], 800, 10)];
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

        return DeformableSphere;
    });