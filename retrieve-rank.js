var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');

console.log("Bootstrapping Retrieve and Rank engine");



// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
  username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
  password: 'nojwL5kgzQES',
  use_vcap_services: false
});

//
// retrieve_and_rank.createCluster({
//   cluster_size: '1',
//   cluster_name: 'Cuisine_Machine_Recipe_Cluster'
// }, function (err, response) {
//   if (err)
//     console.log('error:', err);
//   else
//     console.log(JSON.stringify(response, null, 2));
// });

// add document to cluster

var solrClient = retrieve_and_rank.createSolrClient({
  cluster_id: 'sc12b109cf_91ae_43fe_bb0e_15b68f0fd1cb',
  collection_name: 'Cuisine_Machine_Recipe_Cluster'
});

// retrieve_and_rank.deleteCluster({
//   cluster_id: 'sc057a91b6_476f_43e5_91c8_2462b4c291a7'
// },
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });


//TODO: Add configuration files
//
// retrieve_and_rank.uploadConfig({
//   cluster_id: 'sc12b109cf_91ae_43fe_bb0e_15b68f0fd1cb',
//   config_name: 'retreiveAndRankConfig',
//   config_zip_path: './config/retreive_and_rank/retreive_and_rank_config.zip'
// },
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });


//TODO: add a collection to the cluster
//
// retrieve_and_rank.createCollection({
//   cluster_id: 'sc12b109cf_91ae_43fe_bb0e_15b68f0fd1cb',
//   config_name: 'retreiveAndRankConfig',
//   collection_name: 'Cuisine_Machine_Recipe_Cluster'
// },
//   function (err, response) {
//     if (err)
//       console.log('From Create:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });

// retrieve_and_rank.listClusters({},
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });



//
// var doc = { id : 1,
//             title : 'Test',
//             picture: 'www.url.com',
//             ingredients: 'Anything nothing',
//             instructions: 'Do what you will',
//             about: 'Whatever',
//             yield: '2 servings',
//             tags: 'none'
//         };
// solrClient.add(doc, function(err) {
//   if(err) {
//     console.log('Error indexing document: ' + err);
//   } else {
//     console.log('Indexed a document.');
//     solrClient.commit(function(err) {
//       if(err) {
//         console.log('Error committing change: ' + err);
//       } else {
//         console.log('Successfully commited changes.');
//       }
//     });
//   }
// });

// query
// var query = solrClient.createQuery();
// query.q({ '*' : '*' });
// solrClient.search(query, function(err, searchResponse) {
//   if(err) {
//     console.log('Error searching for documents: ' + err);
//   } else {
//     console.log('Found ' + searchResponse.response.numFound + ' document(s).');
//     console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0], null, 2));
//   }
// });



// Export module function to query retrieve and rank cluster
module.exports = function(sentence, callback) {

    //TODO: Parse the sentence and use the Natural Language Classifier
    //TODO: To find which parameter(s) to use to send to the retrieve and rank
    //TODO: and then build a query object to send to the R and R cluster
    var documents = {};
    var query = solrClient.createQuery();
    query.q({ingredients: sentence});
    solrClient.search(query, callback);
}
