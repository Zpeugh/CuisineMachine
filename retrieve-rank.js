var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');

// authentication
var retrieve = new RetrieveAndRankV1({
  username: '<username>',
  password: '<password>',
});

// create cluster
retrieve_and_rank.createCluster({
  cluster_size: '1',
  cluster_name: 'My cluster'
}, function (err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
});

// add document to cluster
var solrClient = retrieve.createSolrClient({
  cluster_id: 'INSERT YOUR CLUSTER ID HERE',
  collection_name: 'example_collection'
});

var doc = { id : 1234, title_t : 'Hello', text_field_s: 'some text' };
solrClient.add(doc, function(err) {
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
