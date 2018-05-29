// initialise the scene variables
//var parent = this;                                // 'window' object - store 'this' so it can be acessed from children.
var items = new Array(); // Main array that stores all the geometry
var points = new Array(); // Temporary Array to store the input points
var tempItems = new Array(); // Temporary Array to store items while input is being gathered
var tempPoints = new Array(); // Temporary Array to store points while input is being gathered
var selectedItems = new Array(); // store a copy of selected items
var selectionSet = new Array(); // store a list of selected items indices
var selectionAccepted = false; // Store a bool so we know when the selectionSet has been accepted
var activeCommand = ""; // Store the name of the active command
var promptTracker = 0;

var lastCommand = new Array(); // Store the last command
var lastCommandPosition = -1; // Store the current position on the command history

var minPoints = 0; // Stores the minium number of points required for the active command
//var canvas; // Canvas to which the items should be drawn
var inputPromptBox; // inputPrompt to get user input
//var mouse = new Point();                            // store the mouse coordinates.
//var mouse_delta = new Point(0,0);
var closestItem;
var angle = 0; // store the angle between the last point and the mouse cusor
var selectingActive = false; // Are we selecting on screen components?


function reset() {
	console.log(" scene.js - Reset: In Reset");
	points = []; // clear array
	minPoints = 0; // reset minimum required points
	activeCommand = ""; // reset the active command
	tempItems = [];
	selectedItems = [];
	selectionSet = [];
    selectionSetChanged();
	selectionAccepted = false;
	lastCommandPosition = -1;
	//resetCommandPrompt();
	commandLine.resetPrompt();
	promptTracker = 0;
	canvas.requestPaint();
	//sceneQmlObject.selectionSetChange();
}

//function setPrompt(index){
//    //var position = previous ? points.length : points.length+2;
//    console.log("scene.js - setPrompt. Index: ", index)
//    commandLine.value = activeCommand.type + ": " + activeCommand.prompt(Number(index))
//}

function selectionSetChanged(){
    getProperties()
}

function centreVPORT(centre, width, height) {
	console.log(centre.x, centre.y, width, height)
	if (height !== 0 && width !== 0) {
		var xmin = centre.x - width / 2
			var xmax = centre.x + width / 2
			var ymin = centre.y - height / 2
			var ymax = centre.y + height / 2

			canvas.centreInScene(xmin, xmax, ymin, ymax)
	}
}

function getSceneExtents() {

	var size = canvas.canvasSize();
	var width = size.width / canvas.scale;
	var height = size.height / canvas.scale;

	var xmin = -canvas.panX / canvas.scale;
	var xmax = xmin + width;
	var ymin = -canvas.panY / canvas.scale;
	var ymax = ymin + height;

	return {
		xmin: xmin,
		xmax: xmax,
		ymin: ymin,
		ymax: ymax
	};
}

function saveRequired() {
	saved = false; //Changes have occured. A save may be required.
}

function addToScene(type, data, end, index) {

	if (!data) {
		var colour = "BYLAYER";
		data = {
			points: points,
			colour: colour,
			layer: LM.getCLayer()
		};
	}

	var item;

	if (activeCommand && activeCommand.family === "Geometry") {
		item = new this[activeCommand.type](data); // Create a new item, send it the points array
	} else {
		item = new this[type](data); // Create a new item, send it the points array
	}

	if (typeof index === "undefined") {
		//add to end of array
		items.push(item); // add item to the scene
	} else {
		//replace item at index
		items.splice(index, 1, item);

	}
	if (end) {
		reset();
	} // reset all the variables

	//canvas.requestPaint(); // paint the new item to the canvas

}

function writeStatusMessage(label, message) {
	label.statusText = message
}

function findClosestItem() {

	console.log("[scene.js] - findClosestItem- Selected Items:" + selectedItems.length)
	////////// Object Snapping //////////
	var delta = 1.65; // find a more suitable starting value
	var mousePoint = new Point(mouse.x, mouse.y);
	var closestItem;

	for (var i = 0; i < items.length; i++) {
		var distance = items[i].closestPoint(mousePoint)[1]; //ClosestPoint()[1] returns a distance to the closest point

		if (distance < delta) {
			delta = distance;
			closestItem = i;
			console.log(" scene.js - Distance: " + distance);
		}
	}

	return closestItem;
}

