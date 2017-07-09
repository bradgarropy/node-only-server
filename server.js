const querystring = require("querystring");
const http        = require("http");
const fs          = require("fs");


function requestHandler(request, response) {

    console.log(request.method + " " + request.url);

    // GET Method
    if(request.method === "GET") {
        getHandler(request, response);
    }

    // POST Method
    else if (request.method === "POST") {
        postHandler(request, response);
    }

    // Patch Method
    else if(request.method === "PATCH") {
        patchHandler(request, response);
    }

    // Delete Method
    else if(request.method === "DELETE") {
        deleteHandler(request, response);
    }

    // Unknown Method
    else {
        sendError(response);
    }
}


function weight_table(weights) {

    // create html table
    let table = "";
    weights.forEach(function(weight) {
        table += "<tr><td>" + weight.date + "</td><td>" + weight.weight + "</td></tr>";
    });

    // html template
    let html =
    `
    <html>
        <head></head>

        <body>

            <table>
                <tr>
                    <th>Date</th>
                    <th>Weight</th>
                </tr>
                ${table}
            </table>

        </body>
    </html>
    `;

    return html;
}


function getHandler(request, response) {

    if(request.url === "/") {

        // read file
        fs.readFile("./models/weight.json", function handleFile(err, data) {

            // check errors
            if(err) {
                console.log(err);
                throw err;
            }

            // carry on
            else {

                // convert to json
                let weights = JSON.parse(data);

                // render html table
                let html = weight_table(weights);

                // send response
                response.write(html);
                response.end();
            }
        });
    }
    else if(request.url === "/api/weight") {

        // read file
        fs.readFile("./models/weight.json", function handleFile(err, data) {

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

    else {
        sendError(response);
    }
}


function postHandler(request, response) {

    if(request.url === "/api/weight") {

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
            fs.readFile("./models/weight.json", function handleFile(err, data) {

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
                    fs.writeFile("./models/weight.json", weights, function handleFile(err) {

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

    else {
        sendError(response);
    }
}


function patchHandler(request, response) {

    // test for /api/weight/:date endpoint
    let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;
    if(regex.test(request.url)) {

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
            fs.readFile("./models/weight.json", function handleFile(err, data) {

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
                    fs.writeFile("./models/weight.json", weights, function handleFile(err) {

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
}


function deleteHandler(request, response) {

    // test for /api/weight/:date endpoint
    let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;
    if(regex.test(request.url)) {

        // parse date from url
        let date = request.url.split("/");
        date = date[date.length - 1];

        fs.readFile("./models/weight.json", function handleFile(err, data) {

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
                fs.writeFile("./models/weight.json", weights, function handleFile(err) {

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

    else {
        sendError(response);
    }
}


function sendResponse(response, data) {

}


function sendError(response) {

    // default to 404
    response.writeHead(404);

    response.write(
        `
        <!doctype html>
            <html>

                <head>
                    <title>404</title>
                </head>

                <body>404: Resource Not Found</body>

            </html>
            `);

    response.end();
}


// start server
const port = 3000;
const server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
