// Register this command with the scene
commands.push({
    command: "Circle",
    shortcut: "C"
});

function Circle(data) //centreX, centreY, endX, endY)
{
    //Define Properties         //Associated DXF Value
    this.type = "Circle";
    this.family = "Geometry";
    this.minPoints = 2;
    this.showPreview = true; //show preview of item as its being created
    //this.limitPoints = true;
    //this.allowMultiple = false;
    this.helper_geometry = true; // If true a line will be drawn between points when defining geometry

    this.points = [];
    this.radius = 0;

    this.lineWidth = 2; //Thickness
    this.colour = "BYLAYER";
    this.layer = "0";
    this.alpha = 1.0 //Transparancy
    //this.lineType
    //this.LinetypeScale
    //this.PlotStyle
    //this.LineWeight


    if (data) {

        if (data.points) {
            this.points = data.points
            this.calculateRadius();
        }

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            this.layer = data.layer;
        }
    }
}

Circle.prototype.calculateRadius = function () {
    this.radius = distBetweenPoints(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
}

Circle.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    expectedType[0] = ["undefined"];
    prompt[0] = "Pick the centre point:";
 
    expectedType[1] = ["object"];   
    prompt[1] = "Pick another point or Enter radius:";

    expectedType[2] = ["object", "number"];   
    prompt[2] = prompt[1];
            
    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput){
        inputArray.pop()
    }else if (inputArray.length === this.minPoints){
        action = true;
        reset = true
    }

    return [prompt[inputArray.length], reset, action, validInput]
}

Circle.prototype.draw = function (ctx, scale) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var colour = this.colour;

    if (this.colour === "BYLAYER") {
        colour = LM.getLayerByName(this.layer).colour
    }

    this.calculateRadius(); //is this the most efficient way to update the radius?

    ctx.strokeStyle = colour;
    ctx.lineWidth = this.lineWidth / scale;
    ctx.beginPath()

    //ctx.moveTo(this.points[0].x , this.points[0].y);
    ctx.arc(this.points[0].x, this.points[0].y, this.radius, radians2degrees(0), radians2degrees(360), false);

    ctx.stroke()
}

/*Circle.prototype.properties = function(){

    return {  //type: this.type,
        colour: this.colour,
        layer: this.layer,
        lineWidth: this.lineWidth
    }
}
*/

Circle.prototype.svg = function () {
    //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    var svgstr = ""
    var data = svgstr.concat("<circle",
        " cx=", "\"", this.points[0].x, "\"",
        " cy=", "\"", this.points[0].y, "\"",
        " r=", "\"", this.radius, "\"",
        " stroke=", "\"", this.colour, "\"",
        " stroke-width=", "\"", this.lineWidth, "\"", "/>"
    )
    //console.log(data)
    return data
}

Circle.prototype.dxf = function () {
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "CIRCLE",
        //"\n", "5", //HANDLE
        //"\n", "DA",
        "\n", "8", //LAYERNAME
        "\n", this.layer,
        "\n", "10", //X
        "\n", this.points[0].x,
        "\n", "20", //Y
        "\n", this.points[0].y,
        "\n", "30", //Z
        "\n", "0.0",
        "\n", "40",
        "\n", this.radius //DIAMETER
    )
    console.log(" circle.js - DXF Data:" + data)
    return data
}

Circle.prototype.trim = function (points) {
    console.log("circle.js - Points:", points.length)

    if (points.length > 1) {

        var start = points[0];
        var cen = mouse;
        var end = points[1];

        //console.log("Angle:", a-a, " Angle2: ", b, " centre: ", c)

        var arcPoints = [this.points[0]];

        var dir = (start.x - cen.x) * (end.y - cen.y) - (start.y - cen.y) * (end.x - cen.x)
        if (dir > 0) {
            console.log("Clockwise")
            arcPoints.push(points[0], points[1])
        } else if (dir < 0) {
            console.log("Counterclockwise")
            arcPoints.push(points[1], points[0])
        }


        var data = {
            points: arcPoints,
            colour: this.colour,
            layer: this.layer,
            lineWidth: this.lineWidth
        }

        addToScene("Arc", data, false, items.indexOf(this))

    }
}

Circle.prototype.intersectPoints = function () {
    return {
        centre: this.points[0],
        radius: this.radius
    }
}

Circle.prototype.snaps = function (mousePoint, delta) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var snaps = [];

    if (settings.centreSnap) {
        var centre = new Point(this.points[0].x, this.points[0].y);
        snaps.push(centre)
    }

    if (settings.quadrantSnap) {
        var angle0 = new Point(this.points[0].x + this.radius, this.points[0].y);
        var angle90 = new Point(this.points[0].x, this.points[0].y + this.radius);
        var angle180 = new Point(this.points[0].x - this.radius, this.points[0].y);
        var angle270 = new Point(this.points[0].x, this.points[0].y - this.radius);

        snaps.push(angle0, angle90, angle180, angle270)

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

Circle.prototype.closestPoint = function (P) {
    //find the closest point on the circle
    var length = distBetweenPoints(this.points[0].x, this.points[0].y, P.x, P.y)
    var Cx = this.points[0].x + this.radius * (P.x - this.points[0].x) / length
    var Cy = this.points[0].y + this.radius * (P.y - this.points[0].y) / length
    var closest = new Point(Cx, Cy);
    var distance = distBetweenPoints(closest.x, closest.y, P.x, P.y)

    return [closest, distance]
}

Circle.prototype.diameter = function () {
    var diameter = 2 * this.radius
    return diameter
}

Circle.prototype.circumference = function () {
    var circumference = Math.PI * 2 * this.radius;
    return circumference
}

Circle.prototype.area = function () {
    var area = Math.pow((Math.PI * this.radius), 2);
    return area
}

Circle.prototype.extremes = function () {

    var xmin = this.points[0].x - this.radius;
    var xmax = this.points[0].x + this.radius;
    var ymin = this.points[0].y - this.radius;
    var ymax = this.points[0].y + this.radius;

    return [xmin, xmax, ymin, ymax]

}

Circle.prototype.within = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    // determin if this entities is within a the window specified by selection_extremes
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

Circle.prototype.touched = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var rP1 = new Point(selection_extremes[0], selection_extremes[2]);
    var rP2 = new Point(selection_extremes[1], selection_extremes[3]);

    var rectPoints = {
        start: rP1,
        end: rP2
    }
    var output = Intersection.intersectCircleRectangle(this.intersectPoints(), rectPoints);
    console.log(output.status)

    if (output.status === "Intersection") {
        return true
    } else {
        return false
    }

}
