//"use strict";

function Canvas(cnvs) {

	//this.canvas = document.getElementById('myCanvas');
	this.cvs = cnvs;
	this.context = this.cvs.getContext('2d');
	this.scale = 1.0;
	this.minScaleFactor = 0.05;
	this.maxScaleFactor = 300;
	this.panX = 0;
	this.panY = 0;
	this.alpha = 1.0;
	this.panning = false;
	this.zooming = false;
	this.mouseX = 0;
	this.mouseY = 0;
	this.flipped = false;
	this.offset = 0;
	this.lastClick = 0;

	//this.resizeCanvas();
	//this.requestPaint();

}

Canvas.prototype.canvasSize = function () {
	return {
		width: this.cvs.width,
		height: this.cvs.height
	};
};

Canvas.prototype.resizeCanvas = function () {

	if (this.flipped) {
		this.unflipY()
		this.flipped = false;
		this.scale = 1.0
		this.panX -= this.panX
		this.panY -= this.panY
	}

	this.context.canvas.width = window.innerWidth;
	this.context.canvas.height = window.innerHeight;

	if (this.flipped === false) {
		this.flipY()
		this.flipped = true;
	}

	this.requestPaint();
};

Canvas.prototype.mousedown = function (ev) {

	var button = ev.button;
	ev.preventDefault();

	switch (button) {
		case 0: //left button
			data = [];
			sceneControl("LeftClick", data);
			mouse.downX = mouse.x;
			mouse.downY = mouse.y;
			selectingActive = true;
			break;
		case 1: //middle button
			canvas.panning = true;
			ev.target.style.cursor = "move";
			var doubleClickThreshold = 250;
			var thisClick = new Date().getTime();
			var delta = thisClick - this.lastClick
			var isDoubleClick = delta < doubleClickThreshold;
			//console.log(delta, doubleClickThreshold, isDoubleClick)
			this.lastClick = thisClick;
			if (isDoubleClick) {
				//console.log("DoubleClick")
				this.zoomExtents()
			}
			break;
		case 2: //right button
			//console.log("right click")
			//var data = true;
			//sceneControl("RightClick", data);
			break;
			//default:
			//    default code block
	}
};

Canvas.prototype.mouseup = function (ev) {

	var button = ev.button;
	ev.preventDefault();

	switch (button) {
		case 0: //left button
			//console.log("left click")
			selectingActive = false;
			selecting([mouse.downX, mouse.downY, mouse.x, mouse.y], "");
			break;
		case 1: //middle button
			//console.log("middle click")
			canvas.panning = false;
			canvas.requestPaint();
			ev.target.style.cursor = "crosshair";
			break;
		case 2: //right button
			//console.log("right click")
			break;
			//default:
			//    default code block
	}
};

Canvas.prototype.dblclick = function (ev) {

	var button = ev.button;
	ev.preventDefault();

	switch (button) {
		case 0: //left button
			console.log("left dbl click")
			break;
		case 1: //middle button
			console.log("middle dbl click")
			break;
		case 2: //right button
			console.log("right dbl click")
			break;
			//default:
			//    default code block
	}
};

Canvas.prototype.pan = function () {
	if (canvas.panning) {
		var deltaX = mouse.canvasX - mouse.lastX;
		var deltaY = (mouse.canvasY - mouse.lastY);
		canvas.context.translate(deltaX / canvas.scale, deltaY / canvas.scale);
		canvas.panX += deltaX;
		canvas.panY += deltaY;
		//console.log("panX: ", canvas.panX, " panY: ", canvas.panY);
		canvas.requestPaint();
	}
}

Canvas.prototype.selecting = function () {

	if (selectingActive) {
		if (distBetweenPoints(mouse.downX, mouse.downY, mouse.x, mouse.y) > 5) {

			//console.log("Selecting..........")

			if (mouse.y > mouse.downY) {
				//Draw a rectangle on screen
				selecting([mouse.downX, mouse.downY, mouse.x, mouse.y], "#FF0000");
			} else if (mouse.y < mouse.downY) {
				//Draw a rectangle on screen
				selecting([mouse.downX, mouse.downY, mouse.x, mouse.y], "#0000FF");
			}
		}
	}
}

/* UNUSED - RIGHTCLICK IS HANDLED ON DESIGN,HTML
Canvas.prototype.on_right_click = function (ev) {
ev.preventDefault();
};
 */

