// START HEROKU SETUP
//var express = require("express");
//var app = express();
//app.get('/', function(req, res){ res.send('The robot is happily running.'); });
//app.listen(process.env.PORT || 5000);
// END HEROKU SETUP


// Listbot config
//
// Config.keys uses environment variables so sensitive info is not in the repo.
var config = {
    keys: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
    terms: ['#PruebaGRABot'],
    regexFilter: '#PruebaGRABot',
    regexReject: '(RT|@)'
};

var tu = require('tuiter')(config.keys);

function onReTweet(err) {
    if(err) {
        console.error("retweeting failed :(");
        console.error(err);
    }
}

function onTweet(tweet) {
    var regexReject = new RegExp(config.regexReject, 'i');
    var regexFilter = new RegExp(config.regexFilter, 'i');
    if (tweet.retweeted) {
        return;
    }
    if (config.regexReject !== '' && regexReject.test(tweet.text)) {
        return;
    }
    if (regexFilter.test(tweet.text)) {
        console.log(tweet);
        console.log("RT: " + tweet.text);
        
        tu.retweet({
            id: tweet.id_str
        }, onReTweet);
    }
}

tu.filter({
    track: config.terms
}, function(stream) {
    console.log("listening to stream");
    stream.on('tweet', onTweet);
});