var express = require('express');
var http = require("http");
var retrieve_and_rank = require("./retrieve-rank");

var app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/app'));

app.get('/api/search', function(req, res) {
    console.log("HIT THE BACKEND");
    console.log(req.query.q);
    var sentence = req.query.q;
    // http.get("http://www.httpbin.org/get?sample=" + sentence, function(res){
    // 	console.log("Got response accross domains: ");
    // 	console.log(res);
    // });
    retrieve_and_rank();
    res.send("It made it");

});

console.log("Spinning up server on port " + PORT)
app.listen(PORT);
