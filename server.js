var express = require('express');
var http = require("http");
var bodyParser = require('body-parser');
// var retrieve_and_rank = require("./retrieve-rank/retrieve-rank").search;
var retrieve_and_rank = require("./retrieve-rank/retrieve-rank").search_rank;
var classify = require("./nlc/classifier");
var fs = require('fs');
var substitutions = require('./substitution/substitution.js')


var app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/app'));

app.use(bodyParser.text());

app.get('/api/classify', function(req, res) {
    console.log("HIT THE BACKEND");
    console.log(req.query.q);
    var sentence = req.query.q;

    classify(sentence, function(err, response) {
        if (err)
            console.log('error:', err);
        else {
            // console.log(response);
            var class_name = response.classes[0].class_name;
            res.send(class_name);
        }
    });
});


app.get('/api/recipes', function(req, res) {
    console.log("HIT THE BACKEND");
    console.log(req.query.q);
    var sentence = req.query.q;

    classify(sentence, function(err, response) {
        if (err)
            console.log('error:', err);
        else {
            // console.log(response);
            var class_name = response.classes[0].class_name;
            if (class_name == "recipes") {
                var documents = retrieve_and_rank(sentence, function(err, searchResponse) {
                    if (err) {
                        console.log("Error search and rank: " + err);
                        fs.writeFile("DEBUG_LOGS/retreive_and_rank_log.txt", err, function(err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        res.send("Error searching for documents: " + err);
                    } else {
                        console.log('Found ' + searchResponse.response.numFound + ' document(s).');
                        if(searchResponse.response.numFound > 0){
                            for (var i = 0; i < 50; i++) {
                                console.log('First document: ' + JSON.stringify(searchResponse.response.docs[i]["ranker.confidence"], null, 2));
                            }
                        }
                        res.send(JSON.stringify(searchResponse.response.docs));
                    }
                });
            } else {
                console.log(class_name);
                res.send(class_name);
            }
        }
    });
});

app.get('/api/substitutions', function(req, res) {
    console.log("Retrieving Substitutions");
    res.send(substitutions);
});


var buffer = "";

app.post('/speech_to_text', function(req, res) {
    console.log("receive speech to text request");
    console.log(req.body.__proto__);
    // if(req.body == "end") {
    //     console.log(req.body);
    //     fs.writeFile("./audio.wav", buffer, "binary", function(err) {});
    //     buffer = "";
    // } else {
    //     buffer += req.body;
    //     // console.log(req.body);
    // }
    fs.writeFile("./audio.wav", req.body, "binary", function(err) {});
});

console.log("Spinning up server on port " + PORT)
app.listen(PORT);

// get token for speech to text
console.log('STT');
var sttToken = '';
var watson = require('watson-developer-cloud');
var authorization = new watson.AuthorizationV1({
    username: '200220d5-97ff-4e6e-bb0c-6ebc724928b5',
    password: 'wFdBnVqSbi6M',
    url: watson.SpeechToTextV1.URL
});
authorization.getToken(function (err, token) {
    if (!token) {
        console.log('error:', err);
    } else {
        sttToken = token;
        //console.log(token);
    }
});

// pass token to client
// NOTE: might need  way of waiting for token to be set
app.get('/api/stt/gettoken',function(req, res){
    return res.json({ token: sttToken });
});
