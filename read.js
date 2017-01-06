var fs = require('fs');
var path = require('path');
var readLastLine = function(name, callback) {
    fs.stat(name, function(err, stat) {
        fs.open(name, 'r', function(err, fd) {
            if(err) throw err;
            var i = 0;
            var line = '';
            var readPrevious = function(buf) {
                fs.read(fd, buf, 0, buf.length, stat.size-buf.length-i, function(err, bytesRead, buffer) {
                    if(err) throw err;
                    line = String.fromCharCode(buffer[0]) + line;
                    if (buffer[0] === 0x0a && line !== '\n') { //0x0a == '\n'
                        callback(line);
                    } else {
                        i++;
                        readPrevious(new Buffer(1));
                    }
                });
            }
            readPrevious(new Buffer(1));
        });
    });
}

module.exports = readLastLine;
