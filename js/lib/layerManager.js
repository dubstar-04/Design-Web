function LayerManager() {

    this.layers = new Array();
    this.currentLayer = "0";

}


LayerManager.prototype.getLayers = function () {
    return this.layers;
}

LayerManager.prototype.layerCount = function () {
    return this.layers.length;
}

LayerManager.prototype.addLayer = function (layer) {
    console.log(" layermanager.js - addlayer() - New Layer Added:" + layer.name)
    var newLayer = new Layer(layer);
    if (!this.layerExists(layer)) {
        this.layers.push(newLayer);
        saveRequired();
    }
}

LayerManager.prototype.deleteLayer = function () {

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

    if (!layers.length) {
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
    //Scene.clayer = "0";
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
