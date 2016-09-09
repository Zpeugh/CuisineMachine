var express = require('express');

var app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/app'));

app.get('/search', function(req, res) {
	console.log(req.query.q);
});

console.log("Spinning up server on port " + PORT)
app.listen(PORT);
