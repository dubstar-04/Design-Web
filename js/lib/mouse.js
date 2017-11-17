function Mouse() {

	this.x = 0;
	this.y = 0;
	this.canvasX = 0;
	this.canvasY = 0;
	this.lastX = 1;
	this.lastY = 1;
	this.downX = 0;
	this.downY = 0;

}

Mouse.prototype.mouseMoved = function (event) {

	var rect = cnvs.getBoundingClientRect();
	//console.log(rect.left, rect.top)
	//console.log(rect.bottom, rect.top)
	this.lastX = this.canvasX;
	this.lastY = this.canvasY;
	this.canvasX = event.clientX;
	this.canvasY = -event.clientY;

	this.x = ((this.canvasX - rect.left - canvas.panX) / canvas.scale);
	this.y = ((this.canvasY - rect.top - canvas.panY) / canvas.scale);

	writeCoordinates(coordinatesLabel, [this.x, this.y])

	if (canvas.panning) {
		canvas.pan();
	}

	if (selectingActive) {
		canvas.selecting();
	}

}

Mouse.prototype.getCanvasX = function () {
	return this.canvasX;
}

Mouse.prototype.getcanvasY = function () {
	return this.canvasY;
}

Mouse.prototype.getLastX = function () {
	return this.lastX;
}

Mouse.prototype.getLastY = function () {
	return this.lastY;
}

Mouse.prototype.setX = function (x) {
	this.x = x;
}

Mouse.prototype.setY = function (y) {
	this.y = y;
}

Mouse.prototype.setPos = function (newPoint) {
	this.x = newPoint.x;
	this.y = newPoint.y;
}
