var http = require("http");
var fs = require("fs");


requestHandler = function(request, response) {

    if(request.method == "GET") {

        console.log(request.url);
        console.log(request.method);

        if (request.url == "/favicon.ico") {
            response.writeHead(404);
            response.write("<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>");
            response.end();
        }
        else if(request.url == "/") {
            var weights = fs.readFileSync("weight.json");
            weights = JSON.parse(weights);

            var data = "";
            for (var i = 0; i < weights.length; i++) {
                data += "<li>" + weights[i].date + " - " + weights[i].weight + "</li>";
            }

            var html =
            `
            <html>
                <head></head>

                <body>
                    <ul>
                        ${data}
                    </ul>
                </body>
            </html>
            `;

            response.write(html);
            response.end();
        }
        else {
            response.writeHead(404);
            response.write("<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>");
            response.end();
        }
    }
    else if (request.method == "POST") {
        console.log(request.url);
        console.log(request.method);

        response.write(request.method + " request to " + request.url);
        response.end();
    }

};


var port = 3000;
var server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
