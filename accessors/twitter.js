const client = require('../clients/twitter-client')

function getTrendingTopicsForWOEID(data) {
    return new Promise((resolve, reject) => {
        const params = {
            id: data.id
        }

        const callback = (error, data, response) => {
            if(error) {
                reject(error)
            }
            resolve({ data, response })
        }

        client.get('/trends/place', params, callback)
    });
}

function getTweets(data) {
    return new Promise((resolve, reject) => {
        const params = {
            q: data.query,
            result_type: 'recent',
            count: 100,
            include_entities: true
        }

        const callback = (error, data, response) => {
            if(error) {
                reject(error)
            }
            resolve({ data, response })
        }

        client.get('/search/tweets', params, callback)
    })
}

module.exports = {
    getTrendingTopicsForWOEID,
    getTweets
}