var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
var fs = require("fs");

console.log(process.argv[2]);

// Get content from file
var filename = process.argv[2];
var start = process.argv[3];
var end = process.argv[4];

var contents = fs.readFileSync(filename);
var json = JSON.parse(contents);
var recipes = json.recipes;

console.log(recipes.length)


// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
  username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
  password: 'nojwL5kgzQES',
  use_vcap_services: false
});


var solrClient = retrieve_and_rank.createSolrClient({
  cluster_id: 'sc12b109cf_91ae_43fe_bb0e_15b68f0fd1cb',
  collection_name: 'Cuisine_Machine_Recipe_Cluster'
});


// Add each file to the cluster
for (var i = start; i < end; i++){
    solrClient.add(recipes[i], function(err) {
      if(err) {
        console.log('Error indexing document: ' + err);
      } else {
        console.log('Indexed a document.');
        solrClient.commit(function(err) {
          if(err) {
            console.log('Error committing change: ' + err);
          } else {
            console.log('Successfully commited changes.');
          }
        });
      }
    });
}
