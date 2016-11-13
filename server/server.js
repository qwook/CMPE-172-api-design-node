var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*

We are going to build an API that will:

* Handle CRUD for an item (we’re going to use lions)

* Have a standard URL (http://example.com:8080/lions and http://example.com:8080/lions/:id)

* Use the proper HTTP verbs to make it RESTful (GET, POST, PUT, and DELETE)

* Return JSON data.

*/

var lions = [];
var id = 0;

app.get('/lions', function(req, res){
  res.json(lions);
});

app.get('/lions/:id', function(req, res){
  var lion = _.find(lions, {id: req.params.id});
  res.json(lion || {});
});

app.post('/lions', function(req, res) {
  var lion = req.body;
  id++;
  lion.id = id + '';

  lions.push(lion);

  res.json(lion);
});


app.put('/lions/:id', function(req, res) {
  var update = req.body;
  if (update.id) {
    delete update.id
  }

  var lion = _.findIndex(lions, {id: req.params.id});
  if (!lions[lion]) {
    res.send();
  } else {
    var updatedLion = _.assign(lions[lion], update);
    res.json(updatedLion);
  }
});

app.delete('/lions', function(req, res) {
  var id = req.body.id;
  if (!id || !lions[id]) { res.send({
    success: false,
    error: "No such lion with id."
  }) };

  lions[id] = null;
  delete lions[id];

  res.send({success: true});
});

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function() {
 console.log("Node app is running at localhost:" + app.get('port'))
});

