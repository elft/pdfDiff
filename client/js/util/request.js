//http request
//@type = GET, POST, PUT, DELETE
//@uri = http://www.hello.com/getData
//@data = json object { name: "Aname" }
//@headers = json object example { dataType: application/json }
//@callback = return data to the callee
function request(type, uri, data, headers, callback) {
    //on complete send data back to callee
    function listener() {
        var data;
        try {
            data = JSON.parse(this.responseText);
        } catch (e) {
            data = this.responseText;
        }
        callback(data);
    }

    var req = new XMLHttpRequest();
    req.addEventListener("load", listener);
    req.open(type, uri, true);
    for (var header in headers) {
        if (headers.hasOwnProperty(header)) {
            req.setRequestHeader(header, headers[header]);
        }
    }
    req.send(data ? data : null);
}
