var watson = require('watson-developer-cloud');
var fs     = require('fs');

var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');

var natural_language_classifier = new NaturalLanguageClassifierV1({
  username: '<username>',
  password: '<password>'
});


var params = {
  language: 'en',
  name: 'My Classifier',
  training_data: fs.createReadStream('./train.csv')
};

natural_language_classifier.create(params, function(err, response) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(response, null, 2));
});