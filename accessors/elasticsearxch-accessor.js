const sendElasticsearchRequest = require('../clients/elasticsearch-client');
 

function searchInCatalogRejected(sentence) {
const params = {
    httpMethod: 'POST',
    requestPath: 'contents/content/_search',
    payload: {
        "from" : 0, "size" : 100,
        "_source": [ "id", "data.adId", "lastUpdateTime" ],
        "aggs" : {
            "distinct_ads" : {
                "cardinality" : {
                  "field" : "data.adId",
                  "precision_threshold" : 100 
                }
            }
        },
            "query": {

              "bool" : {
                "should" : [
                 {"match": {"data.cssAsinDecorations.productTitle": sentence}},
                 {"match": {"data.cssAsinDecorations.productDescription": sentence}}
                ],
                "minimum_should_match" : 1,
                "filter": {
                    "term": { "reviewStatus" : "REJECTED" }
                  }
              }
            }
          
    }
};

let response = sendElasticsearchRequest(params)
        .then(response => {
            const resObj={};
            resObj.ad_count = response.body.aggregations.distinct_ads.value;
            resObj.results = [];
            let temp = response.body.hits.hits;
            for(let i = 0;i<temp.length;i++) {
                let cd = new Date(temp[i]._source.lastUpdateTime);
                resObj.results[i]={content_id:temp[i]._source.id, ad_id:temp[i]._source.data.adId,
                content_last_updated_time:cd};
            }
           return resObj;
        })
        .catch(error => Object);

   response.then(res => {
        console.log(res);
    })
    return response;

}


function searchInCatalogApproved(sentence) {
    const params = {
        httpMethod: 'POST',
        requestPath: 'contents/content/_search',
        payload: {
            "from" : 0, "size" : 100,
            "_source": [ "id", "data.adId", "lastUpdateTime" ],
            "aggs" : {
                "distinct_ads" : {
                    "cardinality" : {
                      "field" : "data.adId",
                      "precision_threshold" : 100 
                    }
                }
            },
                "query": {
    
                  "bool" : {
                    "should" : [
                     {"match": {"data.cssAsinDecorations.productTitle": sentence}},
                     {"match": {"data.cssAsinDecorations.productDescription": sentence}}
                    ],
                    "minimum_should_match" : 1,
                    "must": {
                        "bool":{
                            "should":[
                               {"term": { "reviewStatus" : "APPROVED" }},
                               {"term": { "reviewStatus" : "SUBMITTED" }}

                            ]
                        }
                      }
                  }
                }
              
        }
    };
    
    let response = sendElasticsearchRequest(params)
        .then(response => {
            const resObj={};
            resObj.ad_count = response.body.aggregations.distinct_ads.value;
            resObj.results = [];
            let temp = response.body.hits.hits;
            for(let i = 0;i<temp.length;i++) {
                let cd = new Date(temp[i]._source.lastUpdateTime);
                resObj.results[i]={content_id:temp[i]._source.id, ad_id:temp[i]._source.data.adId,
                content_last_updated_time:cd};
           }
           return resObj;
        })
        .catch(error => Object);

    
    return response;
    }


searchInCatalogRejected('trump bad');

module.exports = {
    searchInCatalogApproved,
    searchInCatalogRejected
};