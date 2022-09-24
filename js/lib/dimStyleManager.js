function DimStyleManager() {
    //TODO: Can dimstylemanager and style manager be merged?

    this.styles = new Array();
    this.currentstyle = "STANDARD";

    this.addStandardStyles()
}


DimStyleManager.prototype.getStyles = function() {
    return this.styles;
}

DimStyleManager.prototype.styleCount = function() {
    return this.styles.length;
}

DimStyleManager.prototype.newStyle = function() {

    this.addStyle({
        "name": this.getUniqueName("NEW_STYLE")
    });
}

DimStyleManager.prototype.getUniqueName = function(name) {

    var count = 0;
    var styStr = name.replace(/ /g, "_").toUpperCase();
    console.log("New style Name:" + styStr)
    for (var i = 0; i < this.styleCount(); i++) {
        if (this.styles[i].name.includes(styStr)) {
            count = count + 1;
        }
    }
    if (count > 0) {
        styStr = styStr + "_" + count;
    }

    return styStr;
}

DimStyleManager.prototype.addStyle = function(style) {
    console.log(" DimStyleManager.js - addstyle() - New style Added:" + style.name)
    var newstyle = new DimStyle(style);
    if (!this.styleExists(style)) {
        this.styles.push(newstyle);
        saveRequired();
    }
}

DimStyleManager.prototype.deleteStyle = function(styleIndex) {

    var styleToDelete = this.getStyleByIndex(styleIndex).name;

    if (styleToDelete.toUpperCase() === "STANDARD") {
        console.log("Warning: STANDARD style cannot be deleted")
        return;
    }

    var selectionSet = [];

    for (var i = 0; i < items.length; i++) {
        if (items[i].style === styleToDelete) {
            selectionSet.push(i)
        }
    }

    console.log(selectionSet.length, " Item(s) to be deleted from ", styleToDelete);

    selectionSet.sort();
    for (var j = 0; j < selectionSet.length; j++) {
        items.splice((selectionSet[j] - j), 1)
    }

    //Delete The style
    this.styles.splice(styleIndex, 1);
}

DimStyleManager.prototype.getCstyle = function() {
    return this.currentstyle;
}

DimStyleManager.prototype.setCstyle = function(cstyle) {
    this.currentstyle = cstyle;
}

DimStyleManager.prototype.styleExists = function(style) {
    var i = this.styleCount();
    while (i--) {
        //console.log("styleExists:", this.styles[i].name)
        if (this.styles[i].name === style.name) {
            //console.log("DimStyleManager.js styleExist: " + style.name)
            return true;
        }
    }
    //console.log("style Doesn't Exist: " + style.name)
    return false;
}

DimStyleManager.prototype.checkStyles = function() {

    if (!this.styleCount()) {
        console.log("DimStyleManager.js - Check styles -> Add Standard styles")
        this.addStandardStyles();
    }

    for (var i = 0; i < items.length; i++) {
        var style = (items[i].style)
        this.addstyle({
            "name": style
        })
    }
}

DimStyleManager.prototype.addStandardStyles = function() {
    this.addStyle({
        "name": "STANDARD"
    });
    saveRequired();
}

DimStyleManager.prototype.getStyleByName = function(styleName) {

    for (var i = 0; i < this.styleCount(); i++) {
        if (this.styles[i].name === styleName) {

            return this.styles[i];
        }
    }
}

DimStyleManager.prototype.getStyleByIndex = function(styleIndex) {

    return this.styles[styleIndex];
}


DimStyleManager.prototype.renameStyle = function(styleIndex, newName) {

    var newName = this.getUniqueName(newName)

    if (this.getStyleByIndex(styleIndex).name.toUpperCase() !== "STANDARD") {

        if (this.getStyleByIndex(styleIndex).name === this.getCStyle()) {
            this.setCStyle(newName);
            console.log("[DimStyleManager.renamestyle] - set new Cstyle name")
        }

        this.styles[styleIndex].name = newName;
    }

}