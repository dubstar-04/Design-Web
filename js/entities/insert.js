function Insert(data) {
    //Define Properties
    this.type = "Insert";
    this.block = "";
    this.points = [];
    this.colour = "BYLAYER";
    this.layer = "0";

    console.log("can we access items?", items)

    if (data) {

        this.block = data.block;

        if (data.points) {
            this.points = data.points
            console.log("Insert Point Data:", data.points)
        }

        if (data.colour) {
            this.colour = data.colour;
        }

        if (data.layer) {
            this.layer = data.layer;
        }
    }
}

Insert.prototype.dxf = function() {
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "Insert",
        "\n", "8",
        "\n", 0,
        "\n", "2", //name
        "\n", this.block,
        "\n", "10", //X
        "\n", this.points[0].x,
        "\n", "20", //Y
        "\n", this.points[0].y,
        "\n", "30", //Z
        "\n", "0.0",
    )
    console.log(" insert.js - DXF Data:" + data)
    return data
}

Insert.prototype.draw = function(ctx, scale) {

    return
}

Insert.prototype.snaps = function(mousePoint, delta) {

    snaps = [];
    return snaps;
}

Insert.prototype.within = function(selection_extremes) {

    // determin if this entities is within a the window specified by selection_extremes
    var extremePoints = this.extremes()
    if (extremePoints[0] > this.points[0] &&
        extremePoints[1] < this.points[0] &&
        extremePoints[2] > this.points[0] &&
        extremePoints[3] < this.points[0]
    ) {

        return true
    } else {
        return false
    }

}

Insert.prototype.intersectPoints = function() {

    return {
        start: this.points[0],
        end: this.points[0]
    }
}

Insert.prototype.closestPoint = function(P) {

    var distance = P.distance(this.points[0]);
    var minPnt = this.points[0];

    return [minPnt, distance]
}

Insert.prototype.extremes = function() {
    return []
}

Insert.prototype.touched = function(selection_extremes) {

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