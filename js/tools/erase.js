commands.push({command: "Erase", shortcut: "E"});
function Erase()
{
    //Define Properties
    this.type = "Erase";
    this.family = "Tools";
    this.movement = "None";
    this.minPoints = 0;
	this.selectionRequired = true;
    this.limitPoints = true;
}

Erase.prototype.prompt = function(num) {
  //input prompt
  var prompt
  switch(num){
  case (0):
      prompt = "Select Items To " + this.type;
      break;
  }
  return prompt
}

Erase.prototype.action = function(points, items){

    selectionSet.sort();

    console.log("erase.js - selectionset: " + selectionSet);

    for (var i = 0; i < selectionSet.length; i++){
        //console.log("Erase: " + selectionSet[i]);
        items.splice((selectionSet[i]-i),1)
    }
}

