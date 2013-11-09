define([], function() {
	var ObjectGrabber = function(){
		this.object = null;
		this.spring = null;
	};

	ObjectGrabber.prototype.grab = function (intersections) {
		this.release();

		var intersection = intersections[0];
		var nodeId = intersection.intersection.face.a;

		this.object = intersection.object;
		this.spring = this.object.attachExternalSpring(nodeId, 1000, 3);
	};

	ObjectGrabber.prototype.move = function (intersections, mouseEvent) {
		// get projected position
		// set x,y coords

	};

	ObjectGrabber.prototype.release = function () {
		if (this.object && this.spring) {
			this.object.removeSpring(this.spring);
		}
	};

	return ObjectGrabber;
});