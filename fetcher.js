var Transform = require('stream').Transform;  
var inherits = require('util').inherits;

var getTransaction = require('./getTransaction');

function Fetcher(options) {
  if ( ! (this instanceof Fetcher))
    return new Fetcher(options);

  if (! options) options = {};
  this.delay = options.delay || 1000;
  options.objectMode = true;
  Transform.call(this, options);
}

inherits(Fetcher, Transform);

Fetcher.prototype._transform = function _transform(obj, encoding, callback) {
  setTimeout(function() {
    getTransaction(obj.id).then(function(transaction) {
      this.push(transaction);
      callback();
    }.bind(this));
  }.bind(this), this.delay);
};

module.exports = Fetcher;
