define(['mods/deformables/deformableSphere', 'mods/deformables/deformableCube'], function (DeformableSphere, DeformableCube) {
    var factory = function () {
    };

    factory.prototype.createSphere = function (
        outerRadius,
            innerRadius,
            refinements,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            pressureConstantOuter, pressureConstantInner,
            material) {
        var sphere = new DeformableSphere(
            outerRadius,
            innerRadius,
            refinements,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            pressureConstantOuter, pressureConstantInner,
            material);
        return sphere;
    };

    factory.prototype.createCube = function (
            outerSize, innerSize,
            vertexCount,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            pressureConstantOuter, pressureConstantInner,
            material) {
        var cube = new DeformableCube(
            outerSize, innerSize,
            vertexCount,
            vertexMass,
            surfaceStiffness, surfaceDamping,
            connectiveStiffness, connectiveDamping,
            pressureConstantOuter, pressureConstantInner,
            material);
        return cube;
    };

    return factory;
});