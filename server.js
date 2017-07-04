const querystring = require("querystring");
const http        = require("http");
const url         = require('url');
const fs          = require("fs");


requestHandler = function(request, response) {

    console.log(request.method);
    console.log(request.url);

    // GET Method
    if(request.method == "GET") {

        if(request.url == "/") {
            let weights = fs.readFileSync("weight.json");
            weights = JSON.parse(weights);

            let data = "";
            weights.forEach(function(weight) {
                data += "<tr><td>" + weight.date + "</td><td>" + weight.weight + "</td></tr>";
            });

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

            response.write(html);
            response.end();
        }
        else if(request.url == "/api/weight") {
            let weights = fs.readFileSync("weight.json");

            response.write(weights);
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
            let query = "";

            // read all incoming data
            request.on('data', function(data) {
                query += data;
            });

            // perform actions
            request.on('end', function() {

                // parse post data
                let post = querystring.parse(query);

                // convert weight to int
                post.weight = parseInt(post.weight);

                // add new weight
                let weights = fs.readFileSync("weight.json");
                weights = JSON.parse(weights);
                weights.push(post);
                weights = JSON.stringify(weights, null, 4);
                fs.writeFileSync("weight.json", weights);

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

    // Delete Method
    else if(request.method == "DELETE") {

        // parse date from uri
        let u = url.parse(request.url);
        let pathname = u.pathname.split("/");
        let date = pathname[pathname.length - 1];

        // giving up here
        // parsing uri's with variable data using regexes is crazy
        // time to use express
        if(request.url == "/api/weight/:date") {
            console.log("Found a date to delete!");
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

};


var port = 3000;
var server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
