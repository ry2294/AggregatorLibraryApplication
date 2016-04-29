var Twitter = require('twitter'); // Handles connecting with twitter streaming api
var unirest = require('unirest');

// create twitter client for streaming tweets
var client = new Twitter({
    consumer_key: "23wysyPCMUjcJCuUTX9HKDIVK",
    consumer_secret: "jyk4XkjVeM239dzzOanfB2ab8kb9ePMl4u1FeF04pzsuXugNoc",
    access_token_key: "3949975300-HiLLjf8GwbmG93XBf7qJqXGKIvFu0k1edA89jgW",
    access_token_secret: "46lrwJCm3CgxFnv8tigQEbQRUJkpmTOz9SNodoSHbwqVp"
});

// process a tweet raw data and extract relevant information
var processTweet = function(rawTweet) {
    if(rawTweet.geo != null && rawTweet.text!= null) {
        var tweet = {};
        tweet.tweetid = rawTweet.id;
        tweet.text = rawTweet.text;
        tweet.lat = rawTweet.geo.coordinates[0];
        tweet.lon = rawTweet.geo.coordinates[1];
        console.log(tweet);
        unirest.post('http://localhost:8080/redditbot/webapi/tweet')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(tweet)
        .end(function (response) {
        });
        unirest.post('http://localhost:4445/restdemo')
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(tweet)
        .end(function (response) {
        });
    }
};

// stream tweets of the entire world, process them and 
// publich it to all the web sockets connected to the server.
client.stream('statuses/filter', {'locations':'-180,-90,180,90'},function(stream){
    stream.on('data', function(data) {
        processTweet(data);
    });
});
