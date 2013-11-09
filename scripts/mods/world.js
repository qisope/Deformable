define(['mods/integrators/symEuler', 'mods/forces/gravity'], function (SymEuler, Gravity) {

    var viewAngle = 45;
    var near = 0.1;
    var far = 10000;

    var World = function (width, height) {
        var aspect = width / height;

        this.camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);

        this.integrator = new SymEuler();

        this.meshes = [];
        this.objects = [];
        this.forces = [];
        this.objectsByMeshId = {};

        this.gravity = new Gravity(new THREE.Vector3(0, 0, 0));
        this.forces.push(this.gravity);

        this.projector = new THREE.Projector();
    };

    World.prototype.getDomElement = function () {
        return this.renderer.domElement;
    };

    World.prototype.addLight = function (x, y, z, color) {
        var light = new THREE.PointLight(color);
        light.position.x = x;
        light.position.y = y;
        light.position.z = z;
        this.scene.add(light);
    };

    World.prototype.setCamera = function (x, y, z, lookatX, lookatY, lookatZ) {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.camera.position.z = z;
        this.camera.lookAt(new THREE.Vector3(lookatX, lookatY, lookatZ));
    };

    World.prototype.addObject = function (object) {
        var renderMesh = object.getRenderMesh();
        this.scene.add(renderMesh);
        this.meshes.push(renderMesh);
        this.objects.push(object);
        this.objectsByMeshId[renderMesh.uuid] = object;
    };

    World.prototype.setGravity = function (x, y, z) {
        this.gravity.acceleration = new THREE.Vector3(x, y, z);
    };

    World.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    World.prototype.step = function (dt) {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].step(this.forces, this.integrator, dt);
        }
    };

    World.prototype.getInersections = function (vFar) {
        var pFar = this.projector.unprojectVector(vFar.clone(), this.camera);
        var direction = pFar.sub(this.camera.position).normalize();
        var rc = new THREE.Raycaster(this.camera.position, direction);

        var intersections = rc.intersectObjects(this.meshes, false);
        var result = [];

        if (intersections && intersections.length) {
            for (var i=0, il=intersections.length; i<il; i++) {
                var intersection = intersections[i];
                var object = this.objectsByMeshId[intersection.object.uuid]; // intersection.object is in fact our mesh
                if (object) {
                    result.push({ object: object, intersection: intersection });
                }
            }

            return result;
        }

        return intersections;
    };

    return World;
});