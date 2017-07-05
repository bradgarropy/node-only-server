const fs = require("fs");


var read = function() {

    // read file
    let weights = fs.readFileSync("./models/weight.json");

    // convert to json
    weights = JSON.parse(weights);

    return weights;
};


function write(objects) {

    // write weight file
    weights = JSON.stringify(weights, null, 4);
    fs.writeFileSync("./models/weight.json", weights);

    return weights;
}


var add = function(object) {

    // convert weight to int
    object.weight = parseInt(object.weight);

    // read weight file
    weights = read();

    // add new weight
    weights.push(object);

    // write  weight file
    write(weights);

    return weights;
};


var update = function(date, weight) {

    // convert weight to int
    weight = parseInt(weight);

    // read weight file
    weights = read();

    // find index of object
    let index = weights.findIndex(function(weight) {
        return weight.date == date;
    });

    // update weight
    weights[index].weight = weight;

    // write  weight file
    write(weights);

    return weights;
};


var remove = function(date) {

    // read weight file
    weights = read();

    // find and remove date
    for(let i = 0; i < weights.length; i++) {
        if (weights[i].date == date) {
            weights.splice(i, 1);
            break;
        }
    }

    // write weight file
    write(weights);

    return weights;
};


// export methods
exports.read   = read;
exports.add    = add;
exports.update = update;
exports.remove = remove;
