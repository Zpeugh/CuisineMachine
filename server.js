var express = require('express');
var http = require("http");
var retrieve_and_rank = require("./retrieve-rank").search;
var search_rank = require("./retrieve-rank").search_rank;

var app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/app'));

app.get('/api/search', function(req, res) {
    console.log("HIT THE BACKEND");
    console.log(req.query.q);
    var sentence = req.query.q;

    var documents = retrieve_and_rank(sentence, function(err, searchResponse) {
      if(err) {
        console.log("Error search and rank: "+err);
        res.send("Error searching for documents: " + err);
      } else {
          console.log('Found ' + searchResponse.response.numFound + ' document(s).');
          // console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0], null, 2));
          res.send(JSON.stringify(searchResponse.response.docs));
          console.log(JSON.stringify(searchResponse.response.docs));
      }
    });
});

console.log("Spinning up server on port " + PORT)
app.listen(PORT);
