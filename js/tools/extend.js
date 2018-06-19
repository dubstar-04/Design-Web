commands.push({command: "Extend", shortcut: "EX"});
function Extend(items)
{
    //Define Properties
    this.type = "Extend";
    this.family = "Tools";
    this.movement = "Modify";
    this.minPoints = 2;
	this.selectionRequired = true;
    this.limitPoints = false;
    this.dimInput = false; //allow a single number to be input
}

Extend.prototype.prompt = function(num) {
    //input prompt
    var prompt
    switch(num){
    case (0):
        prompt = "Select boundary edges:";
        break;
    case (1):
        prompt = "Select object to extend:";
        break;
    default:
        prompt = "Select another object to extend or press ESC to quit:";
    }
    return prompt
}

Extend.prototype.action = function(item){

    console.log("Extend.js: Extend.prototype.action")

    console.log("Extend.js: selectionset length:", selectionSet.length)

    var intersectPoints = [];

    for (var i = 0; i < selectionSet.length; i++){
           if (selectionSet[i] !== item){
            var boundaryItem = items[selectionSet[i]];
            var extendItem = items[item];

            console.log("boundary.type:", boundaryItem.type, "extend.type:", extendItem.type)

            var functionName = "intersect" + boundaryItem.type + extendItem.type;
            console.log("extend.js - call function:", functionName)
            var intersect = Intersection[functionName](boundaryItem.intersectPoints(), extendItem.intersectPoints(), true);

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
    extendItem.extend(intersectPoints)

}

Extend.prototype.preview = function(){

   // console.log("extend.js - preview")

}

