var http = require("http");


requestHandler = function(request, response) {
    console.log(request.url);
    response.write("Hello World!");
    response.end();
};


var port = 3000;
var server = http.createServer(requestHandler);
server.listen(port, function() {
    console.log("Server listening on port %s.", port);
});
