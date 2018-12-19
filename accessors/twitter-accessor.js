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
            resolve(data)
        }

        client.get('/trends/place', params, callback)
    });
}

function getTweets(data) {
    return new Promise((resolve, reject) => {
        
        const params = {
            q: data.query,
            result_type: 'recent',
            count: 5
        }

        const hashTagId = data.hashTagId

        const callback = (error, data, response) => {
            if(error) {
                reject(error)
            }
            resolve({ data, hashTagId })
        }

        client.get('/search/tweets', params, callback)
    })
}

module.exports = {
    getTrendingTopicsForWOEID,
    getTweets
}