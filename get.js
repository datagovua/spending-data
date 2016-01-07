var httpSync = require('http-sync');

var fs = require('fs');
var stringify = require('csv-stringify');

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

function getUrl(id) {
  return 'http://spending.gov.ua/web/guest/transaction?modeData=getKvit&idTran=' + id + '&p_p_id=transactionportlet_WAR_EdataPortletportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_count=1';
}

function getTransaction(id) {
  var transaction = JSON.parse(httpSync.request({url: getUrl(id)}).end().body.toString());
  return transaction;
}

var data = '';
stringifier = stringify({delimiter: ','})
stringifier.on('readable', function(){
  while(row = stringifier.read()){
    data += row;
  }
});
stringifier.on('error', function(err){
  consol.log(err.message);
});
stringifier.on('finish', function(){
});

function printRow(row) {
  stringifier.write(row);
}

function printHeaders() {
  printRow(headers.map(function(h) {return h['id'];}));
}

function printTransaction(transaction) {
  var row = headers.map(function(header) {
    var value = transaction[header['id']];
    if (header['type'] === 'number') {
      value = value.split('\xa0').join(''); // remove nbsp
    }
    return value;
  })
  printRow(row);
}

function saveTransactions(filename) {
  stringifier.end();
  fs.appendFileSync(filename, data, 'utf8');
}

var LAST_FETCHED_FILE = 'LAST.txt';
function getLastFetchedId() {
  if(fs.existsSync(LAST_FETCHED_FILE)) {
    return parseInt(fs.readFileSync(LAST_FETCHED_FILE, 'utf8'));
  }
}

function saveLastFetchedId(id) {
  fs.writeFileSync(LAST_FETCHED_FILE, id, 'utf8');
}

function getFirstToFetch(lastFetched) {
  var START = 373881;
  if(lastFetched) {
    return lastFetched + 1;
  } else {
    return START;
  }
}

var lastFetched = getLastFetchedId();
var start = getFirstToFetch(lastFetched);

if(!lastFetched) {
  printHeaders();
}
for (var id = start; id < start + 30000; id++) {
  console.log('fetching ' + id)
  var transaction = getTransaction(id);
  printTransaction(transaction);
}
saveTransactions('transactions.csv');

saveLastFetchedId(id - 1);
