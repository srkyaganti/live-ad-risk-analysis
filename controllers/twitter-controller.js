const { getTrendingTopicsForWOEID, getTweets } = require('../accessors/twitter-accessor')
const { insertHashTags, insertTweets, insertHashTagTweetMapping } = require('../mysql/MysqlDataAccessor')

const location_woeids = [
    23424977 //Unites States
]

function getTrendingTopicsForLocations() {
    return new Promise((resolve, reject) => {
        location_woeids.forEach(woeid => {
            getTrendingTopicsForWOEID({ id:woeid })
            .then(response => {
                const { trends, as_of, created_at, locations} = response[0];
                const { name } = locations[0]
                
                
                let hashTagObjects = trends.map(trend => ({
                                        hash_tag_name: trend.name,
                                        search_query: decodeURIComponent(trend.query),
                                        as_of,
                                        created_at,
                                        location: name,
                                        location_woeid: woeid
                                     }));
                    
                resolve(hashTagObjects)   
                // insertHashTags()
            })
            .catch(error => reject(error))
        })
    })
}

module.exports = {
    getTrendingTopicsForLocations
}