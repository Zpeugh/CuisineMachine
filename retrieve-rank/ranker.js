var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
var fs = require('fs');

// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
  username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
  password: 'nojwL5kgzQES'
});

// retrieve_and_rank.listRankers({},
//   function(err, response) {
//     if (err)
//       console.log('error: ', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });


// var params = {
//   training_data: fs.createReadStream('ranker_train.csv'),
//   training_metadata: fs.createReadStream('ranker_meta.json')
// };

// retrieve_and_rank.createRanker(params, function(err, response) {
// 	if(err)
// 		console.log('error:' + err);
// 	else
// 		console.log(JSON.stringify(response, null, 2));
// })
