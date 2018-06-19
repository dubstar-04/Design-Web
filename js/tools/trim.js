commands.push({command: "Trim", shortcut: "TR"});
function Trim(items)
{
    //Define Properties
    this.type = "Trim";
    this.family = "Tools";
    this.movement = "Modify";
    this.minPoints = 2;
	this.selectionRequired = true;
    this.limitPoints = false;
    this.dimInput = false; //allow a single number to be input
}

Trim.prototype.prompt = function(num) {
    //input prompt
    var prompt
    switch(num){
    case (0):
        prompt = "Select boundary edges:";
        break;
    case (1):
        prompt = "Select object to Trim:";
        break;
    default:
        prompt = "Select another object to Trim or press ESC to quit:";
    }
    return prompt
}

Trim.prototype.action = function(item){

    console.log("Trim.js: Trim.prototype.action")

    console.log("Trim.js: selectionset length:", selectionSet.length)

    var intersectPoints = [];

    for (var i = 0; i < selectionSet.length; i++){
           if (selectionSet[i] !== item){
            var boundaryItem = items[selectionSet[i]];
            var TrimItem = items[item];

            console.log("boundary.type:", boundaryItem.type, "Trim.type:", TrimItem.type)

            var functionName = "intersect" + boundaryItem.type + TrimItem.type;
            console.log("Trim.js - call function:", functionName)
            var intersect = Intersection[functionName](boundaryItem.intersectPoints(), TrimItem.intersectPoints());

            console.log(intersect.status)
            if(intersect.points.length){
                console.log("intersect points:", intersect.points.length)
                for(var point = 0; point < intersect.points.length; point++){
                    intersectPoints.push(intersect.points[point]);
                }

            }
        }
    }

    if(intersectPoints)
    TrimItem.trim(intersectPoints)

}

Trim.prototype.preview = function(){

   // console.log("Trim.js - preview")

}

