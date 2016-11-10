//current issues: text search should not go through the nlc classifier
//classifier has trouble with 1 word queries
/*


Errors:
"go" returns nav_prev instead of nav_start
"continue" returns nav_start instead of nav_next

*/

var express = require('express');
var http = require("http");
var retrieve_and_rank = require("./retrieve-rank/retrieve-rank").search_rank;
var classify = require("./nlc/classifier");
var fs = require('fs');


var app = express();

app.use(express.static(__dirname + '/app'));

console.log("Spinning up test server");

console.log("Testing the classifier");

var nlcRecipesTestQueries = ["recipe", "I want a recipe with lemons", "I'd like a recipe for tomato soup with lemons", "lemons","recipes with lemongrass and mirin", "I want a recipe with poppy seeds and nutella", "poppy seeds, nutella", "Sushi", "Bagels and Lox", "Veggie Pizza"];

var i;
for(i =0;i<nlcRecipesTestQueries.length;i++) {
  classify(nlcRecipesTestQueries[i], function(err, response) {
    //console.log(response);
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "recipes") {
        throw new Error(query + " returned " + class_name + " instead of recipes");
      }
    }
  });
}

var nlcTimerTestQueries = ["timer","set a timer","set a timer for 20 minutes", "set a timer for 30 minutes", "set a timer for an hour", "set an hour timer", "remind me in 30 minutes"];
for(i =0;i<nlcTimerTestQueries.length;i++) {
  classify(nlcTimerTestQueries[i], function(err, response) {
    //console.log(response + "\n");
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "timer") {
        throw new Error(query + " returned " + class_name + " instead of timer");
      }
    }
  });
}

var nlcConversionTestQueries = ["cups to gallons", "gallons to cups", "grams to kilograms", "7 teaspoons to tablespoons", "teaspoons to tablespoons", "liters to milileters", "fluid ounces to mililiters","how many grams are in an ounce?"];

for(i =0;i<nlcConversionTestQueries.length;i++) {
  classify(nlcConversionTestQueries[i], function(err, response) {
    //console.log(response + "\n");
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "unit_conversion") {
        throw new Error(query + " returned " + class_name + " instead of unit_conversion");
      }
    }
  });
}


var nlcNavEndTestQueries = ["I'm done", "I'm finished","stop"];
for(i =0;i<nlcNavEndTestQueries.length;i++) {
  classify(nlcNavEndTestQueries[i], function(err, response) {
    //console.log(response + "\n");
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "nav_end") {
        throw new Error(query + " returned " + class_name + " instead of nav_end");
      }
    }
  });
}


var nlcNavStartTestQueries = ["start","begin","go"];//go
for(i =0;i<nlcNavStartTestQueries.length;i++) {
  classify(nlcNavStartTestQueries[i], function(err, response) {
    //console.log(response + "\n");
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "nav_start") {
        throw new Error(query + " returned " + class_name + " instead of nav_start");
      }
    }
  });
}

var nlcNavNextTestQueries = ["next","continue"];
for(i =0;i<nlcNavNextTestQueries.length;i++) {
  classify(nlcNavNextTestQueries[i], function(err, response) {
    //console.log(response + "\n");
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "nav_next") {
        throw new Error(query + " returned " + class_name + " instead of nav_next");
      }
    }
  });
}


var nlcNavPrevTestQueries = ["previous","back"];
for(i =0;i<nlcNavPrevTestQueries.length;i++) {
  classify(nlcNavPrevTestQueries[i], function(err, response) {
    //console.log(response + "\n");
    if (err)
      throw err;
    else {
      var class_name = response.classes[0].class_name;
      var query = response.text;
      if(class_name != "nav_prev") {
        throw new Error(query + " returned " + class_name + " instead of nav_prev");
      }
    }
  });
}


//
