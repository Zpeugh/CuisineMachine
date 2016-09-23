var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
var qs = require('qs');

const CLUSTER_ID = sc12b109cf_91ae_43fe_bb0e_15b68f0fd1cb;
const COLLECTION_NAME = "Cuisine_Machine_Recipe_Cluster2"

// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
  username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
  password: 'nojwL5kgzQES',
  use_vcap_services: false
});


var solrClient = retrieve_and_rank.createSolrClient({
  cluster_id: CLUSTER_ID,
  collection_name: COLLECTION_NAME
});


//TODO: add a collection to the cluster
retrieve_and_rank.createCollection({
  cluster_id: CLUSTER_ID,
  config_name: 'retreiveAndRankConfig',
  collection_name: COLLECTION_NAME
},
  function (err, response) {
    if (err)
      console.log('From Create:', err);
    else
      console.log(JSON.stringify(response, null, 2));
});
