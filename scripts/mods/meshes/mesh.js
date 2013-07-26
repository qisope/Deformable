define([], function () {
    var mesh = function () {
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

    mesh.prototype.findEdges = function () {
        var edges = [];
        var keys = {};

        var recordEdge = function (v1, v2) {
            if (v2 < v1) {
                var t = v1;
                v1 = v2;
                v2 = t;
            }

            var key = v1 + '-' + v2;
            if (!keys[key]) {
                keys[key] = true;
                edges.push({ a: v1, b: v2 });
            }
        };

        for (var i = 0; i < this.faces.length; i++) {
            var face = this.faces[i];
            recordEdge(face.a, face.b);
            recordEdge(face.b, face.c);
            recordEdge(face.c, face.a);
        }

        return edges;
    };

    mesh.prototype.getVolume = function () {
        if (this.vertices.length > 0) {
            var vertex = this.vertices[0];
            var min = vertex.clone();
            var max = vertex.clone();

            for (var i = 1, il = this.vertices.length; i < il; i++) {
                vertex = this.vertices[i];
                if (vertex.x < min.x) min.x = vertex.x;
                else if (vertex.x > max.x) max.x = vertex.x;
                if (vertex.y < min.y) min.y = vertex.y;
                else if (vertex.y > max.y) max.y = vertex.y;
                if (vertex.z < min.z) min.z = vertex.z;
                else if (vertex.z > max.z) max.z = vertex.z;
            }

            return (max.x - min.x)*(max.y - min.y)*(max.z - min.z);
        }

        return 0;
    };

    return mesh;
});