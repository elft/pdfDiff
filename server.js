var http = require("http"),
  route = require("./server/route.js").route,
  fs = require("fs");

http.createServer(function (request, response) {
  route.handle(request, response);
}).listen(parseInt(80, 10));