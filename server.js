var express = require('express');
var http = require("http");
// var retrieve_and_rank = require("./retrieve-rank/retrieve-rank").search;
var retrieve_and_rank = require("./retrieve-rank/retrieve-rank").search_rank;
var classify = require("./nlc/classifier");
var fs = require('fs');


var app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/app'));

app.get('/api/search', function(req, res) {
    console.log("HIT THE BACKEND");
    console.log(req.query.q);
    var sentence = req.query.q;

    // var documents = retrieve_and_rank(sentence, function(err, searchResponse) {
    //         if (err) {
    //             console.log("Error search and rank: " + err);
    //             fs.writeFile("DEBUG_LOGS/retreive_and_rank_log.txt", err, function(err) {
    //                 if (err) {
    //                     return console.log(err);
    //                 }
    //             });
    //
    //             res.send("Error searching for documents: " + err);
    //         } else {
    //             console.log('Found ' + searchResponse.response.numFound + ' document(s).');
    //             for (var i = 0; i < 50; i++) {
    //                 console.log('First document: ' + JSON.stringify(searchResponse.response.docs[i]["ranker.confidence"], null, 2));
    //                 console.log('First document: ' + JSON.stringify(searchResponse.response.docs[i]["title"], null, 2));
    //             }
    //         }
    //     }
    // );


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
                        for (var i = 0; i < 50; i++) {
                            console.log('First document: ' + JSON.stringify(searchResponse.response.docs[i]["ranker.confidence"], null, 2));
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

console.log("Spinning up server on port " + PORT)
app.listen(PORT);


// get watson token for speech to text
/*
console.log('STT');
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
        // use token
    }
});
*/

var watson = require('watson-developer-cloud');
var speech_to_text = watson.speech_to_text({
  username: '200220d5-97ff-4e6e-bb0c-6ebc724928b5',
  password: 'wFdBnVqSbi6M',
  version: 'v1'
});

var params = {
  content_type: 'audio/wav',
  continuous: true,
  interim_results: true,
    model: 'en-US_NarrowbandModel'
};

// Create the stream.
var recognizeStream = speech_to_text.createRecognizeStream(params);

// Pipe in the audio.
// CHANGE TO DATA READ FROM SOCKET BETWEEN CLIENT AND SERVER
fs.createReadStream('audio-file.wav').pipe(recognizeStream);

// Pipe out the transcription to a file.
// CHANGE TO WRITE RESULTS BACK TO SOCKET TO CLIENT
recognizeStream.pipe(fs.createWriteStream('transcription.txt'));
recognizeStream.setEncoding('utf8');

// Listen for events.
recognizeStream.on('data', function(event) { onEvent('Data:', event); });
recognizeStream.on('results', function(event) { onEvent('Results:', event); });
recognizeStream.on('error', function(event) { onEvent('Error:', event); });
recognizeStream.on('close-connection', function(event) { onEvent('Close:', event); });

// Displays events on the console.
function onEvent(name, event) {
    console.log(name, event);
};