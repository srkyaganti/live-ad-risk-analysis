const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { getTrendingTopicsForLocations } = require('./controllers/twitter-controller')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use('/', (req, res) => {
    getTrendingTopicsForLocations()
    .then(data => res.send(data))
    .catch(error => res.send(error))
})

// app.use('/:id', (req, res) => {
//     getTrendingTopicsForWOEID({ id: req.params.id})
//     .then(response => {
//         const { as_of, created_at, locations, trends } = response.data[0]
        
//         const query = decodeURIComponent(trends[2].query)
//         const getTweetsRequest = { query }
        
//         getTweets(getTweetsRequest)
//         .then(response => {
//             const { max_id, max_id_str, next_results, statuses } = response.data
//             let analysisResults = []

//             statuses.forEach(status => {
//                 const { lang, text } = status

//                 analysisResults.push(sentiment.analyze(text))
//             })
//             res.send(analysisResults)
//         })
//         .catch(error => res.send(error))

//         // trends.map(trend => {
//         //     const query = decodeURIComponent(trend.query)
//         //     const getTweetsRequest = { query }
            
//         //     getTweets(getTweetsRequest)
//         //     .then(response => console.log(response))
//         //     .catch(error => console.log(error))
//         // })
        
//         // res.send(response.data[0])
//     })
//     .catch(error => {
//         res.send(error)
//     })
// })

module.exports = app
