define([], function () {
    var Spring = function (node1, node2, stiffness, damping) {
        this.node1 = node1;
        this.node2 = node2;
        this.stiffness = stiffness;
        this.damping = damping;
        this.restLength = node1.getPosition().distanceTo(node2.getPosition());
    };

    Spring.prototype.apply = function () {
        var direction = this.node1.getPosition()
            .sub(this.node2.getPosition());

        if (direction.x || direction.y || direction.z) {
            var length = direction.length();

            direction.normalize();

            var force = direction
                .clone()
                .multiplyScalar(-this.stiffness * (length - this.restLength));

            var velocity1 = this.node1.getVelocity();
            var velocity2 = this.node2.getVelocity();

            var factor = -this.damping * velocity1.sub(velocity2).dot(direction);
            var damping = direction.clone().multiplyScalar(factor);

            force.add(damping);

            this.node1.addForce(force);
            this.node2.addForce(force.negate());
        }
    };

    return Spring;
});