function selectClosestItem(data) {

	var closestItem = findClosestItem();

	console.log(" scene.js - Scene.js: selectClosestItem() - clearSelectedItems: " + data)

	if (data) {
		//console.log(" scene.js - Clear Selection Data");
		selectedItems = [];
		selectionSet = [];
	}

	if (closestItem !== undefined) {
		//console.log(" scene.js - Closest Item: " + closestItem)
		//console.log(items[closestItem].type);

		if (selectionSet.indexOf(closestItem) === -1) { // only store selections once

			var copyofitem = cloneObject(items[closestItem]);

			console.log(" scene.js - Scene.js: selectClosestItem() - Type:" + copyofitem.type)

			copyofitem.colour = settings.selectedItemsColour.toString();
			copyofitem.lineWidth = copyofitem.lineWidth * 2;

			selectedItems.push(copyofitem);
			selectionSet.push(closestItem);

		} else {

			var index = selectionSet.indexOf(closestItem);
			selectionSet.splice(index, 1); // if the command is already in the array, Erase it
			selectedItems.splice(index, 1);

		}

		console.log(" scene.js - Scene.js: selectClosestItem() - selected items length: " + selectedItems.length)
		console.log(" scene.js - Scene.js: selectClosestItem() - indices for selectionSet: " + selectionSet);
        selectionSetChanged();
	} else {
		if (data) {
			console.log(" scene.js - Nothing Selected");
			console.log(" scene.js - scene.js: selectClosestItem- Selected Items:" + selectedItems.length)
			// clear selection
			selectedItems = [];
			selectionSet = [];
            selectionSetChanged();
		}
	}

	//sceneQmlObject.selectionSetChange();
	console.log(" scene.js - scene.js: selectClosestItem- Selected Items:" + selectedItems.length)

}

function snapping() {
	////////// Object Snapping //////////
	var snaps = new Array();
	var delta = 25 / canvas.scale; // find a more suitable starting value
	//var itemIndex = 0;
	var mousePoint = new Point(mouse.x, mouse.y);

	for (var i = 0; i < items.length; i++) {
		var itemSnaps = items[i].snaps(mousePoint, delta) // get an array of snap point from the item

			if (itemSnaps) {
				for (var j = 0; j < itemSnaps.length; j++) {
					var length = distBetweenPoints(itemSnaps[j].x, itemSnaps[j].y, mouse.x, mouse.y)
						if (length < delta) {
							delta = length;
							closestItem = i;

							// Draw a circle to highlight the snap.
							var CentrePoint = new Point(itemSnaps[j].x, itemSnaps[j].y);
							var radiusPoint = new Point(itemSnaps[j].x, itemSnaps[j].y + (5 / canvas.scale));
							var snapCirclePoints = [CentrePoint, radiusPoint];

							var data = {
								points: snapCirclePoints,
								colour: settings.snapColour.toString()
							}
							var item = new Circle(data); //snaps[j].x, snaps[j].y, snaps[j].x, snaps[j].y + 5) // 5 is a radius for the snap circle
							mouse.x = itemSnaps[j].x;
							mouse.y = itemSnaps[j].y;
							//console.log(snaps[j].x, snaps[j].y, delta);
							tempItems.push(item)

							////////// Object Snapping //////////
						}
				}
			}
	}

	canvas.requestPaint();
}

function selecting(coordinates, SelectColour) {

	tempItems = [];

	if (selectingActive) {

		var selectionPoints = [];

		var startPoint = new Point();
		var endPoint = new Point()

		startPoint.x = coordinates[0]; //set the mouse coordinates
		startPoint.y = coordinates[1]; //set the mouse coordinates
		endPoint.x = coordinates[2]; //set the mouse coordinates
		endPoint.y = coordinates[3]; //set the mouse coordinates

		selectionPoints.push(startPoint);
		selectionPoints.push(endPoint);

		var data = {
			points: selectionPoints,
			colour: SelectColour
		}

		var tempItem = new FilledRectangle(data); // Create a new item, send it the tempPoints array
		tempItems.push(tempItem) // Add it to the tempItems Array
	} else {

		canvas.requestPaint();

		var xmin = Math.min(coordinates[0], coordinates[2]);
		var xmax = Math.max(coordinates[0], coordinates[2]);
		var ymin = Math.min(coordinates[1], coordinates[3]);
		var ymax = Math.max(coordinates[1], coordinates[3]);

		var selection_extremes = [xmin, xmax, ymin, ymax]

		//Loop through all the entities and see if it should be selected
		for (var i = 0; i < items.length; i++) {
			if (coordinates[3] > coordinates[1]) {
				//console.log(" scene.js - scene.js: selecting() - Select all touched by selection window")
				if (items[i].touched(selection_extremes) || items[i].within(selection_extremes)) {
					//console.log(items[i].type + " at index: " + i + " is within the selection")
					if (selectionSet.indexOf(i) === -1) { // only store selections once
						var copyofitem = cloneObject(items[i]);
						copyofitem.colour = settings.selectedItemsColour.toString();
						copyofitem.lineWidth = copyofitem.lineWidth * 2;

						//console.log("scene.js - item added")

						selectedItems.push(copyofitem);
						selectionSet.push(i);
                        selectionSetChanged();

					}
				} else if (selectionSet.indexOf(i) !== -1) {
					//var index = selectionSet.indexOf(i);
					//selectionSet.splice(index,1);    // if the command is already in the array, Erase it
					//selectedItems.splice(index,1);
				}
			} else {
				//console.log(" scene.js - scene.js: selecting() - Select all within the selection window")
				if (items[i].within(selection_extremes)) {
					//console.log(items[i].type + " at index: " + i + " is within the selection")
					if (selectionSet.indexOf(i) === -1) { // only store selections once
						var copyofitem = cloneObject(items[i]);
						copyofitem.colour = settings.selectedItemsColour.toString();
						copyofitem.lineWidth = copyofitem.lineWidth * 2;

						selectedItems.push(copyofitem);
						selectionSet.push(i);
                        selectionSetChanged();
					}
				} else if (selectionSet.indexOf(i) !== -1) {
					//var index = selectionSet.indexOf(i);
					//selectionSet.splice(index,1);    // if the command is already in the array, Erase it
					//selectedItems.splice(index,1);
				}

			}
		}
	}

	canvas.requestPaint();
	//sceneQmlObject.selectionSetChange();

}

