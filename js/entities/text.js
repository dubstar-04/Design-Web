// Register this command with the scene
commands.push({
    command: "Text",
    shortcut: "DT"
});

function Text(data) //startX, startY, endX, endY)
{
    //Define Properties         //Associated DXF Value
    this.type = "Text";
    this.family = "Geometry";
    this.minPoints = 1;
    this.showPreview = false; //show preview of item as its being created
    this.helper_geometry = false; // If true a line will be drawn between points when defining geometry
    this.points = [new Point()];

    //this.TextWidth = 2;         //Thickness
    //this.font = "Arial"
    this.string = ""
    this.height = 2.5;
    this.rotation = 0; //in degrees
    this.horizontalAlignment = 0;
    this.verticalAlignment = 0;
    this.backwards = false;
    this.upsideDown = false;
    this.colour = "BYLAYER";
    this.layer = "0";
    this.styleName = "STANDARD"
        //this.alpha = 1.0            //Transparancy
        //this.TextType
        //this.TexttypeScale
        //this.PlotStyle
        //this.TextWeight

    if (data) {

        //console.log("Data: ", data)
        //console.log("text.js - string:", data.string, "rotation: ", data.rotation, " hAlign: ", data.horizontalAlignment, " vAlign: ", data.verticalAlignment)
        this.points = data.points;

        if (data.input) {
            //TODO: Find a better way of providing this data
            // This comes from design-engine
            this.height = data.input[1];
            this.string = data.input[2];
        }

        if (data.string) {
            this.string = data.string;
        }

        if (data.height) {
            this.height = data.height;
        }

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            this.layer = data.layer;
        }

        if (data.rotation) {
            this.rotation = data.rotation;
        }
        if (data.horizontalAlignment) {
            this.horizontalAlignment = data.horizontalAlignment;
        }

        if (data.verticalAlignment) {
            this.verticalAlignment = data.verticalAlignment;
        }

        if (data.styleName) {
            this.styleName = data.styleName;
        }

        if (data.flags) {
            switch (data.flags) {
                // DXF Data
                //2 = Text is backward (mirrored in X).
                // 4 = Text is upside down (mirrored in Y). 
                case 2:
                    this.backwards = true;
                    break;
                case 4:
                    this.upsideDown = true;
                    break;
                case 6:
                    this.upsideDown = true;
                    this.backwards = true;
                    break;
            }
        }
    }
}

Text.prototype.prompt = function(inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    console.log("inputArray: ", inputArray)
    console.log("type: ", typeof inputArray[num - 1])

    expectedType[0] = ["undefined"];
    prompt[0] = "Pick start point:";

    expectedType[1] = ["object"];
    prompt[1] = "Enter height:";

    expectedType[2] = ["number"];
    prompt[2] = "Enter text:";

    expectedType[3] = ["string", "number"];
    prompt[3] = "";

    var validInput = expectedType[num].includes(typeof inputArray[num - 1])

    if (!validInput) {
        console.log("invalid")
        inputArray.pop()
    } else if (inputArray.length === 3) {
        action = true;
        reset = true
    }

    return [prompt[inputArray.length], reset, action, validInput]
}

Text.prototype.width = function() {
    var oldFont = canvas.context.font;
    canvas.context.font = this.height + "pt " + SM.getStyleByName(this.styleName).font.toString();
    var width = (canvas.context.measureText(this.string.toString()).width);
    canvas.context.font = oldFont;
    return width
}

Text.prototype.getHorizontalAlignment = function() {

    /* DXF Data
    0 = Left; 1= Center; 2 = Right
    3 = Aligned (if vertical alignment = 0)
    4 = Middle (if vertical alignment = 0)
    5 = Fit (if vertical alignment = 0)
    */

    switch (this.horizontalAlignment) {
        case 0:
            return "left";
        case 1:
            return "center";
        case 2:
            return "right";
        case 3:
            return (this.verticalAlignment === 0 ? "aligned" : "left"); //(if vertical alignment = 0)
        case 4:
            return (this.verticalAlignment === 0 ? "center" : "left"); //(if vertical alignment = 0)
        case 5:
            return (this.verticalAlignment === 0 ? "fit" : "left"); //(if vertical alignment = 0)
        default:
            return "left";
    }
}

Text.prototype.getVerticalAlignment = function() {

    /* DXF Data
    Vertical text justification type (optional, default = 0): integer codes (not bit- coded):
    0 = Baseline; 1 = Bottom; 2 = Middle; 3 = Top
    See the Group 72 and 73 integer codes table for clarification.
    */

    switch (this.verticalAlignment) {
        case 0:
            return "alphabetic";
        case 1:
            return "bottom";
        case 2:
            return "middle";
        case 3:
            return "top";
        default:
            return "alphabetic";
    }
}

Text.prototype.getBoundingRect = function() {

    var rect = { width: Number(this.width()), height: Number(this.height), x: this.points[0].x, y: this.points[0].y }
        //console.log("text.js - Rect height: ", rect.height, " width: ", rect.width, " x: ", rect.x, " y: ", rect.y)
    return rect
}

