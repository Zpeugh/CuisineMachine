var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
var qs = require('qs');


// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
  username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
  password: 'nojwL5kgzQES',
  use_vcap_services: false
});


retrieve_and_rank.listClusters({},
  function (err, response) {
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
});
