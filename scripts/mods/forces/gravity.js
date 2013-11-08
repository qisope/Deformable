define([], function () {
    var GravityForce = function (acceleration) {
        this.acceleration = acceleration;
    };

    GravityForce.prototype.apply = function (node) {
        var f = this.acceleration
            .clone()
            .multiplyScalar(node.mass);
        node.addForce(f);
    };

    return GravityForce;
});