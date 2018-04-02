//===============Require Calls=============//

require('dotenv').config();
var keys = require('./keys')
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var inquirer = require('inquirer');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//===============Input Types=============//

var typeExecution = process.argv[2];
var tweets = 'my-tweets';
var song = 'spotify-this-song';
var movie = 'movie-this'

//===============Song and Movie Varriables=============//
var movieTitle = '';
var songTitle = '';

//===============Handler for Terminal Input=============//
switch (typeExecution) {
	case tweets:
		myTweets();
		break;
	case song:
		spotifySong();
		break;
	case movie:
		getMovie();
		break;
	default:
		initInquier();
}



//===============Functions=============//


function myTweets() {
	client.get('statuses/user_timeline', {screen_name: 'JoshUMCode'}, function(error, tweets, response){
		if (error){
			console.log(error.message)
		}
		var len = tweets.length
		if (len > 19){
			for (var i = 0; i < 20; i++){
				console.log(tweets[i].created_at, tweets[i].text);
			}	
		} else {
			for ( var i = 0; i < len; i++){
				console.log(tweets[i].created_at, tweets[i].text);
			}
		}
	});
}

function spotifySong() {
	// Refer to console input to extract the song title and store it into
	// songTitle variable.
	var len = process.argv.length

	if (len > 3) {
		for (var i = 3; i < len; i++){
			if (i < len - 1 && songTitle !== ''){
				songTitle = songTitle + ' ' + process.argv[i];
			} else {
				songTitle = process.argv[i];
			}
		}
	} else {
		console.log('Please add a song title.');
	}
	console.log(songTitle);
}

function getMovie() {
	// Refer to console input to extract the song title and store it into
	// movieTitle variable.
	var len = process.argv.length
	// Make sure a movie is added
	if (len > 3) {
		for (var i = 3; i < len; i++){
			if (i < len && movieTitle !== ''){
				movieTitle = movieTitle + ' ' + process.argv[i];
			} else {
				movieTitle = process.argv[i];
			}
		}
	} else {
		console.log('Please add a movie title.');
	}	
	// Log to make sure functioning.
	console.log(movieTitle);

}

function initInquier() {
	inquirer.prompt([
		{
			type: 'list',
			message: 'Please select what you want to do?',
			choices: ['my-tweets', 'spotify-this-song', 'movie-this'],
			name: 'selection'
		}
		]).then(function(response){

			switch (response.selection) {
				case tweets:
					myTweets();
					break;
				case song:
					inquireSong();
					break;
				case movie:
					inquireMovie();
				break;

			}
		})
}

function inquireSong() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Tell me the song you want:',
			name: 'songTitle'
		}
		]).then(function(response){
			songTitle = response.songTitle;
			spotifySong();
		})
}

function inquireMovie() {
	inquirer.prompt([
		{
			type: 'input',
			message: 'Tell me the movie you want:',
			name: 'movieTitle'
		}
		]).then(function(response){
			songTitle = response.movieTitle;
			getMovie();
		})
}