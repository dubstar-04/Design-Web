commands.push({command: "Distance", shortcut: "DI"});
function Distance()
{
    //Define Properties
    this.type = "Distance";
    this.family = "Tools";
    this.movement = "None";
    this.minPoints = 2;
	this.selectionRequired = false;
    this.limitPoints = true;
}

Distance.prototype.prompt = function(num) {
  //input prompt
    var prompt
  switch(num){
	case (0):
      prompt = "File A BUG!!";
      break;
  case (1):
      prompt = "Select Start Point";
      break;
  case (2):
      prompt = "Select End Point";
      break;
  }

  return prompt
}

Distance.prototype.preview = function(num) {

console.log("TO DO: Draw a preview of the measurement")

}

Distance.prototype.action = function(points, items){

    //var point1 = new Point(points[0].x, points[0].y)
    //var point2 = new Point(points[1].x, points[1].y)

    var di = ("Length:" + distBetweenPoints(points[0].x, points[0].y, points[1].x, points[1].y).toFixed(1)
                + " X: " + (points[1].x - points[0].x).toFixed(1) + " Y:" + (points[1].y - points[0].y).toFixed(1));
				
	notify(di)
}
