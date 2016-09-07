var express = require('express');
var app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/app'));

console.log("Spinning up server on port " + PORT)
app.listen(PORT);
