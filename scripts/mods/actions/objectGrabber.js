define([], function() {
	var ObjectGrabber = function(simulation, world){
		this.simulation = simulation;
		this.world = world;

		this.attachment = null;
	};

	ObjectGrabber.prototype.grab = function (data) {
		this.release();

		var intersections = data.intersections;
		if (!intersections.length) {
			return;
		}

		var intersection = intersections[0];
		var nodeId = intersection.intersection.face.a;

		var object = intersection.object;
		var spring = object.attachExternalSpring(nodeId, 2000, 3);

		this.attachment = {
			object: object,
			spring: spring
		}
	};

	ObjectGrabber.prototype.move = function (data, mouseEvent) {
		if (!this.attachment) {
			return;
		}

		var externalNode = this.attachment.spring.node1;
		var objectNode = this.attachment.spring.node2;

		this.attachment.object.renderMesh.geometry.computeBoundingSphere();
		var bounds = this.attachment.object.renderMesh.geometry.boundingSphere;
		var objectNodePosition = objectNode.getPosition();
		objectNodePosition.z = bounds.center.z + bounds.radius;

		var objectMatrix = this.attachment.object.getMatrix();
		var ray = data.ray;
		var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(ray, objectNodePosition.applyMatrix4(objectMatrix));

		var intersection = this.world.getIntersectionWithPlane(ray, plane);
		if (!intersection)
			return;

		intersection.applyMatrix4(new THREE.Matrix4().getInverse(objectMatrix));
		externalNode.setPosition(intersection);
	};

	ObjectGrabber.prototype.release = function () {
		if (this.attachment) {
			this.attachment.object.removeSpring(this.attachment.spring);
			this.world.scene.remove(this.attachment.arrow);
			this.attachment = null;
		}
	};

	return ObjectGrabber;
});