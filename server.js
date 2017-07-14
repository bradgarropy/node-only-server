const weight      = require("./routes/weight");
const index       = require("./routes/index");
const http        = require("http");


function requestHandler(request, response) {

    console.log(request.method + " " + request.url);

    if(request.method === "GET") {
        getHandler(request, response);
    }
    else if (request.method === "POST") {
        postHandler(request, response);
    }
    else if(request.method === "PATCH") {
        patchHandler(request, response);
    }
    else if(request.method === "DELETE") {
        deleteHandler(request, response);
    }
    else {
        sendError(response);
    }
}


// http get
function getHandler(request, response) {

    if(request.url === "/") {
        index.render(request, response);
    }
    else if(request.url === "/api/weight") {
        weight.read(request, response);
    }
    else {
        sendError(response);
    }
}


// http post
function postHandler(request, response) {

    if(request.url === "/api/weight") {
        weight.create(request, response);
    }
    else {
        sendError(response);
    }
}


// http patch
function patchHandler(request, response) {

    // test for /api/weight/:date endpoint
    let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;

    if(regex.test(request.url)) {
        weight.update(request, response);
    }
    else {
        sendError(response);
    }
}


// http delete
function deleteHandler(request, response) {

    // test for /api/weight/:date endpoint
    let regex = /\/api\/weight\/\d{4}-\d{2}-\d{2}/i;

    if(regex.test(request.url)) {
        weight.destroy(request, response);
    }
    else {
        sendError(response);
    }
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
