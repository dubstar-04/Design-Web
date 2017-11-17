commands.push({command: "Rotate", shortcut: "RO"});
function Rotate(items)
{
    //Define Properties
    this.type = "Rotate";
    this.family = "Tools";
    this.movement = "Angular";
    this.minPoints = 3;
    this.limitPoints = true;
    this.dimInput = true; //allow a single number to be input
}

Rotate.prototype.prompt = function(num) {
    //input prompt
        var prompt
    switch(num){
    case (0):
        prompt = "Select Items To " + this.type;
        break;
    case (1):
        prompt = "Select Base Point:";
        break;
    case (2):
        prompt = "Select Start Point or Enter Angle:";
        break;
    case (3):
        prompt = "Select End Angle:";
        break;
    }

    return prompt
}

Rotate.prototype.preview = function(points, selectedItems, items){

    if (points.length > 2){

        var A = points[0].x - points[1].x;
        var O = points[0].y - points[1].y;

        var A1 = points[0].x - points[2].x;
        var O1 = points[0].y - points[2].y;

        var ang1 = Math.atan2(O,A);
        var ang2 = Math.atan2(O1,A1);

        var theta = ang2 - ang1;

        for (var i = 0; i < selectionSet.length; i++){
            //console.log( "(Rotate.prototype.preview) item: " + selectedItems[i].type + " Points length: " + selectedItems[i].points.length);
            for (var j = 0; j < selectedItems[i].points.length; j++){
               //console.log( "(Rotate.prototype.preview) point: " + j + " length: " + selectedItems[i].points.length)
                var x = points[0].x + (items[selectionSet[i]].points[j].x - points[0].x)*Math.cos(theta) - (items[selectionSet[i]].points[j].y-points[0].y)*Math.sin(theta);
                var y = points[0].y + (items[selectionSet[i]].points[j].x - points[0].x)*Math.sin(theta) + (items[selectionSet[i]].points[j].y-points[0].y)*Math.cos(theta);

                selectedItems[i].points[j].x = x;
                selectedItems[i].points[j].y = y;
            }
        }
    }
}


Rotate.prototype.action = function(points, items){

    console.log("Rotate Stuff")

    var A = points[0].x - points[1].x;
    var O = points[0].y - points[1].y;

    var A1 = points[0].x - points[2].x;
    var O1 = points[0].y - points[2].y;

    var ang1 = Math.atan2(O,A);
    var ang2 = Math.atan2(O1,A1);

    var theta = ang2 - ang1;

    //console.log("Theta: " + theta + " degrees: " + radians2degrees(theta));

    for (var i = 0; i < selectionSet.length; i++){

        for (var j = 0; j < selectedItems[i].points.length; j++){

            var x = points[0].x + (items[selectionSet[i]].points[j].x - points[0].x)*Math.cos(theta) - (items[selectionSet[i]].points[j].y-points[0].y)*Math.sin(theta);
            var y = points[0].y + (items[selectionSet[i]].points[j].x - points[0].x)*Math.sin(theta) + (items[selectionSet[i]].points[j].y-points[0].y)*Math.cos(theta);

            items[selectionSet[i]].points[j].x = x;
            items[selectionSet[i]].points[j].y = y;
        }
    }
}
