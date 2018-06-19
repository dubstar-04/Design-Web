
function processItem(item) {
	console.log(" scene.js - Item To Process: " + item)
	saveRequired();
	//reset();

	if (lastCommand.indexOf(item) !== -1) { // only store command once
		lastCommand.splice(lastCommand.indexOf(item), 1); // if the command is already in the array, Erase it
	}
	lastCommand.unshift(item); // add the command to the Array
	while (lastCommand.length > 10) { //check if we have more than 10 command in history
		lastCommand.pop()
	}

	activeCommand = new this[item]; // Convert the 'item' string in to a new object, Line, Circle...
	if (activeCommand.family === "Geometry") { // if the active item exists
		minPoints = activeCommand.minPoints // Get the number if minimum points required for the new item
			commandLine.setPrompt(promptTracker);
	} else if (activeCommand.family === "Tools" && items.length) {
		if (selectionSet.length || activeCommand.selectionRequired === false) {
			minPoints = activeCommand.minPoints
				promptTracker++;
			commandLine.setPrompt(promptTracker);
			selectionAccepted = true;
			if (activeCommand.minPoints === 0) {
				///Erase??
				activeCommand.action(points, items);
				reset();
				canvas.requestPaint();
			}
		} else {
			commandLine.setPrompt(promptTracker);
		}

	} else {
		console.log(" scene.js - processItem: activeCommand === undefined")
		reset()
	}
};