Canvas.prototype.wheel = function (event) {
	var delta = event.detail ? event.detail / 3 * (-120) : event.wheelDelta //event.detail; //.wheelDelta;
	//console.log(delta);

	var scale = Math.pow(1 + Math.abs(delta / 120) / 2, delta > 0 ? 1 : -1);
	//console.log(scale + " canvas.scale " + canvas.scale)
	if (scale < 1 && canvas.scale > canvas.minScaleFactor || scale > 1 && canvas.scale < canvas.maxScaleFactor) {
		canvas.zoom(scale)
	}
};

Canvas.prototype.zoom = function (scale) {

	// Convert pinch coordinates to canvas coordinates
	var x = (mouse.canvasX - canvas.panX) / canvas.scale;
	var y = (mouse.canvasY - canvas.panY) / canvas.scale;

	// Zoom at mouse pointer
	canvas.context.translate(x, y);
	canvas.context.scale(scale, scale)
	canvas.scale = canvas.scale * scale;
	canvas.context.translate(-(x), -(y));
	canvas.panX += ((x / scale) - x) * canvas.scale;
	canvas.panY += ((y / scale) - y) * canvas.scale;

	//console.log("Panned: ", canvas.panX, canvas.panY)
	//console.log("Scaled Canvas: " + canvas.scale);
	//this.zooming = true;
	canvas.requestPaint();
	//redrawTimer.restart();

}

Canvas.prototype.zoomExtents = function () {

	if (items.length) {
		console.log("zoom all ")
		var extents = this.getExtents()
		this.centreInScene(extents.xmin, extents.xmax, extents.ymin, extents.ymax)
	}
}

Canvas.prototype.getExtents = function () {
	var xmin,
		xmax,
		ymin,
		ymax;

	for (var i = 0; i < items.length; i++) {
		var extremes = items[i].extremes();
		xmin = (xmin === undefined) ? extremes[0] : (extremes[0] < xmin) ? extremes[0] : xmin;
		xmax = (xmax === undefined) ? extremes[1] : (extremes[1] > xmax) ? extremes[1] : xmax;
		ymin = (ymin === undefined) ? extremes[2] : (extremes[2] < ymin) ? extremes[2] : ymin;
		ymax = (ymax === undefined) ? extremes[3] : (extremes[3] > ymax) ? extremes[3] : ymax;
	}
	return {
		xmin: xmin,
		xmax: xmax,
		ymin: ymin,
		ymax: ymax
	};
}

Canvas.prototype.centreInScene = function (xmin, xmax, ymin, ymax) {
	console.log("DesignCanvas - centreInScene")
	console.log("Extents: ", xmin, xmax, ymin, ymax)
	var centerX = ((xmin + ((xmax - xmin) / 2))) + this.panX / this.scale;
	var centerY = ((ymin + ((ymax - ymin) / 2))) + (this.panY + this.offset) / this.scale;

	console.log(this.panX, this.panY, this.scale)

	console.log("Center: ", centerX, centerY, (this.panY + this.offset) / this.scale)

	var translateX = ((this.cvs.width / 2 / this.scale) - centerX);
	var translateY = ((this.cvs.height / 2 / this.scale) - centerY);

	console.log("Translate: ", translateX, translateY)

	this.context.translate(translateX, translateY);

	this.panX += (translateX * canvas.scale);
	this.panY += (translateY * canvas.scale);

	centerX = ((this.cvs.width / 2) - this.panX) / this.scale;
	centerY = ((this.cvs.height / 2) - (this.panY + this.offset)) / this.scale;

	var targetScale = Math.min((this.cvs.width / (xmax - xmin)), (this.cvs.height / (ymax - ymin)));

	console.log("Target Scale to fit: " + targetScale + " Current Scale: " + this.scale)

	var requiredScale = (targetScale / this.scale) * 0.80; //scale to 80% of the exteme coordinates

	console.log("Required Scale to fit: " + requiredScale)

	// Zoom at scene centre
	this.context.translate(centerX, centerY);
	this.context.scale(requiredScale, requiredScale)
	this.scale *= requiredScale;
	console.log("New Scale: " + this.scale)

	this.context.translate(-centerX, -centerY);

	this.panX += ((centerX / requiredScale) - centerX) * this.scale;
	this.panY += ((centerY / requiredScale) - centerY) * this.scale;

	this.requestPaint();
}

