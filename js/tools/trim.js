commands.push({command: "Trim", shortcut: "TR"});
function Trim(items)
{
    //Define Properties
    this.type = "Trim";
    this.family = "Tools";
    this.movement = "Modify";
    this.minPoints = 2;
	this.selectionRequired = true;
    this.helper_geometry = false;
    this.showPreview = false;
}

Trim.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    expectedType[0] = ["undefined"];
    prompt[0] = "Select boundary edges:";

    expectedType[1] = ["object"];   
    prompt[1] = selectionSet.length + " Item(s) selected: Add more or press Enter to accept";
 
    expectedType[2] = ["boolean"];   
    prompt[2] = "Select object to Trim:";

    expectedType[3] = ["object"];    
    prompt[3] = "Select another object to Trim or press ESC to quit:";
        
    expectedType[4] = expectedType[3];    
    prompt[4] = prompt[3];
 
    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput || num > 3){
        inputArray.pop()
    }
    
    if (inputArray.length === 3){
        action = true;
        //reset = true
    }

    return [prompt[inputArray.length], reset, action, validInput]
}

Trim.prototype.action = function(){

    console.log("Trim.js: Trim.prototype.action")

    console.log("Trim.js: selectionset length:", selectionSet.length)

    var item = findClosestItem();

    if (item !== undefined){

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

}

Trim.prototype.preview = function(){

   // console.log("Trim.js - preview")

}

