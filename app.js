var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const { getTrendingTopicsForWOEID, getTweets } = require('./accessors/twitter');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/:id', (req, res) => {
    getTrendingTopicsForWOEID({ id: req.params.id})
    .then(response => {
        const { as_of, craeted_at, locations, trends } = response.data[0];
        
        trends.map(trend => {
            const query = decodeURIComponent(trend.query)
            const getTweetsRequest = { query }
            
            getTweets(getTweetsRequest)
            .then(response => console.log(response))
            .catch(error => console.log(error))
        })
        
        res.send(response)
    })
    .catch(error => {
        res.send(error)
    })
});

app.use('/users', usersRouter);

module.exports = app;
