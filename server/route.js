var url = require("url"),
    path = require("path"),
    file = require("./file.js").file;

var route = function () { }

route.prototype.handle = function (request, response) {
    var me = this;
    var uri = url.parse(request.url).pathname;
    var values = url.parse(request.url, true);
    var type = (uri.indexOf(".") !== -1 ? uri.substr(uri.lastIndexOf(".")) : uri);
    var filePath = path.join(process.cwd(), uri);

    //handle route
    switch (true) {
        //on init client load
        case /^[\/]$|\/client\/.|\/node_modules\/./.test(uri):
            file.read(filePath, "binary", function (data) {
                file.gzip(data, function (data) {
                    me.respond(response, 200, { "Content-Type": me.getContentType(type), "Content-Encoding": "gzip" }, data);
                });
            });
            break;
        //route doesnt exist
        default:
            me.respond(response, 404, { "Content-Type": "text/plain" }, "If your lost, let your soul guide you");
            break;
    }
}

route.prototype.getContentType = function (type) {
    switch (type) {
        case "/":
            return "text/html";
        case ".js":
            return "application/javascript";
        case ".css":
            return "text/css"
        default:
            return "binary";
    }
}

route.prototype.respond = function (response, status, headers, data) {
    response.writeHead(status, headers);
    response.write(data);
    response.end();
}

exports.route = new route();