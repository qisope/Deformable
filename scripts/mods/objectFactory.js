define(['mods/deformables/deformableSphere'], function (DeformableSphere) {
    var factory = function () {
    };

    factory.prototype.createSphere = function (
        outerRadius,
            innerRadius,
            refinements,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            material,
            pressureConstantOuter, pressureConstantInner) {
        var sphere = new DeformableSphere(
            outerRadius,
            innerRadius,
            refinements,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            material,
            pressureConstantOuter, pressureConstantInner);
        return sphere;
    };

    return factory;
});