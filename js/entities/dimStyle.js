function DimStyle(data) {
    //Define Properties
    this.type = "DimStyle";
    this.name = "";
    this.DIMPOST = ""       //3 - General dimensioning suffix 
    this.DIMAPOST = ""      //4 - Alternate dimensioning suffix
    this.DIMBLK = ""        //5 - Arrow block name
    this.DIMBLK1 = ""       //6 - First arrow block name
    this.DIMBLK2 = ""       //8 - Second arrow block name 
    this.DIMSCALE = "1.0"   //40 - dimension scale
    this.DIMASZ = "0.18";   //41 - arrow size
    this.DIMEXO = "0.0625"; //42 - offset from origin
    this.DIMDLI = "0.38";   //43 - Baseline spacing
    this.DIMEXE = "0.18";   //44- extend beyond dim lines
    this.DIMRND = "0.0";    //45 - Rounding value for dimension distances
    this.DIMDLE = "0.0";    //46 - Dimension line extension
    this.DIMTP = "0.0";     //47 - Plus tolerance
    this.DIMTM = "0.0";     //48 - Minus tolerance
    this.DIMTXT = "0.18";   //140 - Dimensioning text height
    this.DIMCEN = "0.09";   //141 - centre marks
    this.DIMTSZ = "0.0";    //142 - Dimensioning tick size; 0 = no ticks
    this.DIMALTF = "25.39"; //143 - multiplier for alternate units
    this.DIMLFAC = "1.0";   //144 - Measurement scale factor
    this.DIMTVP = "0.0";    //145 - Text vertical position
    this.DIMTFAC = "1.0";   //146 - Dimension tolerance display scale factor
    this.DIMGAP = "0.09";   //147 - offset from dimline
    this.DIMTOL = "0";      //71 - Dimension tolerances generated if nonzero
    this.DIMLIM = "0";      //72 - Dimension limits generated if nonzero
    this.DIMTIH = "1";      //73 - Text inside horizontal if nonzero
    this.DIMTOH = "1";      //74 - Text outside horizontal if nonzero
    this.DIMSE1 = "0";      //75 - First extension line suppressed if nonzero
    this.DIMSE2 = "0";      //76 - Second extension line suppressed if nonzero
    this.DIMTAD = "0";      //77 -Text above dimension line if nonzero
    this.DIMZIN = "0";      //78 - Zero suppression for “feet & inch” dimensions
    this.DIMALT = "0";      //170 - Alternate unit dimensioning performed if nonzero 
    this.DIMALTD = "2";     //171 - Alternate unit decimal places
    this.DIMTOFL = "0";     //172 - If text outside extensions, force line extensions between extensions if nonzero
    this.DIMSAH = "0";      //173 - Use separate arrow blocks if nonzero
    this.DIMTIX = "0";      //174 - Force text inside extensions if nonzero
    this.DIMSOXD = "0";     //175 - Suppress outside-extensions dimension lines if nonzero
    this.DIMCLRD = "0";     //176 - Dimension line color, range is 0 = BYBLOCK, 256 = BYLAYER
    this.DIMCLRE = "0";     //177 - Dimension extension line color, range is 0 = BYBLOCK, 256 = BYLAYER
    this.DIMCLRT = "0";     //178 - Dimension text color, range is 0 = BYBLOCK, 256 = BYLAYER
    

    if (data) {

        this.name = data.name;
    }
}

DimStyle.prototype.getStandardFlags = function () {

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

DimStyle.prototype.dxf = function () {
    var dxfitem = ""
    var data = dxfitem.concat(
        "0",
        "\n", "DIMSTYLE",
        "\n", "2", //Stylename
        "\n", this.name,
        "\n", "70", //Flags
        "\n", this.getStandardFlags(),
         "\n",  "3", //DIMPOST 
         "\n",  this.DIMPOST,
         "\n",  "4", //DIMAPOST 
         "\n",  this.DIMAPOST,
         "\n",  "5", //DIMBLK
         "\n",  this.DIMBLK,
         "\n",  "6", //DIMBLK1
         "\n",  this.DIMBLK1,
         "\n",  "7", //DIMBLK2
         "\n",  this.DIMBLK2,
         "\n", "40", //DIMSCALE 
         "\n", this.DIMSCALE, 
         "\n", "41",  //DIMASZ 
         "\n", this.DIMASZ, 
         "\n",  "42", //DIMEXO
         "\n", this.DIMEXO, 
         "\n",  "43", //DIMDLI
         "\n", this.DIMDLI,
         "\n",  "44", //DIMEXE
         "\n", this.DIMEXE,
         "\n", "45", //DIMRND
         "\n", this.DIMRND,
         "\n", "46", //DIMDLE
         "\n", this.DIMDLE,
         "\n",  "47", //DIMTP
         "\n",  this.DIMTP,
         "\n", "48", //DIMTM
         "\n", this.DIMTM,
         "\n", "140", //DIMTXT
         "\n", this.DIMTXT,
         "\n", "141", //DIMCEN
         "\n", this.DIMCEN,
         "\n", "142", //DIMTSZ
         "\n", this.DIMTSZ,
         "\n", "143", //DIMALTF
         "\n", this.DIMALTF,
         "\n", "144", //DIMLFAC
         "\n", this.DIMLFAC,
         "\n", "145", //DIMTVP
         "\n", this.DIMTVP,
         "\n", "146", //DIMTFAC
         "\n", this.DIMTFAC,
         "\n", "147", //DIMGAP
         "\n", this.DIMGAP,
         "\n", "71", //DIMTOL
         "\n", this.DIMTOL,
         "\n", "72", //DIMLIM
         "\n", this.DIMLIM,
         "\n", "73", //DIMTIH
         "\n",  this.DIMTIH,
         "\n", "74", //DIMTOH
         "\n", this.DIMTOH,
         "\n", "75", //DIMSE1
         "\n", this.DIMSE1,
         "\n", "76", //DIMSE2
         "\n", this.DIMSE2,
         "\n", "77", //DIMTAD
         "\n", this.DIMTAD,
         "\n", "78", //DIMZIN
         "\n", this.DIMZIN,
         "\n", "170", //DIMALT
         "\n", this.DIMALT,
         "\n", "171", //DIMALTD
         "\n", this.DIMALTD,
         "\n", "172", //DIMTOFL
         "\n", this.DIMTOFL,
         "\n", "173", //DIMSAH
         "\n", this.DIMSAH,
         "\n", "174", //DIMTIX
         "\n", this.DIMTIX,
         "\n", "175", //DIMSOXD
         "\n", this.DIMSOXD,
         "\n", "176", //DIMCLRD
         "\n", this.DIMCLRD,
         "\n", "177", //DIMCLRE
         "\n", this.DIMCLRE,
         "\n", "178", //DIMCLRT
         "\n", this.DIMCLRT
    )
    console.log(" dimStyle.js - DXF Data:" + data)
    return data
}