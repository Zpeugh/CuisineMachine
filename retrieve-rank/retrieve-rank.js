var RetrieveAndRankV1 = require('watson-developer-cloud/retrieve-and-rank/v1');
var qs = require('qs');

console.log("Bootstrapping Retrieve and Rank engine");

const RANKER_ID = 'c852c8x19-rank-1246';
const CLUSTER_ID = "sc12b109cf_91ae_43fe_bb0e_15b68f0fd1cb";
const CLUSTER_NAME = "Cuisine_Machine_Recipe_Cluster";

// authentication
var retrieve_and_rank = new RetrieveAndRankV1({
    username: '0b8e9940-0890-41aa-9a0f-98b73077a868',
    password: 'nojwL5kgzQES',
    use_vcap_services: false
});

var solrClient = retrieve_and_rank.createSolrClient({
    cluster_id: CLUSTER_ID,
    collection_name: CLUSTER_NAME
});


// Export module function to query retrieve and rank cluster
module.exports = {
    search: function(sentence, callback) {

        var documents = {};
        var query = solrClient.createQuery();
        query.q({
            ingredients: sentence
        });
        solrClient.search(query, callback);
    },

    search_rank: function(sentence, callback) {
        var query = qs.stringify({
            q: sentence,
            ranker_id: RANKER_ID,
            rows: 50
        });
        console.log("Executing Retrieve and Rank");
        solrClient.get('/fcselect', query, callback);
    }
}
