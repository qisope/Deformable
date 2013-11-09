define(['mods/meshes/mesh'], function (Mesh) {

    var CubeGeometry = function (x, y, z, xf, yf, zf) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.xf = xf;
        this.yf = yf;
        this.zf = zf;

        this.mesh = new Mesh();
    };

    CubeGeometry.prototype.create = function () {
        var vertexCache = {};
        var that = this;

        //left
        this.buildFace(this.yf, 0, -1, 1, this.yf, this.zf, function (u, v) { return that.getVertex(0, u, v, vertexCache); });
        //right
        this.buildFace(this.yf, this.zf, -1, -1, this.yf, this.zf, function (u, v) { return that.getVertex(that.xf, u, v, vertexCache); });
        //top
        this.buildFace(0, 0, 1, 1, this.xf, this.zf, function (u, v) { return that.getVertex(v, that.yf, u, vertexCache); });
        //bottom
        this.buildFace(0, this.zf, 1, -1, this.xf, this.zf, function (u, v) { return that.getVertex(v, 0, u, vertexCache); });
        //front
        this.buildFace(0, this.yf, 1, -1, this.xf, this.yf, function (u, v) { return that.getVertex(v, u, that.zf, vertexCache); });
        //back
        this.buildFace(this.xf, this.yf, -1, -1, this.xf, this.zf, function (u, v) { return that.getVertex(v, u, 0, vertexCache); });

        return this.mesh.toThreeJsGeometry();
    };

    CubeGeometry.prototype.buildFace = function (u0, v0, ui, vi, us, vs, getVertex) {
        for (var i = 0, u = u0; i < us; i++, u += ui) {
            for (var j = 0, v = v0; j < vs; j++, v += vi) {
                var v1 = getVertex(u, v);
                var v2 = getVertex(u + ui, v);
                var v3 = getVertex(u + ui, v + vi);
                var v4 = getVertex(u, v + vi);

                this.mesh.faces.push(new THREE.Face3(v1, v2, v3));
                this.mesh.faces.push(new THREE.Face3(v1, v3, v4));
            }
        }
    };

    CubeGeometry.prototype.getVertex = function (x, y, z, vertexCache) {
        var key = x + "," + y + "," + z;
        var vi = vertexCache[key];
        if (vi === undefined) {
            var vertex = new THREE.Vector3(-this.x / 2 + this.x * x / this.xf, - this.y / 2 + this.y * y / this.yf, -this.z / 2 + this.z * z / this.zf);
            this.mesh.vertices.push(vertex);
            vi = this.mesh.vertices.length - 1;
            vertexCache[key] = vi;
        }

        return vi;
    };

    return CubeGeometry;
});