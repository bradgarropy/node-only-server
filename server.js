const querystring = require("querystring");
const model       = require("./models/model");
const http        = require("http");
const fs          = require("fs");


function requestHandler(request, response) {

    console.log(request.method);
    console.log(request.url);

    // GET Method
    if(request.method == "GET") {

        if(request.url == "/") {

            // read weight file
            weights = model.read();

            // create html table
            let data = "";
            weights.forEach(function(weight) {
                data += "<tr><td>" + weight.date + "</td><td>" + weight.weight + "</td></tr>";
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
                        ${data}
                    </table>

                </body>
            </html>
            `;

            // send response
            response.write(html);
            response.end();
        }
        else if(request.url == "/api/weight") {

            // read weight file
            weights = model.read();

            // send response
            response.write(JSON.stringify(weights, null, 4));
            response.end();
        }
        else {
            response.writeHead(404);
            response.write("<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>");
            response.end();
        }
    }

    // POST Method
    else if (request.method == "POST") {

        if(request.url == "/api/weight") {

            // read all incoming data
            let query = "";
            request.on('data', function(data) {
                query += data;
            });

            // perform actions
            request.on('end', function() {

                // parse body data
                let body = querystring.parse(query);

                // add new weights
                weights = model.add(body);

                // send response
                response.write(weights);
                response.end();
            });
        }
        else {
            response.writeHead(404);
            response.write("<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>");
            response.end();
        }
    }

    // Patch Method
    else if(request.method == "PATCH") {

        // test for /api/weight/:date endpoint
        let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;
        if(regex.test(request.url)) {

            // read all incoming data
            let query = "";
            request.on('data', function(data) {
                query += data;
            });

            // perform actions
            request.on('end', function() {

                // parse body data
                let body = querystring.parse(query);

                // parse date from url
                let date = request.url.split("/");
                date = date[date.length - 1];

                // update weight
                weights = model.update(date, body.weight);

                // send response
                response.write(weights);
                response.end();
            });
        }
    }

    // Delete Method
    else if(request.method == "DELETE") {

        // test for /api/weight/:date endpoint
        let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;
        if(regex.test(request.url)) {

            // parse date from url
            let date = request.url.split("/");
            date = date[date.length - 1];

            // remove weight
            weights = model.remove(date);

            // send response
            response.write(weights);
            response.end();
        }
        else {
            response.writeHead(404);
            response.write("<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>");
            response.end();
        }

    }

    // Unknown Method
    else {
        response.writeHead(404);
        response.write("<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>");
        response.end();
    }

}


let port = 3000;
let server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
