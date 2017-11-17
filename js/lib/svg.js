function processSVG(data){

    console.log("fileio.js - processSVG")

    var items = new Array();                            // Main array that stores all the geometry

    var matches = data.match(/<(.*)>/g);                            // match xml tags <"any data">

    console.log(matches.length + " XML tags found in selected SVG file")

    for (var i = 0; i < matches.length; i++) {
        //console.log(matches[i])


        var type = matches[i].match(/<\S+\s/);                          // match the svg item type <line x1="577" y1="354" x2="178" y2="122" style="#ffffff; stroke-width:2"/>
        if (type){
            var item = {};
            type = type[0].replace(/[<" "]/g, "");
            //console.log(type)
            item['type'] = type;

            var values = matches[i].match(/\s(.*?)="(.*?)"/g);          // match the item attributes
            //console.log(values)
            for (var j = 0; j < values.length; j++){
                var value = values[j].replace(/["'" "]/g, "");
                value = value.split("=");
                //console.log(value[0])
                item[value[0]] = value[1]
            }

            items.push(item);
        }

        //console.log(JSON.stringify(item));
    }


    return items
}

