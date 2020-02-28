var express = require('express');
var bodyParser = require('body-parser')
const TPSecurityUtils = require('./TPSecurityUtils');

var app = express();
var PORT = process.env.port || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.send("W E B H O O K S  T E S T I N G");
});

app.post('/piano/webhook/:data', function(req, res, next) {
  console.log(`data received from piano. processing now...`);
  next();
}, function(req, res, next) {
  var data = req.params.data;
  res.status(200).send(data);
  console.log(`piano data to be decrypted: ${data}`);
  console.log(`data type: ${typeof data}`);
  data = TPSecurityUtils.decrypt('pWBkcoreb3CDRyAPGOs3ueOPajDwxZPnPWcsZUsH', data);
  console.log(`d e c r y p t e d | d a t a: ${data}`);
  next();
}, function(req, res) {
  console.log(`additional processing, or process complete.`);
});

app.listen(PORT, function () {
  console.log(`Webhooks-example-app listening on port ${PORT}!`);
});