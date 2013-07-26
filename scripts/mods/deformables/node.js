define([], function () {
    var Node = function (mesh, vertex, mass) {
        this.mesh = mesh;
        this.vertex = vertex;
        this.mass = mass;
        this.velocity = new THREE.Vector3();
        this.force = new THREE.Vector3();
    };

    Node.prototype.getPosition = function () {
        return this.mesh.vertices[this.vertex].clone();
    };

    Node.prototype.getVelocity = function () {
        return this.velocity.clone();
    };

    Node.prototype.setPosition = function (position) {
        this.mesh.vertices[this.vertex] = position.clone();
    };

    Node.prototype.setVelocity = function (velocity) {
        this.velocity = velocity.clone();
    };

    Node.prototype.resetForce = function () {
        this.force = new THREE.Vector3();
    };

    Node.prototype.addForce = function (force) {
        this.force.add(force);
    };

    Node.prototype.getForce = function () {
        return this.force.clone();
    };

    return Node;
});