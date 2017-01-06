var request = require("request-promise");
var request = request.defaults({jar: true, gzip: true, forever: true})

function getOptions(transactionId) {
  var options = { method: 'POST',
    gzip: true,
    url: 'http://spending.gov.ua/web/guest/transaction',
    qs: 
     { p_p_id: 'transactionportlet_WAR_EdataPortletportlet',
       p_p_lifecycle: '2',
       p_p_state: 'normal',
       p_p_mode: 'view',
       p_p_cacheability: 'cacheLevelPage',
       p_p_col_id: 'column-1',
       p_p_col_count: '1' },
    headers: 
     { 
       'content-type': 'application/x-www-form-urlencoded',
       'X-Requested-With': 'XMLHttpRequest',
       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
    form: { modeData: 'getKvit', idTran: transactionId }
  };
  return options;
}

module.exports = function getTransaction(transactionId) {
  var options = getOptions(transactionId);
  return request(options).then(function(res) { return JSON.parse(res); });
}
