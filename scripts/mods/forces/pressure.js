define(['mods/utils/geometryUtils'], function (geometryUtils) {
    var PressureForce = function (pressureConstant, shape, mesh) {
        this.pressureConstant = pressureConstant;
        this.shape = shape;
        this.mesh = mesh;
    };

    PressureForce.prototype.apply = function () {
        var volume = geometryUtils.getVolume(this.mesh);
        if (volume <= 0)
            return;

        var pressure = this.pressureConstant / volume;

        for (var i = 0, il = this.mesh.faces.length; i < il; i++) {
            var face = this.mesh.faces[i];

            var nodeA = this.shape.nodes[face.a];
            var nodeB = this.shape.nodes[face.b];
            var nodeC = this.shape.nodes[face.c];

            var triangle = new THREE.Triangle(nodeA.getPosition(), nodeB.getPosition(), nodeC.getPosition());
            var plane = triangle.plane();
            var faceNormal = plane.normal;
            var area = triangle.area();
            var faceForceMagnitude = pressure * area;
            var vertexForce = faceNormal.clone().multiplyScalar(faceForceMagnitude / 3);

            nodeA.addForce(vertexForce);
            nodeB.addForce(vertexForce);
            nodeC.addForce(vertexForce);

            var velocity1 = nodeA.getVelocity();
            var velocity2 = nodeB.getVelocity();
            var velocity3 = nodeC.getVelocity();

            var velocity = velocity1.add(velocity2).add(velocity3);
            velocity.divideScalar(3);

            var airResistance = 0.002;

            var fx = velocity.x*velocity.x * airResistance * area;
            var fy = velocity.y*velocity.y * airResistance * area;
            var fz = velocity.z*velocity.z * airResistance * area;

            var resistanceForceMagnitude = new THREE.Vector3(fx, fy, fz).length();

            velocity.normalize().negate().multiplyScalar(resistanceForceMagnitude).divideScalar(3);

            nodeA.addForce(velocity);
            nodeB.addForce(velocity);
            nodeC.addForce(velocity);
        }
    };

    return PressureForce;
});