define([], function () {
    var mesh = function () {
        this.vertices = [];
        this.faces = [];
    };

    mesh.prototype.vertices = [];
    mesh.prototype.faces = [];

    mesh.prototype.addVertex = function (vertex) {
        this.vertices.push(vertex);
    };

    mesh.prototype.addFace = function (face) {
        this.faces.push(face);
    };

    mesh.prototype.toThreeJsGeometry = function () {
        var geometry = new THREE.Geometry();

        for (var i = 0; i < this.vertices.length; i++) {
            var v = this.vertices[i];
            geometry.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for (var i = 0; i < this.faces.length; i++) {
            var f = this.faces[i];
            geometry.faces.push(new THREE.Face3(f.a, f.b, f.c));
        }

        geometry.computeCentroids();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        return geometry;
    };

    return mesh;
});