function addHelperGeometry(type, points, colour) {
	//Make a new array of points with the base point and the current mouse position.
	//var helperPoints = new Array();
	//helperPoints.push(points);
	//helperPoints.push(point);

	var data = {
		points: points,
		colour: colour //"#00BFFF"
	}
	var helper = new this[type](data); //new Rectangle(data);       // Create a templine to help define geometry
	tempItems.push(helper); // Add it to the tempItems Array
}

function polarSnap(previousPoint) {

	var angleDelta = 3;
	var diff = radians2degrees(previousPoint.angle(mouse)) - (settings.polarAngle * Math.round(radians2degrees(previousPoint.angle(mouse)) / settings.polarAngle))

		if (Math.abs(diff) < angleDelta) {
			//console.log("scene.js - polarSnap - Diff:", diff, " canvas size", canvas.canvasSize)
			var mousept = new Point(mouse.x, mouse.y);
			mousept = mousept.rotate(previousPoint, degrees2radians(-diff))

				mouse.setX(mousept.x);
			mouse.setY(mousept.y)

			var extents = getSceneExtents();
			var length = Math.max(extents.xmax - extents.xmin, extents.ymax - extents.ymin);
			var x = length * Math.cos(previousPoint.angle(mousept));
			var y = length * Math.sin(previousPoint.angle(mousept));
			var polarLinePoints = new Array();
			var lineEnd = new Point(mousept.x + x, mousept.y + y)

				polarLinePoints.push(previousPoint, lineEnd);
			addHelperGeometry("Line", polarLinePoints, settings.polarSnapColour.toString())
		}

}

function orthoSnap(previousPoint) {

	var x = mouse.x - previousPoint.x
		var y = mouse.y - previousPoint.y

		if (Math.abs(x) > Math.abs(y)) {
			mouse.setY(previousPoint.y)
		} else {
			mouse.setX(previousPoint.x)
		}

}

function writeCoordinates(label, coordinates) {
	tempItems = [];
	tempPoints = [];

	mouse.x = coordinates[0]; //set the mouse coordinates
	mouse.y = coordinates[1]; //set the mouse coordinates

	if (activeCommand.family === "Geometry" || selectionAccepted === true && activeCommand.movement !== "Modify") {
		snapping();
	}

	// If there is an activecommand and the start point exists, draw the item on screen with every mouse move
	if (points.length !== 0) {

		var previousPoint = new Point()
			previousPoint.x = points[points.length - 1].x;
		previousPoint.y = points[points.length - 1].y;

		tempPoints = points.slice(0); // copy points to tempPoints
		var point = new Point()

			// generate data from the prevous point and the radius
			// Polar snap if we are close

			if (settings.polar) {
				//if polar is enabled - get the closest points
				polarSnap(previousPoint);
			} else if (settings.ortho) {
				//if ortho is enabled - get the nearest ortho point
				orthoSnap(previousPoint)
			}

			//Add coordinates to the point
			point.x = mouse.x;
		point.y = mouse.y;
		tempPoints.push(point);

		if (activeCommand.helper_geometry) {
			//Make a new array of points with the base point and the current mouse position.
			var helperPoints = new Array();
			helperPoints.push(tempPoints[0]);
			helperPoints.push(point);

			addHelperGeometry("Line", helperPoints, settings.helperGeometryColour.toString())
		}

		if (activeCommand.family === "Geometry" && tempPoints.length >= activeCommand.minPoints) {
			addHelperGeometry(activeCommand.type, tempPoints, settings.helperGeometryColour.toString())
			canvas.requestPaint(); //Improve requests to paint as it is called too often.
		}

		if (activeCommand.family === "Tools") {
			activeCommand.preview(tempPoints, selectedItems, items);
		}

		angle = radians2degrees(previousPoint.angle(mouse))
			var len = distBetweenPoints(previousPoint.x, previousPoint.y, point.x, point.y);

		label.innerHTML = "X: " + Math.round(mouse.x) + " Y: " + Math.round(mouse.y) + ", Len: " + Math.round(len) + ", Ang: " + Math.round(angle)
	} else {
		label.innerHTML = "X: " + Math.round(mouse.x) + " Y: " + Math.round(mouse.y)
	}
}
