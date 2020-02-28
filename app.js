var express = require('express');
const TPSecurityUtils = require('./TPSecurityUtils');

var app = express();
var PORT = process.env.port || 3000;

app.get('/', function(req, res) {
  res.send("W E B H O O K S  T E S T I N G");
});

app.post('/piano-webhook-data', function(req, res) {
  console.log('received piano data: ', req.body);
  var data = req.body;
  var decryptedData = TPSecurityUtils.decrypt(data);
  console.log(decryptedData);
  res.sendStatus(200);
});

app.listen(PORT, function () {
  console.log(`Webhooks-example-app listening on port ${PORT}!`);
});