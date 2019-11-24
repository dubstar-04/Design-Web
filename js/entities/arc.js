// Register this command with the scene
commands.push({
    command: "Arc",
    shortcut: "A"
});

function Arc(data) //centreX, centreY, endX, endY)
{
    //Define Properties         //Associated DXF Value
    this.type = "Arc";
    this.family = "Geometry";
    this.minPoints = 3; //Should match number of cases in prompt
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
            this.radius = this.points[0].distance(this.points[1])
        }

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            this.layer = data.layer;
        }
    }
}

Arc.prototype.startAngle = function () {
    return this.points[0].angle(this.points[1])
}

Arc.prototype.endAngle = function () {
    return this.points[0].angle(this.points[2])
}


Arc.prototype.direction = function () {

    var start = this.startAngle();
    var end = this.endAngle();
    //var direction;

    console.log("Start angle: ", start, " end angle: ", end)
    end = end - start;
    start = start - start;
    console.log("Start angle adjusted to zero: ", start, " end angle: ", end)
    /* if(end < 0){
        end = end + 2 * Math.PI
        console.log("Start angle corrected for minus: ", start, " end angle: ", end)
    }
    */

    return end < start; // < end;

}

Arc.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    expectedType[0] = ["undefined"];
    prompt[0] = "Pick the centre point:";
 
    expectedType[1] = ["object"];   
    prompt[1] = "Pick start point:";

    expectedType[2] = ["object"];   
    prompt[2] = "Pick end point:";

    expectedType[3] = ["object"];   
    prompt[3] = "";
    
    var validInput = expectedType[num].includes(typeof inputArray[num-1])
            
    if(!validInput){
        inputArray.pop()
    }
    
   if (inputArray.length === this.minPoints){
        action = true;
        reset = true;
        this.helper_geometry = false;
    }
    
    return [prompt[inputArray.length], reset, action, validInput]
}

Arc.prototype.draw = function (ctx, scale) {

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

    ctx.arc(this.points[0].x, this.points[0].y, this.radius, this.startAngle(), this.endAngle(), false) //this.direction())

    ctx.stroke()
}

Arc.prototype.properties = function () {

    return { //type: this.type,
        colour: this.colour,
        layer: this.layer,
        lineWidth: this.lineWidth
    }


}

Arc.prototype.svg = function () {
    //<Arc cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    var svgstr = ""
    var data = svgstr.concat("<Arc",
        " cx=", "\"", this.points[0].x, "\"",
        " cy=", "\"", this.points[0].y, "\"",
        " r=", "\"", this.radius, "\"",
        " stroke=", "\"", this.colour, "\"",
        " stroke-width=", "\"", this.lineWidth, "\"", "/>"
    )
    //console.log(data)
    return data
}



Arc.prototype.dxf = function () {
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "ARC",
        "\n", "8", //LAYERNAME
        "\n", this.layer,
        "\n", "10", //X
        "\n", this.points[0].x,
        "\n", "20", //Y
        "\n", this.points[0].y,
        "\n", "30", //Z
        "\n", "0.0",
        "\n", "40",
        "\n", this.radius, //Radius
        "\n", "50", //START ANGLE
        "\n", radians2degrees(this.startAngle()), //Radians
        "\n", "51", //END ANGLE
        "\n", radians2degrees(this.endAngle()) //Radians
    )
    console.log(" arc.js - DXF Data:" + data)
    return data
}

Arc.prototype.trim = function (points) {
    console.log("arc.js - Points:", points.length)
}

Arc.prototype.intersectPoints = function () {

    return {
        centre: this.points[0],
        radius: this.radius,
        startAngle: this.startAngle(),
        endAngle: this.endAngle()
    }

}

