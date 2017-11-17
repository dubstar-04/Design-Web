commands.push({command: "Distance", shortcut: "DI"});
function Distance()
{
    //Define Properties
    this.type = "Distance";
    this.family = "Tools";
    this.movement = "None";
    this.minPoints = 2;
    this.limitPoints = true;
}

Distance.prototype.prompt = function(num) {
  //input prompt
    var prompt
  switch(num){
  case (0):
      prompt = i18n.tr("Select Items To %1").arg(this.type);
      break;
  case (1):
      prompt = i18n.tr("Select Start Point");
      break;
  case (2):
      prompt = i18n.tr("Select End Point");
      break;
  }

  return prompt
}

Distance.prototype.action = function(points, items){

    //var point1 = new Point(points[0].x, points[0].y)
    //var point2 = new Point(points[1].x, points[1].y)

    console.log("Length:" + distBetweenPoints(points[0].x, points[0].y, points[1].x, points[1].y)
                + " X: " + (points[1].x - points[0].x) + " Y:" + (points[1].y - points[0].y));
}
