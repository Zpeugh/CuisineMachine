var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');

console.log("Bootstrapping Retrieve and Rank engine");

// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
  username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
  password: 'nojwL5kgzQES',
});

// create cluster
// retrieve_and_rank.createCluster({
//   cluster_size: '1',
//   cluster_name: 'Cuisine Machine Recipe Cluster'
// }, function (err, response) {
//   if (err)
//     console.log('error:', err);
//   else
//     console.log(JSON.stringify(response, null, 2));
// });

// add document to cluster
params = {
  cluster_id: 'scdaa8d3b3_4828_4657_ac16_41b7f7510237',
  collection_name: 'Cuisine Machine Recipe Cluster'
}

var solrClient = retrieve_and_rank.createSolrClient(params);

// retrieve_and_rank.listClusters({},
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });

//TODO: Add configuration files
//
// var params = {
//   cluster_id: 'scdaa8d3b3_4828_4657_ac16_41b7f7510237',
//   config_name: 'Retrieve and Rank Config',
//   config_zip_path: '/configs/r_and_r_config.zip'
// };
//
// retrieve_and_rank.uploadConfig(params,
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });


//TODO: add a collection to the cluster

// retrieve_and_rank.createCollection(params,
//   function (err, response) {
//     if (err)
//       console.log('error:', err);
//     else
//       console.log(JSON.stringify(response, null, 2));
// });
//TODO: add documents to the cluster

// var doc = { id : 1, title : 'Hello', body: 'some text' };
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
module.exports = function() {
    // query
    var query = solrClient.createQuery();
    query.q({ '*' : '*' });
    solrClient.search(query, function(err, searchResponse) {
      if(err) {
        console.log('Error searching for documents: ' + err);
      } else {
        console.log('Found ' + searchResponse.response.numFound + ' document(s).');
        console.log('First document: ' + JSON.stringify(searchResponse.response.docs[0], null, 2));
      }
    });
}
