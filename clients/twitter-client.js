const Twitter = require('twitter');

const twitterClient = new Twitter({
    consumer_key: 'ozECMERCigVt4aJkLrFqnuoFa',
    consumer_secret: 'QZr4CL4aYvac4jNStcRiki5Fkal4o6IHPYbspQWAYJDFNRmVfO',
    access_token_key: '1071053881671528448-r4Ti6twqQeUllhY2mmWdzffRKJNsnO',
    access_token_secret: 'PlvUlknY05qhSkiDtKqWLiU6PLqAlKdHO9JpXE6p2DaSO'
});

module.exports = twitterClient;