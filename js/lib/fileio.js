function savesvg(Scene) {
    console.log("save svg")
    var data = "<?xml version=\"1.0\"?>"
    data = data.concat("\n", "<svg>")

    for (var i = 0; i < Scene.items.length; i++) {
        data = data.concat("\n", Scene.items[i].svg())
    }

    data = data.concat("\n", "</svg>")

    return data
}

function savedxf() {

    // TODO: Create a thumbnail of the scene and save as the file icon in the file browser

    console.log("save dxf")
    var data = ""
    data = data.concat(
            //Create Header Data
            "999",
            "\nDXF created from www.Design-App.co.uk",
            "\n0",
            "\nSECTION",
            "\n2",
            "\nHEADER",
            "\n9",
            "\n$ACADVER",
            "\n1",
            "\nAC1009",
            "\n9",
            "\n$CLAYER",
            "\n8",
            "\n" + LM.getCLayer(),
            "\n0",
            "\nENDSEC"
        )
        // Create table data for layers
    data = data.concat(
        "\n0",
        "\nSECTION",
        "\n2",
        "\nTABLES",
        "\n0",
        "\nTABLE",
        "\n2",
        "\nLAYER",
        "\n70",
        "\n" + LM.layerCount())

    for (var i = 0; i < LM.layerCount(); i++) {
        data = data.concat("\n", LM.getLayerByIndex(i).dxf())
    }

    data = data.concat(
        "\n0",
        "\nENDTAB"
    )

    // Create table data for text styles

    data = data.concat(
        "\n0",
        "\nTABLE",
        "\n2",
        "\nSTYLE",
        "\n70",
        "\n" + SM.styleCount())

    for (var i = 0; i < SM.styleCount(); i++) {
        data = data.concat("\n", SM.getStyleByIndex(i).dxf())
    }

    data = data.concat(
        "\n0",
        "\nENDTAB"
    )

    // Create table data for dimension styles

    data = data.concat(
        "\n0",
        "\nTABLE",
        "\n2",
        "\nDIMSTYLE",
        "\n70",
        "\n" + DSM.styleCount())

    for (var i = 0; i < DSM.styleCount(); i++) {
        data = data.concat("\n", DSM.getStyleByIndex(i).dxf())
    }

    data = data.concat(
        "\n0",
        "\nENDTAB",
    )

    var extents = getSceneExtents()

    var width = extents.xmax - extents.xmin;
    var height = extents.ymax - extents.ymin;

    data = data.concat(
        "\n0",
        "\nTABLE",
        "\n2", //Table Name
        "\nVPORT",
        "\n70", //Number of entries in table
        "\n1",
        "\n0",
        "\nVPORT",
        "\n2",
        "\n*ACTIVE",
        "\n70", //vport flags
        "\n0",
        "\n10", //lower left corner x pos
        "\n0.0",
        "\n20", //lower left corner y pos
        "\n0.0",
        "\n11", //upper right corner x pos
        "\n1.0",
        "\n21", //upper right corner y pos		
        "\n1.0",
        "\n12", //view centre x pos
        "\n" + Number(extents.xmin + width / 2),
        "\n22", //view centre y pos
        "\n" + Number(extents.ymin + height / 2),
        "\n13", //snap base point x
        "\n0.0",
        "\n23", //snap base point y
        "\n0.0",
        "\n14", //snap spacing x
        "\n10.0",
        "\n24", //snap spacing y
        "\n10.0",
        "\n15", //grid spacing x
        "\n10.0",
        "\n25", //grid spacing y
        "\n10.0",
        "\n16", //view direction (x) from target point
        "\n0.0",
        "\n26", //view direction (y) from target point
        "\n0.0",
        "\n 36", //view direction (z) from target point
        "\n1.0",
        "\n 17", //view target point x
        "\n0.0",
        "\n 27", //view target point y
        "\n0.0",
        "\n 37", //view target point z
        "\n0.0",
        "\n40", //VPort Height
        "\n" + height,
        "\n41", //Vport height/width ratio
        "\n" + width / height,
        "\n42", //Lens Length
        "\n50.0",
        "\n 43", //Front Clipping Plane
        "\n0.0",
        "\n 44", //Back Clipping Plane
        "\n0.0",
        "\n 50", //Snap Rotation Angle
        "\n0.0",
        "\n 51", //View Twist Angle
        "\n0.0",
        "\n71", //Viewmode (System Variable)
        "\n0",
        "\n72", //Cicle sides
        "\n1000",
        "\n73", //fast zoom setting
        "\n1",
        "\n74", //UCSICON Setting
        "\n3",
        "\n75", // snap on/off
        "\n 0",
        "\n76", // grid on/off
        "\n 1",
        "\n77", //snap style
        "\n 0",
        "\n78", //snap isopair
        "\n0",
        "\n0",
        "\nENDTAB",
        "\n0",
        "\nENDSEC")

    data = data.concat(
        "\n0",
        "\nSECTION",
        //Create Entity Data
        "\n2",
        "\nENTITIES")

    for (var i = 0; i < items.length; i++) {
        data = data.concat("\n", items[i].dxf())
    }

    data = data.concat(
        //End Entity and Close File
        "\n0",
        "\nENDSEC",
        "\n0",
        "\nEOF")

    //return data
    var blob = new Blob([data], {
        type: "text/plain;"
    });
    saveAs(blob, "design.dxf");
}

function fileBrowser() {}

function selectFile() {

    console.log("fileio.js: selectFile()")

    document.getElementById('fileupload').click()

    /* 	document.getElementById('fileupload').addEventListener("change", function () {
    		readFile(document.getElementById('fileupload').files[0])
    	}); */

    /* 	console.log("fileio.js: selectFile()")
    	var fileSelector = document.createElement('input');
    	fileSelector.setAttribute('type', 'file');
    	fileSelector.addEventListener("change", function () {
    		readFile(fileSelector.files[0])
    	});
    	fileSelector.click(); */
}

function readFile(file) {
    console.log("fileio.js: readFile()")
    console.log("processFile()")
    var reader = new FileReader();
    reader.onload = function() {
        var text = reader.result;
        openFile(text);
    };

    reader.readAsText(file);
}

function openFile(data) {
    var type = "dxf"

    if (type.toLowerCase() === "svg") {
        var items = processSVG(data)
        if (items) {
            addToScene(items)
        }
    }
    if (type.toLowerCase() === "dxf") {
        console.log("fileio.js - File Type is DXF")
        var dxf = new DXF(data);
        dxf.processData();
    }

    sceneLinkBlockData();
    LM.checkLayers();
    canvas.requestPaint();
    notify("File Opened")
        //return items
}