Canvas.prototype.flipY = function () {

	this.offset = this.context.canvas.height
	this.context.scale(1, -1)
	this.context.translate(0, -this.offset)
	this.panY -= this.offset
}

Canvas.prototype.unflipY = function () {

	this.panY += this.offset
	this.context.translate(0, this.offset)
	this.context.scale(1, -1)
}

Canvas.prototype.requestPaint = function () {

	this.clear()
	this.context.fillStyle = settings.canvasBackgroundColour
	//this.context.clearRect(0, 0 + window.innerHeight, window.innerWidth, -window.innerHeight);
	this.context.fillRect(0 - this.panX / this.scale, 0 - this.panY / this.scale, window.innerWidth / this.scale, -window.innerHeight / this.scale);
	//this.context.fillRect(0, 0, this.context.canvas.width/ this.scale, -this.context.canvas.height/ this.scale);
	this.context.globalAlpha = this.cvs.alpha

	//Get the number of entities and decide how many to draw
	var numOfEntities = items.length
	var i = 0,
		j = 0,
		k = 0;

	if (this.panning || this.zooming) {
		//If Pan or Zoom is in progress, only draw a portion of the entities
		if (numOfEntities > 350) {
			i = (numOfEntities - 350)
		}
	} else {
		//Dont paint the grid if pan or zoom is in progress
		//this.paintGrid();
	}
	this.paintGrid();

	//Draw the scene
	for (i; i < numOfEntities; i++) {
		items[i].draw(this.context, this.scale);
	}

	for (j; j < tempItems.length; j++) {
		tempItems[j].draw(this.context, this.scale);
	}

	for (k; k < selectedItems.length; k++) {
		selectedItems[k].draw(this.context, this.scale);
	}
}

Canvas.prototype.clear = function () {
	this.context.save();
	this.context.setTransform(1, 0, 0, 1, 0, 0);
	this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	this.context.restore();

};

Canvas.prototype.paintGrid = function () {

	var extents = getSceneExtents();

	var xgridmin = extents.xmin;
	var xgridmax = extents.xmax;
	var ygridmin = extents.ymin;
	var ygridmax = extents.ymax;

	//console.log("Xpan: ", this.panX, " Ypan: ", this.panY, " Scale: ", this.scale)

	this.context.strokeStyle = settings.gridColour;

	this.context.lineWidth = 1.5 / this.scale;
	this.context.beginPath()
	this.context.moveTo(xgridmin, 0);
	this.context.lineTo(xgridmax, 0);
	this.context.moveTo(0, 0);
	this.context.lineTo(0, ygridmax);
	this.context.moveTo(0, 0);
	this.context.lineTo(0, ygridmin);
	this.context.stroke()

	if (settings["drawGrid"]) {

		this.context.lineWidth = 0.25 / this.scale;

		var gridInterval = 100;

		/*if (this.scale > 300) {
			gridInterval = 0.1;
		} else */
		if (this.scale > 50) {
			gridInterval = 1
		} else if (this.scale > 5) {
			gridInterval = 10
		} else if (this.scale < 0.6) {
			gridInterval = 1000
		} else {
			gridInterval = 100;
		}

		for (var i = 0; i < xgridmax; i = i + gridInterval) {
			this.context.beginPath()
			this.context.moveTo(i, ygridmin);
			this.context.lineTo(i, ygridmax);
			this.context.stroke()

			//Draw scale
			/*
			this.unflipY()
			var datumTextHeight = 25 / this.scale;
			var textOffset = 5 / this.scale;
			this.context.font = datumTextHeight.toString() + "px Arial";
			this.context.strokeText(i,i+textOffset,0+this.cvs.height+datumTextHeight+textOffset);
			this.flipY()
			*/
		}

		for (var i = 0; i > xgridmin; i = i - gridInterval) {
			this.context.beginPath()
			this.context.moveTo(i, ygridmin);
			this.context.lineTo(i, ygridmax);
			this.context.stroke()
		}

		for (var i = 0; i < ygridmax; i = i + gridInterval) {
			this.context.beginPath()
			this.context.moveTo(xgridmin, i);
			this.context.lineTo(xgridmax, i);
			this.context.stroke()
		}

		for (var i = 0; i > ygridmin; i = i - gridInterval) {
			this.context.beginPath()
			this.context.moveTo(xgridmin, i);
			this.context.lineTo(xgridmax, i);
			this.context.stroke()
		}

	}
}
