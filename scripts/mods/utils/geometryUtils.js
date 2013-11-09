define([], function () {
	var utils = {};

    utils.findEdges = function (geometry) {
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

        for (var i = 0; i < geometry.faces.length; i++) {
            var face = geometry.faces[i];
            recordEdge(face.a, face.b);
            recordEdge(face.b, face.c);
            recordEdge(face.c, face.a);
        }

        return edges;
    };

    utils.getVolume = function (geometry) {
        if (geometry.vertices.length > 0) {
            var vertex = geometry.vertices[0];
            var min = vertex.clone();
            var max = vertex.clone();

            for (var i = 1, il = geometry.vertices.length; i < il; i++) {
                vertex = geometry.vertices[i];
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

    return utils;
});