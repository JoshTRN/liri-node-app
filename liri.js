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
			if (i === 3) {
				songTitle = process.argv[i];

			} else if (i < len) {
				songTitle = songTitle + ' ' + process.argv[i];

			} //else {
			// 	songTitle = process.argv[i];
			// }
		}
	} else if (songTitle === '') {
		console.log('Please add a song title.');
	}
	
	spotify.search({ type: 'track', query: songTitle })
		.then(function(response) {

			var artist = 'Artist: ' + response.tracks.items[0].album.artists[0].name;
			var preview = 'Preview URL: ' + response.tracks.items[0].preview_url
			var songName = 'Song Name: ' + response.tracks.items[0].name;
			var album = 'Album Name: ' + response.tracks.items[0].album.name;
			console.log('\n');
			console.log(artist);
			console.log(preview);
			console.log(songName);
			console.log(album);
			console.log('\n');
		})
		.catch(function(err) {
			console.log(err);
		});
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
	} else if (movieTitle === '') {
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