Arc.prototype.snaps = function (mousePoint, delta) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var snaps = [];

    if (settings.endSnap) {
        //Speed this up by generating the proper start and end points when the arc is initialised
        var start_point = new Point(this.points[0].x + (this.radius * Math.cos(this.startAngle())),
            this.points[0].y + (this.radius * Math.sin(this.startAngle())));
        var end_point = new Point(this.points[0].x + (this.radius * Math.cos(this.endAngle())),
            this.points[0].y + (this.radius * Math.sin(this.endAngle())));

        snaps.push(start_point, end_point);
    }

    if (settings.centreSnap) {
        var centre = this.points[0];
        snaps.push(centre)
    }

    if (settings.nearestSnap) {
        var closest = this.closestPoint(mousePoint)
        //var snaps = [center, start_point, end_point];

        // Crude way to snap to the closest point or a node
        if (closest[2] === true && closest[1] < delta / 10) {
            snaps.push(closest[0])
        }
    }


    return snaps;
}

Arc.prototype.closestPoint = function (P) {
    //find the closest point on the Arc
    var length = this.points[0].distance(P); //distBetweenPoints(this.points[0].x, this.points[0].y, P.x, P.y)
    var Cx = this.points[0].x + this.radius * (P.x - this.points[0].x) / length
    var Cy = this.points[0].y + this.radius * (P.y - this.points[0].y) / length
    var closest = new Point(Cx, Cy);
    var distance = closest.distance(P); //distBetweenPoints(closest.x, closest.y, P.x, P.y)

    //var A_end = this.points[0].x - closest.x;
    //var O_end = this.points[0].y - closest.y;
    var snap_angle = this.points[0].angle(P) //Math.atan2(O_end,A_end) + Math.PI;

    if (snap_angle > this.startAngle() && snap_angle < this.endAngle()) {
        return [closest, distance, true];
    } else {
        return [closest, distance, false];
    }


}

Arc.prototype.diameter = function () {
    var diameter = 2 * this.radius
    return diameter
}


Arc.prototype.area = function () {
    var area = Math.pow((Math.PI * this.radius), 2); //not valid for an arc
    return area
}

Arc.prototype.extremes = function () {

    var x_values = [];
    var y_values = [];

    //var midAngle = (this.endAngle() - this.startAngle()) / 2 + this.startAngle();

    //console.log(" arc.js - [info] (Arc.prototype.extremes) radius: " + this.radius + " startAngle: " + this.startAngle() + " endAngle: " + this.endAngle())// + " midAngle: " + midAngle);

    x_values.push(this.radius * Math.cos(this.startAngle()) + this.points[0].x);
    y_values.push(this.radius * Math.sin(this.startAngle()) + this.points[0].y);
    //x_values.push( this.radius * Math.cos(midAngle) + this.points[0].x);
    //y_values.push( this.radius * Math.sin(midAngle) + this.points[0].y);
    x_values.push(this.radius * Math.cos(this.endAngle()) + this.points[0].x);
    y_values.push(this.radius * Math.sin(this.endAngle()) + this.points[0].y);

    x_values.push((x_values[0] + x_values[1]) / 2)
    y_values.push((y_values[0] + y_values[1]) / 2)

    var xmin = Math.min.apply(Math, x_values)
    var xmax = Math.max.apply(Math, x_values)
    var ymin = Math.min.apply(Math, y_values)
    var ymax = Math.max.apply(Math, y_values)

    //console.log(" arc.js - (Arc Extremes)" + xmin, xmax, ymin, ymax)
    return [xmin, xmax, ymin, ymax]

}

Arc.prototype.within = function (selection_extremes) {

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

Arc.prototype.touched = function (selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var rP1 = new Point(selection_extremes[0], selection_extremes[2]);
    var rP2 = new Point(selection_extremes[1], selection_extremes[3]);

    var rectPoints = {
        start: rP1,
        end: rP2
    }
    var output = Intersection.intersectArcRectangle(this.intersectPoints(), rectPoints);
    //console.log(output.status)

    if (output.status === "Intersection") {
        return true
    } else {
        return false
    }

}
