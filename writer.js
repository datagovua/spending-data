var Writable = require('stream').Writable;  
var util = require('util');


function TransactionWriteStream(options) {  
  if (! (this instanceof TransactionWriteStream))
    return new TransactionWriteStream(options);
  if (! options) options = {};
  options.objectMode = true;
  Writable.call(this, options);
}

util.inherits(TransactionWriteStream, Writable);

TransactionWriteStream.prototype._write = function write(doc, encoding, callback) {  
  console.log(JSON.stringify(doc.data));
  callback();
}


module.exports = TransactionWriteStream;
