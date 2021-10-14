function degrees2radians(degrees) {
    return degrees * Math.PI / 180;
};


function radians2degrees(radians) {
    return radians * 180 / Math.PI;
};

function distBetweenPoints(firstPointx, firstPointy, secondPointx, secondPointy) {
    var A = (firstPointx - secondPointx)
    var B = (firstPointy - secondPointy)
    var ASQ = Math.pow(A, 2)
    var BSQ = Math.pow(B, 2)
    var dist = Math.sqrt(ASQ + BSQ)
    return dist
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function cloneObject(obj) {
    // deep clone obj and all its attributes

    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Object.prototype.toString.call(obj) === '[object Array]') {
        // of obj is an array, return a complete copy of the array
        // array attributes are typically Points or Items (see Block)
        var arr = [];
        for (var i = 0; i < obj.length; i++) {
            //console.log("geometryUtils.js - [cloneObject] [INFO]:", obj, i, obj[i])
            newObj = new this[obj[i].type]();
            attr = JSON.parse(JSON.stringify(obj[i]));
            temp = Object.assign(newObj, attr)
                // console.log("temp item", temp)
                //var point = new Point(obj[i].x, obj[i].y);
            arr.push(temp);
        }
        return arr;
    }

    //console.log(" geometryUtils.js - Type: " + obj.type);
    var temp = new this[obj.type]();
    for (var key in obj) {
        //console.log(" geometryUtils.js - [cloneObject] [INFO]: " +  obj[key])
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}