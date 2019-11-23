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
    //this.limitPoints = true;
    //this.allowMultiple = false;
    this.showPreview = false; //show preview of item as its being created
    this.helper_geometry = false; // If true a line will be drawn between points when defining geometry

    this.points = [];

    //this.TextWidth = 2;         //Thickness
    this.font = "Arial"
    this.string = ""
    this.height = 2.5;
    this.rotation = 0;
    this.horizontalAlignment = 0;
    this.verticalAlignment = 0;
    this.backwards = false;
    this.upsideDown = false;



    //this.string = this.height + "px " + this.font //10px sans-serif
    this.colour = "BYLAYER";
    this.layer = "0";
    //this.alpha = 1.0            //Transparancy
    //this.TextType
    //this.TexttypeScale
    //this.PlotStyle
    //this.TextWeight

    if (data) {

        for (var i=0; data.length; i++){

            console.log("Data: " + i + " : " + data[i])
    
        }

        //console.log("text.js - string:", data.string, "rotation: ", data.rotation, " hAlign: ", data.horizontalAlignment, " vAlign: ", data.verticalAlignment)

        this.points = data.points;
        this.height = data.input[1];
        this.string = data.input[2];

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            this.layer = data.layer;
        }

        //this.colour = data.colour;
        //this.layer = data.layer;
        //this.string = data.string;
        //this.height = data.height;
        //this.rotation = data.rotation;
        //this.horizontalAlignment = data.horizontalAlignment;
        //this.verticalAlignment = data.verticalAlignment;

        /*

        switch (data.flags) {
            /* DXF Data
            2 = Text is backward (mirrored in X).
            4 = Text is upside down (mirrored in Y). 
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

        */
        
        
    }
}

Text.prototype.prompt = function (inputArray) {
    var num = inputArray.length;
    var expectedType = [];
    var reset = false;
    var action = false;
    var prompt = [];

    expectedType[0] = "undefined";
    prompt[0] = "Pick start point:";
 
    expectedType[1] = "object";   
    prompt[1] = "Enter height:";

    expectedType[2] = "number";   
    prompt[2] = "Enter text:";

    expectedType[3] = "string"; 
    prompt[3] = "";
            
    if(typeof inputArray[num-1] !== expectedType[num]){
        inputArray.pop()
    }
    
   if (inputArray.length === 3){
        action = true;
        reset = true
    }
    return [prompt[inputArray.length], reset, action]
}

Text.prototype.width = function () {
    var width = (canvas.context.measureText(this.text).width);
    return width
}

Text.prototype.getHorizontalAlignment = function () {

    /* DXF Data
    0 = Left; 1= Center; 2 = Right
    3 = Aligned (if vertical alignment = 0)
    4 = Middle (if vertical alignment = 0)
    5 = Fit (if vertical alignment = 0)
    */

    // Return canvas textAlignment value

    switch (this.horizontalAlignment) {
        case 0:
            return "left";
        case 1:
            return "center";
        case 2:
            return "right";
        case 3:
            return this.verticalAlignment = 0 ? "aligned" : "left"; //(if vertical alignment = 0)
        case 4:
            return this.verticalAlignment = 0 ? "center" : "left" //(if vertical alignment = 0)
        case 5:
            return this.verticalAlignment = 0 ? "fit" : "left" //(if vertical alignment = 0)
        default:
            return "left";
    }
}

Text.prototype.getVerticalAlignment = function () {

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

Text.prototype.getBoundingRect = function () {

    //var textData = Qt.createQmlObject('import QtQuick 2.4; TextMetrics{id: textMetrics}', canvas, "textMetrics");
    //textData.font.family = this.font;
    //textData.font.pixelSize = this.height;
    //textData.text = this.string
    
    var rect = {width: Number(this.width()), height: Number(this.height), x: this.points[0].x, y: this.points[0].y}

    return rect
}

Text.prototype.draw = function (ctx, scale) {


    var rect = this.getBoundingRect()
    console.log("text.js - text height: ", this.height, " displayed Height: ", rect.height)

    if (!LM.layerVisible(this.layer)) {
        return
    }

    var colour = this.colour;

    if (this.colour === "BYLAYER") {
        colour = LM.getLayerByName(this.layer).colour
    }

    ctx.strokeStyle = colour;
    //ctx.TextWidth = this.TextWidth/scale;
    //ctx.beginPath()

    ctx.font = this.height + "pt " + this.font.toString();
    ctx.fillStyle = colour;

   
   // ctx.textAlign = this.getHorizontalAlignment();
   // ctx.textBaseline = this.getVerticalAlignment();

    ctx.save();
    ctx.scale(1, -1);
    ctx.translate(this.points[0].x, -this.points[0].y);

    /*
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

    //// Test height

    ctx.moveTo(rect.x, rect.y);
    ctx.lineTo(rect.x + rect.width, rect.y);
    ctx.lineTo(rect.x + rect.width, rect.y + rect.height);
    ctx.lineTo(rect.x, rect.y + rect.height);
    ctx.lineTo(rect.x, rect.y);
    */

    //// Test Height

    ctx.fillText(this.string, 0, 0)
    ctx.stroke()
    ctx.restore();
}

Text.prototype.SVG = function (file) {
    //<Text x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
    //"<Text x1=" + this.startX  + "y1=" + this.startY + "x2=" + this.endX + "y2=" + this.endY + "style=" + this.colour + ";stroke-width:" + this.TextWidth + "/>"
}




Text.prototype.snaps = function (mousePoint, delta) {

    var rect = this.getBoundingRect()

    var start = new Point(rect.x, rect.y);
    var mid = new Point();

    mid.x = rect.x + rect.width / 2;
    mid.y = rect.y + rect.height / 2;

    var end = new Point(rect.x + rect.width, rect.y);

    //var closest = this.closestPoint(mousePoint)
    var snaps = [start, mid, end];

    return snaps;
}

Text.prototype.closestPoint = function (P) {

    var mid = new Point();

    mid.x = this.points[0].x + this.width() / 2;
    mid.y = this.points[0].y + this.height / 2;

    return mid
}

Text.prototype.extremes = function () {

    var rect = this.getBoundingRect()
    var xmin = rect.x;
    var xmax = rect.x + rect.width;
    var ymin = rect.y;
    var ymax = rect.y + rect.height;
    //console.log("Rect:" + xmin + " " +  xmax + " " +  ymin + " " +  ymax)
    return [xmin, xmax, ymin, ymax]
}

Text.prototype.within = function (selection_extremes) {

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

Text.prototype.touched = function (selection_extremes) {
    return false;
}
