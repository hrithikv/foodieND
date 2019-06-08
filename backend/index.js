const express = require('express');
var http = require('http');
var fs = require('fs');
var gateway = require('gateway');
var braintree = require("braintree");

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'bythwshzprm4kjnb',
  publicKey: '8cqmxvrkm4gqfv5k',
  privateKey: 'abae0a9f02c96f3069a83e390d63dbfb'
});

gateway.clientToken.generate({
}, function (err, response) {
  var clientToken = response.clientToken
});

app.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
   res.send(response.clientToken);
 });
});

app.get('/food', function(req, res) {
  fs.readFile('restaurants.json', function(err, data) {
    res.write(data);
    res.end();
  });
})

gateway.transaction.sale({
  amount: "10.0",
  paymentMethodNonce: "fake-valid-nonce",
  options: {
    submitForSettlement: true
  }
}, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }

  if (result.success) {
    outcome = result.transaction.id
    console.log(outcome);
  } else {
    outcome = result.message
    console.error(outcome);
  }
});

const port = process.env.PORT || 3000;

const httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
console.log('Backend running on port ' + port + '.');
})
