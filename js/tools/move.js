commands.push({command: "Move", shortcut: "M"});

function Move(items)
{
    //Define Properties
    this.type = "Move";
    this.family = "Tools";
    this.movement = "Linear";
    this.minPoints = 2;
	this.selectionRequired = true;
    this.limitPoints = true;
    this.dimInput = true; //allow a single number to be input
}

Move.prototype.prompt = function(num) {
  //input prompt
        var prompt
  switch(num){
  case (0):
      prompt = "Select Items To" + this.type;
      break;
  case (1):
      prompt = "Select Base Point:";
      break;
  case (2):
      prompt = "Select Destination or Enter Distance:";
      break;
  }

  return prompt
}

Move.prototype.action = function(points, items){

    console.log("move.js: Move.prototype.action")
    console.log("move.js: points length: " + points.length)
    console.log("move.js: items length: " + items.length)

    var xDelta =  points[1].x - points[0].x
    var yDelta =  points[1].y - points[0].y

   console.log("move.js: X: " + xDelta + " Y: " + yDelta)

    for (var i = 0; i < selectionSet.length; i++){
        //console.log("selectionset.type: " + selectionSet[i].type);
        for (var j = 0; j < selectedItems[i].points.length; j++){
            items[selectionSet[i]].points[j].x = items[selectionSet[i]].points[j].x + xDelta;
            items[selectionSet[i]].points[j].y = items[selectionSet[i]].points[j].y + yDelta;
        }
    }

}

Move.prototype.preview = function(points, selectedItems, items){

    //console.log("move.js: Move.prototype.preview")
    //console.log("move.js: points length: " + points.length)
    //console.log("move.js: selectedItems length: " + selectedItems.length)
    //console.log("move.js: items length: " + items.length)


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

