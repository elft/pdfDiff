var fs = require("fs"),
    zlib = require("zlib");

var file = function () { }

file.prototype.read = function (file, format, callback) {
    fs.exists(file, function (exists) {
        if (fs.statSync(file).isDirectory()) file += 'client/index.html';
        if (!exists) console.log("File " + file + " does not exist");
        fs.readFile(file, format, function (err, data) {
            callback(data || err);
        });
    });
}

file.prototype.write = function (file, data) {
    fs.writeFile(file, data, function (err, data) {
        if (err) console.log(err);
    });
}

file.prototype.gzip = function (data, callback) {
    zlib.gzip(data, function (err, data) {
        callback(data || err);
    });
}

exports.file = new file();