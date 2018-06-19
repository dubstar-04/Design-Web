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
    this.dimInput = true; //allow a single number to be input
}

Copy.prototype.prompt = function(num) {
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

