function Layer(data) {
    //Define Properties
    this.type = "Layer";
    this.name = "";
    this.frozen = false;
    this.on = true;
    this.locked = false;
    this.colour = "#FFFFFF";
    this.lineType = "CONTINUOUS";
    this.lineWeight = "DEFAULT";
    this.plotting = true;


    if (data) {

        this.name = data.name;

        switch (data.flags) {
            case 0:
                break;
            case 1: //1 = Layer is frozen;
                this.frozen = true;
                break;
            case 2: //2 = Layer is frozen by default in new viewports.
                this.frozen = true;
                break;
            case 4: //4 = Layer is locked.
                this.locked = true;
                break;
            case 16: //16 = If set, table entry is externally dependent on an xref.
                break;
            case 32: //32 = If this bit and bit 16 are both set, the externally dependent xref has been successfully resolved.
                break;
            case 64: //64 = If set, the table entry was referenced by at least one entity in the drawing the last time the drawing was edited. (This flag is for the benefit of AutoCAD commands. It can be ignored by most programs that read DXF files and need not be set by programs that write DXF files.)
                break;
        }
        if (data.colour) {
            //console.log(" layer.js - Layer Colour: " + data.colour)
            this.colour = data.colour;
        }

        if (data.lineType) {
            this.lineType = data.lineType;
        }

        if (data.lineWeight) {
            this.lineWeight = data.lineWeight;
        }

        if (data.plotting) {
            this.plotting = data.plotting;
        }
    }
}

Layer.prototype.getFlags = function () {

    //Standard flags (bit-coded values):
    //1 = Layer is frozen; otherwise layer is thawed.
    //2 = Layer is frozen by default in new viewports.
    //4 = Layer is locked.
    //16 = If set, table entry is externally dependent on an xref.
    //32 = If this bit and bit 16 are both set, the externally dependent xref has been successfully resolved.
    //64 = If set, the table entry was referenced by at least one entity in the drawing the last time the drawing was edited. (This flag is for the benefit of AutoCAD commands. It can be ignored by most programs that read DXF files and need not be set by programs that write DXF files.)
    var flags = 0

    if (this.frozen) {
        flags += 1
    }
    if (this.locked) {
        flags += 4
    }

    return flags

}

Layer.prototype.dxf = function () {
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "LAYER",
        "\n", "2", //Layername
        "\n", this.name,
        "\n", "70", //Flags
        "\n", this.getFlags(),
        "\n", "62", //Colour: Negative if layer is off
        "\n", this.on ? getACADColour(this.colour) : (0 - getACADColour(this.colour)),
        "\n", "6", //Linetype
        "\n", this.lineType,
        // "\n", "290", //plotting               |
        // "\n", this.plotting ? 1 : 0,          |   These items codes dont seem to be
        // "\n", "370", //lineWeight             |   supported in ACAD.
        // "\n", this.lineWeight                 |
    )
    console.log(" layer.js - DXF Data:" + data)
    return data
}