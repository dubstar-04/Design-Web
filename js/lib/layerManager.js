function LayerManager() {

    this.layers = new Array();
    this.currentLayer = "0";

    this.addStandardLayers()

}


LayerManager.prototype.getLayers = function () {
    return this.layers;
}

LayerManager.prototype.layerCount = function () {
    return this.layers.length;
}

LayerManager.prototype.newLayer = function () {

    this.addLayer({
        "name": this.getUniqueName("NEW_LAYER")
    });
}

LayerManager.prototype.getUniqueName = function(name){
	
	var count = 0;
    var layStr = name.replace(/ /g, "_").toUpperCase();
    console.log("New Layer Name:" + layStr)
    for (var i = 0; i < this.layerCount(); i++) {
        if (this.layers[i].name.includes(layStr)) {
            count = count + 1;
        }
    }
    if (count > 0) {
        layStr = layStr + "_" + count;
    }

	return layStr;
}

LayerManager.prototype.addLayer = function (layer) {
    console.log(" layermanager.js - addlayer() - New Layer Added:" + layer.name)
    var newLayer = new Layer(layer);
    if (!this.layerExists(layer)) {
        this.layers.push(newLayer);
        saveRequired();
    }
}

LayerManager.prototype.deleteLayer = function (layerIndex) {

    var layerToDelete = this.getLayerByIndex(layerIndex).name;

    if (layerToDelete.toUpperCase() === "DEFPOINTS") {
        console.log("Warning: DEFPOINTS layer cannot be deleted")
        return;
    }

    /*
      for (var i = 0; i < items.length; i++) {
          if (items[i].layer === layerToDelete) {
              count++
          }
      }
      */

    var selectionSet = [];

    for (var i = 0; i < items.length; i++) {
        if (items[i].layer === layerToDelete) {
            selectionSet.push(i)
        }
    }

    console.log(selectionSet.length, " Item(s) to be deleted from ", layerToDelete);

    selectionSet.sort();
    for (var j = 0; j < selectionSet.length; j++) {
        items.splice((selectionSet[j] - j), 1)
    }

    //Delete The Layer
    this.layers.splice(layerIndex, 1);
}

LayerManager.prototype.getCLayer = function () {
    return this.currentLayer;
}

LayerManager.prototype.setCLayer = function (clayer) {
    this.currentLayer = clayer;
}

LayerManager.prototype.layerExists = function (layer) {
    var i = this.layerCount();
    while (i--) {
        //console.log("layerExists:", this.layers[i].name)
        if (this.layers[i].name === layer.name) {
            //console.log("layerManager.js LayerExist: " + layer.name)
            return true;
        }
    }
    //console.log("Layer Doesn't Exist: " + layer.name)
    return false;
}

LayerManager.prototype.checkLayers = function () {

    if (!this.layerCount()) {
        console.log("layermanager.js - Check Layers -> Add Standard Layers")
        this.addStandardLayers();
    }

    for (var i = 0; i < items.length; i++) {
        var layer = (items[i].layer)
        this.addLayer({
            "name": layer
        })
    }
}

LayerManager.prototype.addStandardLayers = function () {
    this.addLayer({
        "name": "0",
        "colour": "#00BFFF"
    });
    this.addLayer({
        "name": "DEFPOINTS",
        "plotting": false
    });
    saveRequired();
}


LayerManager.prototype.layerVisible = function (layer) {
    for (var i = 0; i < this.layers.length; i++) {
        if (this.layers[i].name === layer) {

            if (this.layers[i].on || this.layers[i].frozen) {
                return true;
            }

            return false;
            break;
        }
    }

}

LayerManager.prototype.getLayerByName = function (layerName) {

    for (var i = 0; i < this.layerCount(); i++) {
        if (this.layers[i].name === layerName) {

            return this.layers[i];
            break;
        }
    }
}

LayerManager.prototype.getLayerByIndex = function (layerIndex) {

    return this.layers[layerIndex];
}


LayerManager.prototype.renameLayer = function (layerIndex, newName) {
	
	var newName = this.getUniqueName(newName)

    if (this.getLayerByIndex(layerIndex).name.toUpperCase() !== "DEFPOINTS") {
        
        if (this.getLayerByIndex(layerIndex).name === this.getCLayer()) {	
            this.setCLayer(newName);
            console.log("[Layernamanger.renameLayer] - set new Clayer name")
        }
        
        this.layers[layerIndex].name = newName;
    }

}
