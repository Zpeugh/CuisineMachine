var watson = require('watson-developer-cloud');
var fs = require('fs');

var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

// authentication
var natural_language_classifier = new NaturalLanguageClassifierV1({
  password: "6MlNL134cgCP",
  username: "ea81bd9c-8673-474d-9db1-4eba97f2d14f"
});

var id = 'b73235x135-nlc-29';
// b73235x135-nlc-29

// list all classfier
natural_language_classifier.list({},
  function(err, response) {
    if (err)
        console.log('error:', err);
      else
        console.log(JSON.stringify(response, null, 2));
  }
);

// check status of the classifier
natural_language_classifier.status({
  classifier_id: "b73235x135-nlc-29" },
  function(err, response) {
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
  }
);

// classify sentence
// natural_language_classifier.classify({
//   text: 'give me some recipes',
//   classifier_id: '2a3173x97-nlc-907' },
//   function(err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });


//
// natural_language_classifier.remove({ classifier_id: '8d6f17x127-nlc-37' }, function(err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });

// create classifier
// var params = {
//   language: 'en',
//   name: 'Cuisine_Machine_Classifier',
//   training_data: fs.createReadStream('./train.csv')
// };
//
// natural_language_classifier.create(params, function(err, response) {
//   if (err)
//     console.log(err);
//   else
//     console.log(JSON.stringify(response, null, 2));
// });


module.exports = function(sentence, callback) {
  natural_language_classifier.classify({
    text: sentence,
    classifier_id: id
  }, callback);
}
