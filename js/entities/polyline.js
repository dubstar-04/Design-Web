// Register this command with the scene
commands.push({
    command: "Polyline",
    shortcut: "PL"
});

function Polyline(data) {
    //Define Properties         //Associated DXF Value
    this.type = "Polyline";
    this.family = "Geometry";
    this.minPoints = 2;
    this.showPreview = true; //show preview of item as its being created
    //this.limitPoints = false;
    //this.allowMultiple = false;
    this.helper_geometry = false; // If true a line will be drawn between points when defining geometry
    this.points = [];
    this.lineWidth = 2; //Thickness
    this.colour = "BYLAYER";
    this.layer = "0";
    this.alpha = 1.0 //Transparancy


    if (data) {

        if (data.points) {
            this.points = data.points
        }

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            //console.log("Polyline.js Layer data:" + data.layer)
            this.layer = data.layer;
        }
    }
}

Polyline.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    //console.log("inputArray: ", inputArray)

    expectedType[0] = ["undefined"];
    prompt[0] = "Pick start point:";
 
    expectedType[1] = ["object"];   
    prompt[1] = "Pick another point or press ESC to quit:";

    expectedType[2] = ["object","number"];   
    prompt[2] = prompt[1];

    expectedType[3] = ["object","number"];   
    prompt[3] = prompt[1];

    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput || num > this.minPoints){
        inputArray.pop()
    }else if (inputArray.length === this.minPoints){
        action = true;
        //reset = true
    }
    
    return [prompt[inputArray.length], reset, action, validInput]
}

Polyline.prototype.draw = function (ctx, scale) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var colour = this.colour;

    if (this.colour === "BYLAYER") {
        colour = LM.getLayerByName(this.layer).colour
    }

    ctx.strokeStyle = colour;
    ctx.lineWidth = this.lineWidth / scale;
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (var i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.stroke()
}

Polyline.prototype.svg = function () {
    //<Polyline x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    //<Polyline x1="20" y1="100" x2="100" y2="100" stroke-width="2" stroke="black"/>
    var quote = "\""
    var svgstr = ""
    var data = svgstr.concat("<Polyline x1=", "\"", this.startX, "\"",
        " y1=", "\"", this.startY, "\"",
        " x2=", "\"", this.endX, "\"",
        " y2=", "\"", this.endY, "\"",
        " stroke=", "\"", this.colour, "\"",
        " stroke-width=", "\"", this.PolylineWidth, "\"", "/>"
    )
    //console.log(data)
    return data
}

Polyline.prototype.dxf = function () {

    var closed = (this.points[0].x === this.points[this.points.length - 1].x && this.points[0].y === this.points[this.points.length - 1].y);
    var vertices = this.vertices();
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "POLYLINE",
        //"\n", "5", //HANDLE
        //"\n", "DA",
        "\n", "8", //LAYERNAME
        "\n", this.layer,
        "\n", "66",
        "\n", "1",
        "\n", "10", //X
        "\n", "0",
        "\n", "20", //Y
        "\n", "0",
        "\n", "30", //Z
        "\n", "0",
        "\n", "39", //Line Width
        "\n", this.lineWidth,
        "\n", "70", //Flags
        "\n", closed ? "1" : "0",
        //"\n", "100", //Subclass marker
        //"\n", "AcDb2dPolyline",
        vertices, //Dont use a new line here as the vertex data will start with a new line.
        "\n", "0",
        "\n", "SEQEND", //END OF SEQUENCE
        "\n", "8", //LAYERNAME
        "\n", this.layer
    )
    console.log(" polyline.js - DXF Data:" + data)
    return data
}

Polyline.prototype.intersectPoints = function () {

    return {
        points: this.points
    }

}

Polyline.prototype.vertices = function () {

    var vertices_data = "";
    for (var i = 0; i < this.points.length; i++) {

        vertices_data = vertices_data.concat(
            "\n", "0",
            "\n", "VERTEX",
            //"\n", "5", //HANDLE
            //"\n", "DA",
            "\n", "8", //LAYERNAME
            "\n", "0",
            //"\n", "100",
            //"\n", "AcDbVertex",
            //"\n", "100",
            //"\n", "AcDb2dVertex",
            "\n", "10", //X
            "\n", this.points[i].x,
            "\n", "20", //Y
            "\n", this.points[i].y,
            "\n", "30", //Z
            //"\n", "0",
            //"\n", "0",
            "\n", "0"
        )
    }

    return vertices_data;
}

Polyline.prototype.length = function () {}

Polyline.prototype.midPoint = function (x, x1, y, y1) {

    var midX = (x + x1) / 2
    var midY = (y + y1) / 2
    var midPoint = new Point(midX, midY);

    return midPoint;
}


Polyline.prototype.snaps = function (mousePoint, delta) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var snaps = [];

    if (settings.endSnap) {
        // End points for each segment
        for (var i = 0; i < this.points.length; i++) {
            snaps.push(this.points[i]);
        }
    }

    if (settings.midSnap) {

        for (var i = 1; i < this.points.length; i++) {

            var start = this.points[i - 1];
            var end = this.points[i]

            snaps.push(this.midPoint(start.x, end.x, start.y, end.y));
        }
    }

    if (settings.nearestSnap) {
        var closest = this.closestPoint(mousePoint)

        // Crude way to snap to the closest point or a node
        if (closest[1] < delta / 10) {
            snaps.push(closest[0])
        }
    }

    return snaps;
}

Polyline.prototype.closestPoint = function (P) {

    var distance = Infinity;
    var minPnt = P;

    for (var i = 1; i < this.points.length; i++) {

        var A = this.points[i - 1];
        var B = this.points[i];
        var pnt = P.perpendicular(A, B);
    
        if (pnt !== null){
            pntDist = distBetweenPoints(P.x, P.y, pnt.x, pnt.y)

            if(pntDist < distance){
                distance = pntDist;
                minPnt = pnt;
                console.log("distance:" , distance)
            }
        }
    }

    return [minPnt, distance]
}

Polyline.prototype.extremes = function () {

    var x_values = [];
    var y_values = [];

    for (var i = 0; i < this.points.length; i++) {
        x_values.push(this.points[i].x);
        y_values.push(this.points[i].y);
    }

    var xmin = Math.min.apply(Math, x_values)
    var xmax = Math.max.apply(Math, x_values)
    var ymin = Math.min.apply(Math, y_values)
    var ymax = Math.max.apply(Math, y_values)

    return [xmin, xmax, ymin, ymax]
}

Polyline.prototype.within = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    // determin if this entity is within a the window specified by selection_extremes
    var extremePoints = this.extremes()
    if (extremePoints[0] > selection_extremes[0] &&
        extremePoints[1] < selection_extremes[1] &&
        extremePoints[2] > selection_extremes[2] &&
        extremePoints[3] < selection_extremes[3]
    ) {

        return true
    } else {
        return false
    }
}

Polyline.prototype.touched = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var lP1 = new Point();
    var lP2 = new Point();

    var rP1 = new Point(selection_extremes[0], selection_extremes[2]);
    var rP2 = new Point(selection_extremes[1], selection_extremes[3]);

    var rectPoints = {
        start: rP1,
        end: rP2
    };

    var output = Intersection.intersectPolylineRectangle(this.intersectPoints(), rectPoints);
    //console.log("polyline.js - touched - status:",output.status)

    if (output.status === "Intersection") {
        return true
    } else {
        return false
    }
}
