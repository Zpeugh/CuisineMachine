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
