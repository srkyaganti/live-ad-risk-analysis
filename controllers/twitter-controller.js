const { getTrendingTopicsForWOEID, getTweets } = require('../accessors/twitter-accessor')
const { insertHashTags, insertTweets, insertHashTagTweetMapping, createNewReportId } = require('../mysql/MysqlDataAccessor')
const sentiment = require('../clients/sentiment');

const location_woeids = [
    23424977 //Unites States
]

function getTrendingTopicsForLocations() {
    return new Promise((resolve, reject) => {
        location_woeids.forEach(woeid => {
            getTrendingTopicsForWOEID({ id:woeid })
            .then(response => {
                createNewReportId()
                .then(report_id => {
                    const { trends, as_of, created_at, locations} = response[0];
                    const { name } = locations[0]
                    
                    
                    let hashTagObjects = trends.map(trend => ({
                                            report_id,
                                            hash_tag_name: trend.name,
                                            search_query: trend.query,
                                            as_of,
                                            created_at,
                                            location: name,
                                            location_woeid: woeid
                                        }));

                    const promises = hashTagObjects.map(object =>  insertHashTags(object)
                                                                    .then(data => { object.id = data.id; return object })
                                                                    .catch(error => object))

                    Promise.all(promises)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
                })
                .catch(error => reject(error))
            })
            .catch(error => reject(error))
        })
    })
}

function getTweetsForHashTagObject(hashTagObject) {
    return new Promise((resolve, reject) => {
        
        const data =  {
            hashTagId: hashTagObject.id,
            query: hashTagObject.search_query
        }

        getTweets(data)
        .then(response => {
            const statuses = response.data.statuses
            const hashTagId = response.hashTagId;

            const tweetObjects = statuses.map(status => {
                                    const sentiment_result = sentiment.analyze(status.text)
                                    
                                    return {
                                        tweet_id: status.id_str,
                                        created_at: status.created_at,
                                        hash_tag_id: hashTagId,
                                        text: status.text,
                                        sentiment_score: sentiment_result.score,
                                        negative_keywords: sentiment_result.negative.join(),
                                        positive_keywords: sentiment_result.positive.join()
                                    }
                                 })

                const promises = tweetObjects.map(object =>  insertTweets(object)
                .then(data => { object.id = data.id; return object })
                .catch(error => object))

                Promise.all(promises)
                .then(response => resolve(response))
                .catch(error => reject(error))
            resolve(tweetObjects)
        })
        .catch(error => reject(error))
    })
}

module.exports = {
    getTrendingTopicsForLocations,
    getTweetsForHashTagObject
}