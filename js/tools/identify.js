commands.push({command: "Identify", shortcut: "ID"});
function Identify()
{
    //Define Properties
    this.type = "Identify";
    this.family = "Tools";
    this.movement = "None";
    this.minPoints = 1;
	this.selectionRequired = false;
    this.limitPoints = true;
}

Identify.prototype.prompt = function(num) {
  //input prompt
    var prompt
  switch(num){
	case (0):
      prompt = "File A BUG!!";
      break;
  case (1):
      prompt = "Select Point";
      break;
  }

  return prompt
}

Identify.prototype.preview = function(num) {
//no preview required
return;

}

Identify.prototype.action = function(points, items){
	
    var id = (" X: " + points[0].x.toFixed(1) + " Y:" + points[0].y.toFixed(1));		
	notify(id)
}
