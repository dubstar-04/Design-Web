
function savesvg(Scene){
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

	// Create a thumbnail of the scene and save as the file icon in the file browser

	console.log("save dxf")
	var data = ""
		data = data.concat(
			//Create Header Data
			"999",
			"\nDXF created from Design",
			"\n0",
			"\nSECTION",
			"\n2",
			"\nHEADER",
			"\n9",
			"\n$ACADVER",
			"\n1",
			"\nAC1009",
			"\n0",
			"\n$CLAYER",
			"\n8",
			"\n" + LM.getCLayer(),
			"\n9",
			"\nENDSEC",
			"\n0",
			"\nSECTION")

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

		var extents = getSceneExtents() //Scene.canvas.getExtents();

		var width = extents.xmax - extents.xmin;
	var height = extents.ymax - extents.ymin;

	data = data.concat(
			"\n0",
			"\nENDTAB",
			"\n0",
			"\nTABLE",
			"\n2",
			"\nVPORT",
			"\n2",
			"\n*ACTIVE",
			"\n10",
			"\n0.0",
			"\n20",
			"\n0.0",
			"\n11",
			"\n1.0",
			"\n21",
			"\n1.0",
			"\n12",
			"\n" + Number(extents.xmin + width / 2),
			"\n22",
			"\n" + Number(extents.ymin + height / 2),
			"\n40",
			"\n" + height,
			"\n41",
			"\n" + width / height,
			"\n76",
			"\n1",
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
			type: "text/plain;charset=utf-8"
		});
	saveAs(blob, "design.dxf");
}

function fileBrowser() {}

function selectFile() {
	console.log("fileio.js: selectFile()")
	var fileSelector = document.createElement('input');
	fileSelector.setAttribute('type', 'file');
	fileSelector.addEventListener("change", function () {
		readFile(fileSelector.files[0])
	});
	fileSelector.click();
}

function readFile(file) {
	console.log("fileio.js: readFile()")
	console.log("processFile()")
	var reader = new FileReader();
	reader.onload = function () {
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
		
		LM.checkLayers();
		canvas.requestPaint();
		notify("File Opened")
		//return items
}
