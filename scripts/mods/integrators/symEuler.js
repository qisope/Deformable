define([], function () {
    var SymEuler = function () {
    };

    SymEuler.prototype.apply = function (node, dt) {
        var a = node.getForce().divideScalar(node.mass);
        var v0 = node.getVelocity();
        var x0 = node.getPosition();
        var v1 = v0.add(a.multiplyScalar(dt));
        var x1 = x0.add(v1.clone().multiplyScalar(dt));

        node.setVelocity(v1);
        node.setPosition(x1);
    };

    return SymEuler;
});