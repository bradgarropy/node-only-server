const querystring = require("querystring");
const fs          = require("fs");


function read(request, response) {

    // read file
    fs.readFile("./models/weight.json", function(err, data) {

        // check errors
        if(err) {
            console.log(err);
            throw err;
        }

        // carry on
        else {
            // send response
            response.write(data);
            response.end();
        }
    });
}


function add(request, response) {

    // read all incoming data
    let query = "";
    request.on("data", function(data) {
        query += data;
    });

    // perform actions
    request.on("end", function() {

        // parse body data
        let body = querystring.parse(query);

        // TODO: Validate body data.

        // convert weight to int
        body.weight = parseInt(body.weight);

        // read file
        fs.readFile("./models/weight.json", function(err, data) {

            // check errors
            if(err) {
                console.log(err);
                throw err;
            }

            // carry on
            else {

                // convert to json
                let weights = JSON.parse(data);

                // add new weight
                weights.push(body);

                // convert to stringify
                weights = JSON.stringify(weights, null, 4);

                // write file
                fs.writeFile("./models/weight.json", weights, function(err) {

                    // check errors
                    if(err) {
                        console.log(err);
                        throw err;
                    }

                    // carry on
                    else {
                        // send response
                        response.write(weights);
                        response.end();
                    }
                });
            }
        });
    });
}


function update(request, response) {

    // read all incoming data
    let query = "";
    request.on("data", function(data) {
        query += data;
    });

    // perform actions
    request.on("end", function() {

        // parse body data
        let body = querystring.parse(query);

        // TODO: Validate body data.

        // convert weight to int
        body.weight = parseInt(body.weight);

        // parse date from url
        let date = request.url.split("/");
        date = date[date.length - 1];

        // TODO: Validate url date.

        // read file
        fs.readFile("./models/weight.json", function(err, data) {

            // check errors
            if(err) {
                console.log(err);
                throw err;
            }

            // carry on
            else {

                // convert to json
                let weights = JSON.parse(data);

                // find index of object
                let index = weights.findIndex(function(weight) {
                    return weight.date === date;
                });

                // update weight
                weights[index].weight = body.weight;

                // convert to stringify
                weights = JSON.stringify(weights, null, 4);

                // write file
                fs.writeFile("./models/weight.json", weights, function(err) {

                    // check errors
                    if(err) {
                        console.log(err);
                        throw err;
                    }

                    // carry on
                    else {
                        // send response
                        response.write(weights);
                        response.end();
                    }
                });
            }
        });
    });
}


function remove(request, response) {

    // parse date from url
    let date = request.url.split("/");
    date = date[date.length - 1];

    fs.readFile("./models/weight.json", function(err, data) {

        // check errors
        if(err) {
            console.log(err);
            throw err;
        }

        // carry on
        else {

            // convert to json
            let weights = JSON.parse(data);

            // find and remove date
            for(let i = 0; i < weights.length; i++) {
                if (weights[i].date === date) {
                    weights.splice(i, 1);
                    break;
                }
            }

            // convert to string
            weights = JSON.stringify(weights, null, 4);

            // write file
            fs.writeFile("./models/weight.json", weights, function(err) {

                // catch error
                if (err) {
                    console.log(err);
                    throw err;
                }

                // carry on
                else {
                    // send response
                    response.write(weights);
                    response.end();
                }
            });
        }
    });
}


// exports
exports.read   = read;
exports.add    = add;
exports.update = update;
exports.remove = remove;
