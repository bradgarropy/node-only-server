var http = require("http");


requestHandler = function(request, response) {
    console.log(request.url);
    console.log(request.method);

    if(request.method == "GET") {
        response.write(request.method + " request to " + request.url);
        response.end();
    }
    else if (request.method == "POST") {
        response.write(request.method + " request to " + request.url);
        response.end();
    }

};


var port = 3000;
var server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