///////////////////////////////////////////////////////////////////////
////////// This is the main function that contols the scene //////////
/////////////////////////////////////////////////////////////////////
function sceneControl(action, data) {

	function handleLeftClick(data) {
		console.log(" scene.js - HandleLeftClick - find the closest item")
		console.log(" scene.js - clicked: " + data)
		selectClosestItem(data);
	}
	
	function handleEnter(data) {

		console.log(" scene.js - HandleEnter")
		console.log("Selected Command: " + data[0])
		//console.log("Available commands:")

		var currentCommand = "";

		if (data[0] === 'reset-repeat') {
			console.log("[design-engine] handleEnter - lastCommand: ", lastCommand[0]);
			currentCommand = lastCommand[0];
		} else {
			
			currentCommand = getCommandFromShortcut( data[0].toUpperCase() )
			
/* 			var selectedCommand = data[0].toUpperCase();

			for (var i = 0; i < commands.length; i++) {

				if (commands[i].shortcut === selectedCommand) {
					currentCommand = commands[i].command;
				}
			} */
		}
		console.log("Process: " + currentCommand);
		processItem(currentCommand);

		//        if (["L", "LINE"].contains(data[0].toUpperCase())){processItem("Line")}
		//        else if (["C", "CIRCLE"].contains(data[0].toUpperCase())){processItem("Circle")}
		//        else if (["REC", "RECTANGLE"].contains(data[0].toUpperCase())){processItem("Rectangle")}
		//        else if (["A", "ARC"].contains(data[0].toUpperCase())){processItem("Arc")}
		//        else if (["PL", "POLYLINE"].contains(data[0].toUpperCase())){processItem("Polyline")}
		//        else if (["EL", "ELLIPSE"].contains(data[0].toUpperCase())){processItem("Ellipse")}
		//        else if (["SP", "SPLINE"].contains(data[0].toUpperCase())){processItem("Spline")}

		//        else if (["M", "MOVE"].contains(data[0].toUpperCase())){processItem("Move")}
		//        else if (["RO", "ROTATE"].contains(data[0].toUpperCase())){processItem("Rotate")}
		//        else if (["E", "ERASE"].contains(data[0].toUpperCase())){processItem("Erase")}
		//        else if (["DI", "DISTANCE"].contains(data[0].toUpperCase())){processItem("Distance")}
		//        else if (["CO", "COPY"].contains(data[0].toUpperCase())){processItem("Copy")}
		//        else if (["DT", "TEXT"].contains(data[0].toUpperCase())){processItem("Text")}
		//        else if (["EX", "EXTEND"].contains(data[0].toUpperCase())){processItem("Extend")}
		//        else if (["TR", "TRIM"].contains(data[0].toUpperCase())){processItem("Trim")}
		//        else if (data[0] === "reset-repeat"){if(lastCommand.length){processItem(lastCommand[0])}}
		//        else {
		//            console.log(" scene.js - Handledata: Not Recognised")
		//            reset()
		//        }
	}
	
	function getCommandFromShortcut( shortcut ){
		
		var commandFromShortcut = shortcut
		
		for (var i = 0; i < commands.length; i++) {

			if (commands[i].shortcut === shortcut) {
				commandFromShortcut = commands[i].command;
			}
		}
		
		return commandFromShortcut
	}
	
	function isCommand(command){
		
		for (var i = 0; i < commands.length; i++) {

			if (commands[i].command === command) {
				return true;
			}
		}
		
		return false;
	}
	

	function handleLeftClickwithCommand(data) {
		console.log(" scene.js - scene.js: handleLeftClickwithCommand")
		// data contains the mouse coordinates, set the point x & y
		if (activeCommand.family === "Geometry") {
			var point = new Point()
				point.x = mouse.x; //data[0];
			point.y = mouse.y; //data[1];
			points.push(point);
			promptTracker++;

			console.log("scene.js - handleLeftClickWithCommand points:" + points.length + " minPoints: " + minPoints)

			if (points.length >= minPoints) {
				addToScene(null, null, activeCommand.limitPoints);
			} else {
				commandLine.setPrompt(promptTracker);
			}
		} else if (activeCommand.family === "Tools") {

			console.log(" scene.js - scene.js: handleLeftClickwithCommand- Selected Items:" + selectedItems.length)
			console.log(" scene.js - Tool Command")
			
			if (selectionAccepted) {// || activeCommand.selectionRequired === false) {
				promptTracker++;

				if (activeCommand.movement === "Modify") {
					console.log("scene.js - handle left click with command - trim/extend")
					var closestItem = findClosestItem();

					if (closestItem !== undefined) {
						activeCommand.action(closestItem);
					}
				} else {

					var point = new Point()
					point.x = mouse.x; //data[0];
					point.y = mouse.y; //data[1];
					points.push(point);

					if (points.length >= minPoints) {
						//if we have all the required points then make the change
						activeCommand.action(points, items);
						if (activeCommand.limitPoints) {
							reset();
						}
						commandLine.setPrompt(promptTracker);
						canvas.requestPaint();

					} else {
						commandLine.setPrompt(promptTracker);
					}
				}
			} else {
				selectClosestItem(data);
				if (selectionSet.length) {
					commandLine.setPrompt(selectionSet.length + " Item(s) selected: Add more or press Enter to accept")
				}
			}
		}
	}

	function handleEnterwithCommand(data) {
		
	console.log("scene.js - scene.js: handleEnterwithCommand - DATA 0:", data[0])	
		
	if( isCommand(getCommandFromShortcut( data[0]))){
		console.log("scene.js - scene.js: handleEnterwithCommand - New Command: Reset State")
		reset()
		processItem(getCommandFromShortcut( data[0]))
	}else{

		if (activeCommand.family === "Tools") {
			////////// Typed Point x,y //////////
			if (data[0].indexOf(",") !== -1) {
				console.log(" scene.js - Coordinates Entered")
				if (selectionAccepted) {
					var xyData = data[0].split(',');
					var point = new Point()
						// generate data from the prevous point and the radius
						point.x = parseFloat(xyData[0]);
					point.y = parseFloat(xyData[1]);
					//console.log(" scene.js - Point entered: " + point.x + " " + point.y)
					points.push(point);
					promptTracker++;
					commandLine.setPrompt(promptTracker);
				}
			} else if (typeof data[0] === "number") {
				////////// never reached as data always a string //////////
				console.log(" scene.js - Dimension Entered")
			} else if (typeof data[0] === "string") {
				console.log(" scene.js - scene.js: handleEnterwithCommand - String Data")
				////////// Point selection Accepted //////////
				if (!selectionAccepted) {
					minPoints = activeCommand.minPoints
						promptTracker++;
					commandLine.setPrompt(promptTracker);
					selectionAccepted = true;

					console.log(" scene.js - scene.js: handleEnterwithCommand - Selected Items:" + selectedItems.length)

					if (activeCommand.minPoints === 0) {
						///Erase??
						activeCommand.action(points, items);
						reset();
						canvas.requestPaint();
					}
				} else if (selectionAccepted && activeCommand.dimInput) {
					//console.log(data[0])
					////////// A dimension is entered //////////
					if (isFinite(data[0])) {
						var point = new Point()

							if (activeCommand.movement === "Linear") {
								var length = data;
								var x = length * Math.cos(degrees2radians(angle));
								var y = length * Math.sin(degrees2radians(angle));
								// generate data from the prevous point and the radius
								point.x = points[points.length - 1].x + x;
								point.y = points[points.length - 1].y + y;
								points.push(point);
								promptTracker++;
							} else if (activeCommand.movement === "Angular") {
								// An angle has been entered create a point at 0 degrees from the base point
								point.x = points[0].x
									point.y = points[0].y + 10
									points.push(point);
								promptTracker++;

								var endPoint = new Point();
								var theta = degrees2radians(data);

								endPoint.x = points[0].x + (points[1].x - points[0].x) * Math.cos(theta) - (points[1].y - points[0].y) * Math.sin(theta);
								endPoint.y = points[0].y + (points[1].x - points[0].x) * Math.sin(theta) + (points[1].y - points[0].y) * Math.cos(theta);

								points.push(endPoint);
								promptTracker++;
							}

							if (points.length >= minPoints) {
								activeCommand.action(points, items);
								reset();
								canvas.requestPaint();
							} else {
								commandLine.setPrompt(promptTracker);
							}

							//addToScene(true)
							console.log(" scene.js - Dim entered")
					} else {
						//repeat prompt
						commandLine.setPrompt(promptTracker - 1);
					}
				} /////
			} else {
				console.log(" scene.js - HandleEnterWithData: I dont understand the state")
				//repeat prompt
				commandLine.setPrompt(promptTracker - 1);
			}
			console.log(" scene.js - scene.js: handleEnterwithCommand - Selected Items:" + selectedItems.length)
		}

		if (activeCommand.family === "Geometry") {
			// check if the data contains a comma. if it does its probably user entered coordinates
			if (data[0].indexOf(",") !== -1) {
				var xyData = data[0].split(',');
				var point = new Point()
					// generate data from the prevous point and the radius
					point.x = parseFloat(xyData[0]);
				point.y = parseFloat(xyData[1]);
				//console.log(" scene.js - Point entered: " + point.x + " " + point.y)
				points.push(point);
				promptTracker++;
				commandLine.setPrompt();

				if (points.length >= minPoints) {
					addToScene(null, null, activeCommand.limitPoints);
				} else {
					commandLine.setPrompt(activeCommand.type + ": " + activeCommand.prompt(points.length + 1));
				}

				//reset();
			} else if (data[0] === "reset-repeat") {
				reset();

			} else if (isFinite(data[0])) {
				var point = new Point()

					var length = data[0];
				var x = length * Math.cos(degrees2radians(angle));
				var y = length * Math.sin(degrees2radians(angle));

				// generate data from the prevous point and the radius
				point.x = points[points.length - 1].x + x;
				point.y = points[points.length - 1].y + y;
				points.push(point);
				promptTracker++;

				if (points.length >= minPoints) {
					addToScene(null, null, activeCommand.limitPoints);
					commandLine.clearPrompt();
				} else {
					commandLine.setPrompt(activeCommand.type + ": " + activeCommand.prompt(points.length + 1));
				}

			} else {}
		}
	  }
	}

	if (action === "LeftClick" && activeCommand.type !== undefined) {
		handleLeftClickwithCommand(data)
	} else if (action === "LeftClick" && activeCommand.type === undefined) {
		handleLeftClick(data)
	} else if (action === "Enter" && activeCommand.type !== undefined) {
		handleEnterwithCommand(data)
	} else if (action === "Enter" && activeCommand.type === undefined) {
		handleEnter(data)
	} else if (action === "RightClick") {
		reset()
	} else {
		console.log(" scene.js - Scenecontrol: Command Not recognised")
	}
}