Text.prototype.draw = function(ctx, scale) {

    var rect = this.getBoundingRect()

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var colour = this.colour;

    if (this.colour === "BYLAYER") {
        colour = LM.getLayerByName(this.layer).colour
    }

    //ctx.strokeStyle = colour; // Text doesn't require a stroke, see fill.
    ctx.font = this.height + "pt " + SM.getStyleByName(this.styleName).font.toString();
    ctx.fillStyle = colour;
    ctx.textAlign = this.getHorizontalAlignment();
    ctx.textBaseline = this.getVerticalAlignment();
    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(this.points[0].x, -this.points[0].y);

    if (this.upsideDown) {
        ctx.scale(1, -1);
    }

    if (this.backwards) {
        ctx.scale(-1, 1);
    }

    if (this.backwards || this.upsideDown) {
        ctx.rotate(degrees2radians(this.rotation));
    } else {
        ctx.rotate(degrees2radians(-this.rotation));
    }

    ctx.fillText(this.string, 0, 0)
        //ctx.stroke() // Text doesn't require a stroke
    ctx.restore();

    //// Draw Bounding Box to test the getBoundingRect()
    /*
    ctx.strokeStyle = colour;
    ctx.lineWidth = 1 / scale;
    ctx.beginPath()
    ctx.moveTo(rect.x, rect.y);
    ctx.lineTo(rect.x + rect.width, rect.y);
    ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
    ctx.lineTo(rect.x, rect.y + rect.height);
    ctx.lineTo(rect.x, rect.y);
    ctx.stroke()
    */
}

Text.prototype.SVG = function(file) {
    //<Text x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    //"<Text x1=" + this.startX  + "y1=" + this.startY + "x2=" + this.endX + "y2=" + this.endY + "style=" + this.colour + ";stroke-width:" + this.TextWidth + "/>"
}


Text.prototype.dxf = function() {
    var dxfitem = ""
    var data = dxfitem.concat(
            "0",
            "\n", "TEXT",
            "\n", "8", //LAYERNAME
            "\n", this.layer,
            "\n", "10", //X
            "\n", this.points[0].x,
            "\n", "20", //Y
            "\n", this.points[0].y,
            "\n", "30", //Z
            "\n", "0.0",
            // "\n", "11", //X
            // "\n", this.points[1].x,
            // "\n", "21", //Y
            // "\n", this.points[1].y, //Y
            // "\n", "31", //Z
            // "\n", "0.0",
            "\n", "1", //STRING
            "\n", this.string,
            "\n", "40", //STRING
            "\n", this.height,
            // "\n", "7", // TEXT STYLE
            // "\n", "STANDARD",
            // "\n", "72", //HORIZONTAL ALIGNMENT
            // "\n", this.getHorizontalAlignment(),
            // "\n", "73", //VERTICAL ALIGNMENT
            // "\n", this.getVerticalAlignment()
        )
        //console.log(" line.js - DXF Data:" + data)
    return data
}

Text.prototype.snaps = function(mousePoint, delta) {

    var rect = this.getBoundingRect()

    var botLeft = new Point(rect.x, rect.y);
    var botRight = new Point(rect.x + rect.width, rect.y);
    var topLeft = new Point(rect.x, rect.y + rect.height);
    var topRight = new Point(rect.x + rect.width, rect.y + rect.height);
    var mid = new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);

    var snaps = [botLeft, botRight, topLeft, topRight, mid];

    //var closest = this.closestPoint(mousePoint)

    return snaps;
}

Text.prototype.closestPoint = function(P) {

    var rect = this.getBoundingRect()
    var botLeft = new Point(rect.x, rect.y);
    var topRight = new Point(rect.x + rect.width, rect.y + rect.height);
    var mid = new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);

    var distance = distBetweenPoints(P.x, P.y, mid.x, mid.y)

    // if P is inside the bounding box return distance 0  
    if (P.x > botLeft.x &&
        P.x < topRight.x &&
        P.y > botLeft.y &&
        P.y < topRight.y
    ) { distance = 0 }

    //console.log(distance);

    return [mid, distance]
}

Text.prototype.extremes = function() {
    var rect = this.getBoundingRect()
    var xmin = rect.x;
    var xmax = rect.x + rect.width;
    var ymin = rect.y;
    var ymax = rect.y + rect.height;
    //console.log("Rect:" + xmin + " " +  xmax + " " +  ymin + " " +  ymax)
    return [xmin, xmax, ymin, ymax]
}

Text.prototype.within = function(selection_extremes) {

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

Text.prototype.intersectPoints = function() {

    var rect = this.getBoundingRect()

    var botLeft = new Point(rect.x, rect.y);
    var topRight = new Point(rect.x + rect.width, rect.y + rect.height);

    return {
        start: botLeft,
        end: topRight
    }
}

Text.prototype.touched = function(selection_extremes) {

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var rP1 = new Point(selection_extremes[0], selection_extremes[2]);
    var rP2 = new Point(selection_extremes[1], selection_extremes[3]);

    var rectPoints = {
        start: rP1,
        end: rP2
    };

    var output = Intersection.intersectRectangleRectangle(this.intersectPoints(), rectPoints);
    console.log(output.status)

    if (output.status === "Intersection") {
        return true
    }
    //no intersection found. return false
    return false

}