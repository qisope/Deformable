define(['mods/meshes/mesh'], function (Mesh) {

    var Icosphere = function (radius, refinements) {
        this.radius = radius;
        this.refinements = refinements;

        Mesh.call(this);
        this.vertices = [];
        this.faces = [];
        this.middlePointCache = {};

        this.createIcosahedron();
    };

    Icosphere.prototype = Object.create(Mesh.prototype);

    Icosphere.prototype.createIcosahedron = function () {
        var t = (1 + Math.sqrt(5)) / 2;

        this.addVertex(new THREE.Vector3(-1, t, 0));
        this.addVertex(new THREE.Vector3(1, t, 0));
        this.addVertex(new THREE.Vector3(-1, -t, 0));
        this.addVertex(new THREE.Vector3(1, -t, 0));

        this.addVertex(new THREE.Vector3(0, -1, t));
        this.addVertex(new THREE.Vector3(0, 1, t));
        this.addVertex(new THREE.Vector3(0, -1, -t));
        this.addVertex(new THREE.Vector3(0, 1, -t));

        this.addVertex(new THREE.Vector3(t, 0, -1));
        this.addVertex(new THREE.Vector3(t, 0, 1));
        this.addVertex(new THREE.Vector3(-t, 0, -1));
        this.addVertex(new THREE.Vector3(-t, 0, 1));

        var faces = [];
 
        faces.push(new THREE.Face3(0, 11, 5));
        faces.push(new THREE.Face3(0, 5, 1));
        faces.push(new THREE.Face3(0, 1, 7));
        faces.push(new THREE.Face3(0, 7, 10));
        faces.push(new THREE.Face3(0, 10, 11));
 
        faces.push(new THREE.Face3(1, 5, 9));
        faces.push(new THREE.Face3(5, 11, 4));
        faces.push(new THREE.Face3(11, 10, 2));
        faces.push(new THREE.Face3(10, 7, 6));
        faces.push(new THREE.Face3(7, 1, 8));
 
        faces.push(new THREE.Face3(3, 9, 4));
        faces.push(new THREE.Face3(3, 4, 2));
        faces.push(new THREE.Face3(3, 2, 6));
        faces.push(new THREE.Face3(3, 6, 8));
        faces.push(new THREE.Face3(3, 8, 9));
 
        faces.push(new THREE.Face3(4, 9, 5));
        faces.push(new THREE.Face3(2, 4, 11));
        faces.push(new THREE.Face3(6, 2, 10));
        faces.push(new THREE.Face3(8, 6, 7));
        faces.push(new THREE.Face3(9, 8, 1));

        this.refine(faces);
    };

    Icosphere.prototype.refine = function (faces) {

        for (var i = 0; i < this.refinements; i++) {
            var faces2 = []
            for (var j = 0; j < faces.length; j++) {
                var face = faces[j];

                var a = this.getMiddlePoint(face.a, face.b);
                var b = this.getMiddlePoint(face.b, face.c);
                var c = this.getMiddlePoint(face.c, face.a);

                faces2.push(new THREE.Face3(face.a, a, c));
                faces2.push(new THREE.Face3(face.b, b, a));
                faces2.push(new THREE.Face3(face.c, c, b));
                faces2.push(new THREE.Face3(a, b, c));
            }

            faces = faces2;
        }

        for (var i = 0; i < faces.length; i++) {
            this.addFace(faces[i]);
        }
    };

    Icosphere.prototype.addVertex = function (vertex) {
        var length = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z) / this.radius;
        Mesh.prototype.addVertex.call(this, new THREE.Vector3(vertex.x/length, vertex.y/length, vertex.z/length));
        return this.vertices.length-1;
    };

    Icosphere.prototype.getMiddlePoint = function (v1, v2) {

        var key = v1 <= v2 ? (v1 + '-' + v2) : (v2 + '-' + v1);
        if (this.middlePointCache[key]) {
            return this.middlePointCache[key];
        }

        var vertex1 = this.vertices[v1];
        var vertex2 = this.vertices[v2];
        var middle = new THREE.Vector3(
            (vertex1.x + vertex2.x) / 2,
            (vertex1.y + vertex2.y) / 2,
            (vertex1.z + vertex2.z) / 2);

        var v3 = this.addVertex(middle);
        this.middlePointCache[key] = v3;
        return v3;
    };

    return Icosphere;
});