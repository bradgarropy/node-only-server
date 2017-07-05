const querystring = require("querystring");
const http        = require("http");
const fs          = require("fs");


requestHandler = function(request, response) {

    console.log(request.method);
    console.log(request.url);

    // GET Method
    if(request.method == "GET") {

        if(request.url == "/") {

            // read weight file
            let weights = fs.readFileSync("weight.json");
            weights = JSON.parse(weights);

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
            let weights = fs.readFileSync("weight.json");

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

                // read weight file
                let weights = fs.readFileSync("weight.json");
                weights = JSON.parse(weights);

                // add new weight
                weights.push(post);

                // write weight file
                weights = JSON.stringify(weights, null, 4);
                fs.writeFileSync("weight.json", weights);

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

    // Delete Method
    else if(request.method == "DELETE") {

        // test for /api/weight/:date endpoint
        let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;
        if(regex.test(request.url)) {

            // parse date from url
            let date = request.url.split("/");
            date = date[date.length - 1];

            // read weight file
            let weights = fs.readFileSync("weight.json");
            weights = JSON.parse(weights);

            // find and remove date
            for(let i = 0; i < weights.length; i++) {
                if (weights[i].date == date) {
                    weights.splice(i, 1);
                    break;
                }
            }

            // write weight file
            weights = JSON.stringify(weights, null, 4);
            fs.writeFileSync("weight.json", weights);

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

};


let port = 3000;
let server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
