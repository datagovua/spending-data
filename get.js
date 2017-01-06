var stringify = require('csv-stringify');
var transform = require('stream-transform');
var fs = require('fs');

var Generator = require('./generator')
var Writer = require('./writer');
var Fetcher = require('./fetcher');
var readLastLine = require('./read');

var transformer = transform(function(data){
  data['doc_sq'] = data['doc_sq'].split('\xa0').join(''); // remove nbsp
  return data;
});

var outputFilename = 'transactions.csv';

function getFirstToFetch(filename, cb) {
  readLastLine(filename, function(line) {
    var lastFetched = parseInt(line.split(',')[0]);
    var START = 373881;
    if(lastFetched) {
      cb(lastFetched + 1);
    } else {
      cb(START);
    }
  });
}
getFirstToFetch(outputFilename, function(firstTransactionId) {
  var gen = new Generator({highWaterMark: 1, start: firstTransactionId});
  
  var fetcher = new Fetcher({ delay: 500 });
  
  var headers = [
                  {id: 'trns_id'},
                  {id: 'doc_datd'},
                  {id: 'msrprd_date'},
                  {id: 'doc_nazn'},
                  {id: 'payer_nm'},
                  {id: 'recipt_nm'},
                  {id: 'doc_sq', type: 'number'},
                  {id: 'payer_edrpou'},
                  {id: 'recipt_edrpou'},
                  {id: 'recipt_mfo_knw_id'},
                  {id: 'recipt_mfo_nm'},
                  {id: 'payer_mfo_knw_id'},
                  {id: 'payer_mfo_nm'}
                ];
  var stringifier = stringify({delimiter: ',', columns: headers.map(function(h) {return h['id']})})
  
  var ws = fs.createWriteStream(outputFilename, { flags: 'a' });
  gen.pipe(fetcher).pipe(transformer).pipe(stringifier).pipe(ws);
  //pipe(process.stdout);
});
