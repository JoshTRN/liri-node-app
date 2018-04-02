
var keys = require('./keys')
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var typeExecution = process.argv[2];

var tweets = 'my-tweets';
var song = 'spotify-this-song';
var movie = 'movie-this'

switch (typeExecution) {
	case tweets:
		console.log(tweets);
		myTweets();
		break;
	case song:
		console.log(song);
		spotifySong();
		break;
	case movie:
		console.log(movie);
		movie();
		break;
}



//============Functions==========//


function myTweets(){

}

function spotifySong(){

}

function movie(){

}