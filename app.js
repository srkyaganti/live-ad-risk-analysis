const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { getTrendingTopicsForLocations, getTweetsForHashTagObject } = require('./controllers/twitter-controller')
const { updateHashTag, getHashTags, getTweetsGivenHashTagId } = require('./mysql/MysqlDataAccessor')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.post('/api/reports', (req, res) => {
    const parameters = req.body
    getHashTags(parameters)
    .then(data => res.json(data))
    .catch(error => res.json(error))
})

app.post('/api/report', (req, res) => {
    const parameters = req.body
    getTweetsGivenHashTagId(parameters.id)
    .then(data => res.json(data))
    .catch(error => res.json(error))
})

app.use('/', (req, res) => {
    getTrendingTopicsForLocations()
    .then(data => {

        const promises = data.slice(0, 5).map(obj => 
            getTweetsForHashTagObject(obj)
            .then(response => response)
            .catch(error => error)
        )

        Promise.all(promises)
        .then(data => {
                data.map(e => ({ 
                    hashTagId: e.map(entry => entry.hash_tag_id).reduce((a, b) => a || b, null),
                    sentiment_score: e.map(entry => entry.sentiment_score).reduce((a, b) => a + b, 0) 
                }))

            const hashTagIdSentimentScoreMapping = data.map(e => ({ 
                hashTagId: e.map(entry => entry.hash_tag_id).reduce((a, b) => a || b, null),
                sentiment_score: e.map(entry => entry.sentiment_score).reduce((a, b) => a + b, 0) 
            }))

            const promises1 = hashTagIdSentimentScoreMapping.map(mapping => 
                updateHashTag({
                    hash_tag_id: mapping.hashTagId ,
                    total_sentiment_score: mapping.sentiment_score
                })
                .then(response => response)
                .catch(error => error)
            )

            Promise.all(promises1)
            .then(data => res.send(data))
            .catch(error => res.send(error))
        })
        .catch(error => res.send(error))

        // Promise.all(promises)
        // .then(data => res.send(data))
        // .catch(error => res.send(error))
    })
    .catch(error => res.send(error))
})

module.exports = app
