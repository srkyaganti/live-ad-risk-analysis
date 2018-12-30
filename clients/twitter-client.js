const Twitter = require('twitter');

const twitterClient = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

module.exports = twitterClient;