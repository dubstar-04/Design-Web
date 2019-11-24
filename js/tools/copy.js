commands.push({command: "Copy", shortcut: "CO"});
function Copy()
{
    //Define Properties
    this.type = "Copy";
    this.family = "Tools";
    this.movement = "Linear";
    this.minPoints = 2;
	this.selectionRequired = true;
    this.limitPoints = true;
    this.showPreview = true;
}

Copy.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    expectedType[0] = ["undefined"];
    prompt[0] = "Select Items To " + this.type;
 
    expectedType[1] = ["object"];   
    prompt[1] = selectionSet.length + " Item(s) selected: Add more or press Enter to accept";
 
    expectedType[2] = ["boolean"];    
    prompt[2] = "Select Base Point:";
 
    expectedType[3] = ["object"];    
    prompt[3] = "Select Destination or Enter Distance:";
 
    expectedType[4] = ["object"];   
    prompt[4] = "";
            
    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput){
        inputArray.pop()
    }else if (inputArray.length === 4){
        action = true;
        reset = true
    }
    
    return [prompt[inputArray.length], reset, action, validInput]
}

Copy.prototype.action = function(points, items){

    //console.log("Copy Stuff")

    var xDelta =  points[1].x - points[0].x
    var yDelta =  points[1].y - points[0].y

    for (var i = 0; i < selectionSet.length; i++){
        //console.log("selectionset.type: " + selectionSet[i].type);

        var copyofitem = cloneObject(items[selectionSet[i]]);

        for (var j = 0; j < copyofitem.points.length; j++){
            copyofitem.points[j].x = items[selectionSet[i]].points[j].x + xDelta;
            copyofitem.points[j].y = items[selectionSet[i]].points[j].y + yDelta;
        }

          items.push(copyofitem);
    }

}

Copy.prototype.preview = function(points, selectedItems, items){

    //console.log("Copy Stuff")

    var xDelta =  points[1].x - points[0].x
    var yDelta =  points[1].y - points[0].y

    for (var i = 0; i < selectionSet.length; i++){
        //console.log("selectionset.type: " + selectionSet[i].type);
        for (var j = 0; j < selectedItems[i].points.length; j++){
            selectedItems[i].points[j].x = items[selectionSet[i]].points[j].x + xDelta;
            selectedItems[i].points[j].y = items[selectionSet[i]].points[j].y + yDelta;
        }
    }

}

