var Readable = require('stream').Readable;  
var util = require('util');

function Generator(options) {
  if (! (this instanceof Generator)) return new Generator(options);
  if (! options) options = { start: 1 };
  options.objectMode = true;
  this.start = options.start;
  Readable.call(this, options);
}

util.inherits(Generator, Readable);

Generator.prototype._read = function read() {  
  setTimeout(function() {
    this.push({ id: this.start++ });
  }.bind(this), 10);
};


module.exports = Generator;
