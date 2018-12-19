const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { getTrendingTopicsForLocations, getTweetsForHashTagObject } = require('./controllers/twitter-controller')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

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
                
            res.send(
                data.map(e => ({ 
                    hashTagId: e.map(entry => entry.hash_tag_id).reduce((a, b) => a || b, null),
                    sentiment_score: e.map(entry => entry.sentiment_score).reduce((a, b) => a + b, 0) 
                }))
            )
        })
        .catch(error => res.send(error))

        // Promise.all(promises)
        // .then(data => res.send(data))
        // .catch(error => res.send(error))
    })
    .catch(error => res.send(error))
})

module.exports = app
