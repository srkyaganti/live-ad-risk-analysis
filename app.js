const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { getTrendingTopicsForLocations, getTweetsForHashTagObject } = require('./controllers/twitter-controller')
const { updateHashTag, getHashTags, getTweetsGivenHashTagId } = require('./mysql/MysqlDataAccessor')
const sendRequest = require('./clients/elasticsearch-client')
const {
    searchInCatalogApproved,
    searchInCatalogRejected
} = require('./accessors/elasticsearxch-accessor')

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
            const tweetsData = data;
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
            .then(data => {
                const hashTagKeywordsMapping = tweetsData.map(e => ({ 
                    hashTagId: e.map(entry => entry.hash_tag_id).reduce((a, b) => a || b, null),
                    negative_keywords: e.map(entry => entry.negative_keywords).filter(e => e.length > 0).join(),
                    positive_keywords: e.map(entry => entry.positive_keywords).filter(e => e.length > 0).join()
                }))

                const promises2 = hashTagKeywordsMapping.map(mapping => {
                    return searchInCatalogRejected(mapping.negative_keywords)
                    .then(response => {mapping.rejected_ad_count = response.ad_count; return mapping})
                    .catch(error => error)
                })   
                
                Promise.all(promises2)
                .then(response => {
                    const someVar = response;
                    const promises3 = response.map(result => {
                        return updateHashTag({ hash_tag_id: result.hashTagId, rejected_ad_count: result.rejected_ad_count  })
                                .then(response => response)
                                .catch(error => error);
                    })

                    Promise.all(promises3)
                    .then(response => {
                        const promises4 = someVar.map(va => {
                            return searchInCatalogApproved(va.positive_keywords)
                            .then(response => {va.approved_ad_couint = response.ad_count; return va})
                            .catch(error => error)
                        })

                        Promise.all(promises4)
                        .then(response => {

                            const promises5 = response.map(result => {
                                return updateHashTag({ hash_tag_id: result.hashTagId, approved_ad_couint: result.approved_ad_couint  })
                                        .then(response => response)
                                        .catch(error => error);
                            })

                            Promise.all(promises5)
                            .then(response => res.send(response))
                            .catch(error => res.send(error))
                        })
                        .catch(error => res.send(error))

                        // const promises4 = someVar.map(result => {
                        //     return updateHashTag({ hash_tag_id: result.hashTagId, approved_ad_counit: result.approved_ad_counit  })
                        //             .then(response => response)
                        //             .catch(error => error);
                        // })

                        // res.send(someVar)
                    })
                    .catch(error => res.send(error))
                })
                .catch(error => res.send(error))
            })
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
