commands.push({ command: "Move", shortcut: "M" });

function Move(items) {
    //Define Properties
    this.type = "Move";
    this.family = "Tools";
    this.movement = "Linear";
    this.minPoints = 2;
    this.selectionRequired = true;
    this.helper_geometry = true;
    this.showPreview = true;
}


Move.prototype.prompt = function(inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    console.log("inputArray: ", inputArray)

    expectedType[0] = ["undefined"];
    prompt[0] = "Select Items To " + this.type;

    expectedType[1] = ["object"];
    prompt[1] = selectionSet.length + " Item(s) selected: Add more or press Enter to accept";

    expectedType[2] = ["boolean"];
    prompt[2] = "Select Base Point:";

    expectedType[3] = ["object"];
    prompt[3] = "Select Destination or Enter Distance:";

    expectedType[4] = ["object", "number"];
    prompt[4] = "";

    var validInput = expectedType[num].includes(typeof inputArray[num - 1])

    if (!validInput) {
        inputArray.pop()
    } else if (inputArray.length === 4) {
        action = true;
        reset = true
    }

    return [prompt[inputArray.length], reset, action, validInput]
}

Move.prototype.action = function(points, items) {

    console.log("move.js: Move.prototype.action")
    console.log("move.js: points length: " + points.length)
    console.log("move.js: items length: " + items.length)

    var xDelta = points[1].x - points[0].x
    var yDelta = points[1].y - points[0].y

    console.log("move.js: X: " + xDelta + " Y: " + yDelta)

    for (var i = 0; i < selectionSet.length; i++) {
        //console.log("selectionset.type: " + selectionSet[i].type);
        for (var j = 0; j < selectedItems[i].points.length; j++) {
            items[selectionSet[i]].points[j].x = items[selectionSet[i]].points[j].x + xDelta;
            items[selectionSet[i]].points[j].y = items[selectionSet[i]].points[j].y + yDelta;
        }
    }

}

Move.prototype.preview = function(points, selectedItems, items) {

    //console.log("move.js: Move.prototype.preview")
    //console.log("move.js: points length: " + points.length)
    //console.log("move.js: selectedItems length: " + selectedItems.length)
    //console.log("move.js: items length: " + items.length)

    var xDelta = points[1].x - points[0].x
    var yDelta = points[1].y - points[0].y

    for (var i = 0; i < selectionSet.length; i++) {
        //console.log("selectionset.type: " + selectedItems[i].type);
        for (var j = 0; j < selectedItems[i].points.length; j++) {
            selectedItems[i].points[j].x = items[selectionSet[i]].points[j].x + xDelta;
            selectedItems[i].points[j].y = items[selectionSet[i]].points[j].y + yDelta;
        }
    }

}