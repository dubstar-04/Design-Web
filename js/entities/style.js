function Style(data) {
    //Define Properties
    this.type = "Style";
    this.name = "";
    this.font = "Arial"; //TODO: how to set the font to one thats available. See style.js also. 
    this.textHeight = 2.5;
    this.widthFactor = 1
    this.obliqueAngle = 0;
    this.backwards = false;
    this.upsideDown = false;
    this.vertical = false
    

    if (data) {

        this.name = data.name;

        if (data.font) {
            this.font = data.font;
        }

        if (data.bigFont) {
            this.bigFont = data.bigFont;
       }

        if (data.textHeight) {
            this.textHeight = data.textHeight;
        }

        if (data.lastTextHeight) {
            this.lastTextHeight = data.lastTextHeight;
        }

        if (data.obliqueAngle) {
            this.obliqueAngle = data.obliqueAngle;
        }

        if (data.standardFlags) {
            this.standardFlags = data.standardFlags;
        }

        if (data.widthFactor) { 
            this.widthFactor = data.widthFactor;
        }

        if (data.standardFlags){
            switch (data.standardFlags) {
                case 4:
                    this.vertical = true;
                    break;
            }
        }

        if (data.flags){
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

Style.prototype.getFlags = function () {

    //Standard flags (bit-coded values):
    //2 = Text is backward (mirrored in x).
    //4 = Text is upside down (mirrored in y).
    //4 = Text is backward and upside down

 var flags = 0

    if (this.backwards) {
        flags += 2
    }
    if (this.upsideDown) {
        flags += 4
    }

    return flags

}

Style.prototype.getStandardFlags = function () {

    //Standard flags (bit-coded values):
    //1 = This entry describes as shape
    //4 = Vertical Text
    //16 = Style is from an xref
    //32 = Xref is resolved (If set with 16)
    //64 = Required for 

 var flags = 0

    if (this.vertical) {
        flags += 4
    }

    return flags
}

Style.prototype.dxf = function () {
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "STYLE",
        "\n", "2", //Stylename
        "\n", this.name,
        "\n", "3", //Font
        "\n", this.font,
        "\n", "4", //Big font name 0 is none
        "\n", "",
        "\n", "40", //Text Height
        "\n", this.textHeight,
        "\n", "41", //Width Factor
        "\n", this.widthFactor,
        "\n", "42", //Last Text Height
        "\n", this.textHeight,
        "\n", "50", //Linetype
        "\n", this.obliqueAngle,
        "\n", "70", //Flags
        "\n", this.getStandardFlags(),
        "\n", "71", //Flags
        "\n", this.getFlags(),
    )
    console.log(" Style.js - DXF Data:" + data)
    return data
}